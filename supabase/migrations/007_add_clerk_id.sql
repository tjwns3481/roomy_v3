-- 기존 users 테이블에 clerk_id 컬럼 추가 (Clerk 인증 호환)

-- 1. clerk_id 컬럼 추가 (nullable로 먼저 추가)
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS clerk_id text;

-- 2. 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON public.users(clerk_id);

-- 3. RLS 정책 업데이트 - 기존 정책 제거
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admin users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Admin users can update any profile" ON public.users;
DROP POLICY IF EXISTS "Service role full access" ON public.users;
DROP POLICY IF EXISTS "Allow insert from service role" ON public.users;
DROP POLICY IF EXISTS "Allow all for service role" ON public.users;

-- 4. 새로운 RLS 정책 (서비스 롤 전체 접근)
CREATE POLICY "Allow all for service role"
  ON public.users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 5. accommodations 테이블 RLS 정책도 업데이트
DROP POLICY IF EXISTS "Users can view their own accommodations" ON public.accommodations;
DROP POLICY IF EXISTS "Authenticated users can create accommodations" ON public.accommodations;
DROP POLICY IF EXISTS "Users can update their own accommodations" ON public.accommodations;
DROP POLICY IF EXISTS "Users can delete their own accommodations" ON public.accommodations;
DROP POLICY IF EXISTS "Allow all for service role" ON public.accommodations;

CREATE POLICY "Allow all for service role"
  ON public.accommodations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 6. guides 테이블 RLS 정책도 업데이트
DROP POLICY IF EXISTS "Users can view their own guides" ON public.guides;
DROP POLICY IF EXISTS "Public can view published guides" ON public.guides;
DROP POLICY IF EXISTS "Users can create guides" ON public.guides;
DROP POLICY IF EXISTS "Users can update their own guides" ON public.guides;
DROP POLICY IF EXISTS "Users can delete their own guides" ON public.guides;
DROP POLICY IF EXISTS "Allow all for service role" ON public.guides;

CREATE POLICY "Allow all for service role"
  ON public.guides
  FOR ALL
  USING (true)
  WITH CHECK (true);
