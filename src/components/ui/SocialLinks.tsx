import { SOCIAL_LINKS } from '@/lib/brand'

export default function SocialLinks() {
  const links = [
    { key: 'instagram', url: SOCIAL_LINKS.instagram, label: 'Instagram', icon: '📷' },
    { key: 'linkedin', url: SOCIAL_LINKS.linkedin, label: 'LinkedIn', icon: '💼' },
    { key: 'twitter', url: SOCIAL_LINKS.twitter, label: 'X (Twitter)', icon: '𝕏' },
  ].filter((l) => l.url)

  if (links.length === 0) return null

  return (
    <div className="flex justify-center gap-3">
      {links.map((l) => (
        <a
          key={l.key}
          href={l.url!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={l.label}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-black/5 bg-white text-sm transition hover:border-brand-200 hover:bg-brand-50"
        >
          {l.icon}
        </a>
      ))}
    </div>
  )
}
