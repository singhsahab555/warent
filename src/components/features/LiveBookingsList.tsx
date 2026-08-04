'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Booking = {
  id: string
  start_date: string
  end_date: string
  area_sqft: number
  lender_amount: number
  status: string
  created_at: string
  inventory_slots: { slot_code: string } | null
  users: { full_name: string; company_name: string | null } | null
}

export default function LiveBookingsList({
  lenderId,
  initialBookings,
}: {
  lenderId: string
  initialBookings: Booking[]
}) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [justArrivedId, setJustArrivedId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`lender-bookings-${lenderId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
          filter: `lender_id=eq.${lenderId}`,
        },
        async (payload) => {
          // Fetch related slot/renter info since payload only has raw columns.
          // Deliberately selects lender_amount, NOT total_amount/price_per_sqft —
          // those are the renter-facing marked-up figures and must never reach
          // the lender's dashboard, or the hidden margin is trivially reverse-engineered.
          const { data } = await supabase
            .from('bookings')
            .select(`
              id, start_date, end_date, area_sqft,
              lender_amount, status, created_at,
              inventory_slots ( slot_code ),
              users:renter_id ( full_name, company_name )
            `)
            .eq('id', payload.new.id)
            .single() as unknown as { data: Booking | null }

          if (data) {
            setBookings((prev) => [data as unknown as Booking, ...prev])
            setJustArrivedId(data.id)
            setTimeout(() => setJustArrivedId(null), 3000)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [lenderId])

  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
        <p className="text-sm font-medium text-gray-900">No bookings yet.</p>
        <p className="mt-1 text-sm text-gray-500">
          Bookings will appear here in real time as renters reserve your slots.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {bookings.map((b) => (
        <div
          key={b.id}
          className={`rounded-xl border p-4 transition ${
            justArrivedId === b.id
              ? 'border-green-300 bg-green-50'
              : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {b.users?.company_name ?? b.users?.full_name ?? 'Renter'}
              </p>
              <p className="text-xs text-gray-500">
                Slot {b.inventory_slots?.slot_code} · {b.area_sqft} sqft · {b.start_date} to {b.end_date}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                ₹{Number(b.lender_amount).toLocaleString('en-IN')}
              </p>
              <span className="text-xs capitalize text-gray-500">{b.status}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
