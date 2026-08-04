import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLenderWarehouses } from '@/lib/queries/warehouses'
import { getLenderPayouts } from '@/lib/queries/payouts'
import StatCard from '@/components/ui/StatCard'

export default async function LenderOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const [warehouses, payouts] = await Promise.all([
    getLenderWarehouses(user.id),
    getLenderPayouts(user.id),
  ])

  const activeWarehouses = warehouses.filter((w) => w.status === 'active').length
  const totalSlots = warehouses.reduce((sum, w) => sum + w.inventory_slots.length, 0)
  const owed = payouts.filter((p) => p.status === 'owed').reduce((sum, p) => sum + Number(p.amount), 0)
  const paidOut = payouts.filter((p) => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0)

  const firstName = (profile?.full_name ?? 'there').split(' ')[0]

  return (
    <div>
      {/* Hero welcome band */}
      <div className="animate-fade-in-up relative overflow-hidden rounded-3xl bg-ink-900 px-8 py-10">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 animate-float-slow rounded-full bg-brand-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 animate-float-slow rounded-full bg-accent-500/20 blur-3xl" style={{ animationDelay: '1.5s' }} />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/70 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse-ring" />
            Live on WARENT
          </span>
          <h1 className="mt-4 text-3xl font-extrabold text-white">
            Welcome back, <span className="shimmer-text">{firstName}</span> 👋
          </h1>
          <p className="mt-1.5 max-w-md text-sm text-white/60">
            You&rsquo;re part of India&rsquo;s fastest-growing fractional warehousing network.
            Here&rsquo;s how your space is performing.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="stagger-children mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Warehouses" value={String(warehouses.length)} emoji="🏬" />
        <StatCard label="Live listings" value={String(activeWarehouses)} emoji="✅" tone="accent" />
        <StatCard label="Total slots" value={String(totalSlots)} emoji="📦" />
        <StatCard label="Owed to you" value={`₹${owed.toLocaleString('en-IN')}`} emoji="💰" tone="brand" />
      </div>

      {/* Quick actions */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/lender/warehouses/new"
          className="animate-fade-in-up group flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink-900/5"
          style={{ animationDelay: '150ms' }}
        >
          <div>
            <p className="font-bold text-ink-900">List a new warehouse</p>
            <p className="mt-0.5 text-sm text-gray-500">Add space and start earning this week.</p>
          </div>
          <span className="text-xl transition group-hover:translate-x-1">→</span>
        </Link>
        <Link
          href="/lender/earnings"
          className="animate-fade-in-up group flex items-center justify-between rounded-2xl border border-black/5 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-ink-900/5"
          style={{ animationDelay: '220ms' }}
        >
          <div>
            <p className="font-bold text-ink-900">View earnings</p>
            <p className="mt-0.5 text-sm text-gray-500">
              ₹{paidOut.toLocaleString('en-IN')} paid out so far.
            </p>
          </div>
          <span className="text-xl transition group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {warehouses.length === 0 && (
        <div className="animate-fade-in-up mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-14 text-center" style={{ animationDelay: '300ms' }}>
          <span className="text-3xl">🏬</span>
          <p className="mt-2 text-sm font-medium text-gray-900">No warehouses yet.</p>
          <p className="mt-1 text-sm text-gray-500">List your first space to appear here.</p>
          <Link
            href="/lender/warehouses/new"
            className="mt-4 inline-block rounded-full bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700"
          >
            + Add warehouse
          </Link>
        </div>
      )}
    </div>
  )
}
