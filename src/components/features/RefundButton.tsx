'use client'

import { useState, useTransition } from 'react'
import { refundBooking } from '@/lib/actions/refund'

export default function RefundButton({ bookingId }: { bookingId: string }) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  if (done) {
    return <span className="text-xs font-bold text-gray-400">Refunded ✓</span>
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50"
      >
        Refund
      </button>
    )
  }

  return (
    <div className="w-64 rounded-xl border border-red-200 bg-red-50 p-3">
      <input
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason for refund..."
        className="w-full rounded-lg border border-red-200 px-2.5 py-1.5 text-xs focus:outline-none"
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      <div className="mt-2 flex gap-1.5">
        <button
          disabled={isPending || !reason.trim()}
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
