import { Suspense } from 'react'
import SearchControls from '@/components/features/SearchControls'
import SearchResultsView from '@/components/features/SearchResultsView'
import { searchAvailableSlots } from '@/lib/queries/slots'
import { searchSchema } from '@/lib/validators/search'
import { SkeletonCardGrid } from '@/components/ui/SkeletonCard'

export default async function RenterSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; minSqft?: string }>
}) {
  const params = await searchParams
  const parsed = searchSchema.parse({
    city: params.city ?? '',
    minSqft: params.minSqft ?? 50,
  })

  return (
    <div>
      {/* Hero band */}
      <div className="animate-fade-in-up relative overflow-hidden rounded-3xl bg-ink-900 px-8 py-9">
        <div className="pointer-events-none absolute -right-10 -top-14 h-44 w-44 animate-float-slow rounded-full bg-brand-600/30 blur-3xl" />
        <div
          className="pointer-events-none absolute -bottom-16 left-1/4 h-40 w-40 animate-float-slow rounded-full bg-accent-500/20 blur-3xl"
          style={{ animationDelay: '1.2s' }}
        />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse-ring" />
            Live availability, updated in real time
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-white">
            Find <span className="shimmer-text">warehouse space</span>
          </h1>
          <p className="mt-1.5 max-w-md text-sm text-white/60">
            Search fractional slots by city and required area — book in under a minute.
          </p>
        </div>
      </div>

      <div className="animate-fade-in-up mt-6" style={{ animationDelay: '100ms' }}>
        <SearchControls />
      </div>

      <div className="mt-6">
        <Suspense key={`${parsed.city}-${parsed.minSqft}`} fallback={<SkeletonCardGrid />}>
          <SearchResults city={parsed.city} minSqft={parsed.minSqft} />
        </Suspense>
      </div>
    </div>
  )
}

async function SearchResults({ city, minSqft }: { city: string; minSqft: number }) {
  const { data: slots, error } = await searchAvailableSlots(city, minSqft)

  if (error) {
    return <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
  }

  if (slots.length === 0) {
    return (
      <div className="animate-fade-in-up rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <span className="text-3xl">🔍</span>
        <p className="mt-2 text-sm font-medium text-gray-900">No warehouses found in this area.</p>
        <p className="mt-1 text-sm text-gray-500">
          Try reducing your sq ft requirement or searching a different city.
        </p>
      </div>
    )
  }

  return <SearchResultsView slots={slots} />
}
