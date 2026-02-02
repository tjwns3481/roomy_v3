-- @TASK P2-R1-T1 - accommodations 테이블 마이그레이션
-- @SPEC specs/domain/resources.yaml#accommodation
-- Create accommodations table with user relationship

-- Create the accommodations table
create table if not exists public.accommodations (
  -- Primary key
  id uuid primary key default gen_random_uuid(),

  -- Foreign key: Reference to users table
  user_id uuid not null references public.users(id) on delete cascade,

  -- Accommodation information
  name text not null,
  address text,

  -- Location data
  latitude numeric,
  longitude numeric,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create index on user_id for faster lookups and foreign key constraints
create index if not exists idx_accommodations_user_id on public.accommodations(user_id);

-- Create trigger to automatically update updated_at on row changes
-- Reuse the existing handle_updated_at function from users table
create trigger handle_accommodations_updated_at
  before update on public.accommodations
  for each row
  execute function public.handle_updated_at();

-- Enable row level security
alter table public.accommodations enable row level security;

-- Drop existing policies if any
drop policy if exists "Users can view their own accommodations" on public.accommodations;
drop policy if exists "Authenticated users can create accommodations" on public.accommodations;
drop policy if exists "Users can update their own accommodations" on public.accommodations;
drop policy if exists "Users can delete their own accommodations" on public.accommodations;
drop policy if exists "Allow all for service role" on public.accommodations;

-- Allow service role full access (for API routes)
-- Note: With Clerk authentication, authorization is handled at the application level
create policy "Allow all for service role"
  on public.accommodations
  for all
  using (true)
  with check (true);
