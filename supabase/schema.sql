-- Run this in the Supabase SQL editor to set up the ideas table.

create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  category text not null,
  created_at timestamptz not null default now()
);

alter table public.ideas enable row level security;

-- This is an internal tool with no auth in v1, so allow the anon
-- (public) role to read and submit ideas. Tighten these policies
-- once authentication is added.
create policy "Anyone can read ideas"
  on public.ideas for select
  to anon
  using (true);

create policy "Anyone can submit ideas"
  on public.ideas for insert
  to anon
  with check (true);
