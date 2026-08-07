import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import SocialLinks from '@/components/ui/SocialLinks'
import FaqItem from '@/components/ui/FaqItem'
import { BRAND } from '@/lib/brand'

const RENTER_FAQS = [
  {
    q: 'How does booking work?',
    a: 'Search by city and required area, pick a slot, choose your dates, and pay securely through Razorpay or Stripe. Your booking is confirmed instantly once payment clears — no waiting on manual approval.',
  },
  {
    q: 'What if I need to cancel?',
    a: 'Our refund policy gives you 90% back with 7+ days notice, 50% with 3-6 days notice, and bookings are non-refundable inside 3 days. Full details are on our Refund Policy page.',
  },
  {
    q: 'Is my payment information safe?',
    a: 'Yes — all payments are processed directly by Razorpay or Stripe. WARENT never sees or stores your card details.',
  },
  {
    q: 'Are the warehouses verified?',
    a: 'Every warehouse is reviewed by our team before it appears in search results.',
  },
  {
    q: 'What if the space doesn\'t match the listing when I arrive?',
    a: 'The Lender is responsible for the physical condition of their space. If it doesn\'t match what was listed, contact our support team right away — we investigate every report and take action against Lenders who misrepresent their listings.',
  },
]

const LENDER_FAQS = [
  {
    q: 'How do I get paid?',
    a: 'Once a renter completes payment, the amount owed to you (based on your listed rate) appears in your Earnings dashboard. Payouts are transferred to you and marked paid with a reference number you can always see.',
  },
  {
    q: 'How is my listing priced?',
    a: 'You set your own rate when listing a slot. Renters see a final booking price that covers WARENT\'s platform fee — you always receive exactly the rate you listed.',
  },
  {
    q: 'What happens after I submit a warehouse?',
    a: 'New listings start as "pending verification." Our team reviews it, then you can publish it live from your warehouse\'s detail page.',
  },
  {
    q: 'Who is responsible for maintaining and cleaning the space?',
    a: 'You are. WARENT handles bookings, payments, and verification — but the physical condition, cleanliness, security, and safety of your warehouse is your responsibility as the space owner, for the full duration of any booking.',
  },
]

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-surface">
      <header className="border-b border-black/5 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <nav className="flex gap-4 text-xs font-semibold text-gray-400">
            <Link href="/about" className="hover:text-ink-900">About</Link>
            <Link href="/contact" className="hover:text-ink-900">Contact</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="animate-fade-in-up text-3xl font-extrabold tracking-tight text-ink-900">
          Frequently asked questions
        </h1>

        <h2 className="mt-10 text-sm font-bold uppercase tracking-wide text-gray-400">
          For renters
        </h2>
        <div className="stagger-children mt-3 space-y-3">
          {RENTER_FAQS.map((item, i) => (
            <FaqItem key={i} question={item.q} answer={item.a} />
          ))}
        </div>

        <h2 className="mt-10 text-sm font-bold uppercase tracking-wide text-gray-400">
          For lenders
        </h2>
        <div className="stagger-children mt-3 space-y-3">
          {LENDER_FAQS.map((item, i) => (
            <FaqItem key={i} question={item.q} answer={item.a} />
          ))}
        </div>

        <div className="animate-fade-in-up mt-10 rounded-2xl border border-black/5 bg-white p-6 text-center">
          <p className="text-sm font-semibold text-ink-900">Still have a question?</p>
          <Link
            href="/contact"
            className="mt-3 inline-block rounded-full bg-brand-600 px-5 py-2 text-sm font-bold text-white hover:bg-brand-700"
          >
            Contact support
          </Link>
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
