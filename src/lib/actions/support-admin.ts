'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateTicketStatus(ticketId: string, status: 'open' | 'in_progress' | 'resolved') {
  const supabase = await createClient()
  const { error } = await supabase
    .from('support_tickets' as any)
    .update({ status } as any)
    .eq('id', ticketId)

  if (error) return { error: error.message }
  revalidatePath('/admin/support')
  return { success: true }
}
