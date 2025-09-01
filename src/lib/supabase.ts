import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const signUp = async (email: string, password: string, userData: {
  username: string
  name: string
  role: 'Admin' | 'Agriculteur'
  client_id?: string
}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  if (error) throw error
  
  if (data.user) {
    // Create user profile with explicit typing
    const profileData: Database['public']['Tables']['users']['Insert'] = {
      id: data.user.id,
      username: userData.username,
      name: userData.name,
      role: userData.role,
      client_id: userData.client_id || null,
      status: 'Active' as const
    }

    const { error: profileError } = await supabase
      .from('users')
      .insert([profileData])
      
    if (profileError) throw profileError
  }
  
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null
  
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()
    
  return profile
}
