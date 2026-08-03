import { getAllOwedPayouts } from '@/lib/queries/payouts'
import MarkPaidButton from '@/components/features/MarkPaidButton'

export default async function AdminPayoutsPage() {
  const payouts = await getAllOwedPayouts()
  const totalOwed = payouts.reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink-900">Lender payouts</h1>
      <p className="mt-1 text-sm text-gray-500">
        Transfer these manually via your bank/UPI, then mark as paid to keep the ledger accurate.
      </p>

      <div className="mt-5 inline-block rounded-2xl bg-ink-900 px-6 py-4 text-white">
        <p className="text-xs font-semibold text-white/50">Total owed to lenders</p>
        <p className="mt-1 text-2xl font-extrabold">₹{totalOwed.toLocaleString('en-IN')}</p>
      </div>

      <div className="mt-6 space-y-3">
        {payouts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
            <p className="text-sm text-gray-500">No pending payouts.</p>
          </div>
        ) : (
          payouts.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-2xl border border-black/5 bg-white p-4"
            >
              <div>
                <p className="font-bold text-ink-900">{p.users?.full_name ?? 'Lender'}</p>
                <p className="text-sm text-gray-500">{p.users?.email}</p>
                <p className="mt-1 text-xs text-gray-400">
                  Booking {p.bookings?.start_date} → {p.bookings?.end_date}
                </p>
                {p.needs_reconciliation && (
                  <p className="mt-1 text-xs font-bold text-red-600">
                    ⚠ Needs reconciliation — related booking was refunded after payout
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p className="text-lg font-extrabold text-ink-900">
                  ₹{Number(p.amount).toLocaleString('en-IN')}
                </p>
                <MarkPaidButton payoutId={p.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
