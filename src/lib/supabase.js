import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// When both env vars are present we run in "shared" mode (live data for
// everyone via Supabase). Otherwise the app falls back to per-browser
// localStorage so it still works with zero configuration.
export const isShared = Boolean(url && anonKey)

export const supabase = isShared ? createClient(url, anonKey) : null

export const TABLE = 'projects'
