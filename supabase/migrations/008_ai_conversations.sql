-- @TASK P5-R1-T1 - ai_conversations 테이블 마이그레이션
-- @SPEC AI 대화 기록 저장용 테이블

-- Create ai_conversations table
create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.guides(id) on delete cascade,
  session_id text not null,
  question text not null,
  answer text not null,
  created_at timestamptz not null default now()
);

-- Create indexes for performance
create index if not exists idx_ai_conversations_guide_id on public.ai_conversations(guide_id);
create index if not exists idx_ai_conversations_session_id on public.ai_conversations(session_id);
create index if not exists idx_ai_conversations_created_at on public.ai_conversations(created_at desc);

-- Enable RLS
alter table public.ai_conversations enable row level security;

-- RLS Policy: SELECT - only guide owners can view AI conversation records
create policy "ai_conversations_select_policy"
  on public.ai_conversations
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

-- RLS Policy: INSERT - anonymous users can insert AI conversations
create policy "ai_conversations_insert_policy"
  on public.ai_conversations
  for insert
  with check (true);

-- RLS Policy: DELETE - only guide owners can delete AI conversation records
create policy "ai_conversations_delete_policy"
  on public.ai_conversations
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
grant select, delete on public.ai_conversations to authenticated;
grant insert on public.ai_conversations to anon, authenticated;
