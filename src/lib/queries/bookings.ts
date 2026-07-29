import { createClient } from '@/lib/supabase/server'

export async function getLenderBookings(lenderId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id, start_date, end_date, area_sqft, price_per_sqft,
      total_amount, status, created_at,
      inventory_slots ( slot_code ),
      users:renter_id ( full_name, company_name )
    `)
    .eq('lender_id', lenderId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data
}

export async function getRenterBookings(renterId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id, start_date, end_date, area_sqft, price_per_sqft,
      subtotal_amount, commission_amount, total_amount, status, created_at,
      inventory_slots ( slot_code, storage_type, warehouses ( name, city, state ) )
    `)
    .eq('renter_id', renterId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data
}