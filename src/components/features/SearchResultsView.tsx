'use client'

import { useState } from 'react'
import type { AvailableSlot } from '@/lib/queries/slots'
import WarehouseCard from './WarehouseCard'
import SlotsMap from './SlotsMap'
import CheckoutModal from './CheckoutModal'

export default function SearchResultsView({ slots }: { slots: AvailableSlot[] }) {
  const [view, setView] = useState<'list' | 'map'>('list')
  const [bookingSlot, setBookingSlot] = useState<AvailableSlot | null>(null)
  // Tracks whether the map has EVER been opened this page visit. Once true, we
  // keep the map mounted (just visually hidden) instead of unmounting it —
  // Mapbox re-initializes and re-downloads tiles on every mount, so toggling
  // List <-> Map repeatedly would otherwise burn a fresh map "load" each time,
  // eating into the free-tier monthly limit far faster than actual usage warrants.
  const [mapEverOpened, setMapEverOpened] = useState(false)

  const handleShowMap = () => {
    setMapEverOpened(true)
    setView('map')
  }

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
          onClick={handleShowMap}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
            view === 'map' ? 'bg-brand-600 text-white' : 'text-gray-500 hover:text-ink-900'
          }`}
        >
          🗺️ Map
        </button>
      </div>

      <div className={view === 'list' ? '' : 'hidden'}>
        <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => (
            <WarehouseCard key={slot.slot_id} slot={slot} />
          ))}
        </div>
      </div>

      {/* Only mounted after the first "Map" click (saves loads for users who
          never open it), then stays mounted — hidden via CSS, not unmounted —
          for the rest of the session so re-toggling is free. */}
      {mapEverOpened && (
        <div className={view === 'map' ? '' : 'hidden'}>
          <SlotsMap slots={slots} onSelectSlot={(slot) => setBookingSlot(slot)} />
        </div>
      )}

      {bookingSlot && (
        <CheckoutModal slot={bookingSlot} onClose={() => setBookingSlot(null)} />
      )}
    </div>
  )
}
