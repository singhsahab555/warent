'use client'

import { useState, useTransition } from 'react'
import { refundBooking, getRefundEligibility, type RefundEligibility } from '@/lib/actions/refund'

export default function RefundButton({ bookingId }: { bookingId: string }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [eligibility, setEligibility] = useState<RefundEligibility | null>(null)
  const [loadingEligibility, setLoadingEligibility] = useState(false)

  if (done) {
    return <span className="text-xs font-bold text-gray-400">Refunded ✓</span>
  }

  const handleOpen = async () => {
    setOpen(true)
    setLoadingEligibility(true)
    const result = await getRefundEligibility(bookingId)
    setEligibility(result)
    setLoadingEligibility(false)
  }

  if (!open) {
    return (
      <button
        onClick={handleOpen}
        className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
      >
        Refund
      </button>
    )
  }

  const nonRefundable = eligibility?.refundAmount === 0

  return (
    <div className="w-72 rounded-xl border border-red-200 bg-red-50 p-3">
      {loadingEligibility ? (
        <p className="text-xs text-gray-500">Checking cancellation policy…</p>
      ) : eligibility?.error ? (
        <p className="text-xs text-red-600">{eligibility.error}</p>
      ) : (
        <div className="mb-2 rounded-lg bg-white p-2.5">
          <p className="text-xs font-semibold text-gray-500">{eligibility?.policyTier}</p>
          <p className="mt-1 text-sm font-bold text-ink-900">
            Refund: ₹{eligibility?.refundAmount?.toLocaleString('en-IN')}
            <span className="ml-1 text-xs font-normal text-gray-400">
              of ₹{eligibility?.totalAmount?.toLocaleString('en-IN')} ({((eligibility?.refundPercent ?? 0) * 100).toFixed(0)}%)
            </span>
          </p>
          <p className="mt-0.5 text-[11px] text-gray-400">
            {eligibility?.daysNotice} day(s) notice before start date
          </p>
        </div>
      )}

      {!nonRefundable && (
        <input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for refund..."
          className="w-full rounded-lg border border-red-200 px-2.5 py-1.5 text-xs focus:outline-none"
        />
      )}
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      <div className="mt-2 flex gap-1.5">
        {!nonRefundable && (
          <button
            disabled={isPending || !reason.trim() || loadingEligibility}
            onClick={() =>
              startTransition(async () => {
                setError(null)
                const result = await refundBooking(bookingId, reason)
                if (result?.error) {
                  setError(result.error)
                  return
                }
                setDone(true)
              })
            }
            className="flex-1 rounded-lg bg-red-600 py-1.5 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? 'Processing…' : 'Confirm refund'}
          </button>
        )}
        <button
          onClick={() => setOpen(false)}
          className="rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-semibold text-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
