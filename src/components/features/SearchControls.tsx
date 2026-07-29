'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

export default function SearchControls() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [city, setCity] = useState(searchParams.get('city') ?? '')
  const [minSqft, setMinSqft] = useState(Number(searchParams.get('minSqft') ?? 50))

  const applySearch = (nextCity: string, nextMinSqft: number) => {
    const params = new URLSearchParams()
    if (nextCity) params.set('city', nextCity)
    params.set('minSqft', String(nextMinSqft))

    startTransition(() => {
      router.push(`/renter?${params.toString()}`)
    })
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm shadow-ink-900/5">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-gray-400">
            City
          </label>
          <div className="relative mt-1.5">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm">
              📍
            </span>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applySearch(city, minSqft)}
              placeholder="e.g. Kolkata, Mumbai..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-sm font-medium focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <button
          onClick={() => applySearch(city, minSqft)}
          disabled={isPending}
          className="rounded-xl bg-brand-600 px-7 py-2.5 text-sm font-bold text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700 disabled:opacity-50"
        >
          {isPending ? 'Searching…' : 'Search'}
        </button>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wide text-gray-400">
            Required area
          </label>
          <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-extrabold text-brand-700">
            {minSqft.toLocaleString('en-IN')} sqft
          </span>
        </div>
        <input
          type="range"
          min={50}
          max={10000}
          step={50}
          value={minSqft}
          onChange={(e) => setMinSqft(Number(e.target.value))}
          onMouseUp={() => applySearch(city, minSqft)}
          onTouchEnd={() => applySearch(city, minSqft)}
          className="mt-2.5 w-full accent-brand-600"
        />
        <div className="mt-1 flex justify-between text-[11px] font-medium text-gray-400">
          <span>50 sqft</span>
          <span>10,000 sqft</span>
        </div>
      </div>
    </div>
  )
}