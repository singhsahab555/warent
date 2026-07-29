import { z } from 'zod'

export const searchSchema = z.object({
  city: z.string().optional().default(''),
  minSqft: z.coerce.number().min(50).max(10000).default(50),
})

export type SearchInput = z.infer<typeof searchSchema>