import { createClient } from '@/lib/supabase/server'

export type AdminBooking = {
  id: string
  start_date: string
  end_date: string
  total_amount: number
  status: string
  payment_status: string
  payment_provider: string | null
  created_at: string
  inventory_slots: { slot_code: string; warehouses: { name: string } | null } | null
}

export async function getAllBookings(): Promise<AdminBooking[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id, start_date, end_date, total_amount, status, payment_status, payment_provider, created_at,
      inventory_slots ( slot_code, warehouses ( name ) )
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return []
  return data as unknown as AdminBooking[]
}
