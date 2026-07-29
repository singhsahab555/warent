export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="w-2/3 space-y-2">
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-3 w-1/2 rounded bg-gray-200" />
        </div>
        <div className="h-5 w-16 rounded-full bg-gray-200" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-gray-100 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-2.5 w-10 rounded bg-gray-200" />
            <div className="h-3.5 w-14 rounded bg-gray-200" />
          </div>
        ))}
      </div>

      <div className="mt-4 h-14 rounded-lg bg-gray-100" />
    </div>
  )
}

export function SkeletonCardGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}