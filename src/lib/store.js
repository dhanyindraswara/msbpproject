import { useCallback, useEffect, useRef, useState } from 'react'
import { isShared, COLLECTION, getDb } from './firebase.js'
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

// People directory is tiny (~0.7 KB) and always needed for the email composer.
async function loadDirectory() {
  try {
    const res = await fetch(import.meta.env.BASE_URL + 'data/people.json')
    const people = await res.json()
    const dir = {}
    for (const pr of people || []) dir[pr.code] = pr.email
    return dir
  } catch (e) {
    console.warn('people load failed', e)
    return {}
  }
}

// The full 242-project seed (~191 KB). Only fetched when actually needed:
// local mode, or first-run seeding of an empty Firestore collection. Shared
// mode normally skips this entirely — the data comes from Firestore.
async function loadSeedProjects() {
  try {
    const res = await fetch(import.meta.env.BASE_URL + 'data/projects.json')
    const json = await res.json()
    return json.projects || []
  } catch (e) {
    console.warn('seed load failed', e)
    return []
  }
}

// Firestore rejects `undefined` field values; round-trip through JSON to drop
// them and produce a plain, storable object.
function clean(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * useStore — single source of truth for projects.
 * Shared mode (Firestore): live data + realtime sync across everyone.
 * Fallback mode: per-browser localStorage seeded from projects.json.
 */
export function useStore() {
  const [loading, setLoading] = useState(true)
  const [all, setAll] = useState([])
  const dirRef = useRef({})

  useEffect(() => {
    let cancelled = false
    let unsubscribe = null

    async function init() {
      dirRef.current = await loadDirectory()
      if (cancelled) return

      if (isShared) {
        const db = await getDb()
        const { collection, doc, getDocs, onSnapshot, writeBatch } = await import('firebase/firestore')
        if (cancelled) return
        const colRef = collection(db, COLLECTION)

        // Pull current docs; seed the collection on first run if empty.
        try {
          const snap = await getDocs(colRef)
          if (cancelled) return
          if (snap.empty) {
            const seed = await loadSeedProjects()
            if (cancelled) return
            if (seed.length) {
              const batch = writeBatch(db)
              for (const p of seed) batch.set(doc(colRef, String(p.id)), clean(normalize(p)))
              await batch.commit()
              setAll(seed.map((p) => normalize(p)))
            }
          } else {
            setAll(snap.docs.map((d) => normalize(d.data())))
          }
        } catch (e) {
          console.warn('firestore load failed', e)
        }
        if (cancelled) return
        setLoading(false)

        // Live updates from anyone else (also keeps this tab authoritative).
        unsubscribe = onSnapshot(
          colRef,
          (snapshot) => setAll(snapshot.docs.map((d) => normalize(d.data()))),
          (err) => console.warn('firestore subscribe failed', err)
        )
      } else {
        const local = readLocal()
        const src = local || (await loadSeedProjects())
        if (cancelled) return
        setAll(src.map((p) => normalize(p)))
        setLoading(false)
      }
    }

    init()
    return () => {
      cancelled = true
      if (unsubscribe) unsubscribe()
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
      ;(async () => {
        const db = await getDb()
        const { doc, setDoc } = await import('firebase/firestore')
        await setDoc(doc(db, COLLECTION, String(proj.id)), clean(proj))
      })().catch((error) => console.warn('save failed', error))
    }
  }, [])

  const deleteProject = useCallback((id) => {
    setAll((cur) => {
      const next = cur.filter((p) => p.id !== id)
      if (!isShared) writeLocal(next)
      return next
    })
    if (isShared) {
      ;(async () => {
        const db = await getDb()
        const { doc, deleteDoc } = await import('firebase/firestore')
        await deleteDoc(doc(db, COLLECTION, String(id)))
      })().catch((error) => console.warn('delete failed', error))
    }
  }, [])

  return { loading, all, dir: dirRef, saveProject, deleteProject, isShared }
}
