'use client'

import { useState } from 'react'
import type { AvailableSlot } from '@/lib/queries/slots'
import WarehouseCard from './WarehouseCard'
import SlotsMap from './SlotsMap'
import CheckoutModal from './CheckoutModal'

export default function SearchResultsView({ slots }: { slots: AvailableSlot[] }) {
  const [view, setView] = useState<'list' | 'map'>('list')
  const [bookingSlot, setBookingSlot] = useState<AvailableSlot | null>(null)

  return (
    <div>
      <div className="mb-4 inline-flex rounded-full border border-black/5 bg-white p-1">
        <button
          onClick={() => setView('list')}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
            view === 'list' ? 'bg-brand-600 text-white' : 'text-gray-500 hover:text-ink-900'
          }`}
        >
          📋 List
        </button>
        <button
          onClick={() => setView('map')}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
            view === 'map' ? 'bg-brand-600 text-white' : 'text-gray-500 hover:text-ink-900'
          }`}
        >
          🗺️ Map
        </button>
      </div>

      {view === 'list' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => (
            <WarehouseCard key={slot.slot_id} slot={slot} />
          ))}
        </div>
      ) : (
        <SlotsMap slots={slots} onSelectSlot={(slot) => setBookingSlot(slot)} />
      )}

      {bookingSlot && (
        <CheckoutModal slot={bookingSlot} onClose={() => setBookingSlot(null)} />
      )}
    </div>
  )
}
