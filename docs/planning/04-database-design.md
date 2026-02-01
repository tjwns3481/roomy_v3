# Roomy(루미) - 데이터베이스 설계

> 생성일: 2026-02-01
> 버전: 1.0 (MVP)

---

## 1. 개요

### 1.1 데이터베이스

- **플랫폼**: Supabase (PostgreSQL)
- **인증**: Supabase Auth
- **파일 저장**: Supabase Storage

### 1.2 설계 원칙

1. **정규화**: 중복 최소화
2. **확장성**: 향후 기능 추가 고려
3. **보안**: RLS (Row Level Security) 적용
4. **성능**: 적절한 인덱스 설정

---

## 2. ERD (Entity Relationship Diagram)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                    ERD                                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│    users     │       │  accommodations  │       │    guides    │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (PK)      │──┐    │ id (PK)          │──┐    │ id (PK)      │
│ email        │  │    │ user_id (FK)     │  │    │ accom_id (FK)│
│ name         │  └───▶│ name             │  └───▶│ slug         │
│ role         │       │ address          │       │ title        │
│ created_at   │       │ created_at       │       │ content_blocks│
│ updated_at   │       │ updated_at       │       │ wifi_ssid    │
└──────────────┘       └──────────────────┘       │ wifi_password│
                                                  │ is_published │
                                                  │ view_count   │
                                                  │ created_at   │
                                                  │ updated_at   │
                                                  └──────┬───────┘
                                                         │
                    ┌────────────────────────────────────┼────────────────────┐
                    │                                    │                    │
                    ▼                                    ▼                    ▼
           ┌──────────────┐                    ┌──────────────────┐   ┌──────────────┐
           │   stories    │                    │ ai_conversations │   │    visits    │
           ├──────────────┤                    ├──────────────────┤   ├──────────────┤
           │ id (PK)      │                    │ id (PK)          │   │ id (PK)      │
           │ guide_id (FK)│                    │ guide_id (FK)    │   │ guide_id (FK)│
           │ media_url    │                    │ session_id       │   │ visitor_ip   │
           │ media_type   │                    │ question         │   │ user_agent   │
           │ order_index  │                    │ answer           │   │ created_at   │
           │ created_at   │                    │ created_at       │   └──────────────┘
           └──────────────┘                    └──────────────────┘
```

---

## 3. 테이블 상세

### 3.1 users (사용자)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK, DEFAULT gen_random_uuid() | 사용자 고유 ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 |
| name | VARCHAR(100) | | 이름 |
| role | VARCHAR(20) | DEFAULT 'host' | 역할 (host, admin) |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'host' CHECK (role IN ('host', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 3.2 accommodations (숙소)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 숙소 고유 ID |
| user_id | UUID | FK (users.id), ON DELETE CASCADE | 소유자 |
| name | VARCHAR(200) | NOT NULL | 숙소 이름 |
| address | TEXT | | 주소 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

```sql
CREATE TABLE accommodations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name VARCHAR(200) NOT NULL,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_accommodations_user_id ON accommodations(user_id);
```

### 3.3 guides (가이드)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 가이드 고유 ID |
| accommodation_id | UUID | FK (accommodations.id), ON DELETE CASCADE | 숙소 |
| slug | VARCHAR(100) | UNIQUE, NOT NULL | URL 슬러그 |
| title | VARCHAR(200) | NOT NULL | 가이드 제목 |
| content_blocks | JSONB | DEFAULT '[]' | 블록 콘텐츠 |
| wifi_ssid | VARCHAR(100) | | Wi-Fi SSID |
| wifi_password | VARCHAR(100) | | Wi-Fi 비밀번호 |
| is_published | BOOLEAN | DEFAULT FALSE | 발행 여부 |
| view_count | INTEGER | DEFAULT 0 | 조회수 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |
| updated_at | TIMESTAMP | DEFAULT NOW() | 수정일 |

```sql
CREATE TABLE guides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accommodation_id UUID REFERENCES accommodations(id) ON DELETE CASCADE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  content_blocks JSONB DEFAULT '[]'::jsonb,
  wifi_ssid VARCHAR(100),
  wifi_password VARCHAR(100),
  is_published BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_guides_slug ON guides(slug);
CREATE INDEX idx_guides_accommodation_id ON guides(accommodation_id);
CREATE INDEX idx_guides_is_published ON guides(is_published);
```

### 3.4 stories (스토리)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 스토리 고유 ID |
| guide_id | UUID | FK (guides.id), ON DELETE CASCADE | 가이드 |
| media_url | TEXT | NOT NULL | 미디어 URL |
| media_type | VARCHAR(20) | NOT NULL | 미디어 타입 (image, video) |
| order_index | INTEGER | NOT NULL | 순서 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |

```sql
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE NOT NULL,
  media_url TEXT NOT NULL,
  media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video')),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_stories_guide_id ON stories(guide_id);
```

### 3.5 ai_conversations (AI 대화)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 대화 고유 ID |
| guide_id | UUID | FK (guides.id), ON DELETE CASCADE | 가이드 |
| session_id | VARCHAR(100) | NOT NULL | 세션 ID |
| question | TEXT | NOT NULL | 질문 |
| answer | TEXT | NOT NULL | 답변 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일 |

```sql
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE NOT NULL,
  session_id VARCHAR(100) NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_guide_id ON ai_conversations(guide_id);
CREATE INDEX idx_ai_conversations_created_at ON ai_conversations(created_at);
```

### 3.6 visits (방문 기록)

| 컬럼 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| id | UUID | PK | 방문 고유 ID |
| guide_id | UUID | FK (guides.id), ON DELETE CASCADE | 가이드 |
| visitor_ip | VARCHAR(50) | | 방문자 IP |
| user_agent | TEXT | | User Agent |
| created_at | TIMESTAMP | DEFAULT NOW() | 방문 시간 |

```sql
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE NOT NULL,
  visitor_ip VARCHAR(50),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_visits_guide_id ON visits(guide_id);
CREATE INDEX idx_visits_created_at ON visits(created_at);
```

---

## 4. content_blocks JSONB 구조

### 4.1 블록 타입 정의

```typescript
type BlockType = 'wifi' | 'rules' | 'devices' | 'places' | 'text' | 'image' | 'video';

interface ContentBlock {
  id: string;           // UUID
  type: BlockType;
  order: number;
  data: BlockData;
}
```

### 4.2 블록별 데이터 구조

```typescript
// Wi-Fi 블록
interface WifiBlock {
  type: 'wifi';
  data: {
    ssid: string;
    password: string;
    note?: string;
  }
}

// 이용수칙 블록
interface RulesBlock {
  type: 'rules';
  data: {
    checkIn: string;      // "15:00"
    checkOut: string;     // "11:00"
    items: string[];      // ["금연", "반려동물 불가", ...]
  }
}

// 기기 사용법 블록
interface DevicesBlock {
  type: 'devices';
  data: {
    items: {
      name: string;         // "TV"
      description: string;  // "리모컨은 소파 옆에..."
      imageUrl?: string;
    }[]
  }
}

// 주변 맛집/명소 블록
interface PlacesBlock {
  type: 'places';
  data: {
    items: {
      name: string;       // "맛있는 식당"
      category: string;   // "맛집" | "카페" | "명소"
      address: string;
      mapUrl?: string;    // 네이버/카카오맵 링크
    }[]
  }
}

// 텍스트 블록
interface TextBlock {
  type: 'text';
  data: {
    title: string;
    content: string;
  }
}

// 이미지 블록
interface ImageBlock {
  type: 'image';
  data: {
    url: string;
    caption?: string;
  }
}

// 비디오 블록
interface VideoBlock {
  type: 'video';
  data: {
    url: string;
    caption?: string;
  }
}
```

### 4.3 예시 데이터

```json
[
  {
    "id": "uuid-1",
    "type": "wifi",
    "order": 1,
    "data": {
      "ssid": "MyRoom_5G",
      "password": "welcome123",
      "note": "5G가 안 되면 2.4G를 사용해주세요"
    }
  },
  {
    "id": "uuid-2",
    "type": "rules",
    "order": 2,
    "data": {
      "checkIn": "15:00",
      "checkOut": "11:00",
      "items": ["실내 금연", "반려동물 불가", "22시 이후 정숙"]
    }
  },
  {
    "id": "uuid-3",
    "type": "devices",
    "order": 3,
    "data": {
      "items": [
        {
          "name": "TV",
          "description": "리모컨은 소파 오른쪽 테이블에 있어요",
          "imageUrl": "https://..."
        },
        {
          "name": "보일러",
          "description": "거실 벽면 온도조절기에서 조절하세요",
          "imageUrl": "https://..."
        }
      ]
    }
  }
]
```

---

## 5. Row Level Security (RLS)

### 5.1 users 테이블

```sql
-- 사용자는 자신의 정보만 조회/수정 가능
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### 5.2 accommodations 테이블

```sql
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own accommodations" ON accommodations
  FOR ALL USING (user_id = auth.uid());
```

### 5.3 guides 테이블

```sql
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;

-- 호스트는 자신의 가이드만 관리
CREATE POLICY "Users can manage own guides" ON guides
  FOR ALL USING (
    accommodation_id IN (
      SELECT id FROM accommodations WHERE user_id = auth.uid()
    )
  );

-- 게스트는 발행된 가이드 조회 가능
CREATE POLICY "Anyone can view published guides" ON guides
  FOR SELECT USING (is_published = TRUE);
```

### 5.4 관리자 정책

```sql
-- 관리자는 모든 데이터 접근 가능
CREATE POLICY "Admins can access all users" ON users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- (다른 테이블에도 동일하게 적용)
```

---

## 6. 마이그레이션 순서

```
1. users 테이블 생성
2. accommodations 테이블 생성
3. guides 테이블 생성
4. stories 테이블 생성
5. ai_conversations 테이블 생성
6. visits 테이블 생성
7. 인덱스 생성
8. RLS 정책 적용
```

---

## 7. Supabase Storage 버킷

| 버킷 | 용도 | 접근 정책 |
|------|------|----------|
| guides | 가이드 이미지/비디오 | 호스트: 업로드/삭제, 게스트: 조회 |
| stories | 스토리 미디어 | 호스트: 업로드/삭제, 게스트: 조회 |
| avatars | 사용자 프로필 이미지 | 본인만 업로드/삭제, 공개 조회 |
