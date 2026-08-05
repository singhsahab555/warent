import { createClient } from '@/lib/supabase/server'

export type SupportTicket = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: string
  created_at: string
}

export async function getAllTickets(): Promise<SupportTicket[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('support_tickets' as any)
    .select('id, name, email, subject, message, status, created_at')
    .order('created_at', { ascending: false }) as unknown as { data: SupportTicket[] | null; error: any }

  if (error) return []
  return data ?? []
}
