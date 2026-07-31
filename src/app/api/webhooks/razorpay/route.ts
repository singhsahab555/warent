import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get('x-razorpay-signature')

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('hex')

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(rawBody)

  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity
    const bookingId = payment.notes?.booking_id

    if (bookingId) {
      const supabase = await createClient()
      // Idempotent — confirm_booking_payment only updates rows still 'pending',
      // so a duplicate webhook delivery is harmless.
      await supabase.rpc('confirm_booking_payment' as any, {
        p_booking_id: bookingId,
        p_provider: 'razorpay',
        p_provider_order_id: payment.order_id,
        p_provider_payment_id: payment.id,
      })
    }
  }

  return NextResponse.json({ received: true })
}
