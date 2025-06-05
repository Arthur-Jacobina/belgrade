import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/*
-- Disable RLS temporarily to allow user creation
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Drop existing policies that are causing issues
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can insert their own data" ON users;
*/

// Database Types
export interface User {
  id: string
  created_at: string
  privy_id: string
  full_name: string
  email: string
  wallet?: string
  organization_name?: string
}

// User verification and management functions
export async function verifyUser(privyId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('privy_id', privyId)
      .single()

    if (error) {
      console.log('Error verifying user:', error)
      return null
    }

    return data
  } catch (error) {
    console.log('Error verifying user:', error)
    return null
  }
}

export async function createUser(userData: {
  privyId: string
  fullName: string
  email: string
  wallet?: string
  organizationName?: string
}): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        privy_id: userData.privyId,
        full_name: userData.fullName,
        email: userData.email,
        wallet: userData.wallet,
        organization_name: userData.organizationName,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating user:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching user:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
} 