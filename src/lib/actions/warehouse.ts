'use server'

import { createClient } from '@/lib/supabase/server'
import { addWarehouseSchema, inventorySlotSchema } from '@/lib/validators/warehouse'
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

  // 2. Insert the fractional slots — routed through add_inventory_slot so
  // available_area_sqft is correctly decremented and over-allocation is
  // rejected, using the exact same logic as adding slots later.
  for (const slot of slots) {
    const { error: slotError } = await supabase.rpc('add_inventory_slot' as any, {
      p_warehouse_id: warehouseId,
      p_slot_code: slot.slotCode,
      p_area_sqft: slot.areaSqft,
      p_price_per_sqft: slot.pricePerSqft,
      p_min_booking_days: slot.minBookingDays,
      p_storage_type: slot.storageType,
    } as any)

    if (slotError) {
      return { error: `Slot "${slot.slotCode}": ${slotError.message}` }
    }
  }

  revalidatePath('/lender/warehouses')
  return { success: true }
}

export async function addSlotToWarehouse(
  warehouseId: string,
  input: unknown
): Promise<WarehouseActionState> {
  const parsed = inventorySlotSchema.safeParse(input)

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { error } = await supabase.rpc('add_inventory_slot' as any, {
    p_warehouse_id: warehouseId,
    p_slot_code: parsed.data.slotCode,
    p_area_sqft: parsed.data.areaSqft,
    p_price_per_sqft: parsed.data.pricePerSqft,
    p_min_booking_days: parsed.data.minBookingDays,
    p_storage_type: parsed.data.storageType,
  } as any)

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/lender/warehouses/${warehouseId}`)
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