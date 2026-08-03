import { createClient } from '@/lib/supabase/server'

export type Payout = {
  id: string
  amount: number
  status: string
  paid_at: string | null
  payout_reference: string | null
  created_at: string
  bookings: { start_date: string; end_date: string } | null
}

export async function getLenderPayouts(lenderId: string): Promise<Payout[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('payouts' as any)
    .select('id, amount, status, paid_at, payout_reference, created_at, bookings ( start_date, end_date )')
    .eq('lender_id', lenderId)
    .order('created_at', { ascending: false }) as unknown as { data: Payout[] | null; error: any }

  if (error) return []
  return data ?? []
}

export async function getAllOwedPayouts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('payouts' as any)
    .select('id, amount, status, needs_reconciliation, created_at, users:lender_id ( full_name, email ), bookings ( start_date, end_date )')
    .eq('status', 'owed')
    .order('created_at', { ascending: true }) as unknown as { data: any[] | null; error: any }

  if (error) return []
  return data ?? []
}
