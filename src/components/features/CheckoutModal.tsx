'use client'

import { useState } from 'react'
import Script from 'next/script'
import { createBooking } from '@/lib/actions/booking'
import { createRazorpayOrder, verifyRazorpayPayment, createStripeCheckoutSession } from '@/lib/actions/payment'
import type { AvailableSlot } from '@/lib/queries/slots'

type Stage = 'form' | 'paying' | 'success'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function CheckoutModal({
  slot,
  onClose,
}: {
  slot: AvailableSlot
  onClose: () => void
}) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [provider, setProvider] = useState<'razorpay' | 'stripe'>('razorpay')
  const [stage, setStage] = useState<Stage>('form')
  const [error, setError] = useState<string | null>(null)

  const durationDays =
    startDate && endDate
      ? Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)
      : 0
  const months = durationDays > 0 ? durationDays / 30 : 0
  const total = Math.round(slot.area_sqft * slot.price_per_sqft * months)

  const isValidDuration = durationDays >= slot.min_booking_days

  const handlePay = async () => {
    setError(null)

    if (!startDate || !endDate) {
      setError('Please select both dates')
      return
    }
    if (!isValidDuration) {
      setError(`Minimum booking duration is ${slot.min_booking_days} days`)
      return
    }

    setStage('paying')

    // Step 1: create the booking as a 'pending' payment hold
    const bookingResult = await createBooking(null, { slotId: slot.slot_id, startDate, endDate })
    if (bookingResult?.error || !bookingResult?.bookingId) {
      setError(bookingResult?.error ?? 'Could not create booking')
      setStage('form')
      return
    }

    const bookingId = bookingResult.bookingId

    if (provider === 'stripe') {
      const session = await createStripeCheckoutSession(bookingId)
      if (session?.error || !session?.stripeUrl) {
        setError(session?.error ?? 'Could not start Stripe checkout')
        setStage('form')
        return
      }
      window.location.href = session.stripeUrl
      return
    }

    // Razorpay flow
    const order = await createRazorpayOrder(bookingId)
    if (order?.error || !order?.razorpayOrderId) {
      setError(order?.error ?? 'Could not start payment')
      setStage('form')
      return
    }

    const rzp = new window.Razorpay({
      key: order.razorpayKeyId,
      amount: order.amount,
      currency: 'INR',
      name: 'WARENT',
      description: `${slot.warehouse_name} — Slot ${slot.slot_code}`,
      order_id: order.razorpayOrderId,
      handler: async (response: any) => {
        const verify = await verifyRazorpayPayment({
          bookingId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        })

        if (verify?.error) {
          setError(verify.error)
          setStage('form')
          return
        }

        setStage('success')
      },
      modal: {
        ondismiss: () => setStage('form'),
      },
      theme: { color: '#4529e0' },
    })

    rzp.open()
    setStage('form') // reset local stage; Razorpay's own modal takes over the UI now
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
          {stage === 'success' ? (
            <div className="text-center">
              <span className="text-4xl">🎉</span>
              <p className="mt-3 text-lg font-extrabold text-ink-900">Booking confirmed</p>
              <p className="mt-1 text-sm text-gray-500">
                {slot.warehouse_name} — {slot.area_sqft} sqft reserved and paid.
              </p>
              <button
                onClick={onClose}
                className="mt-6 w-full rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white hover:bg-brand-700"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-ink-900">Confirm booking</h2>
                  <p className="text-sm text-gray-500">{slot.warehouse_name}</p>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-400">Start date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-gray-400">End date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {durationDays > 0 && !isValidDuration && (
                <p className="mt-2 text-xs text-amber-600">
                  Minimum booking duration is {slot.min_booking_days} days (currently {durationDays})
                </p>
              )}

              <div className="mt-4">
                <label className="block text-xs font-bold uppercase tracking-wide text-gray-400">
                  Pay with
                </label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setProvider('razorpay')}
                    className={`rounded-xl border-2 py-2 text-sm font-bold ${
                      provider === 'razorpay'
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    🇮🇳 Razorpay (INR)
                  </button>
                  <button
                    onClick={() => setProvider('stripe')}
                    className={`rounded-xl border-2 py-2 text-sm font-bold ${
                      provider === 'stripe'
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    🌍 Stripe (USD)
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-2 rounded-xl bg-gray-50 p-4 text-sm">
                <Row label={`${slot.area_sqft} sqft × ₹${slot.price_per_sqft}/sqft × ${months.toFixed(1)} mo.`} value="" />
                <div className="border-t border-gray-200 pt-2">
                  <Row label="Total" value={`₹${total.toLocaleString('en-IN')}`} bold />
                </div>
              </div>

              {error && (
                <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}

              <button
                onClick={handlePay}
                disabled={stage === 'paying' || !startDate || !endDate}
                className="mt-5 w-full rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700 disabled:opacity-50"
              >
                {stage === 'paying' ? 'Processing…' : `Pay & confirm`}
              </button>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                <span>🔒</span>
                <span>Secured by {provider === 'razorpay' ? 'Razorpay' : 'Stripe'}</span>
                <span className="mx-1">·</span>
                <a href="/refund-policy" target="_blank" className="underline hover:text-gray-600">
                  Cancellation policy
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? 'font-bold text-ink-900' : 'text-gray-600'}>{label}</span>
      <span className={bold ? 'font-bold text-ink-900' : 'text-ink-900'}>{value}</span>
    </div>
  )
}
