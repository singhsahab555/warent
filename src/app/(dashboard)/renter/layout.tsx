import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Logo from '@/components/ui/Logo'
import SidebarNav, { type NavItem } from '@/components/ui/SidebarNav'
import UserFooter from '@/components/ui/UserFooter'

const navItems: NavItem[] = [
  { href: '/renter', label: 'Search Space', emoji: '🔍', exact: true },
  { href: '/renter/bookings', label: 'My Bookings', emoji: '📋' },
]

export default async function RenterLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'renter') redirect('/lender')

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="flex w-64 flex-col border-r border-black/5 bg-white">
        <div className="border-b border-black/5 px-5 py-5">
          <Logo subtitle="Renter Portal" size="sm" />
        </div>

        <SidebarNav items={navItems} />

        <UserFooter name={profile?.full_name ?? 'Renter'} role="renter" />
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
