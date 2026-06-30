// Seed Firestore with the 242 projects from public/data/projects.json.
//
// Usage (fill in your Firebase web config, e.g. from a .env file):
//   VITE_FIREBASE_API_KEY=... VITE_FIREBASE_PROJECT_ID=... npm run seed
//
// This uses the Firebase Web SDK with your public config, so the Firestore
// security rules (firestore.rules) must allow writes to the `projects`
// collection. The app also auto-seeds on first load if the collection is empty,
// so running this script is optional.

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, writeBatch } from 'firebase/firestore'

const __dirname = dirname(fileURLToPath(import.meta.url))

const config = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

if (!config.apiKey || !config.projectId) {
  console.error('Missing env. Set VITE_FIREBASE_API_KEY and VITE_FIREBASE_PROJECT_ID (see .env.example).')
  process.exit(1)
}

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
const projects = (raw.projects || []).map((p) => ({
  ...p,
  owner: p.owner || '',
  ownerEmail: p.ownerEmail || '',
  activities: Array.isArray(p.activities) ? p.activities : parseHistory(p.history),
}))

const app = initializeApp(config)
const db = getFirestore(app)
const colRef = collection(db, 'projects')

// Firestore batches are capped at 500 writes; chunk to stay well under.
const CHUNK = 400
let written = 0
try {
  for (let i = 0; i < projects.length; i += CHUNK) {
    const slice = projects.slice(i, i + CHUNK)
    const batch = writeBatch(db)
    for (const p of slice) {
      batch.set(doc(colRef, String(p.id)), JSON.parse(JSON.stringify(p)))
    }
    await batch.commit()
    written += slice.length
  }
  console.log(`Seeded ${written} projects into Firestore.`)
  process.exit(0)
} catch (error) {
  console.error('Seed failed:', error.message)
  process.exit(1)
}
