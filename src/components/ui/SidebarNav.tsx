'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type NavItem = {
  href: string
  label: string
  emoji: string
  exact?: boolean
}

export default function SidebarNav({
  items,
  collapsed = false,
}: {
  items: NavItem[]
  collapsed?: boolean
}) {
  const pathname = usePathname()

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {items.map((item) => {
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={`group relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              collapsed ? 'justify-center' : ''
            } ${
              isActive
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                : 'text-gray-600 hover:bg-black/5 hover:text-ink-900'
            }`}
          >
            <span className="text-base">{item.emoji}</span>
            {!collapsed && item.label}

            {collapsed && (
              <span className="pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-lg bg-ink-900 px-2.5 py-1.5 text-xs font-semibold text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 z-20">
                {item.label}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}
