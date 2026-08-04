import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getRenterBookings } from '@/lib/queries/bookings'

const statusStyles: Record<string, string> = {
  confirmed: 'bg-accent-50 text-accent-700',
  pending: 'bg-amber-50 text-amber-700',
  active: 'bg-brand-50 text-brand-700',
  completed: 'bg-gray-100 text-gray-500',
  cancelled: 'bg-red-50 text-red-600',
  disputed: 'bg-red-50 text-red-600',
}

export default async function RenterBookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const bookings = await getRenterBookings(user.id)

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink-900">My bookings</h1>
      <p className="mt-1 text-sm text-gray-500">Every slot you've reserved on WARENT.</p>

      {bookings.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <span className="text-3xl">📭</span>
          <p className="mt-2 text-sm font-medium text-gray-900">No bookings yet.</p>
          <p className="mt-1 text-sm text-gray-500">
            Head to Search Space to book your first warehouse slot.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {bookings.map((b: any) => {
            const warehouse = b.inventory_slots?.warehouses
            return (
              <div
                key={b.id}
                className="rounded-2xl border border-black/5 bg-white p-5 transition hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-bold text-ink-900">
                        {warehouse?.name ?? 'Warehouse'}
                      </h3>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold capitalize ${
                          statusStyles[b.status] ?? statusStyles.pending
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {warehouse ? `${warehouse.city}, ${warehouse.state}` : ''}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      Slot {b.inventory_slots?.slot_code} · {b.area_sqft} sqft ·{' '}
                      {b.start_date} → {b.end_date}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-lg font-extrabold text-ink-900">
                      ₹{Number(b.total_amount).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
