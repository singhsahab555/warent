'use client'

import { useState, useEffect } from 'react'
import Logo from './Logo'
import SidebarNav, { type NavItem } from './SidebarNav'
import UserFooter from './UserFooter'

export default function DashboardShell({
  subtitle,
  navItems,
  userName,
  userRole,
  children,
}: {
  subtitle: string
  navItems: NavItem[]
  userName: string
  userRole: string
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('warent-sidebar-collapsed')
    if (saved === 'true') setCollapsed(true)
    setHydrated(true)
  }, [])

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem('warent-sidebar-collapsed', String(next))
      return next
    })
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <aside
        className={`relative flex shrink-0 flex-col border-r border-black/5 bg-white transition-[width] duration-300 ease-in-out ${
          collapsed ? 'w-[76px]' : 'w-64'
        } ${hydrated ? '' : 'invisible'}`}
      >
        <button
          onClick={toggle}
          className="absolute -right-3 top-8 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-black/10 bg-white text-gray-400 shadow-sm transition hover:text-brand-600"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`h-3.5 w-3.5 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`}
          >
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="overflow-hidden border-b border-black/5 px-5 py-5">
          <div className={collapsed ? 'flex justify-center' : ''}>
            <Logo subtitle={collapsed ? undefined : subtitle} size="sm" />
          </div>
        </div>

        <div className="overflow-hidden">
          <SidebarNav items={navItems} collapsed={collapsed} />
        </div>

        <div className="mt-auto overflow-hidden">
          <UserFooter name={userName} role={userRole} collapsed={collapsed} />
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
