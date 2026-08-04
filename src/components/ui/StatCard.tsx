export default function StatCard({
  label,
  value,
  emoji,
  tone = 'default',
}: {
  label: string
  value: string
  emoji: string
  tone?: 'default' | 'brand' | 'accent'
}) {
  const toneStyles = {
    default: 'bg-white border border-black/5',
    brand: 'bg-brand-600 text-white',
    accent: 'bg-accent-400 text-ink-900',
  }[tone]

  const labelStyles = tone === 'default' ? 'text-gray-400' : tone === 'brand' ? 'text-brand-100' : 'text-ink-900/60'

  return (
    <div className={`animate-fade-in-up rounded-2xl p-5 shadow-sm shadow-ink-900/5 ${toneStyles}`}>
      <div className="flex items-center justify-between">
        <p className={`text-xs font-bold uppercase tracking-wide ${labelStyles}`}>{label}</p>
        <span className="text-lg">{emoji}</span>
      </div>
      <p className="mt-2 text-2xl font-extrabold">{value}</p>
    </div>
  )
}
