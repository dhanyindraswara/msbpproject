# MSBP Project Manager

Consolidated plan & live tracker for MSBP projects — built with **React + Vite**,
with an optional **Supabase** backend for shared, live data across the whole team.

Recreated from the Claude Design prototype (`project/MSBP Project Manager.dc.html`).
The original design bundle and chat transcripts are preserved under `project/` and `chats/`.

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

## Shared / live data (Supabase)

To let everyone see the same data update live:

1. Create a free project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run [`supabase/schema.sql`](supabase/schema.sql) to create the
   `projects` table, enable realtime, and set the access policy.
3. Copy `.env.example` to `.env` and fill in your project's API values
   (Supabase → **Project Settings → API**):
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=ey...
   ```
4. Seed the 242 projects into the database:
   ```bash
   VITE_SUPABASE_URL=... SUPABASE_SERVICE_KEY=... npm run seed
   ```
   (The app also auto-seeds on first load if the table is empty.)
5. `npm run dev` (or rebuild). The header subtitle now reads **“live tracker”** and
   changes from any user sync to everyone in real time.

> **Access note:** `schema.sql` grants the public anon key full read/write — fine for a
> trusted internal team tracker. For real access control, enable Supabase Auth and
> tighten the row-level-security policy.

## Deploy

`npm run build` produces a static `dist/` you can host anywhere — Vercel, Netlify,
GitHub Pages, etc. Set the `VITE_SUPABASE_*` environment variables in your host's
settings to enable shared mode in production. (`vite.config.js` uses a relative `base`,
so it also works from a sub-path like GitHub Pages project sites.)

## Project structure

```
index.html              app shell + fonts
src/
  main.jsx              React entry
  App.jsx               state, filters, KPIs, drawer/email orchestration
  styles.css            global styles (ported from the prototype)
  lib/
    helpers.js          pure logic: status/category colors, dates, email/CSV builders
    supabase.js         Supabase client + shared-mode detection
    store.js            data layer: Supabase realtime + localStorage fallback
  components/           Header, KpiCards, FilterBar, ProjectTable, BoardView,
                        MobileCards, DetailDrawer, EmailComposer, Toast
public/data/            projects.json (seed + people directory) + source.xlsx
supabase/schema.sql     database schema
scripts/seed.mjs        one-off Supabase seeder
```
