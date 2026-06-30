// Firebase web config. These values are safe to expose in the client — access
// is controlled by Firestore security rules (see firestore.rules), not by
// keeping the config secret.
//
// The Firebase SDK (~200 KB gzip) is NOT imported at module load. It is pulled
// in lazily via getDb() so it never blocks first paint and ends up in its own
// cached chunk. isShared can be evaluated without touching the SDK at all.
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

export const COLLECTION = 'projects'

let dbPromise = null

// Lazily load the Firebase SDK and return the Firestore instance (memoised).
export function getDb() {
  if (!dbPromise) {
    dbPromise = Promise.all([import('firebase/app'), import('firebase/firestore')]).then(
      ([{ initializeApp }, { getFirestore }]) => getFirestore(initializeApp(config))
    )
  }
  return dbPromise
}
