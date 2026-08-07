import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import SocialLinks from '@/components/ui/SocialLinks'
import ScrollReveal from '@/components/ui/ScrollReveal'
import ComparisonSection from '@/components/features/ComparisonSection'
import { BRAND } from '@/lib/brand'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-surface">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-semibold text-ink-900 hover:bg-black/5"
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-600/30 hover:bg-brand-700"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-float-slow rounded-full bg-accent-200/60 blur-3xl" />
        <div
          className="pointer-events-none absolute -right-16 top-32 h-80 w-80 animate-float-slow rounded-full bg-brand-200/50 blur-3xl"
          style={{ animationDelay: '1.5s' }}
        />

        <div className="relative mx-auto max-w-4xl px-6 pb-16 pt-16 text-center sm:pt-24">
          <span className="animate-fade-in-up inline-flex items-center gap-1.5 rounded-full bg-accent-100 px-3 py-1.5 text-xs font-bold text-accent-700">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-500 animate-pulse-ring" />
            Live in Mumbai, Kolkata &amp; 6 more cities
          </span>

          <h1
            className="animate-fade-in-up mt-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-6xl"
            style={{ animationDelay: '80ms' }}
          >
            <span className="shimmer-text">{BRAND.tagline}</span>
          </h1>

          <p
            className="animate-fade-in-up mx-auto mt-5 max-w-xl text-lg text-gray-500"
            style={{ animationDelay: '160ms' }}
          >
            {BRAND.description}
          </p>

          <div
            className="animate-fade-in-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: '240ms' }}
          >
            <Link
              href="/signup"
              className="w-full rounded-full bg-brand-600 px-7 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-brand-600/30 transition hover:-translate-y-0.5 hover:bg-brand-700 sm:w-auto"
            >
              Find space near you →
            </Link>
            <Link
              href="/signup"
              className="w-full rounded-full border-2 border-ink-900/10 bg-white px-7 py-3.5 text-center text-sm font-bold text-ink-900 transition hover:-translate-y-0.5 hover:border-ink-900/20 sm:w-auto"
            >
              List your warehouse
            </Link>
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="border-y border-black/5 bg-ink-900">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-4 px-6 py-8 text-center">
          <Stat value="50–50,000" label="sqft, any size" />
          <Stat value="< 60 sec" label="to confirm a booking" />
          <Stat value="0" label="double-bookings, ever" />
        </div>
      </section>

      {/* The core value-prop comparison */}
      <ComparisonSection />

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <ScrollReveal>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-ink-900">
            How it works
          </h2>
        </ScrollReveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          <ScrollReveal delay={0}>
            <HowStep number="1" emoji="🔍" title="Search your city" desc="Tell us how much space you need — from 50 to 10,000 sqft." />
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <HowStep number="2" emoji="📅" title="Pick your dates" desc="Days, weeks, or months. No multi-year lease required." />
          </ScrollReveal>
          <ScrollReveal delay={240}>
            <HowStep number="3" emoji="✅" title="Booked in seconds" desc="Pay securely and your slot is confirmed instantly — verified and ready." />
          </ScrollReveal>
        </div>
      </section>

      {/* Feature cards */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <ScrollReveal>
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-ink-900">
            Built for D2C speed
          </h2>
        </ScrollReveal>
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          <ScrollReveal delay={0}>
            <FeatureCard
              emoji="📦"
              title="Fractional slots"
              desc="Book exactly the space you need — 50 to 500 sqft — instead of a whole warehouse."
              color="bg-brand-50"
            />
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <FeatureCard
              emoji="✅"
              title="Verified partners"
              desc="Every warehouse is checked before it goes live on WARENT."
              color="bg-accent-50"
            />
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <FeatureCard
              emoji="⚡"
              title="Real-time availability"
              desc="Live booking engine — no double-booked slots, no waiting on confirmations."
              color="bg-brand-50"
            />
          </ScrollReveal>
        </div>
      </section>

      {/* CTA band */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <ScrollReveal>
          <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-brand-600 px-8 py-10 text-center sm:flex-row sm:text-left">
            <div>
              <h3 className="text-2xl font-extrabold text-white">Have space to spare?</h3>
              <p className="mt-1 text-brand-100">List it on WARENT and start earning this week.</p>
            </div>
            <Link
              href="/signup"
              className="shrink-0 rounded-full bg-accent-400 px-6 py-3 text-sm font-bold text-ink-900 hover:bg-accent-300"
            >
              List your warehouse
            </Link>
          </div>
        </ScrollReveal>
      </section>

      <footer className="border-t border-black/5 py-8 text-center text-xs text-gray-400">
        <div className="mb-3 flex flex-wrap justify-center gap-4 font-semibold">
          <Link href="/about" className="hover:text-ink-900">About</Link>
          <Link href="/faq" className="hover:text-ink-900">FAQ</Link>
          <Link href="/contact" className="hover:text-ink-900">Contact</Link>
          <Link href="/terms" className="hover:text-ink-900">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-ink-900">Privacy Policy</Link>
          <Link href="/refund-policy" className="hover:text-ink-900">Refund Policy</Link>
        </div>
        <div className="mb-3">
          <SocialLinks />
        </div>
        © {new Date().getFullYear()} {BRAND.name}. Built for India's D2C supply chain.
      </footer>
    </main>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-extrabold text-white sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs font-medium text-white/50">{label}</p>
    </div>
  )
}

function HowStep({ number, emoji, title, desc }: { number: string; emoji: string; title: string; desc: string }) {
  return (
    <div className="relative text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-2xl shadow-lg shadow-brand-600/30">
        {emoji}
      </div>
      <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-3 rounded-full bg-accent-400 px-2 py-0.5 text-[10px] font-extrabold text-ink-900">
        STEP {number}
      </span>
      <h3 className="mt-4 font-bold text-ink-900">{title}</h3>
      <p className="mt-1.5 text-sm text-gray-500">{desc}</p>
    </div>
  )
}

function FeatureCard({
  emoji,
  title,
  desc,
  color,
}: {
  emoji: string
  title: string
  desc: string
  color: string
}) {
  return (
    <div className={`rounded-2xl ${color} p-6`}>
      <span className="text-3xl">{emoji}</span>
      <h3 className="mt-4 font-bold text-ink-900">{title}</h3>
      <p className="mt-1.5 text-sm text-gray-600">{desc}</p>
    </div>
  )
}
