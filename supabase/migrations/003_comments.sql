-- Feature: comments
-- Run this in the Supabase SQL editor after schema.sql.

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.ideas (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists comments_idea_id_idx on public.comments (idea_id);

alter table public.comments enable row level security;

-- Same v1 tradeoff as ideas: no auth yet, so anon can read and post
-- comments. Tighten once authentication is added.
create policy "Anyone can read comments"
  on public.comments for select
  to anon
  using (true);

create policy "Anyone can add comments"
  on public.comments for insert
  to anon
  with check (true);
