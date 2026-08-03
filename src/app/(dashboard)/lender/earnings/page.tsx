import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLenderPayouts } from '@/lib/queries/payouts'

export default async function LenderEarningsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const payouts = await getLenderPayouts(user.id)
  const owed = payouts.filter((p) => p.status === 'owed').reduce((sum, p) => sum + Number(p.amount), 0)
  const paid = payouts.filter((p) => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0)

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink-900">Earnings</h1>
      <p className="mt-1 text-sm text-gray-500">Your share from confirmed bookings.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:max-w-md">
        <div className="rounded-2xl bg-brand-600 p-5 text-white">
          <p className="text-xs font-semibold text-brand-100">Owed to you</p>
          <p className="mt-1 text-2xl font-extrabold">₹{owed.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-2xl border border-black/5 bg-white p-5">
          <p className="text-xs font-semibold text-gray-400">Paid out</p>
          <p className="mt-1 text-2xl font-extrabold text-ink-900">₹{paid.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <h2 className="mt-8 text-sm font-bold uppercase tracking-wide text-gray-400">History</h2>

      {payouts.length === 0 ? (
        <div className="mt-3 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center">
          <p className="text-sm text-gray-500">No payouts yet — they appear here once a booking is paid.</p>
        </div>
      ) : (
        <div className="mt-3 space-y-2">
          {payouts.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl border border-black/5 bg-white p-4">
              <div>
                <p className="text-sm font-bold text-ink-900">
                  {p.bookings?.start_date} → {p.bookings?.end_date}
                </p>
                {p.payout_reference && (
                  <p className="text-xs text-gray-400">Ref: {p.payout_reference}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold text-ink-900">₹{Number(p.amount).toLocaleString('en-IN')}</p>
                <span
                  className={`text-xs font-bold capitalize ${
                    p.status === 'paid' ? 'text-accent-600' : 'text-amber-600'
                  }`}
                >
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
