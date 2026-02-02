-- @TASK P2-R2-T1 - guides 테이블 마이그레이션
-- @SPEC specs/domain/resources.yaml#guide

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Create guides table
create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  accommodation_id uuid not null references public.accommodations(id) on delete cascade,
  slug text not null,
  title text not null,
  content_blocks jsonb not null default '[]'::jsonb,
  wifi_ssid text,
  wifi_password text,
  is_published boolean not null default false,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Add unique constraint on slug + accommodation_id combination
  constraint guides_slug_accommodation_unique unique(slug, accommodation_id)
);

-- Create indexes for performance
create index if not exists idx_guides_accommodation_id on public.guides(accommodation_id);
create index if not exists idx_guides_is_published on public.guides(is_published);
create index if not exists idx_guides_created_at on public.guides(created_at desc);

-- Create unique index on slug within each accommodation (for query optimization)
create index if not exists idx_guides_slug_accommodation on public.guides(slug, accommodation_id);

-- Create updated_at trigger
create trigger guides_updated_at_trigger
  before update on public.guides
  for each row
  execute procedure handle_updated_at();

-- Enable RLS
alter table public.guides enable row level security;

-- RLS Policy: SELECT - anyone can view published guides, owners can view their own
create policy "guides_select_policy"
  on public.guides
  for select
  using (
    is_published = true
    or
    (
      auth.uid() is not null
      and accommodation_id in (
        select id from public.accommodations
        where owner_id = auth.uid()
      )
    )
  );

-- RLS Policy: INSERT - authenticated users can create guides for their accommodations
create policy "guides_insert_policy"
  on public.guides
  for insert
  with check (
    auth.uid() is not null
    and accommodation_id in (
      select id from public.accommodations
      where owner_id = auth.uid()
    )
  );

-- RLS Policy: UPDATE - only accommodation owners can update their guides
create policy "guides_update_policy"
  on public.guides
  for update
  using (
    auth.uid() is not null
    and accommodation_id in (
      select id from public.accommodations
      where owner_id = auth.uid()
    )
  )
  with check (
    auth.uid() is not null
    and accommodation_id in (
      select id from public.accommodations
      where owner_id = auth.uid()
    )
  );

-- RLS Policy: DELETE - only accommodation owners can delete their guides
create policy "guides_delete_policy"
  on public.guides
  for delete
  using (
    auth.uid() is not null
    and accommodation_id in (
      select id from public.accommodations
      where owner_id = auth.uid()
    )
  );

-- Grant permissions
grant select on public.guides to anon, authenticated;
grant insert, update, delete on public.guides to authenticated;
