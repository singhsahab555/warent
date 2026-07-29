import AddWarehouseForm from '@/components/features/AddWarehouseForm'

export default function NewWarehousePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Add a warehouse</h1>
      <p className="mt-1 text-sm text-gray-500">
        List your space and define fractional slots for short-term rental.
      </p>
      <div className="mt-6">
        <AddWarehouseForm />
      </div>
    </div>
  )
}