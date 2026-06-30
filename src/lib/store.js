import { useCallback, useEffect, useRef, useState } from 'react'
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore'
import { db, isShared, COLLECTION } from './firebase.js'
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
      const seed = await loadSeed()
      if (cancelled) return
      dirRef.current = seed.dir

      if (isShared) {
        const colRef = collection(db, COLLECTION)

        // Pull current docs; seed the collection on first run if empty.
        try {
          const snap = await getDocs(colRef)
          if (cancelled) return
          if (snap.empty && seed.projects.length) {
            const batch = writeBatch(db)
            for (const p of seed.projects) {
              batch.set(doc(colRef, String(p.id)), clean(normalize(p)))
            }
            await batch.commit()
            setAll(seed.projects.map((p) => normalize(p)))
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
          (snapshot) => {
            setAll(snapshot.docs.map((d) => normalize(d.data())))
          },
          (err) => console.warn('firestore subscribe failed', err)
        )
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
      setDoc(doc(db, COLLECTION, String(proj.id)), clean(proj)).catch((error) =>
        console.warn('save failed', error)
      )
    }
  }, [])

  const deleteProject = useCallback((id) => {
    setAll((cur) => {
      const next = cur.filter((p) => p.id !== id)
      if (!isShared) writeLocal(next)
      return next
    })
    if (isShared) {
      deleteDoc(doc(db, COLLECTION, String(id))).catch((error) =>
        console.warn('delete failed', error)
      )
    }
  }, [])

  return { loading, all, dir: dirRef, saveProject, deleteProject, isShared }
}
