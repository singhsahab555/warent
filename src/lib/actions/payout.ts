'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type PayoutActionState = { error?: string; success?: boolean } | null

export async function markPayoutPaid(payoutId: string, reference: string): Promise<PayoutActionState> {
  const supabase = await createClient()

  const { error } = await supabase.rpc('mark_payout_paid' as any, {
    p_payout_id: payoutId,
    p_reference: reference,
  } as any)

  if (error) return { error: error.message }

  revalidatePath('/admin/payouts')
  return { success: true }
}
