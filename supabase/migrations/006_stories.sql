-- @TASK P2-R3-T1 - stories 테이블 마이그레이션
-- @SPEC specs/domain/resources.yaml#story

-- Create stories table
create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.guides(id) on delete cascade,
  media_url text not null,
  media_type text not null,
  order_index integer not null default 0,
  label text,
  created_at timestamptz not null default now(),

  -- Add check constraint for media_type
  constraint stories_media_type_check check (media_type in ('image', 'video'))
);

-- Create indexes for performance
create index if not exists idx_stories_guide_id on public.stories(guide_id);
create index if not exists idx_stories_guide_id_order_index on public.stories(guide_id, order_index);

-- Enable RLS
alter table public.stories enable row level security;

-- RLS Policy: SELECT - anyone can view stories from published guides, owners can view from their own guides
create policy "stories_select_policy"
  on public.stories
  for select
  using (
    guide_id in (
      select id from public.guides
      where is_published = true
    )
    or
    (
      auth.uid() is not null
      and guide_id in (
        select g.id from public.guides g
        where g.accommodation_id in (
          select id from public.accommodations
          where owner_id = auth.uid()
        )
      )
    )
  );

-- RLS Policy: INSERT - only guide owners can add stories
create policy "stories_insert_policy"
  on public.stories
  for insert
  with check (
    auth.uid() is not null
    and guide_id in (
      select g.id from public.guides g
      where g.accommodation_id in (
        select id from public.accommodations
        where owner_id = auth.uid()
      )
    )
  );

-- RLS Policy: UPDATE - only guide owners can update stories
create policy "stories_update_policy"
  on public.stories
  for update
  using (
    auth.uid() is not null
    and guide_id in (
      select g.id from public.guides g
      where g.accommodation_id in (
        select id from public.accommodations
        where owner_id = auth.uid()
      )
    )
  )
  with check (
    auth.uid() is not null
    and guide_id in (
      select g.id from public.guides g
      where g.accommodation_id in (
        select id from public.accommodations
        where owner_id = auth.uid()
      )
    )
  );

-- RLS Policy: DELETE - only guide owners can delete stories
create policy "stories_delete_policy"
  on public.stories
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
grant select on public.stories to anon, authenticated;
grant insert, update, delete on public.stories to authenticated;
