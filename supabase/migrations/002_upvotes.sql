-- Feature: upvoting
-- Run this in the Supabase SQL editor after schema.sql.

alter table public.ideas
  add column if not exists upvotes integer not null default 0;

-- Atomic increment so concurrent upvotes never clobber each other.
create or replace function public.increment_upvotes(idea_id uuid)
returns void
language sql
as $$
  update public.ideas set upvotes = upvotes + 1 where id = idea_id;
$$;

grant execute on function public.increment_upvotes(uuid) to anon;
