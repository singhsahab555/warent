'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

// Change this whenever you want to run a new promo — bumping the key forces
// it to show again even for returning visitors who dismissed an old one.
const PROMO_KEY = 'warent-promo-seen-v1'

export default function PromoModal() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const seen = sessionStorage.getItem(PROMO_KEY)
    if (!seen) {
      const timer = setTimeout(() => setVisible(true), 1200) // small delay feels less jarring than instant
      return () => clearTimeout(timer)
    }
  }, [])

  const dismiss = () => {
    sessionStorage.setItem(PROMO_KEY, 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={dismiss}
    >
      <div
        className="animate-fade-in-up relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm hover:text-ink-900"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-brand-500 to-brand-700">
          <div className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 animate-float-slow rounded-full bg-white/10 blur-2xl" />
          <div
            className="pointer-events-none absolute -right-6 bottom-0 h-28 w-28 animate-float-slow rounded-full bg-accent-400/20 blur-2xl"
            style={{ animationDelay: '1.2s' }}
          />
          <span className="relative text-6xl">🏬</span>
        </div>

        <div className="p-6 text-center">
          <h2 className="text-xl font-extrabold text-ink-900">First booking on us</h2>
          <p className="mt-1.5 text-sm text-gray-500">
            List your first warehouse or complete your first booking this month — our team will
            personally make sure it goes smoothly.
          </p>
          <Link
            href="/signup"
            onClick={dismiss}
            className="mt-5 block rounded-full bg-brand-600 py-3 text-sm font-bold text-white hover:bg-brand-700"
          >
            Get started
          </Link>
          <button
            onClick={dismiss}
            className="mt-2 text-xs font-semibold text-gray-400 hover:text-gray-600"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
