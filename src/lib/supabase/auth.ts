// Supabase Auth Helpers - CLIENT SIDE ONLY
// For use in 'use client' components
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'

// Client-side auth
export function createAuthClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Sign in with email and password
export async function signInWithEmail(email: string, password: string) {
  const supabase = createAuthClient()
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

// Sign out
export async function signOut() {
  const supabase = createAuthClient()
  return await supabase.auth.signOut()
}

// Get current session (client-side)
export async function getClientSession() {
  const supabase = createAuthClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Get current user (client-side)
export async function getClientUser() {
  const supabase = createAuthClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
