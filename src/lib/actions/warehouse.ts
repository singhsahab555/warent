'use server'

import { createClient } from '@/lib/supabase/server'
import { addWarehouseSchema } from '@/lib/validators/warehouse'
import { revalidatePath } from 'next/cache'

export type WarehouseActionState = {
  error?: string
  success?: boolean
} | null

export async function createWarehouse(
  _prevState: WarehouseActionState,
  input: unknown
): Promise<WarehouseActionState> {
  const parsed = addWarehouseSchema.safeParse(input)

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const {
    name, description, addressLine, city, state, pincode, lat, lng, totalAreaSqft, slots,
    photoUrls, coverImageUrl,
  } = parsed.data

  // 1. Create the warehouse via RPC (handles PostGIS point)
  const { data: warehouseId, error: warehouseError } = await supabase.rpc('create_warehouse', {
    p_name: name,
    p_description: description ?? '',
    p_address_line: addressLine,
    p_city: city,
    p_state: state,
    p_pincode: pincode,
    p_lat: lat,
    p_lng: lng,
    p_total_area_sqft: totalAreaSqft,
    p_cover_image_url: coverImageUrl ?? null,
    p_photo_urls: photoUrls ?? [],
  })

  if (warehouseError || !warehouseId) {
    return { error: warehouseError?.message ?? 'Failed to create warehouse' }
  }

  // 2. Insert the fractional slots
  const { error: slotsError } = await supabase.from('inventory_slots').insert(
    slots.map((slot) => ({
      warehouse_id: warehouseId,
      slot_code: slot.slotCode,
      area_sqft: slot.areaSqft,
      price_per_sqft: slot.pricePerSqft,
      min_booking_days: slot.minBookingDays,
      storage_type: slot.storageType,
    }))
  )

  if (slotsError) {
    return { error: slotsError.message }
  }

  revalidatePath('/lender/warehouses')
  return { success: true }
}

export async function setWarehouseStatus(
  warehouseId: string,
  status: 'active' | 'inactive'
): Promise<WarehouseActionState> {
  const supabase = await createClient()

  // RLS's warehouses_update_own policy already restricts this to the owning lender —
  // no separate admin approval flow needed for MVP; the lender self-publishes.
  const { error } = await supabase
    .from('warehouses')
    .update({ status })
    .eq('id', warehouseId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/lender/warehouses')
  revalidatePath(`/lender/warehouses/${warehouseId}`)
  return { success: true }
}