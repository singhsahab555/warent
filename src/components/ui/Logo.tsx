import { BRAND } from '@/lib/brand'

export default function Logo({
  subtitle,
  size = 'md',
}: {
  subtitle?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const dims = {
    sm: { box: 'h-7 w-7', icon: 'h-4 w-4', text: 'text-base' },
    md: { box: 'h-9 w-9', icon: 'h-5 w-5', text: 'text-lg' },
    lg: { box: 'h-12 w-12', icon: 'h-6 w-6', text: 'text-2xl' },
  }[size]

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`relative flex ${dims.box} shrink-0 items-center justify-center rounded-xl bg-brand-600`}
      >
        <svg viewBox="0 0 24 24" fill="none" className={`${dims.icon} text-white`}>
          <path d="M3 9.5L12 4l9 5.5V19a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9.5z" fill="currentColor" />
        </svg>
        <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-accent-400" />
      </div>
      <div className="leading-tight">
        <span className={`${dims.text} font-extrabold tracking-tight text-ink-900`}>
          {BRAND.name}
        </span>
        {subtitle && <p className="-mt-0.5 text-xs font-medium text-gray-500">{subtitle}</p>}
      </div>
    </div>
  )
}
