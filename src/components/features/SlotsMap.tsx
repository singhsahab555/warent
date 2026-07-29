'use client'

import Map, { Marker, Popup } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useState } from 'react'
import type { AvailableSlot } from '@/lib/queries/slots'

export default function SlotsMap({ slots }: { slots: AvailableSlot[] }) {
  const [active, setActive] = useState<AvailableSlot | null>(null)

  const first = slots[0]

  return (
    <div className="h-[500px] w-full overflow-hidden rounded-xl border border-gray-200">
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: first?.lng ?? 88.3639,
          latitude: first?.lat ?? 22.5726,
          zoom: 10,
        }}
        mapStyle="mapbox://styles/mapbox/light-v11"
      >
        {slots.map((slot) => (
          <Marker
            key={slot.slot_id}
            longitude={slot.lng}
            latitude={slot.lat}
            onClick={() => setActive(slot)}
          >
            <div className="cursor-pointer rounded-full bg-gray-900 px-2 py-1 text-xs font-medium text-white shadow">
              ₹{slot.price_per_sqft}
            </div>
          </Marker>
        ))}

        {active && (
          <Popup
            longitude={active.lng}
            latitude={active.lat}
            onClose={() => setActive(null)}
            closeOnClick={false}
          >
            <div className="text-sm">
              <p className="font-medium">{active.warehouse_name}</p>
              <p className="text-gray-500">{active.area_sqft} sqft · ₹{active.price_per_sqft}/sqft</p>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}