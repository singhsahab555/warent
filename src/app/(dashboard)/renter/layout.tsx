import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/ui/DashboardShell'
import type { NavItem } from '@/components/ui/SidebarNav'

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
    <DashboardShell
      subtitle="Renter Portal"
      navItems={navItems}
      userName={profile?.full_name ?? 'Renter'}
      userRole="renter"
    >
      {children}
    </DashboardShell>
  )
}
