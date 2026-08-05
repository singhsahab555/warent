'use server'

import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'
import { z } from 'zod'

const ticketSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Enter a valid email'),
  subject: z.string().min(3, 'Subject is too short'),
  message: z.string().min(10, 'Please add a bit more detail'),
})

export type SupportActionState = { error?: string; success?: boolean } | null

export async function submitSupportTicket(
  _prev: SupportActionState,
  formData: FormData
): Promise<SupportActionState> {
  const parsed = ticketSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Persist first — this is the source of truth. Email is a notification
  // on top, not the storage mechanism, so nothing is lost if it fails.
  const { error } = await supabase.from('support_tickets' as any).insert({
    user_id: user?.id ?? null,
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  } as any)

  if (error) {
    return { error: 'Could not submit your message. Please try again.' }
  }

  // Best-effort notification — failure here doesn't fail the whole submission
  await sendEmail({
    to: parsed.data.email,
    subject: `We received your message: ${parsed.data.subject}`,
    html: `<p>Hi ${parsed.data.name},</p><p>Thanks for reaching out to WARENT. Our team will get back to you shortly.</p><p><strong>Your message:</strong><br/>${parsed.data.message}</p>`,
  })

  return { success: true }
}
