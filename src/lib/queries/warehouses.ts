import { createClient } from '@/lib/supabase/server'

export type LenderWarehouse = {
  id: string
  name: string
  city: string
  state: string
  status: string
  total_area_sqft: number
  available_area_sqft: number
  created_at: string
  inventory_slots: { id: string; status: string }[]
}

export async function getLenderWarehouses(lenderId: string): Promise<LenderWarehouse[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('warehouses')
    .select(`
      id, name, city, state, status, total_area_sqft, available_area_sqft, created_at,
      inventory_slots ( id, status )
    `)
    .eq('lender_id', lenderId)
    .order('created_at', { ascending: false })

  if (error) return []
  return data as unknown as LenderWarehouse[]
}