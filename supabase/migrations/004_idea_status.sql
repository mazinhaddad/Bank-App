-- Feature: idea status
-- Run this in the Supabase SQL editor after schema.sql.

alter table public.ideas
  add column if not exists status text not null default 'Submitted';

alter table public.ideas
  drop constraint if exists ideas_status_check;

alter table public.ideas
  add constraint ideas_status_check
  check (status in ('Submitted', 'Under Review', 'Approved', 'Implemented'));

-- Same v1 tradeoff as elsewhere: no auth yet, so anon can move an
-- idea through its status states. Tighten once authentication (e.g.
-- an admin/reviewer role) is added.
create policy "Anyone can update idea status"
  on public.ideas for update
  to anon
  using (true)
  with check (true);
