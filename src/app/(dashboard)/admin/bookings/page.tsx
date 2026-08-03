import { getAllBookings } from '@/lib/queries/admin-bookings'
import RefundButton from '@/components/features/RefundButton'

const statusStyles: Record<string, string> = {
  paid: 'bg-accent-50 text-accent-700',
  pending: 'bg-amber-50 text-amber-700',
  refunded: 'bg-gray-100 text-gray-500',
  failed: 'bg-red-50 text-red-600',
}

export default async function AdminBookingsPage() {
  const bookings = await getAllBookings()

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink-900">All bookings</h1>
      <p className="mt-1 text-sm text-gray-500">Most recent 50 across the platform.</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 bg-gray-50 text-left text-xs font-bold uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3">Warehouse / Slot</th>
              <th className="px-5 py-3">Dates</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Payment</th>
              <th className="px-5 py-3">Provider</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-black/5 last:border-0">
                <td className="px-5 py-3 font-semibold text-ink-900">
                  {b.inventory_slots?.warehouses?.name ?? '—'}
                  <span className="ml-1 text-xs font-normal text-gray-400">
                    {b.inventory_slots?.slot_code}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-600">
                  {b.start_date} → {b.end_date}
                </td>
                <td className="px-5 py-3 font-bold text-ink-900">
                  ₹{Number(b.total_amount).toLocaleString('en-IN')}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                      statusStyles[b.payment_status] ?? statusStyles.pending
                    }`}
                  >
                    {b.payment_status}
                  </span>
                </td>
                <td className="px-5 py-3 capitalize text-gray-500">{b.payment_provider ?? '—'}</td>
                <td className="px-5 py-3">
                  {b.payment_status === 'paid' && <RefundButton bookingId={b.id} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <p className="px-5 py-10 text-center text-sm text-gray-400">No bookings yet.</p>
        )}
      </div>
    </div>
  )
}
