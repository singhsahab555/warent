'use client'

import { useActionState, useState } from 'react'
import { signup, type ActionState } from '@/lib/actions/auth'
import Logo from '@/components/ui/Logo'

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(signup, null)
  const [role, setRole] = useState<'lender' | 'renter'>('renter')

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-3xl border border-black/5 bg-white p-8 shadow-xl shadow-ink-900/5">
          <h1 className="text-xl font-extrabold text-ink-900">Create your account</h1>
          <p className="mt-1 text-sm text-gray-500">Join WARENT in under a minute</p>

          <form action={formAction} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('renter')}
                className={`rounded-xl border-2 py-2.5 text-sm font-bold transition ${
                  role === 'renter'
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                📦 I need space
              </button>
              <button
                type="button"
                onClick={() => setRole('lender')}
                className={`rounded-xl border-2 py-2.5 text-sm font-bold transition ${
                  role === 'lender'
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                🏬 I have space
              </button>
            </div>
            <input type="hidden" name="role" value={role} />

            <div>
              <label className="block text-sm font-semibold text-ink-900">Full name</label>
              <input name="fullName" required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-900">Phone</label>
              <input name="phone" required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-900">Email</label>
              <input name="email" type="email" required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-900">Password</label>
              <input name="password" type="password" required className={inputClass} />
            </div>

            {state?.error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-600/30 hover:bg-brand-700 disabled:opacity-50"
            >
              {isPending ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

const inputClass =
  'mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100'
