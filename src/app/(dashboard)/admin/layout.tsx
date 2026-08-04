import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardShell from '@/components/ui/DashboardShell'
import type { NavItem } from '@/components/ui/SidebarNav'

const navItems: NavItem[] = [
  { href: '/admin', label: 'Pending Approvals', emoji: '✅', exact: true },
  { href: '/admin/bookings', label: 'All Bookings', emoji: '📋' },
  { href: '/admin/payouts', label: 'Lender Payouts', emoji: '💸' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/login')

  return (
    <DashboardShell
      subtitle="Admin Panel"
      navItems={navItems}
      userName={profile?.full_name ?? 'Admin'}
      userRole="admin"
    >
      {children}
    </DashboardShell>
  )
}
