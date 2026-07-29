export function SkeletonRow() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-3.5 w-32 rounded bg-gray-200" />
          <div className="h-3 w-48 rounded bg-gray-200" />
        </div>
        <div className="space-y-2 text-right">
          <div className="ml-auto h-3.5 w-20 rounded bg-gray-200" />
          <div className="ml-auto h-3 w-12 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  )
}

export function SkeletonRowList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  )
}