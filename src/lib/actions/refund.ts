'use server'

import { createClient } from '@/lib/supabase/server'
import { getRazorpayClient } from '@/lib/razorpay'
import { getStripeClient } from '@/lib/stripe'
import { revalidatePath } from 'next/cache'

export type RefundActionState = { error?: string; success?: boolean } | null

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

  try {
    if (booking.payment_provider === 'razorpay') {
      const razorpay = getRazorpayClient()
      // Omitting `amount` triggers a full refund of whatever was actually captured —
      // safer than recalculating and risking a paisa-level mismatch with Razorpay's records.
      await razorpay.payments.refund(booking.provider_payment_id, {})
    } else if (booking.payment_provider === 'stripe') {
      const stripe = getStripeClient()
      // provider_payment_id stores the Checkout Session id for Stripe bookings;
      // retrieve the actual PaymentIntent to refund against.
      const session = await stripe.checkout.sessions.retrieve(booking.provider_payment_id)
      if (!session.payment_intent) {
        return { error: 'Could not locate Stripe payment to refund' }
      }
      await stripe.refunds.create({
        payment_intent: session.payment_intent as string,
      })
    }
  } catch (err: any) {
    console.error('Refund provider error (full):', JSON.stringify(err, null, 2))
    const description = err?.error?.description || err?.raw?.message || err?.message
    const code = err?.error?.code || err?.error?.reason
    const providerMessage = [description, code].filter(Boolean).join(' — ') || JSON.stringify(err)
    return { error: `Refund failed at payment provider: ${providerMessage}` }
  }

  // Provider refund succeeded — now update our own ledger/booking state
  const { error: dbError } = await supabase.rpc('handle_booking_refund' as any, {
    p_booking_id: bookingId,
    p_amount: booking.total_amount,
    p_reason: reason,
  } as any)

  if (dbError) {
    // Money has already been refunded on the provider side at this point —
    // surface this loudly rather than silently, since the DB is now out of sync
    // with reality until someone manually reconciles it.
    return { error: `Refund succeeded with provider but failed to update our records: ${dbError.message}. Please reconcile manually.` }
  }

  revalidatePath('/admin')
  return { success: true }
}
