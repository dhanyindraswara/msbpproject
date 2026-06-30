import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase, isShared, TABLE } from './supabase.js'
import { normalize } from './helpers.js'

const KEY = 'msbp_projects_v2'

// ---- localStorage helpers (fallback / offline mode) ----
function readLocal() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  } catch (e) {
    /* ignore */
  }
  return null
}
function writeLocal(all) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all))
  } catch (e) {
    /* ignore */
  }
}

// Load the static seed shipped with the app (also the people directory).
async function loadSeed() {
  try {
    const res = await fetch(import.meta.env.BASE_URL + 'data/projects.json')
    const json = await res.json()
    const dir = {}
    for (const pr of json.people || []) dir[pr.code] = pr.email
    return { projects: json.projects || [], dir }
  } catch (e) {
    console.warn('seed load failed', e)
    return { projects: [], dir: {} }
  }
}

/**
 * useStore — single source of truth for projects.
 * Shared mode (Supabase): live data + realtime sync across everyone.
 * Fallback mode: per-browser localStorage seeded from projects.json.
 */
export function useStore() {
  const [loading, setLoading] = useState(true)
  const [all, setAll] = useState([])
  const dirRef = useRef({})

  useEffect(() => {
    let cancelled = false
    let channel = null

    async function init() {
      const seed = await loadSeed()
      if (cancelled) return
      dirRef.current = seed.dir

      if (isShared) {
        // Pull current rows; seed the table on first run if empty.
        const { data, error } = await supabase.from(TABLE).select('id, data')
        if (error) console.warn('supabase load failed', error)
        let rows = data || []
        if (!rows.length && seed.projects.length) {
          const payload = seed.projects.map((p) => ({ id: p.id, data: normalize(p) }))
          const { error: seedErr } = await supabase.from(TABLE).upsert(payload)
          if (seedErr) console.warn('supabase seed failed', seedErr)
          rows = payload
        }
        if (cancelled) return
        setAll(rows.map((r) => normalize(r.data)))
        setLoading(false)

        // Live updates from anyone else.
        channel = supabase
          .channel('projects-sync')
          .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, (payload) => {
            setAll((cur) => {
              if (payload.eventType === 'DELETE') {
                return cur.filter((p) => p.id !== payload.old.id)
              }
              const row = normalize(payload.new.data)
              const idx = cur.findIndex((p) => p.id === row.id)
              if (idx === -1) return [row, ...cur]
              const next = cur.slice()
              next[idx] = row
              return next
            })
          })
          .subscribe()
      } else {
        const local = readLocal()
        const src = local || seed.projects
        setAll(src.map((p) => normalize(p)))
        setLoading(false)
      }
    }

    init()
    return () => {
      cancelled = true
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  // Persist a single project (insert or update).
  const saveProject = useCallback((proj) => {
    setAll((cur) => {
      const idx = cur.findIndex((p) => p.id === proj.id)
      const next = idx === -1 ? [proj, ...cur] : cur.map((p) => (p.id === proj.id ? proj : p))
      if (!isShared) writeLocal(next)
      return next
    })
    if (isShared) {
      supabase
        .from(TABLE)
        .upsert({ id: proj.id, data: proj, updated_at: new Date().toISOString() })
        .then(({ error }) => error && console.warn('save failed', error))
    }
  }, [])

  const deleteProject = useCallback((id) => {
    setAll((cur) => {
      const next = cur.filter((p) => p.id !== id)
      if (!isShared) writeLocal(next)
      return next
    })
    if (isShared) {
      supabase
        .from(TABLE)
        .delete()
        .eq('id', id)
        .then(({ error }) => error && console.warn('delete failed', error))
    }
  }, [])

  return { loading, all, dir: dirRef, saveProject, deleteProject, isShared }
}
