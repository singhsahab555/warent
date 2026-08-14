'use client'

import { useState } from 'react'
import { addSlotToWarehouse } from '@/lib/actions/warehouse'

export default function AddSlotForm({
  warehouseId,
  availableSqft,
}: {
  warehouseId: string
  availableSqft: number
}) {
  const [open, setOpen] = useState(false)
  const [slotCode, setSlotCode] = useState('')
  const [areaSqft, setAreaSqft] = useState(Math.min(100, availableSqft))
  const [pricePerSqft, setPricePerSqft] = useState(30)
  const [minBookingDays, setMinBookingDays] = useState(30)
  const [storageType, setStorageType] = useState<'ambient' | 'cold_storage' | 'hazmat' | 'high_value'>('ambient')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (availableSqft <= 0) {
    return (
      <p className="mt-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
        All capacity for this warehouse has been allocated to slots.
      </p>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 rounded-full bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700"
      >
        + Add another slot ({availableSqft} sqft available)
      </button>
    )
  }

  const handleSubmit = async () => {
    setError(null)
    setIsSubmitting(true)

    const result = await addSlotToWarehouse(warehouseId, {
      slotCode,
      areaSqft,
      pricePerSqft,
      minBookingDays,
      storageType,
    })

    setIsSubmitting(false)

    if (result?.error) {
      setError(result.error)
      return
    }

    setOpen(false)
    setSlotCode('')
  }

  return (
    <div className="mt-3 rounded-2xl border border-black/5 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-ink-900">Add a new slot</h3>
        <span className="text-xs font-semibold text-gray-400">{availableSqft} sqft remaining</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Field label="Slot code">
          <input
            value={slotCode}
            onChange={(e) => setSlotCode(e.target.value)}
            placeholder="A-104"
            className={inputClass}
          />
        </Field>
        <Field label={`Area (max ${availableSqft} sqft)`}>
          <input
            type="number"
            value={areaSqft}
            onChange={(e) => setAreaSqft(Number(e.target.value))}
            max={availableSqft}
            className={inputClass}
          />
        </Field>
        <Field label="Rate (₹20-40/sqft)">
          <input
            type="number"
            value={pricePerSqft}
            onChange={(e) => setPricePerSqft(Number(e.target.value))}
            className={inputClass}
          />
        </Field>
        <Field label="Min booking (days)">
          <input
            type="number"
            value={minBookingDays}
            onChange={(e) => setMinBookingDays(Number(e.target.value))}
            className={inputClass}
          />
        </Field>
        <div className="col-span-2">
          <Field label="Storage type">
            <select
              value={storageType}
              onChange={(e) => setStorageType(e.target.value as typeof storageType)}
              className={inputClass}
            >
              <option value="ambient">📦 Ambient (general goods)</option>
              <option value="cold_storage">❄️ Cold storage</option>
              <option value="high_value">💎 High-value goods</option>
              <option value="hazmat">⚠️ Hazmat-compliant</option>
            </select>
          </Field>
        </div>
      </div>

      {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="mt-4 flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !slotCode.trim() || areaSqft <= 0}
          className="rounded-full bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Adding…' : 'Add slot'}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="rounded-full border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none'
