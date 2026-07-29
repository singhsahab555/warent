'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const bookingSchema = z.object({
  slotId: z.string().uuid(),
  startDate: z.string(),
  endDate: z.string(),
})

export type BookingActionState = {
  error?: string
  bookingId?: string
} | null

export async function createBooking(
  _prevState: BookingActionState,
  input: unknown
): Promise<BookingActionState> {
  const parsed = bookingSchema.safeParse(input)

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()

  const { data, error } = await supabase.rpc('create_booking', {
    p_slot_id: parsed.data.slotId,
    p_start_date: parsed.data.startDate,
    p_end_date: parsed.data.endDate,
  })

  if (error) {
    // Postgres RAISE EXCEPTION messages arrive here — already human-readable
    return { error: error.message }
  }

  revalidatePath('/renter')
  return { bookingId: data as string }
}