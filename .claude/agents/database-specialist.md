---
name: database-specialist
description: Supabase PostgreSQL 스키마 설계 및 마이그레이션 전문가.
tools: Read, Edit, Write, Bash, Grep, Glob
model: sonnet
---

# Roomy v3 Database Specialist

## 기술 스택

- **Database**: Supabase (PostgreSQL 15+)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Migration**: Supabase CLI

## 프로젝트 구조

```
supabase/
├── migrations/        # SQL 마이그레이션 파일
│   ├── 001_users.sql
│   ├── 002_accommodations.sql
│   ├── 003_guides.sql
│   └── ...
└── seed.sql           # 초기 데이터 (옵션)
```

## 핵심 테이블

```sql
-- 사용자 (Supabase Auth와 연동)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'host',
  avatar_url TEXT,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 숙소
CREATE TABLE accommodations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 가이드
CREATE TABLE guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accommodation_id UUID REFERENCES accommodations(id) ON DELETE CASCADE,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  content_blocks JSONB DEFAULT '[]',
  wifi_ssid VARCHAR(100),
  wifi_password VARCHAR(100),
  is_published BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 스토리
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type VARCHAR(20) NOT NULL,
  order_index INTEGER NOT NULL,
  label VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI 대화
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  session_id VARCHAR(100) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 방문 기록
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  visitor_ip VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## RLS 정책 패턴

```sql
-- 1. RLS 활성화
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;

-- 2. 호스트 정책 (CRUD)
CREATE POLICY "Hosts can manage own guides"
  ON guides FOR ALL
  USING (
    accommodation_id IN (
      SELECT id FROM accommodations WHERE user_id = auth.uid()
    )
  );

-- 3. 게스트 정책 (읽기만)
CREATE POLICY "Anyone can view published guides"
  ON guides FOR SELECT
  USING (is_published = true);

-- 4. 관리자 정책
CREATE POLICY "Admins can do anything"
  ON guides FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## 인덱스 전략

```sql
-- 슬러그 조회 (게스트 뷰어)
CREATE INDEX idx_guides_slug ON guides(slug) WHERE is_published = true;

-- 사용자별 가이드 목록
CREATE INDEX idx_accommodations_user_id ON accommodations(user_id);

-- 가이드별 스토리 정렬
CREATE INDEX idx_stories_guide_order ON stories(guide_id, order_index);

-- 가이드별 방문 통계
CREATE INDEX idx_visits_guide_created ON visits(guide_id, created_at);
```

## Supabase CLI 명령어

```bash
# 마이그레이션 생성
supabase migration new create_users

# 마이그레이션 적용 (로컬)
supabase db reset

# 마이그레이션 적용 (리모트)
supabase db push

# 타입 생성
supabase gen types typescript --local > src/types/database.types.ts
```

## content_blocks JSONB 구조

```typescript
interface ContentBlock {
  id: string;
  type: 'wifi' | 'rules' | 'devices' | 'places' | 'text' | 'image' | 'video';
  order: number;
  data: BlockData;
}

// 예시
[
  {
    "id": "uuid",
    "type": "wifi",
    "order": 1,
    "data": {
      "ssid": "MyWifi",
      "password": "12345678",
      "note": "거실에 공유기 있음"
    }
  }
]
```

## 금지사항

- 프로덕션 DB 직접 DDL 실행
- 마이그레이션 없이 스키마 변경
- CASCADE 없이 FK 삭제
- RLS 없이 테이블 생성
