import { z } from 'zod'

export const inventorySlotSchema = z.object({
  slotCode: z.string().min(1, 'Slot code required'),
  areaSqft: z.coerce.number().min(50, 'Minimum 50 sqft').max(500, 'Maximum 500 sqft'),
  pricePerSqft: z.coerce.number().min(20, 'Minimum ₹20/sqft').max(40, 'Maximum ₹40/sqft'),
  minBookingDays: z.coerce.number().min(1, 'At least 1 day'),
})

export const addWarehouseSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  description: z.string().optional(),
  addressLine: z.string().min(5, 'Address is too short'),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  pincode: z.string().min(6, 'Enter a valid pincode').max(6),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  totalAreaSqft: z.coerce.number().min(50, 'Minimum 50 sqft'),
  slots: z.array(inventorySlotSchema).min(1, 'Add at least one slot'),
  photoUrls: z.array(z.string().url()).max(5).optional().default([]),
  coverImageUrl: z.string().url().nullable().optional(),
})

export type AddWarehouseInput = z.infer<typeof addWarehouseSchema>