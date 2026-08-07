'use client'

import ScrollReveal from '@/components/ui/ScrollReveal'

const rows = [
  {
    label: 'Minimum space',
    traditional: 'Whole warehouse (often 10,000+ sqft)',
    warent: 'As little as 50 sqft',
  },
  {
    label: 'Commitment',
    traditional: '1–3 year lease',
    warent: 'Days to months, your choice',
  },
  {
    label: 'Setup time',
    traditional: 'Weeks of paperwork & negotiation',
    warent: 'Under 60 seconds to confirm',
  },
  {
    label: 'Pricing',
    traditional: 'Fixed rent, regardless of usage',
    warent: 'Pay only for the sqft & days you use',
  },
  {
    label: 'Verification',
    traditional: 'You inspect and vet yourself',
    warent: 'Every listing verified before going live',
  },
]

export default function ComparisonSection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <ScrollReveal>
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700">
            The old way vs. the WARENT way
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Why lease a warehouse<br />when you can rent a shelf?
          </h2>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={120}>
        <div className="mt-12 overflow-hidden rounded-3xl border border-black/5 bg-white shadow-xl shadow-ink-900/5">
          {/* Header row */}
          <div className="grid grid-cols-[1fr_1.2fr_1.2fr] items-center border-b border-black/5 bg-gray-50">
            <div className="p-4 text-xs font-bold uppercase tracking-wide text-gray-400 sm:p-5">
              &nbsp;
            </div>
            <div className="border-l border-black/5 p-4 text-center sm:p-5">
              <p className="text-sm font-bold text-gray-500">🏚️ Traditional warehousing</p>
            </div>
            <div className="border-l border-black/5 bg-brand-600 p-4 text-center sm:p-5">
              <p className="text-sm font-bold text-white">✨ WARENT</p>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={row.label}
              className={`grid grid-cols-[1fr_1.2fr_1.2fr] items-center ${
                i !== rows.length - 1 ? 'border-b border-black/5' : ''
              }`}
            >
              <div className="p-4 text-sm font-bold text-ink-900 sm:p-5">{row.label}</div>
              <div className="border-l border-black/5 p-4 text-center text-sm text-gray-500 sm:p-5">
                {row.traditional}
              </div>
              <div className="border-l border-black/5 bg-brand-50/40 p-4 text-center text-sm font-semibold text-brand-800 sm:p-5">
                {row.warent}
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={240}>
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-6 rounded-full border border-black/5 bg-white px-8 py-4 shadow-sm">
            <Metric value="No lease" label="lock-in required" />
            <div className="h-8 w-px bg-black/10" />
            <Metric value="200x" label="smaller minimum space" />
            <div className="h-8 w-px bg-black/10" />
            <Metric value="< 60s" label="to confirm a booking" />
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-lg font-extrabold text-brand-600">{value}</p>
      <p className="text-[11px] font-medium text-gray-400">{label}</p>
    </div>
  )
}
