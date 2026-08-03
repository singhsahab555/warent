'use server'

import { createClient } from '@/lib/supabase/server'
import { getRazorpayClient } from '@/lib/razorpay'
import { getStripeClient } from '@/lib/stripe'
import { revalidatePath } from 'next/cache'

export type RefundActionState = { error?: string; success?: boolean } | null

export type RefundEligibility = {
  error?: string
  refundPercent?: number
  refundAmount?: number
  daysNotice?: number
  policyTier?: string
  totalAmount?: number
}

// Preview what the renter would actually get back, per the cancellation policy,
// before an admin commits to the refund. Called by the UI to show the amount.
export async function getRefundEligibility(bookingId: string): Promise<RefundEligibility> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .rpc('calculate_refund_eligibility' as any, { p_booking_id: bookingId } as any)
    .single() as unknown as {
    data: { refund_percent: number; refund_amount: number; days_notice: number; policy_tier: string } | null
    error: { message: string } | null
  }

  if (error || !data) return { error: error?.message ?? 'Could not calculate refund eligibility' }

  const { data: booking } = await supabase
    .from('bookings')
    .select('total_amount')
    .eq('id', bookingId)
    .single()

  return {
    refundPercent: data.refund_percent,
    refundAmount: data.refund_amount,
    daysNotice: data.days_notice,
    policyTier: data.policy_tier,
    totalAmount: (booking as unknown as { total_amount: number } | null)?.total_amount,
  }
}

export async function refundBooking(
  bookingId: string,
  reason: string
): Promise<RefundActionState> {
  const supabase = await createClient()

  const { data: bookingRaw, error: fetchError } = await supabase
    .from('bookings')
    .select('id, total_amount, payment_status, payment_provider, provider_payment_id')
    .eq('id', bookingId)
    .single()

  const booking = bookingRaw as unknown as {
    id: string
    total_amount: number
    payment_status: string
    payment_provider: string | null
    provider_payment_id: string | null
  } | null

  if (fetchError || !booking) return { error: 'Booking not found' }
  if (booking.payment_status !== 'paid') {
    return { error: 'Only paid bookings can be refunded' }
  }
  if (!booking.provider_payment_id || !booking.payment_provider) {
    return { error: 'No payment record found for this booking' }
  }

  // Compute the policy-eligible amount server-side — never trust a client-supplied
  // refund amount, since that's exactly the kind of value someone could tamper with.
  const eligibility = await getRefundEligibility(bookingId)
  if (eligibility.error || eligibility.refundAmount === undefined) {
    return { error: eligibility.error ?? 'Could not calculate refund amount' }
  }

  const refundAmount = eligibility.refundAmount

  if (refundAmount <= 0) {
    return { error: `Non-refundable per cancellation policy: ${eligibility.policyTier}` }
  }

  try {
    if (booking.payment_provider === 'razorpay') {
      const razorpay = getRazorpayClient()
      await razorpay.payments.refund(booking.provider_payment_id, {
        amount: Math.round(refundAmount * 100), // partial refund, in paise
      })
    } else if (booking.payment_provider === 'stripe') {
      const stripe = getStripeClient()
      const session = await stripe.checkout.sessions.retrieve(booking.provider_payment_id)
      if (!session.payment_intent) {
        return { error: 'Could not locate Stripe payment to refund' }
      }
      await stripe.refunds.create({
        payment_intent: session.payment_intent as string,
        amount: Math.round(refundAmount * 100), // partial refund, in cents
      })
    }
  } catch (err: any) {
    console.error('Refund provider error (full):', JSON.stringify(err, null, 2))
    const description = err?.error?.description || err?.raw?.message || err?.message
    const code = err?.error?.code || err?.error?.reason
    const providerMessage = [description, code].filter(Boolean).join(' — ') || JSON.stringify(err)
    return { error: `Refund failed at payment provider: ${providerMessage}` }
  }

  const fullReason = `${reason} (Policy: ${eligibility.policyTier})`

  const { error: dbError } = await supabase.rpc('handle_booking_refund' as any, {
    p_booking_id: bookingId,
    p_amount: refundAmount,
    p_reason: fullReason,
  } as any)

  if (dbError) {
    return { error: `Refund succeeded with provider but failed to update our records: ${dbError.message}. Please reconcile manually.` }
  }

  revalidatePath('/admin')
  return { success: true }
}
