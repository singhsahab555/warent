'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'

const verificationSchema = z.object({
  gstin: z.string().min(15, 'Enter a valid 15-character GSTIN').max(15).optional().or(z.literal('')),
  gstinDocumentUrl: z.string().url().optional(),
  idDocumentUrl: z.string().url().optional(),
})

export type VerificationActionState = { error?: string; success?: boolean } | null

export async function submitVerificationDocuments(
  _prev: VerificationActionState,
  input: unknown
): Promise<VerificationActionState> {
  const parsed = verificationSchema.safeParse(input)

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const updates: Record<string, string> = {}
  if (parsed.data.gstin) updates.gstin = parsed.data.gstin
  if (parsed.data.gstinDocumentUrl) updates.gstin_document_url = parsed.data.gstinDocumentUrl
  if (parsed.data.idDocumentUrl) updates.id_document_url = parsed.data.idDocumentUrl

  if (Object.keys(updates).length === 0) {
    return { error: 'Please upload at least one document' }
  }

  const { error } = await supabase
    .from('users')
    .update(updates as any)
    .eq('id', user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/lender')
  return { success: true }
}
