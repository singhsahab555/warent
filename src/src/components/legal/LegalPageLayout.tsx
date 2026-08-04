import Link from 'next/link'
import Logo from '@/components/ui/Logo'

export default function LegalPageLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string
  lastUpdated: string
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-surface">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <nav className="flex gap-4 text-xs font-semibold text-gray-400">
            <Link href="/terms" className="hover:text-ink-900">Terms</Link>
            <Link href="/privacy" className="hover:text-ink-900">Privacy</Link>
            <Link href="/refund-policy" className="hover:text-ink-900">Refunds</Link>
          </nav>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-14">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-400">Last updated: {lastUpdated}</p>

        <div className="prose-legal mt-10 space-y-8 text-[15px] leading-relaxed text-gray-700">
          {children}
        </div>

        <div className="mt-14 rounded-2xl bg-gray-100 p-5 text-xs text-gray-500">
          This document is a general template and does not constitute legal advice. WARENT
          recommends consulting a qualified lawyer familiar with Indian consumer protection,
          e-commerce, and data protection law before relying on it for a live business.
        </div>
      </article>

      <footer className="border-t border-black/5 py-8 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} WARENT. Built for India's D2C supply chain.
      </footer>
    </main>
  )
}
