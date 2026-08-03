'use client'

import Map, { Marker, Popup, NavigationControl } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useState, useRef, useCallback } from 'react'
import type { MapRef } from 'react-map-gl/mapbox'
import type { AvailableSlot } from '@/lib/queries/slots'

export default function SlotsMap({
  slots,
  onSelectSlot,
}: {
  slots: AvailableSlot[]
  onSelectSlot?: (slot: AvailableSlot) => void
}) {
  const [active, setActive] = useState<AvailableSlot | null>(null)
  const mapRef = useRef<MapRef>(null)

  const handleMapLoad = useCallback(() => {
    // Mapbox sometimes calculates canvas size before the flex/grid layout
    // around it settles, leaving tiles blank until a resize is forced.
    setTimeout(() => mapRef.current?.resize(), 0)
  }, [])

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  if (!token) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400">
        Map unavailable — Mapbox token not configured.
      </div>
    )
  }

  if (slots.length === 0) {
    return (
      <div className="flex h-[500px] w-full items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400">
        No results to show on the map yet.
      </div>
    )
  }

  const first = slots[0]

  return (
    <div className="h-[500px] w-full overflow-hidden rounded-2xl border border-black/5 shadow-sm shadow-ink-900/5">
      <Map
        ref={mapRef}
        onLoad={handleMapLoad}
        mapboxAccessToken={token}
        initialViewState={{
          longitude: first.lng,
          latitude: first.lat,
          zoom: 11,
        }}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
      >
        <NavigationControl position="top-right" showCompass={false} />

        {slots.map((slot) => (
          <Marker
            key={slot.slot_id}
            longitude={slot.lng}
            latitude={slot.lat}
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              setActive(slot)
            }}
          >
            <button
              className={`cursor-pointer rounded-full border-2 px-2.5 py-1 text-xs font-bold shadow-md transition ${
                active?.slot_id === slot.slot_id
                  ? 'border-white bg-brand-600 text-white scale-110'
                  : 'border-white bg-ink-900 text-white hover:bg-brand-600'
              }`}
            >
              ₹{slot.price_per_sqft}
            </button>
          </Marker>
        ))}

        {active && (
          <Popup
            longitude={active.lng}
            latitude={active.lat}
            onClose={() => setActive(null)}
            closeOnClick={false}
            offset={16}
            className="warent-map-popup"
          >
            <div className="min-w-[180px] p-1">
              <p className="font-bold text-ink-900">{active.warehouse_name}</p>
              <p className="mt-0.5 text-xs text-gray-500">
                {active.city}, {active.state}
              </p>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-600">
                  {active.area_sqft} sqft · ₹{active.price_per_sqft}/sqft
                </span>
              </div>
              {onSelectSlot && (
                <button
                  onClick={() => onSelectSlot(active)}
                  className="mt-2 w-full rounded-full bg-brand-600 py-1.5 text-xs font-bold text-white hover:bg-brand-700"
                >
                  Book now
                </button>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
