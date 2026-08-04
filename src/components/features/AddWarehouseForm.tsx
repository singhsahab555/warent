'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addWarehouseSchema, type AddWarehouseInput } from '@/lib/validators/warehouse'
import { createWarehouse } from '@/lib/actions/warehouse'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AddWarehouseForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddWarehouseInput>({
    resolver: zodResolver(addWarehouseSchema),
    defaultValues: {
      slots: [{ slotCode: '', areaSqft: 100, pricePerSqft: 30, minBookingDays: 30 }],
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'slots' })

  const onSubmit = async (data: AddWarehouseInput) => {
    setServerError(null)
    setIsSubmitting(true)

    const result = await createWarehouse(null, data)

    setIsSubmitting(false)

    if (result?.error) {
      setServerError(result.error)
      return
    }

    router.push('/lender/warehouses')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-8">
      {/* Warehouse details */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-base font-semibold text-gray-900">Warehouse details</h2>

        <div className="mt-4 space-y-4">
          <Field label="Warehouse name" error={errors.name?.message}>
            <input {...register('name')} className={inputClass} />
          </Field>

          <Field label="Description (optional)" error={errors.description?.message}>
            <textarea {...register('description')} rows={3} className={inputClass} />
          </Field>

          <Field label="Address" error={errors.addressLine?.message}>
            <input {...register('addressLine')} className={inputClass} />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <Field label="City" error={errors.city?.message}>
              <input {...register('city')} className={inputClass} />
            </Field>
            <Field label="State" error={errors.state?.message}>
              <input {...register('state')} className={inputClass} />
            </Field>
            <Field label="Pincode" error={errors.pincode?.message}>
              <input {...register('pincode')} className={inputClass} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitude" error={errors.lat?.message}>
              <input type="number" step="any" {...register('lat')} className={inputClass} />
            </Field>
            <Field label="Longitude" error={errors.lng?.message}>
              <input type="number" step="any" {...register('lng')} className={inputClass} />
            </Field>
          </div>

          <Field label="Total area (sqft)" error={errors.totalAreaSqft?.message}>
            <input type="number" {...register('totalAreaSqft')} className={inputClass} />
          </Field>
        </div>
      </section>

      {/* Inventory slots */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">Inventory slots</h2>
          <button
            type="button"
            onClick={() => append({ slotCode: '', areaSqft: 100, pricePerSqft: 30, minBookingDays: 30 })}
            className="text-sm font-medium text-gray-900 hover:underline"
          >
            + Add slot
          </button>
        </div>
        {errors.slots?.message && (
          <p className="mt-2 text-sm text-red-600">{errors.slots.message}</p>
        )}

        <div className="mt-4 space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Slot {index + 1}</span>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-xs font-medium text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <Field label="Slot code" error={errors.slots?.[index]?.slotCode?.message}>
                  <input {...register(`slots.${index}.slotCode`)} placeholder="A-101" className={inputClass} />
                </Field>
                <Field label="Area (50–500 sqft)" error={errors.slots?.[index]?.areaSqft?.message}>
                  <input type="number" {...register(`slots.${index}.areaSqft`)} className={inputClass} />
                </Field>
                <Field label="Your rate (₹20–40/sqft)" error={errors.slots?.[index]?.pricePerSqft?.message}>
                  <input type="number" {...register(`slots.${index}.pricePerSqft`)} className={inputClass} />
                </Field>
                <Field label="Min booking (days)" error={errors.slots?.[index]?.minBookingDays?.message}>
                  <input type="number" {...register(`slots.${index}.minBookingDays`)} className={inputClass} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </section>

      {serverError && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating warehouse...' : 'Create warehouse'}
      </button>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none'