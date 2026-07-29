import Link from 'next/link'
import type { LenderWarehouse } from '@/lib/queries/warehouses'

const statusStyles: Record<string, string> = {
  active: 'bg-accent-50 text-accent-700',
  pending_verification: 'bg-amber-50 text-amber-700',
  suspended: 'bg-red-50 text-red-600',
  inactive: 'bg-gray-100 text-gray-500',
}

export default function WarehouseListItem({ warehouse }: { warehouse: LenderWarehouse }) {
  const totalSlots = warehouse.inventory_slots.length
  const availableSlots = warehouse.inventory_slots.filter((s) => s.status === 'available').length

  return (
    <Link
      href={`/lender/warehouses/${warehouse.id}`}
      className="group block overflow-hidden rounded-2xl border border-black/5 bg-white transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink-900/5"
    >
      <div className="flex h-20 items-start justify-between bg-gradient-to-br from-brand-50 to-accent-50 px-5 pt-4">
        <span className="text-2xl">🏬</span>
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-bold capitalize ${
            statusStyles[warehouse.status] ?? statusStyles.inactive
          }`}
        >
          {warehouse.status.replace('_', ' ')}
        </span>
      </div>

      <div className="px-5 pb-5 pt-3">
        <h3 className="truncate text-base font-extrabold text-ink-900">{warehouse.name}</h3>
        <p className="mt-0.5 text-sm text-gray-500">
          {warehouse.city}, {warehouse.state}
        </p>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-gray-50 p-3">
          <Stat label="Area" value={`${warehouse.total_area_sqft}`} unit="sqft" />
          <Stat label="Slots" value={`${availableSlots}/${totalSlots}`} unit="free" />
          <Stat
            label="Listed"
            value={new Date(warehouse.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
            })}
            unit=""
          />
        </div>
      </div>
    </Link>
  )
}

function Stat({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-sm font-bold text-ink-900">
        {value}
        {unit && <span className="ml-0.5 text-[10px] font-medium text-gray-400">{unit}</span>}
      </p>
    </div>
  )
}
