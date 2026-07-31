import { NextRequest, NextResponse } from 'next/server'
import { getStripeClient } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const stripe = getStripeClient()
  const rawBody = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as { metadata?: { booking_id?: string }; id: string; payment_intent?: string }
    const bookingId = session.metadata?.booking_id

    if (bookingId) {
      const supabase = await createClient()
      await supabase.rpc('confirm_booking_payment' as any, {
        p_booking_id: bookingId,
        p_provider: 'stripe',
        p_provider_order_id: session.id,
        p_provider_payment_id: (session.payment_intent as string) ?? session.id,
      })
    }
  }

  return NextResponse.json({ received: true })
}
