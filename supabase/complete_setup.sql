-- =====================================================
-- Roomy v3 Complete Database Setup (Clerk Auth 호환)
-- Supabase SQL Editor에서 실행하세요
-- =====================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Helper function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 3. USERS 테이블
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id text UNIQUE,
  email text NOT NULL UNIQUE,
  name text,
  role text NOT NULL DEFAULT 'host' CHECK (role IN ('host', 'admin')),
  avatar_url text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 기존 테이블에 clerk_id 추가 (이미 있으면 무시)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'users' AND column_name = 'clerk_id') THEN
    ALTER TABLE public.users ADD COLUMN clerk_id text UNIQUE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON public.users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

DROP TRIGGER IF EXISTS handle_users_updated_at ON public.users;
CREATE TRIGGER handle_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for service role" ON public.users;
CREATE POLICY "Allow all for service role" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- 4. ACCOMMODATIONS 테이블
-- =====================================================
CREATE TABLE IF NOT EXISTS public.accommodations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_accommodations_user_id ON public.accommodations(user_id);

DROP TRIGGER IF EXISTS handle_accommodations_updated_at ON public.accommodations;
CREATE TRIGGER handle_accommodations_updated_at
  BEFORE UPDATE ON public.accommodations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for service role" ON public.accommodations;
CREATE POLICY "Allow all for service role" ON public.accommodations FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- 5. GUIDES 테이블
-- =====================================================
CREATE TABLE IF NOT EXISTS public.guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  accommodation_id uuid NOT NULL REFERENCES public.accommodations(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  content_blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  wifi_ssid text,
  wifi_password text,
  is_published boolean NOT NULL DEFAULT false,
  view_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT guides_slug_unique UNIQUE(slug)
);

CREATE INDEX IF NOT EXISTS idx_guides_accommodation_id ON public.guides(accommodation_id);
CREATE INDEX IF NOT EXISTS idx_guides_slug ON public.guides(slug);
CREATE INDEX IF NOT EXISTS idx_guides_is_published ON public.guides(is_published);

DROP TRIGGER IF EXISTS guides_updated_at_trigger ON public.guides;
CREATE TRIGGER guides_updated_at_trigger
  BEFORE UPDATE ON public.guides
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for service role" ON public.guides;
CREATE POLICY "Allow all for service role" ON public.guides FOR ALL USING (true) WITH CHECK (true);

-- 공개된 가이드는 누구나 조회 가능
DROP POLICY IF EXISTS "Public can view published guides" ON public.guides;
CREATE POLICY "Public can view published guides" ON public.guides FOR SELECT USING (is_published = true);

-- =====================================================
-- 6. STORIES 테이블 (선택사항)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id uuid NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  title text NOT NULL,
  media_url text NOT NULL,
  media_type text NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_stories_guide_id ON public.stories(guide_id);

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for service role" ON public.stories;
CREATE POLICY "Allow all for service role" ON public.stories FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- 완료 메시지
-- =====================================================
DO $$ BEGIN RAISE NOTICE 'Roomy v3 데이터베이스 설정 완료!'; END $$;
