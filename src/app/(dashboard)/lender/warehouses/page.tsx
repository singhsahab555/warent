import Link from 'next/link'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getLenderWarehouses } from '@/lib/queries/warehouses'
import WarehouseListItem from '@/components/features/WarehouseListItem'
import { SkeletonCardGrid } from '@/components/ui/SkeletonCard'
import { redirect } from 'next/navigation'

export default async function LenderWarehousesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My warehouses</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your listed spaces.</p>
        </div>
        <Link
          href="/lender/warehouses/new"
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Add warehouse
        </Link>
      </div>

      <div className="mt-6">
        <Suspense fallback={<SkeletonCardGrid count={3} />}>
          <WarehouseList lenderId={user.id} />
        </Suspense>
      </div>
    </div>
  )
}

async function WarehouseList({ lenderId }: { lenderId: string }) {
  const warehouses = await getLenderWarehouses(lenderId)

  if (warehouses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <p className="text-sm font-medium text-gray-900">No warehouses listed yet.</p>
        <p className="mt-1 text-sm text-gray-500">
          Add your first warehouse to start receiving bookings.
        </p>
        <Link
          href="/lender/warehouses/new"
          className="mt-4 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Add warehouse
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {warehouses.map((w) => (
        <WarehouseListItem key={w.id} warehouse={w} />
      ))}
    </div>
  )
}