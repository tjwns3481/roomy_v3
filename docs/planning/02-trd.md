# Roomy(루미) - 기술 요구사항 문서 (TRD)

> 생성일: 2026-02-01
> 버전: 1.0 (MVP)

---

## 1. 기술 스택 요약

| 영역 | 기술 | 버전 | 선택 이유 |
|------|------|------|----------|
| **프론트엔드** | Next.js (React) | 14+ | SEO 최적화, App Router, 빠른 개발 |
| **스타일링** | Tailwind CSS | 3.x | 유틸리티 퍼스트, 빠른 UI 개발 |
| **백엔드/DB** | Supabase | - | 올인원 (Auth, DB, Storage, Edge Functions) |
| **AI 챗봇** | Gemini 3.0 Flash | - | 빠르고 저렴, 한국어 지원 |
| **배포** | Vercel | - | Next.js 최적화, 자동 배포 |

---

## 2. 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                         클라이언트                               │
├──────────────────────────┬──────────────────────────────────────┤
│   호스트 (Web)           │   게스트 (Mobile Web/PWA)            │
│   - 대시보드             │   - 가이드 뷰어                      │
│   - 에디터               │   - AI 챗봇                          │
│   - QR 다운로드          │   - 스토리 뷰어                      │
├──────────────────────────┴──────────────────────────────────────┤
│                      Next.js App (Vercel)                       │
├─────────────────────────────────────────────────────────────────┤
│                         Supabase                                │
│  ┌───────────┬───────────┬───────────┬───────────┐             │
│  │   Auth    │ Database  │  Storage  │   Edge    │             │
│  │  (인증)   │(PostgreSQL)│  (파일)   │ Functions │             │
│  └───────────┴───────────┴───────────┴───────────┘             │
├─────────────────────────────────────────────────────────────────┤
│                    Gemini 3.0 Flash API                         │
│                       (AI 챗봇)                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. 데이터베이스 스키마

### 3.1 테이블 설계

```sql
-- 사용자 (호스트)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'host', -- 'host', 'admin'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 숙소
CREATE TABLE accommodations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  address TEXT,
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
  media_type VARCHAR(20) NOT NULL, -- 'image', 'video'
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AI 대화 로그
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  session_id VARCHAR(100) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 방문 통계
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  visitor_ip VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3.2 관계도

```
users (1) ──── (N) accommodations (1) ──── (1) guides
                                              │
                                              ├── (N) stories
                                              ├── (N) ai_conversations
                                              └── (N) visits
```

---

## 4. API 설계

### 4.1 인증 API

| 메소드 | 경로 | 설명 |
|--------|------|------|
| POST | /api/auth/signup | 회원가입 |
| POST | /api/auth/login | 로그인 |
| POST | /api/auth/logout | 로그아웃 |
| GET | /api/auth/me | 현재 사용자 정보 |

### 4.2 가이드 API

| 메소드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/guides | 내 가이드 목록 |
| POST | /api/guides | 가이드 생성 |
| GET | /api/guides/:id | 가이드 상세 |
| PUT | /api/guides/:id | 가이드 수정 |
| DELETE | /api/guides/:id | 가이드 삭제 |
| POST | /api/guides/:id/publish | 가이드 발행 |

### 4.3 스토리 API

| 메소드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/guides/:id/stories | 스토리 목록 |
| POST | /api/guides/:id/stories | 스토리 추가 |
| PUT | /api/stories/:id | 스토리 수정 |
| DELETE | /api/stories/:id | 스토리 삭제 |

### 4.4 AI 챗봇 API

| 메소드 | 경로 | 설명 |
|--------|------|------|
| POST | /api/chat | AI 질문/답변 |
| GET | /api/guides/:id/faq | FAQ 목록 |

### 4.5 관리자 API

| 메소드 | 경로 | 설명 |
|--------|------|------|
| GET | /api/admin/users | 전체 사용자 목록 |
| GET | /api/admin/guides | 전체 가이드 목록 |
| GET | /api/admin/stats | 서비스 통계 |
| GET | /api/admin/ai-logs | AI 로그 목록 |

---

## 5. 게스트 뷰어 URL 구조

```
/g/:slug                    # 가이드 메인 (스토리 + 메뉴)
/g/:slug/wifi              # Wi-Fi 정보
/g/:slug/rules             # 이용 수칙
/g/:slug/devices           # 기기 사용법
/g/:slug/places            # 주변 맛집/명소
/g/:slug/chat              # AI 챗봇
```

---

## 6. 블록 타입 정의

### 6.1 content_blocks JSONB 구조

```typescript
interface ContentBlock {
  id: string;
  type: 'wifi' | 'rules' | 'devices' | 'places' | 'text' | 'image' | 'video';
  order: number;
  data: WifiData | RulesData | DevicesData | PlacesData | TextData | MediaData;
}

interface WifiData {
  ssid: string;
  password: string;
  note?: string;
}

interface RulesData {
  checkIn: string;    // "15:00"
  checkOut: string;   // "11:00"
  items: string[];    // ["금연", "반려동물 불가", ...]
}

interface DevicesData {
  items: {
    name: string;      // "TV"
    description: string;
    imageUrl?: string;
  }[];
}

interface PlacesData {
  items: {
    name: string;
    category: string;  // "맛집", "카페", "명소"
    address: string;
    mapUrl?: string;
  }[];
}

interface TextData {
  title: string;
  content: string;
}

interface MediaData {
  url: string;
  caption?: string;
}
```

---

## 7. AI 챗봇 구현

### 7.1 RAG (Retrieval-Augmented Generation) 구조

```
게스트 질문 → 가이드 콘텐츠 검색 → Gemini 프롬프트 생성 → 답변
```

### 7.2 시스템 프롬프트

```
당신은 숙소 가이드 AI 어시스턴트입니다.
다음은 이 숙소의 가이드 정보입니다:

{가이드 콘텐츠}

게스트의 질문에 위 정보를 바탕으로 친절하게 답변해주세요.
가이드에 없는 정보는 "호스트님께 직접 문의해주세요"라고 안내해주세요.
```

### 7.3 Guardrails

- 가이드 내용 외 외부 정보 답변 금지
- 숙소와 무관한 질문 거절
- 개인정보 요청 거절

---

## 8. 보안

### 8.1 인증

- Supabase Auth (이메일/비밀번호)
- JWT 토큰 기반 세션

### 8.2 권한 관리

| 역할 | 권한 |
|------|------|
| guest | 게스트 뷰어 조회만 |
| host | 자신의 가이드 CRUD |
| admin | 전체 관리 |

### 8.3 Row Level Security (RLS)

```sql
-- 호스트는 자신의 가이드만 접근
CREATE POLICY "Users can only access their own guides"
  ON guides FOR ALL
  USING (accommodation_id IN (
    SELECT id FROM accommodations WHERE user_id = auth.uid()
  ));
```

---

## 9. 성능 최적화

### 9.1 프론트엔드

- Next.js Image 최적화
- 동적 import로 코드 스플리팅
- Service Worker로 PWA 캐싱

### 9.2 백엔드

- Supabase Edge Functions로 지연 최소화
- DB 인덱스 최적화

### 9.3 목표 지표

| 지표 | 목표 |
|------|------|
| LCP | < 1.5초 |
| FID | < 100ms |
| CLS | < 0.1 |

---

## 10. 배포

### 10.1 환경

| 환경 | 용도 |
|------|------|
| development | 로컬 개발 |
| staging | QA 테스트 |
| production | 실 서비스 |

### 10.2 환경 변수

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Gemini
GEMINI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

---

## 11. 모니터링

- Vercel Analytics (성능 모니터링)
- Supabase Dashboard (DB 모니터링)
- 자체 로깅 (AI 대화 기록)
