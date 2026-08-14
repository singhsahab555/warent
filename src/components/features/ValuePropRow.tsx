import ScrollReveal from '@/components/ui/ScrollReveal'

const VALUE_PROPS = [
  { emoji: '⚡', label: 'Instant booking', desc: 'Confirmed in under 60 seconds' },
  { emoji: '🔓', label: 'No lock-in', desc: 'Book by the week, not the year' },
  { emoji: '✅', label: 'Verified listings', desc: 'Every warehouse reviewed before going live' },
  { emoji: '🔒', label: 'Secure payments', desc: 'Processed by Razorpay & Stripe' },
  { emoji: '📏', label: 'Any size', desc: 'From 50 sqft up, your call' },
  { emoji: '🛡️', label: 'Zero double-bookings', desc: 'Race-safe by design' },
]

export default function ValuePropRow() {
  return (
    <section className="border-y border-black/5 bg-white py-14">
      <div className="mx-auto max-w-5xl px-6">
        <ScrollReveal>
          <p className="text-center text-xs font-bold uppercase tracking-wide text-gray-400">
            Why WARENT
          </p>
        </ScrollReveal>

        <div className="stagger-children mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-6">
          {VALUE_PROPS.map((item) => (
            <div key={item.label} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-2xl">
                {item.emoji}
              </div>
              <p className="mt-2.5 text-sm font-bold text-ink-900">{item.label}</p>
              <p className="mt-0.5 text-xs text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
