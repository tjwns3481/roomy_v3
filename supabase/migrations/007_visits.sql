-- @TASK P4-R1-T1 - visits 테이블 마이그레이션
-- @SPEC 방문 기록 추적용 테이블

-- Create visits table
create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.guides(id) on delete cascade,
  visitor_ip text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- Create indexes for performance
create index if not exists idx_visits_guide_id on public.visits(guide_id);
create index if not exists idx_visits_created_at on public.visits(created_at desc);
create index if not exists idx_visits_guide_id_created_at on public.visits(guide_id, created_at desc);

-- Enable RLS
alter table public.visits enable row level security;

-- RLS Policy: SELECT - only guide owners can view visit records
create policy "visits_select_policy"
  on public.visits
  for select
  using (
    auth.uid() is not null
    and guide_id in (
      select g.id from public.guides g
      where g.accommodation_id in (
        select id from public.accommodations
        where owner_id = auth.uid()
      )
    )
  );

-- RLS Policy: INSERT - anonymous users can record visits
create policy "visits_insert_policy"
  on public.visits
  for insert
  with check (true);

-- RLS Policy: DELETE - only guide owners can delete visit records
create policy "visits_delete_policy"
  on public.visits
  for delete
  using (
    auth.uid() is not null
    and guide_id in (
      select g.id from public.guides g
      where g.accommodation_id in (
        select id from public.accommodations
        where owner_id = auth.uid()
      )
    )
  );

-- Grant permissions
grant select, delete on public.visits to authenticated;
grant insert on public.visits to anon, authenticated;
