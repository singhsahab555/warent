export const BRAND = {
  name: 'WARENT',
  tagline: 'Rent by the square foot, not the warehouse.',
  description:
    'Fractional warehousing for D2C brands. Book verified space by the square foot, not the lease term.',
  supportEmail: 'sumitsingh12022@gmail.com', // update once you have a real business inbox
} as const

// Fill these in once real accounts exist. The footer's SocialLinks component
// only renders an icon for links that are non-null — leave any as null to
// keep it hidden, no other code changes needed.
export const SOCIAL_LINKS = {
  instagram: 'https://instagram.com' as string | null,
  linkedin: null as string | null,
  twitter: null as string | null,
} as const
