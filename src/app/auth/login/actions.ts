'use server'

import { supabase } from '@/consts/supabaseClient'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  // const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.log("sign up error")
    // redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}

export async function signup(formData: FormData) {
  // const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    // redirect('/error')
    console.log("sign up error")
  }

  revalidatePath('/', 'layout')
  redirect('/account')
}