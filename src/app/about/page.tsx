import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import SocialLinks from '@/components/ui/SocialLinks'
import { BRAND } from '@/lib/brand'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-surface">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <nav className="flex gap-4 text-xs font-semibold text-gray-400">
            <Link href="/faq" className="hover:text-ink-900">FAQ</Link>
            <Link href="/contact" className="hover:text-ink-900">Contact</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <span className="animate-fade-in-up inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-3 py-1.5 text-xs font-bold text-accent-700">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />
          Built for India&rsquo;s D2C supply chain
        </span>

        <h1 className="animate-fade-in-up mt-5 text-4xl font-extrabold tracking-tight text-ink-900" style={{ animationDelay: '60ms' }}>
          Why {BRAND.name} exists
        </h1>

        <p className="animate-fade-in-up mt-4 text-lg text-gray-600" style={{ animationDelay: '120ms' }}>
          D2C brands and small importers need warehouse space for weeks or months at a time — not
          a 3-year lease. Traditional warehouse owners often have vacant capacity they can&rsquo;t
          easily rent out in small pieces. {BRAND.name} connects the two, one square foot at a
          time.
        </p>

        <div className="stagger-children mt-12 grid gap-4 sm:grid-cols-2">
          <TrustCard
            emoji="🔒"
            title="Payments you can trust"
            body="Every transaction runs through Razorpay or Stripe — industry-standard, PCI-compliant payment processors. We never see or store your card details."
          />
          <TrustCard
            emoji="✅"
            title="Verified before going live"
            body="Every lender and warehouse listing is reviewed by our team before it appears in search — no unverified spaces slip through."
          />
          <TrustCard
            emoji="🛡️"
            title="Data protected by design"
            body="Access to your account, bookings, and listings is enforced at the database level — you only ever see what belongs to you."
          />
          <TrustCard
            emoji="💸"
            title="Fair, published cancellation terms"
            body="Our refund policy is public and enforced consistently by the same system for every booking — see it for yourself."
          />
        </div>

        <div className="animate-fade-in-up mt-12 rounded-2xl bg-ink-900 p-8 text-center" style={{ animationDelay: '400ms' }}>
          <p className="text-lg font-bold text-white">Have a question before you get started?</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link
              href="/faq"
              className="rounded-full bg-white/10 px-5 py-2 text-sm font-bold text-white hover:bg-white/20"
            >
              Read the FAQ
            </Link>
            <Link
              href="/contact"
              className="rounded-full bg-accent-400 px-5 py-2 text-sm font-bold text-ink-900 hover:bg-accent-300"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>

      <footer className="border-t border-black/5 py-8 text-center text-xs text-gray-400">
        <div className="mb-3">
          <SocialLinks />
        </div>
        © {new Date().getFullYear()} {BRAND.name}. Built for India's D2C supply chain.
      </footer>
    </main>
  )
}

function TrustCard({ emoji, title, body }: { emoji: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5">
      <span className="text-2xl">{emoji}</span>
      <h3 className="mt-3 font-bold text-ink-900">{title}</h3>
      <p className="mt-1.5 text-sm text-gray-500">{body}</p>
    </div>
  )
}
