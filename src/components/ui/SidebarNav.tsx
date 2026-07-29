'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export type NavItem = {
  href: string
  label: string
  emoji: string
  exact?: boolean
}

export default function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <nav className="flex-1 space-y-1 px-3 py-4">
      {items.map((item) => {
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              isActive
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                : 'text-gray-600 hover:bg-black/5 hover:text-ink-900'
            }`}
          >
            <span className="text-base">{item.emoji}</span>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
