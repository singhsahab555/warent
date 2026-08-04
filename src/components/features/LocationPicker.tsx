'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import Map, { Marker } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

type GeocodeSuggestion = {
  id: string
  place_name: string
  center: [number, number] // [lng, lat]
  context: { id: string; text: string }[]
}

type LocationValue = {
  addressLine: string
  city: string
  state: string
  pincode: string
  lat: number
  lng: number
}

export default function LocationPicker({
  value,
  onChange,
}: {
  value: LocationValue
  onChange: (next: LocationValue) => void
}) {
  const [query, setQuery] = useState(value.addressLine || '')
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [locateError, setLocateError] = useState<string | null>(null)
  // Bumped only when the user picks a genuinely new location (search select or
  // "use current location") — forces the map to recenter. Dragging the pin to
  // fine-tune does NOT bump this, so the viewport stays put while dragging
  // instead of jarringly recentering under the user's cursor.
  const [locationVersion, setLocationVersion] = useState(0)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const hasPin = value.lat !== 0 && value.lng !== 0

  // --- Address autocomplete via Mapbox Geocoding API ---
  const fetchSuggestions = useCallback(
    async (text: string) => {
      if (!token || text.trim().length < 3) {
        setSuggestions([])
        return
      }
      setIsSearching(true)
      try {
        const res = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(text)}.json?` +
            `access_token=${token}&country=IN&types=address,place,locality&limit=5`
        )
        const data = await res.json()
        setSuggestions(data.features ?? [])
      } catch {
        setSuggestions([])
      } finally {
        setIsSearching(false)
      }
    },
    [token]
  )

  const handleQueryChange = (text: string) => {
    setQuery(text)
    setShowSuggestions(true)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchSuggestions(text), 350)
  }

  const extractContext = (feature: GeocodeSuggestion, type: string) =>
    feature.context?.find((c) => c.id.startsWith(type))?.text ?? ''

  const handleSelectSuggestion = (feature: GeocodeSuggestion) => {
    const [lng, lat] = feature.center
    const city = extractContext(feature, 'place') || extractContext(feature, 'locality')
    const state = extractContext(feature, 'region')
    const pincode = extractContext(feature, 'postcode')

    setQuery(feature.place_name)
    setShowSuggestions(false)
    setSuggestions([])

    onChange({
      addressLine: feature.place_name,
      city: city || value.city,
      state: state || value.state,
      pincode: pincode || value.pincode,
      lat,
      lng,
    })
    setLocationVersion((v) => v + 1)
  }

  // --- "Use my current location" via browser Geolocation + reverse geocode ---
  const handleUseCurrentLocation = () => {
    setLocateError(null)
    if (!navigator.geolocation) {
      setLocateError('Geolocation is not supported by your browser')
      return
    }
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const res = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?` +
              `access_token=${token}&types=address,place`
          )
          const data = await res.json()
          const feature = data.features?.[0]
          if (feature) {
            const city = extractContext(feature, 'place') || extractContext(feature, 'locality')
            const state = extractContext(feature, 'region')
            const pincode = extractContext(feature, 'postcode')
            setQuery(feature.place_name)
            onChange({
              addressLine: feature.place_name,
              city: city || value.city,
              state: state || value.state,
              pincode: pincode || value.pincode,
              lat: latitude,
              lng: longitude,
            })
            setLocationVersion((v) => v + 1)
          } else {
            onChange({ ...value, lat: latitude, lng: longitude })
            setLocationVersion((v) => v + 1)
          }
        } catch {
          onChange({ ...value, lat: latitude, lng: longitude })
          setLocationVersion((v) => v + 1)
        } finally {
          setIsLocating(false)
        }
      },
      (err) => {
        setIsLocating(false)
        setLocateError(
          err.code === err.PERMISSION_DENIED
            ? 'Location access denied — enable it in your browser settings, or search/pin manually.'
            : 'Could not detect your location — try searching or pinning manually.'
        )
      }
    )
  }

  // --- Fine-tune by dragging the pin ---
  const handleMarkerDragEnd = (e: { lngLat: { lat: number; lng: number } }) => {
    onChange({ ...value, lat: e.lngLat.lat, lng: e.lngLat.lng })
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Warehouse location</label>

      <div className="relative mt-1.5">
        <input
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Start typing an address..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none"
        />
        {isSearching && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            Searching…
          </span>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            {suggestions.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => handleSelectSuggestion(s)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  {s.place_name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          disabled={isLocating}
          className="text-xs font-semibold text-brand-600 hover:underline disabled:opacity-50"
        >
          {isLocating ? 'Detecting…' : '📍 Use my current location'}
        </button>
        {locateError && <span className="text-xs text-red-600">{locateError}</span>}
      </div>

      {/* Fine-tune pin */}
      {token && hasPin && (
        <div className="mt-3 overflow-hidden rounded-xl border border-gray-200">
          <div className="h-56 w-full">
            <Map
              key={locationVersion}
              mapboxAccessToken={token}
              initialViewState={{ latitude: value.lat, longitude: value.lng, zoom: 15 }}
              style={{ width: '100%', height: '100%' }}
              mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
            >
              <Marker
                latitude={value.lat}
                longitude={value.lng}
                draggable
                onDragEnd={handleMarkerDragEnd}
                color="#4529e0"
              />
            </Map>
          </div>
          <p className="bg-gray-50 px-3 py-1.5 text-[11px] text-gray-400">
            Drag the pin to fine-tune the exact location.
          </p>
        </div>
      )}

      {!hasPin && (
        <p className="mt-2 text-xs text-gray-400">
          Search an address or use your current location to set the exact pin.
        </p>
      )}
    </div>
  )
}
