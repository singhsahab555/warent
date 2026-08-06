import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/ui/DashboardShell'
import type { NavItem } from '@/components/ui/SidebarNav'

const navItems: NavItem[] = [
  { href: '/lender', label: 'Overview', emoji: '🏠', exact: true },
  { href: '/lender/warehouses', label: 'My Warehouses', emoji: '🏬' },
  { href: '/lender/warehouses/new', label: 'Add Warehouse', emoji: '➕' },
  { href: '/lender/bookings', label: 'Bookings', emoji: '📋' },
  { href: '/lender/earnings', label: 'Earnings', emoji: '💰' },
  { href: '/lender/verification', label: 'Verification', emoji: '🪪' },
]

export default async function LenderLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'lender') redirect('/renter')

  return (
    <DashboardShell
      subtitle="Lender Portal"
      navItems={navItems}
      userName={profile?.full_name ?? 'Lender'}
      userRole="lender"
    >
      {children}
    </DashboardShell>
  )
}
