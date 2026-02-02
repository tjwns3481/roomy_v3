-- @TASK P1-R1-T1 - users 테이블 마이그레이션 (Clerk 인증 호환)
-- @SPEC specs/domain/resources.yaml#user
-- Create users table with Clerk Auth integration

-- Create the users table
create table if not exists public.users (
  -- Primary key: Auto-generated UUID
  id uuid primary key default gen_random_uuid(),

  -- Clerk user ID (external auth provider)
  clerk_id text unique not null,

  -- User information
  email text not null unique,
  name text,
  role text not null default 'host' check (role in ('host', 'admin')),
  avatar_url text,
  phone text,

  -- Timestamps
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create index on clerk_id for faster lookups
create index if not exists idx_users_clerk_id on public.users(clerk_id);

-- Create index on email for faster lookups
create index if not exists idx_users_email on public.users(email);

-- Create index on role for filtering by user role
create index if not exists idx_users_role on public.users(role);

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at on row changes
drop trigger if exists handle_users_updated_at on public.users;
create trigger handle_users_updated_at
  before update on public.users
  for each row
  execute function public.handle_updated_at();

-- Enable row level security
alter table public.users enable row level security;

-- Drop existing policies if any
drop policy if exists "Users can view their own profile" on public.users;
drop policy if exists "Users can update their own profile" on public.users;
drop policy if exists "Admin users can view all profiles" on public.users;
drop policy if exists "Admin users can update any profile" on public.users;
drop policy if exists "Service role full access" on public.users;
drop policy if exists "Allow insert from service role" on public.users;
drop policy if exists "Allow all for service role" on public.users;

-- Allow service role full access (for API routes with service key)
create policy "Allow all for service role"
  on public.users
  for all
  using (true)
  with check (true);

-- Note: With Clerk authentication, RLS policies will be handled differently
-- API routes will use the service role key to bypass RLS
-- User authorization is handled at the application level
