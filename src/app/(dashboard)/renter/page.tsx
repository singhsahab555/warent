import { Suspense } from 'react'
import SearchControls from '@/components/features/SearchControls'
import WarehouseCard from '@/components/features/WarehouseCard'
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
      <h1 className="text-2xl font-semibold text-gray-900">Find warehouse space</h1>
      <p className="mt-1 text-sm text-gray-500">
        Search fractional slots by city and required area.
      </p>

      <div className="mt-6">
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
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <p className="text-sm font-medium text-gray-900">No warehouses found in this area.</p>
        <p className="mt-1 text-sm text-gray-500">
          Try reducing your sq ft requirement or searching a different city.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {slots.map((slot) => (
        <WarehouseCard key={slot.slot_id} slot={slot} />
      ))}
    </div>
  )
}