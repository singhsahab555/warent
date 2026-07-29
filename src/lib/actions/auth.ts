'use server'

import { createClient } from '@/lib/supabase/server'
import { loginSchema, signupSchema } from '@/lib/validators/auth'
import { redirect } from 'next/navigation'

export type ActionState = {
  error?: string
} | null

export async function login(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { error: 'Invalid email or password' }
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', data.user.id)
    .single()

  if (profile?.role === 'lender') {
  redirect('/lender')
} else if (profile?.role === 'admin') {
  redirect('/admin')
} else {
  redirect('/renter')
}
}

export async function signup(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    phone: formData.get('phone'),
    role: formData.get('role'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { fullName, email, password, phone, role } = parsed.data
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone,
        role,
      },
    },
  })

  if (error || !data.user) {
    return { error: error?.message ?? 'Signup failed' }
  }

  redirect(role === 'lender' ? '/lender' : '/renter')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}