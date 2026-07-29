import { logout } from '@/lib/actions/auth'

export default function UserFooter({ name, role }: { name: string; role: string }) {
  const initial = name?.trim()?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="border-t border-black/5 px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-400 text-sm font-extrabold text-ink-900">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-ink-900">{name}</p>
          <p className="truncate text-xs capitalize text-gray-400">{role}</p>
        </div>
      </div>
      <form action={logout}>
        <button className="mt-3 w-full rounded-lg border border-gray-200 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-50 hover:text-ink-900">
          Log out
        </button>
      </form>
    </div>
  )
}
