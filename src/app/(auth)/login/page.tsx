'use client'

import { useActionState } from 'react'
import { login, type ActionState } from '@/lib/actions/auth'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(login, null)

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-xl shadow-ink-900/5">
          <h1 className="text-xl font-extrabold text-ink-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">Log in to your WARENT account</p>

          <form action={formAction} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-ink-900">Email</label>
              <input
                name="email"
                type="email"
                required
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-900">Password</label>
              <input
                name="password"
                type="password"
                required
                className="mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
              />
            </div>

            {state?.error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-600/30 hover:bg-brand-700 disabled:opacity-50"
            >
              {isPending ? 'Logging in...' : 'Log in'}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          No account?{' '}
          <Link href="/signup" className="font-bold text-brand-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
