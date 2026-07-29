import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Logo from '@/components/ui/Logo'
import SidebarNav, { type NavItem } from '@/components/ui/SidebarNav'
import UserFooter from '@/components/ui/UserFooter'

const navItems: NavItem[] = [
  { href: '/admin', label: 'Pending Approvals', emoji: '✅', exact: true },
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
    <div className="flex min-h-screen bg-surface">
      <aside className="flex w-64 flex-col border-r border-black/5 bg-white">
        <div className="border-b border-black/5 px-5 py-5">
          <Logo subtitle="Admin Panel" size="sm" />
        </div>
        <SidebarNav items={navItems} />
        <UserFooter name={profile?.full_name ?? 'Admin'} role="admin" />
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
