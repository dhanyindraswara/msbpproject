import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Firebase web config. These values are safe to expose in the client — access
// is controlled by Firestore security rules (see firestore.rules), not by
// keeping the config secret. Get them from the Firebase console:
// Project settings → General → Your apps → SDK setup and configuration.
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// When the core config is present we run in "shared" mode (live data for
// everyone via Firestore). Otherwise the app falls back to per-browser
// localStorage so it still works with zero configuration.
export const isShared = Boolean(config.apiKey && config.projectId)

const app = isShared ? initializeApp(config) : null
export const db = app ? getFirestore(app) : null

export const COLLECTION = 'projects'
