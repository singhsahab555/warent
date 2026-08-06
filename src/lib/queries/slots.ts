import { createClient } from '@/lib/supabase/server'

export type AvailableSlot = {
  slot_id: string
  slot_code: string
  area_sqft: number
  price_per_sqft: number
  min_booking_days: number
  storage_type: string
  warehouse_id: string
  warehouse_name: string
  city: string
  state: string
  address_line: string
  lat: number
  lng: number
  has_loading_dock: boolean
  has_security: boolean
  cover_image_url: string | null
}

export async function searchAvailableSlots(city: string, minSqft: number): Promise<{
  data: AvailableSlot[]
  error: string | null
}> {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('search_available_slots', {
    p_city: city || '',
    p_min_sqft: minSqft,
  })

  if (error) {
    return { data: [], error: error.message }
  }

  return { data: (data ?? []) as unknown as AvailableSlot[], error: null }
}