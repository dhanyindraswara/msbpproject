-- MSBP Project Manager — Supabase schema
-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query).

create table if not exists public.projects (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

-- Realtime: broadcast row changes so every open tab updates live.
alter publication supabase_realtime add table public.projects;

-- Row Level Security.
-- This is an internal team tracker, so the policy below grants the public
-- "anon" key full read/write. That is fine for a trusted internal tool, but
-- it means anyone with the URL + anon key can edit. If you need real access
-- control, enable Supabase Auth and replace the policy with auth checks.
alter table public.projects enable row level security;

drop policy if exists "anon full access" on public.projects;
create policy "anon full access"
  on public.projects
  for all
  to anon, authenticated
  using (true)
  with check (true);
