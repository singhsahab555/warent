'use client'

import { useState } from 'react'
import type { AvailableSlot } from '@/lib/queries/slots'
import CheckoutModal from './CheckoutModal'

const storageEmoji: Record<string, string> = {
  ambient: '📦',
  cold_storage: '❄️',
  hazmat: '⚠️',
  high_value: '💎',
}

export default function WarehouseCard({ slot }: { slot: AvailableSlot }) {
  const [showModal, setShowModal] = useState(false)
  const months = slot.min_booking_days / 30
  const estimatedTotal = Math.round(slot.area_sqft * slot.price_per_sqft * months)

  return (
    <>
      <div className="group overflow-hidden rounded-2xl border border-black/5 bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink-900/5">
        <div className="flex h-28 items-end justify-between bg-gradient-to-br from-brand-50 to-accent-50 px-5 pb-3 pt-4">
          <span className="text-3xl">{storageEmoji[slot.storage_type] ?? '📦'}</span>
          <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-bold capitalize text-brand-700 backdrop-blur-sm">
            {slot.storage_type.replace('_', ' ')}
          </span>
        </div>

        <div className="p-5">
          <h3 className="truncate text-base font-extrabold text-ink-900">{slot.warehouse_name}</h3>
          <p className="mt-0.5 text-sm text-gray-500">
            {slot.city}, {slot.state}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-gray-50 p-3">
            <Stat label="Area" value={`${slot.area_sqft}`} unit="sqft" />
            <Stat label="Rate" value={`₹${slot.price_per_sqft}`} unit="/sqft" />
            <Stat label="Min." value={`${slot.min_booking_days}`} unit="days" />
          </div>

          {(slot.has_loading_dock || slot.has_security) && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {slot.has_loading_dock && <Badge>🚛 Loading dock</Badge>}
              {slot.has_security && <Badge>🔒 24/7 security</Badge>}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-gray-400">Est. total for min. stay</p>
              <p className="text-lg font-extrabold text-ink-900">
                ₹{estimatedTotal.toLocaleString('en-IN')}
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="rounded-full bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-brand-600/30 transition hover:bg-brand-700"
            >
              Book now
            </button>
          </div>
        </div>
      </div>

      {showModal && <CheckoutModal slot={slot} onClose={() => setShowModal(false)} />}
    </>
  )
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-sm font-bold text-ink-900">
        {value}
        <span className="ml-0.5 text-[10px] font-medium text-gray-400">{unit}</span>
      </p>
    </div>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-accent-50 px-2.5 py-1 text-[11px] font-semibold text-accent-700">
      {children}
    </span>
  )
}
