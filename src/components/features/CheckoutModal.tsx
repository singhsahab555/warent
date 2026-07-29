'use client'

import { useState } from 'react'
import { createBooking } from '@/lib/actions/booking'
import type { AvailableSlot } from '@/lib/queries/slots'

const COMMISSION_RATE = 0.12 // must mirror the DB function — display-only, DB is source of truth

export default function CheckoutModal({
  slot,
  onClose,
}: {
  slot: AvailableSlot
  onClose: () => void
}) {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const durationDays =
    startDate && endDate
      ? Math.round((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000)
      : 0
  const months = durationDays > 0 ? durationDays / 30 : 0
  const subtotal = Math.round(slot.area_sqft * slot.price_per_sqft * months)
  const commission = Math.round(subtotal * COMMISSION_RATE)
  const total = subtotal + commission

  const isValidDuration = durationDays >= slot.min_booking_days

  const handleConfirm = async () => {
    setError(null)

    if (!startDate || !endDate) {
      setError('Please select both dates')
      return
    }
    if (!isValidDuration) {
      setError(`Minimum booking duration is ${slot.min_booking_days} days`)
      return
    }

    setIsSubmitting(true)
    const result = await createBooking(null, { slotId: slot.slot_id, startDate, endDate })
    setIsSubmitting(false)

    if (result?.error) {
      setError(result.error)
      return
    }

    setSuccess(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        {success ? (
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">Booking confirmed</p>
            <p className="mt-1 text-sm text-gray-500">
              {slot.warehouse_name} — {slot.area_sqft} sqft reserved.
            </p>
            <button
              onClick={onClose}
              className="mt-6 w-full rounded-lg bg-gray-900 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Confirm booking</h2>
                <p className="text-sm text-gray-500">{slot.warehouse_name}</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
                />
              </div>
            </div>

            {durationDays > 0 && !isValidDuration && (
              <p className="mt-2 text-xs text-amber-600">
                Minimum booking duration is {slot.min_booking_days} days (currently {durationDays})
              </p>
            )}

            <div className="mt-5 space-y-2 rounded-lg bg-gray-50 p-4 text-sm">
              <Row label={`Area × rate (${slot.area_sqft} sqft × ₹${slot.price_per_sqft})`} value={`₹${subtotal.toLocaleString('en-IN')}`} />
              <Row label={`Platform commission (${(COMMISSION_RATE * 100).toFixed(0)}%)`} value={`₹${commission.toLocaleString('en-IN')}`} />
              <div className="border-t border-gray-200 pt-2">
                <Row label="Total" value={`₹${total.toLocaleString('en-IN')}`} bold />
              </div>
            </div>

            {error && (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
            )}

            <button
              onClick={handleConfirm}
              disabled={isSubmitting || !startDate || !endDate}
              className="mt-5 w-full rounded-lg bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isSubmitting ? 'Confirming...' : 'Confirm & book'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? 'font-semibold text-gray-900' : 'text-gray-600'}>{label}</span>
      <span className={bold ? 'font-semibold text-gray-900' : 'text-gray-900'}>{value}</span>
    </div>
  )
}