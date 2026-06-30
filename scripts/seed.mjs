// Seed Supabase with the 242 projects from public/data/projects.json.
// Usage:
//   VITE_SUPABASE_URL=... SUPABASE_SERVICE_KEY=... npm run seed
//
// Prefer the service_role key here (server-side, bypasses RLS). The anon key
// also works if you applied the policy in supabase/schema.sql.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const key =
  process.env.SUPABASE_SERVICE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.SUPABASE_ANON_KEY

if (!url || !key) {
  console.error('Missing env. Set VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY (or anon key).')
  process.exit(1)
}

const supabase = createClient(url, key)

function parseHistory(text) {
  if (!text) return []
  return String(text)
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((l, i) => ({
      id: 'a' + i + Math.random().toString(36).slice(2, 7),
      date: '',
      text: l.replace(/^[\-•\d.\)\s]+/, '').trim() || l,
    }))
}

const raw = JSON.parse(readFileSync(join(__dirname, '..', 'public', 'data', 'projects.json'), 'utf8'))
const rows = (raw.projects || []).map((p) => ({
  id: p.id,
  data: {
    owner: p.owner || '',
    ownerEmail: p.ownerEmail || '',
    ...p,
    activities: Array.isArray(p.activities) ? p.activities : parseHistory(p.history),
  },
}))

const { error } = await supabase.from('projects').upsert(rows)
if (error) {
  console.error('Seed failed:', error.message)
  process.exit(1)
}
console.log(`Seeded ${rows.length} projects into Supabase.`)
