'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendEmail } from '@/lib/email'

export type AdminActionState = { error?: string; success?: boolean } | null

export async function approveLender(_prev: AdminActionState, userId: string): Promise<AdminActionState> {
  const supabase = await createClient()

  const { data: userRow, error: fetchError } = await supabase
    .from('users')
    .select('email, full_name')
    .eq('id', userId)
    .single()

  if (fetchError || !userRow) {
    return { error: 'User not found' }
  }

  const { error } = await supabase.from('users').update({ is_verified: true }).eq('id', userId)

  if (error) return { error: error.message }

  await sendEmail({
    to: userRow.email,
    subject: 'Your WARENT lender account is verified 🎉',
    html: `<p>Hi ${userRow.full_name},</p><p>Your lender account has been verified. You can now publish your warehouses to the marketplace.</p>`,
  })

  revalidatePath('/admin')
  return { success: true }
}

export async function rejectLender(_prev: AdminActionState, userId: string): Promise<AdminActionState> {
  const supabase = await createClient()
  // Rejecting doesn't delete the account — just leaves is_verified false with a note.
  // A real flow might store a reason; kept minimal for MVP.
  const { error } = await supabase
    .from('users')
    // @ts-expect-error — verification_notes exists after migration; regenerate types to clear this
    .update({ verification_notes: 'Rejected — documents insufficient' })
    .eq('id', userId)

  if (error) return { error: error.message }
  revalidatePath('/admin')
  return { success: true }
}

export async function approveWarehouse(_prev: AdminActionState, warehouseId: string): Promise<AdminActionState> {
  const supabase = await createClient()

  const { data: whRow, error: fetchError } = await supabase
    .from('warehouses')
    .select('name, lender_id, users:lender_id ( email, full_name )')
    .eq('id', warehouseId)
    .single()

  if (fetchError || !whRow) return { error: 'Warehouse not found' }

  const { error } = await supabase
    .from('warehouses')
    .update({ status: 'active' })
    .eq('id', warehouseId)

  if (error) return { error: error.message }

  const lender = whRow.users as unknown as { email: string; full_name: string } | null
  if (lender?.email) {
    await sendEmail({
      to: lender.email,
      subject: `"${whRow.name}" is now live on WARENT 🚀`,
      html: `<p>Hi ${lender.full_name},</p><p>Your warehouse "${whRow.name}" has been approved and is now visible to renters searching WARENT.</p>`,
    })
  }

  revalidatePath('/admin')
  return { success: true }
}

export async function rejectWarehouse(_prev: AdminActionState, warehouseId: string): Promise<AdminActionState> {
  const supabase = await createClient()
  const { error } = await supabase
    .from('warehouses')
    .update({ status: 'inactive' })
    .eq('id', warehouseId)

  if (error) return { error: error.message }
  revalidatePath('/admin')
  return { success: true }
}
