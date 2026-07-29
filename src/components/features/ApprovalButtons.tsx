'use client'

import { useState, useTransition } from 'react'
import type { AdminActionState } from '@/lib/actions/admin'

export default function ApprovalButtons({
  id,
  onApprove,
  onReject,
}: {
  id: string
  onApprove: (prev: AdminActionState, id: string) => Promise<AdminActionState>
  onReject: (prev: AdminActionState, id: string) => Promise<AdminActionState>
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<'approved' | 'rejected' | null>(null)

  const run = (action: (prev: AdminActionState, id: string) => Promise<AdminActionState>, label: 'approved' | 'rejected') => {
    setError(null)
    startTransition(async () => {
      const result = await action(null, id)
      if (result?.error) {
        setError(result.error)
        return
      }
      setDone(label)
    })
  }

  if (done) {
    return (
      <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold capitalize text-gray-500">
        {done}
      </span>
    )
  }

  return (
    <div>
      <div className="flex gap-2">
        <button
          onClick={() => run(onApprove, 'approved')}
          disabled={isPending}
          className="rounded-full bg-accent-400 px-4 py-2 text-xs font-bold text-ink-900 hover:bg-accent-300 disabled:opacity-50"
        >
          ✓ Approve
        </button>
        <button
          onClick={() => run(onReject, 'rejected')}
          disabled={isPending}
          className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          ✕ Reject
        </button>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}
