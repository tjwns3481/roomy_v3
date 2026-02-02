-- =====================================================
-- Roomy v3 테이블 수정 (기존 users.id가 text 타입인 경우)
-- Supabase SQL Editor에서 실행하세요
-- =====================================================

-- 1. 기존 users 테이블 구조 확인 후 accommodations 생성
-- (users.id가 text 타입이므로 user_id도 text로)
CREATE TABLE IF NOT EXISTS public.accommodations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_accommodations_user_id ON public.accommodations(user_id);

-- 2. updated_at 트리거 함수 (없으면 생성)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_accommodations_updated_at ON public.accommodations;
CREATE TRIGGER handle_accommodations_updated_at
  BEFORE UPDATE ON public.accommodations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all for service role" ON public.accommodations;
CREATE POLICY "Allow all for service role" ON public.accommodations FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- 3. GUIDES 테이블
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

DROP POLICY IF EXISTS "Public can view published guides" ON public.guides;
CREATE POLICY "Public can view published guides" ON public.guides FOR SELECT USING (is_published = true);

-- =====================================================
-- 4. STORIES 테이블
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
-- 완료
-- =====================================================
DO $$ BEGIN RAISE NOTICE '테이블 생성 완료! accommodations, guides, stories'; END $$;
