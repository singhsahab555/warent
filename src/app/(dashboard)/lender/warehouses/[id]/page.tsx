import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getWarehouseDetail } from '@/lib/queries/warehouse-detail'
import PublishToggle from '@/components/features/PublishToggle'

const statusStyles: Record<string, string> = {
  active: 'bg-accent-50 text-accent-700',
  pending_verification: 'bg-amber-50 text-amber-700',
  suspended: 'bg-red-50 text-red-600',
  inactive: 'bg-gray-100 text-gray-500',
}

const slotStatusStyles: Record<string, string> = {
  available: 'bg-accent-50 text-accent-700',
  reserved: 'bg-amber-50 text-amber-700',
  occupied: 'bg-brand-50 text-brand-700',
  maintenance: 'bg-gray-100 text-gray-500',
}

export default async function WarehouseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const warehouse = await getWarehouseDetail(id)

  if (!warehouse) notFound()
  if (warehouse.lender_id !== user.id) redirect('/lender/warehouses')

  return (
    <div>
      <Link
        href="/lender/warehouses"
        className="text-sm font-semibold text-gray-400 hover:text-ink-900"
      >
        ← My warehouses
      </Link>

      <div className="mt-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-extrabold text-ink-900">{warehouse.name}</h1>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                statusStyles[warehouse.status] ?? statusStyles.inactive
              }`}
            >
              {warehouse.status.replace('_', ' ')}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {warehouse.address_line}, {warehouse.city}, {warehouse.state} {warehouse.pincode}
          </p>
        </div>

        <PublishToggle warehouseId={warehouse.id} status={warehouse.status} />
      </div>

      {warehouse.description && (
        <p className="mt-4 max-w-2xl text-sm text-gray-600">{warehouse.description}</p>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Total area" value={`${warehouse.total_area_sqft} sqft`} />
        <MiniStat label="Available" value={`${warehouse.available_area_sqft} sqft`} />
        <MiniStat label="Total slots" value={`${warehouse.inventory_slots.length}`} />
        <MiniStat
          label="Listed"
          value={new Date(warehouse.created_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        />
      </div>

      {(warehouse.has_loading_dock || warehouse.has_security || warehouse.has_fire_safety) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {warehouse.has_loading_dock && <Amenity>🚛 Loading dock</Amenity>}
          {warehouse.has_security && <Amenity>🔒 24/7 security</Amenity>}
          {warehouse.has_fire_safety && <Amenity>🧯 Fire safety</Amenity>}
        </div>
      )}

      <h2 className="mt-8 text-lg font-extrabold text-ink-900">Inventory slots</h2>

      {warehouse.inventory_slots.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
          <p className="text-sm font-medium text-gray-900">No slots added yet.</p>
        </div>
      ) : (
        <div className="mt-3 overflow-hidden rounded-2xl border border-black/5 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-gray-50 text-left text-xs font-bold uppercase tracking-wide text-gray-400">
                <th className="px-5 py-3">Slot</th>
                <th className="px-5 py-3">Area</th>
                <th className="px-5 py-3">Rate</th>
                <th className="px-5 py-3">Min. lease</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {warehouse.inventory_slots.map((slot) => (
                <tr key={slot.id} className="border-b border-black/5 last:border-0">
                  <td className="px-5 py-3 font-bold text-ink-900">{slot.slot_code}</td>
                  <td className="px-5 py-3 text-gray-600">{slot.area_sqft} sqft</td>
                  <td className="px-5 py-3 text-gray-600">₹{slot.price_per_sqft}/sqft</td>
                  <td className="px-5 py-3 text-gray-600">{slot.min_booking_days} days</td>
                  <td className="px-5 py-3 capitalize text-gray-600">
                    {slot.storage_type.replace('_', ' ')}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                        slotStatusStyles[slot.status] ?? slotStatusStyles.maintenance
                      }`}
                    >
                      {slot.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white p-3.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-0.5 text-sm font-extrabold text-ink-900">{value}</p>
    </div>
  )
}

function Amenity({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
      {children}
    </span>
  )
}
