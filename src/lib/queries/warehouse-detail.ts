import { createClient } from '@/lib/supabase/server'

export type WarehouseDetail = {
  id: string
  name: string
  description: string | null
  address_line: string
  city: string
  state: string
  pincode: string
  total_area_sqft: number
  available_area_sqft: number
  status: string
  has_loading_dock: boolean
  has_security: boolean
  has_fire_safety: boolean
  created_at: string
  lender_id: string
  inventory_slots: {
    id: string
    slot_code: string
    area_sqft: number
    price_per_sqft: number
    status: string
    min_booking_days: number
    storage_type: string
  }[]
}

export async function getWarehouseDetail(warehouseId: string): Promise<WarehouseDetail | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('warehouses')
    .select(`
      id, name, description, address_line, city, state, pincode,
      total_area_sqft, available_area_sqft, status,
      has_loading_dock, has_security, has_fire_safety, created_at, lender_id,
      inventory_slots ( id, slot_code, area_sqft, price_per_sqft, status, min_booking_days, storage_type )
    `)
    .eq('id', warehouseId)
    .single()

  if (error) return null
  return data as unknown as WarehouseDetail
}
