'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { submitSupportTicket, type SupportActionState } from '@/lib/actions/support'
import Logo from '@/components/ui/Logo'

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState<SupportActionState, FormData>(
    submitSupportTicket,
    null
  )

  return (
    <main className="min-h-screen bg-surface">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <nav className="flex gap-4 text-xs font-semibold text-gray-400">
            <Link href="/about" className="hover:text-ink-900">About</Link>
            <Link href="/faq" className="hover:text-ink-900">FAQ</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-6 py-16">
        <h1 className="animate-fade-in-up text-3xl font-extrabold tracking-tight text-ink-900">
          Get in touch
        </h1>
        <p className="animate-fade-in-up mt-2 text-sm text-gray-500" style={{ animationDelay: '80ms' }}>
          Questions about a booking, a listing, or anything else — we usually respond within one
          business day.
        </p>

        {state?.success ? (
          <div className="animate-fade-in-up mt-8 rounded-2xl border border-accent-200 bg-accent-50 p-6 text-center">
            <span className="text-3xl">✅</span>
            <p className="mt-2 font-bold text-ink-900">Message sent</p>
            <p className="mt-1 text-sm text-gray-600">
              We&rsquo;ve received your message and sent a confirmation to your email.
            </p>
          </div>
        ) : (
          <form action={formAction} className="animate-fade-in-up mt-8 space-y-4" style={{ animationDelay: '150ms' }}>
            <div>
              <label className="block text-sm font-semibold text-ink-900">Name</label>
              <input name="name" required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-900">Email</label>
              <input name="email" type="email" required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-900">Subject</label>
              <input name="subject" required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-900">Message</label>
              <textarea name="message" rows={5} required className={inputClass} />
            </div>

            {state?.error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-full bg-brand-600 py-2.5 text-sm font-bold text-white shadow-md shadow-brand-600/30 hover:bg-brand-700 disabled:opacity-50"
            >
              {isPending ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}
      </div>

      <footer className="border-t border-black/5 py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} WARENT. Built for India's D2C supply chain.
      </footer>
    </main>
  )
}

const inputClass =
  'mt-1.5 w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100'
