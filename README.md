# MSBP Project Manager

Consolidated plan & live tracker for MSBP projects — built with **React + Vite**,
with an optional **Firebase Firestore** backend for shared, live data across the
whole team.

Recreated from the Claude Design prototype. The original design bundle and chat
transcripts are preserved under [`archive/`](archive/).

## Features

- **242 projects** loaded from the consolidated Excel (2025 & 2026 cohorts).
- **5 KPI cards** — total, average progress, completed, in-progress, at-risk/overdue.
- **Filters** — search + year / category / lead / status.
- **Table view**, **Board (kanban) view** with drag-and-drop status changes, and a
  dedicated **mobile card view** (auto under 760px).
- Inline **progress slider** and **status dropdown** on every row/card.
- **Process Owner / Customer** column and field.
- **Detail drawer** with full editing and an **activity timeline** (dated, add/remove).
- **Email composer** — auto-fills To / Cc (from the people directory) / subject / body,
  opens your mail app or copies the text.
- **CSV export**, source-Excel download, and **+ New project**.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # static site → dist/
npm run preview    # preview the production build
```

Out of the box the app runs in **local mode**: each person's edits are saved in their
own browser (`localStorage`), seeded from `public/data/projects.json`. No configuration
needed.

## Shared / live data (Firebase Firestore)

To let everyone see the same data update live:

1. Create a free project at [console.firebase.google.com](https://console.firebase.google.com)
   (the free **Spark** plan is plenty for this tracker).
2. In the project, go to **Build → Firestore Database → Create database** and start it
   in production mode (any region).
3. Register a **Web app** (Project settings → General → Your apps → Web). Copy the
   config values it shows you.
4. Copy `.env.example` to `.env` and fill in the values:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
5. Publish the security rules in [`firestore.rules`](firestore.rules). Either paste them
   into **Firestore → Rules** in the console, or with the
   [Firebase CLI](https://firebase.google.com/docs/cli):
   ```bash
   firebase deploy --only firestore:rules
   ```
6. Seed the 242 projects into Firestore (optional — the app also auto-seeds on first
   load if the collection is empty):
   ```bash
   npm run seed     # reads the VITE_FIREBASE_* values from your environment
   ```
7. `npm run dev` (or rebuild). The header subtitle now reads **“live tracker”** and
   changes from any user sync to everyone in real time.

> **Access note:** `firestore.rules` grants full read/write with no auth — fine for a
> trusted internal team tracker, mirroring the old Supabase anon policy. For real access
> control, enable **Firebase Authentication** and tighten the rule to e.g.
> `allow read, write: if request.auth != null;`.

## Deploy

`npm run build` produces a static `dist/` you can host anywhere — Firebase Hosting,
Vercel, Netlify, GitHub Pages, etc. Set the `VITE_FIREBASE_*` environment variables in
your host's settings to enable shared mode in production. (`vite.config.js` uses a
relative `base`, so it also works from a sub-path like GitHub Pages project sites.)

To deploy on **Firebase Hosting** (config in [`firebase.json`](firebase.json)):

```bash
npm run build
firebase deploy            # set your project id in .firebaserc first
```

## Project structure

```
index.html              app shell + fonts
src/
  main.jsx              React entry
  App.jsx               state, filters, KPIs, drawer/email orchestration
  styles.css            global styles (ported from the prototype)
  lib/
    helpers.js          pure logic: status/category colors, dates, email/CSV builders
    firebase.js         Firestore client + shared-mode detection
    store.js            data layer: Firestore realtime + localStorage fallback
  components/           Header, KpiCards, FilterBar, ProjectTable, BoardView,
                        MobileCards, DetailDrawer, EmailComposer, Toast
public/data/            projects.json (seed + people directory) + source.xlsx
firestore.rules         Firestore security rules
firebase.json           Firebase Hosting + Firestore config
.firebaserc             Firebase project id (set "default" before deploying)
.env.example            template for the VITE_FIREBASE_* config
scripts/seed.mjs        one-off Firestore seeder
archive/                preserved design prototype bundle + chat transcripts
```
