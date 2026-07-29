import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getLenderBookings } from '@/lib/queries/bookings'
import LiveBookingsList from '@/components/features/LiveBookingsList'
import { redirect } from 'next/navigation'

// 1. Fallback Loading Skeleton Component
function BookingsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-20 w-full rounded-xl bg-gray-100 border border-gray-200"
        />
      ))}
    </div>
  )
}

// 2. Async Child Component (Handles Data Fetching)
async function BookingsContent({ userId }: { userId: string }) {
  const bookings = await getLenderBookings(userId)

  return (
    <LiveBookingsList lenderId={userId} initialBookings={bookings as any} />
  )
}

// 3. Main Page Component (Renders Shell Immediately)
export default async function LenderBookingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Active bookings</h1>
      <p className="mt-1 text-sm text-gray-500">
        Updates live as renters book your slots.
      </p>

      <div className="mt-6">
        {/* Suspense Boundary handles the async data stream */}
        <Suspense fallback={<BookingsSkeleton />}>
          <BookingsContent userId={user.id} />
        </Suspense>
      </div>
    </div>
  )
}