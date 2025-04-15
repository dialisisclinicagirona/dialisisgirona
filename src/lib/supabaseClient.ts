import { createClient } from '@supabase/supabase-js'

console.log(import.meta.env);
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Regular client with anonymous key for standard operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client with service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)