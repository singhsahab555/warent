'use server'

import { createClient } from '@/lib/supabase/server'
import { getRazorpayClient } from '@/lib/razorpay'
import { getStripeClient } from '@/lib/stripe'
import crypto from 'crypto'

export type PaymentActionState = {
  error?: string
  razorpayOrderId?: string
  razorpayKeyId?: string
  amount?: number
  stripeUrl?: string
} | null

async function getBookingForPayment(bookingId: string) {
  const supabase = await createClient()
  const { data, error } = (await supabase
    .from('bookings')
    .select('id, total_amount, payment_status, renter_id')
    .eq('id', bookingId)
    .single()) as unknown as {
    data: { id: string; total_amount: number; payment_status: string; renter_id: string } | null
    error: { message: string } | null
  }

  if (error || !data) return { error: 'Booking not found' as const }
  if (data.payment_status !== 'pending') return { error: 'This booking is already paid or cancelled' as const }
  return { data }
}

// --- Razorpay (India) ---
export async function createRazorpayOrder(bookingId: string): Promise<PaymentActionState> {
  const result = await getBookingForPayment(bookingId)
  if ('error' in result) return { error: result.error }

  const razorpay = getRazorpayClient()
  const amountPaise = Math.round(result.data.total_amount * 100) // Razorpay expects smallest currency unit

  try {
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: bookingId,
      notes: { booking_id: bookingId },
    })

    return {
      razorpayOrderId: order.id,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
      amount: amountPaise,
    }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

// Called client-side immediately after Razorpay's checkout succeeds, for instant UI feedback.
// The webhook (below) is the source-of-truth backup in case this call never fires
// (browser closed, network drop, etc).
export async function verifyRazorpayPayment(input: {
  bookingId: string
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}): Promise<PaymentActionState> {
  const body = `${input.razorpayOrderId}|${input.razorpayPaymentId}`
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')

  if (expectedSignature !== input.razorpaySignature) {
    return { error: 'Payment signature verification failed' }
  }

  const supabase = await createClient()
  const { error } = await supabase.rpc('confirm_booking_payment' as any, {
    p_booking_id: input.bookingId,
    p_provider: 'razorpay',
    p_provider_order_id: input.razorpayOrderId,
    p_provider_payment_id: input.razorpayPaymentId,
  })

  if (error) return { error: error.message }
  return {}
}

// --- Stripe (global / non-India) ---
export async function createStripeCheckoutSession(bookingId: string): Promise<PaymentActionState> {
  const result = await getBookingForPayment(bookingId)
  if ('error' in result) return { error: result.error }

  const stripe = getStripeClient()
  const amountCents = Math.round(result.data.total_amount * 100)

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd', // adjust per your global pricing strategy
            product_data: { name: 'WARENT warehouse booking' },
            unit_amount: amountCents,
          },
          quantity: 1,
        },
      ],
      metadata: { booking_id: bookingId },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/renter/bookings?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/renter/bookings?payment=cancelled`,
    })

    return { stripeUrl: session.url ?? undefined }
  } catch (err) {
    return { error: (err as Error).message }
  }
}
