import ScrollReveal from '@/components/ui/ScrollReveal'

const CATEGORIES = [
  {
    emoji: '📦',
    title: 'Ambient storage',
    desc: 'General dry goods, apparel, packaging, and standard D2C inventory.',
  },
  {
    emoji: '❄️',
    title: 'Cold storage',
    desc: 'Temperature-controlled space for perishables and cold-chain goods.',
  },
  {
    emoji: '💎',
    title: 'High-value goods',
    desc: 'Extra-secure listings for electronics, jewellery, and premium inventory.',
  },
  {
    emoji: '⚠️',
    title: 'Hazmat-compliant',
    desc: 'Listings that meet safety requirements for regulated materials.',
  },
]

export default function StorageCategoriesGrid() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">
            Built for what you're actually storing
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Every listing tells you exactly<br />what kind of space it is
          </h2>
        </div>
      </ScrollReveal>

      <div className="stagger-children mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.title}
            className="rounded-2xl border border-black/5 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-ink-900/5"
          >
            <span className="text-3xl">{cat.emoji}</span>
            <h3 className="mt-4 font-bold text-ink-900">{cat.title}</h3>
            <p className="mt-1.5 text-sm text-gray-500">{cat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
