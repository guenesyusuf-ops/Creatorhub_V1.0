import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Anon key client - for browser/public use
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Service role client - for server-side API routes only
// Bypasses RLS - never expose this to the browser
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
export const supabaseAdmin = serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
  : supabase // fallback to anon if not configured
