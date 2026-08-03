'use client'

import { useState, useTransition } from 'react'
import { markPayoutPaid } from '@/lib/actions/payout'

export default function MarkPaidButton({ payoutId }: { payoutId: string }) {
  const [open, setOpen] = useState(false)
  const [reference, setReference] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  if (done) {
    return <span className="text-xs font-bold text-accent-600">Marked paid ✓</span>
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded-full bg-accent-400 px-3 py-1.5 text-xs font-bold text-ink-900 hover:bg-accent-300"
      >
        Mark as paid
      </button>
    )
  }

  return (
    <div className="w-56 rounded-xl border border-black/5 bg-gray-50 p-3">
      <input
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        placeholder="Bank UTR / reference no."
        className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs focus:outline-none"
      />
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
      <div className="mt-2 flex gap-1.5">
        <button
          disabled={isPending || !reference.trim()}
          onClick={() =>
            startTransition(async () => {
              setError(null)
              const result = await markPayoutPaid(payoutId, reference)
              if (result?.error) {
                setError(result.error)
                return
              }
              setDone(true)
            })
          }
          className="flex-1 rounded-lg bg-ink-900 py-1.5 text-xs font-bold text-white disabled:opacity-50"
        >
          {isPending ? 'Saving…' : 'Confirm'}
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
