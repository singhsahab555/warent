'use client'

import { useState, useTransition } from 'react'
import { setWarehouseStatus } from '@/lib/actions/warehouse'

export default function PublishToggle({
  warehouseId,
  status,
}: {
  warehouseId: string
  status: string
}) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const isLive = status === 'active'

  const handleToggle = () => {
    setError(null)
    startTransition(async () => {
      const result = await setWarehouseStatus(warehouseId, isLive ? 'inactive' : 'active')
      if (result?.error) setError(result.error)
    })
  }

  if (status === 'suspended') {
    return (
      <span className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
        Suspended — contact support
      </span>
    )
  }

  return (
    <div>
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`rounded-full px-5 py-2.5 text-sm font-bold shadow-sm transition disabled:opacity-50 ${
          isLive
            ? 'border-2 border-red-200 bg-white text-red-600 hover:bg-red-50'
            : 'bg-accent-400 text-ink-900 shadow-accent-400/40 hover:bg-accent-300'
        }`}
      >
        {isPending
          ? 'Updating…'
          : isLive
            ? 'Unpublish from marketplace'
            : '🚀 Publish to marketplace'}
      </button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      {!isLive && status === 'pending_verification' && (
        <p className="mt-2 max-w-xs text-xs text-gray-400">
          Your listing is ready — publish it to make it visible to renters searching WARENT.
        </p>
      )}
    </div>
  )
}
