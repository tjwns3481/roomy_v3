# Roomy v3 - 코딩 컨벤션 (Coding Convention)

> 생성일: 2026-02-01
> 버전: 1.0 (MVP)

---

## 1. 프로젝트 구조

```
roomy_v3/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # 인증 그룹
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (host)/              # 호스트 그룹
│   │   │   ├── dashboard/
│   │   │   ├── editor/[guideId]/
│   │   │   ├── settings/
│   │   │   └── templates/
│   │   ├── (admin)/             # 관리자 그룹
│   │   │   ├── page.tsx
│   │   │   ├── users/
│   │   │   ├── guides/
│   │   │   └── ai-logs/
│   │   ├── g/[slug]/            # 게스트 뷰어 (Public)
│   │   │   ├── page.tsx
│   │   │   └── [blockId]/
│   │   ├── api/                 # API Routes
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                  # 기본 UI 컴포넌트
│   │   ├── editor/              # 에디터 관련
│   │   ├── guest/               # 게스트 뷰어 관련
│   │   ├── dashboard/           # 대시보드 관련
│   │   └── admin/               # 관리자 관련
│   ├── lib/
│   │   ├── supabase/            # Supabase 클라이언트
│   │   ├── gemini/              # Gemini AI 클라이언트
│   │   └── utils/               # 유틸리티
│   ├── hooks/                   # 커스텀 훅
│   ├── types/                   # TypeScript 타입
│   └── styles/                  # 글로벌 스타일
├── public/
├── supabase/
│   └── migrations/              # DB 마이그레이션
└── docs/
    └── planning/                # 기획 문서
```

---

## 2. 네이밍 규칙

### 2.1 파일/폴더

| 종류 | 규칙 | 예시 |
|------|------|------|
| 폴더 | kebab-case | `editor-blocks/`, `ai-chat/` |
| 컴포넌트 | PascalCase | `GuideCard.tsx`, `BlockEditor.tsx` |
| 훅 | camelCase (use 접두사) | `useGuide.ts`, `useAuth.ts` |
| 유틸 | camelCase | `formatDate.ts`, `generateSlug.ts` |
| 타입 | PascalCase | `Guide.ts`, `ContentBlock.ts` |

### 2.2 변수/함수

```typescript
// 변수: camelCase
const guideTitle = "My Guide";
const isPublished = true;

// 상수: UPPER_SNAKE_CASE
const MAX_BLOCKS = 20;
const API_BASE_URL = "/api";

// 함수: camelCase (동사로 시작)
function getGuide(id: string) {}
function updateBlock(block: Block) {}
function handleSubmit() {}

// 컴포넌트: PascalCase
function GuideCard({ guide }: Props) {}
function BlockEditor({ block }: Props) {}
```

### 2.3 CSS 클래스 (Tailwind)

```tsx
// 기본: Tailwind 유틸리티 사용
<div className="flex items-center gap-4 p-4" />

// 긴 클래스는 줄바꿈
<div
  className={cn(
    "flex items-center justify-between",
    "rounded-lg border p-4",
    "hover:bg-gray-50 transition-colors"
  )}
/>

// 조건부 클래스
<button
  className={cn(
    "px-4 py-2 rounded",
    isActive ? "bg-blue-500 text-white" : "bg-gray-100"
  )}
/>
```

---

## 3. 컴포넌트 규칙

### 3.1 파일 구조

```typescript
// GuideCard.tsx

// 1. 임포트
import { useState } from "react";
import { Guide } from "@/types";
import { cn } from "@/lib/utils";

// 2. 타입 정의
interface GuideCardProps {
  guide: Guide;
  onEdit?: () => void;
  onDelete?: () => void;
}

// 3. 컴포넌트
export function GuideCard({ guide, onEdit, onDelete }: GuideCardProps) {
  // 훅
  const [isLoading, setIsLoading] = useState(false);

  // 핸들러
  const handleEdit = () => {
    onEdit?.();
  };

  // 렌더
  return (
    <div className="rounded-lg border p-4">
      <h3>{guide.title}</h3>
      {/* ... */}
    </div>
  );
}
```

### 3.2 Props 규칙

```typescript
// 인터페이스 사용 (Props 접미사)
interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

// 기본값은 destructuring에서
export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  onClick,
}: ButtonProps) {
  // ...
}
```

### 3.3 Server vs Client 컴포넌트

```typescript
// Server Component (기본값)
// - 데이터 fetching
// - 정적 콘텐츠
// - SEO 필요한 페이지

// Client Component ('use client' 필요)
// - 상태 관리 (useState, useEffect)
// - 이벤트 핸들러 (onClick, onChange)
// - 브라우저 API 사용

'use client';

export function BlockEditor() {
  const [blocks, setBlocks] = useState([]);
  // ...
}
```

---

## 4. 훅 규칙

### 4.1 커스텀 훅 패턴

```typescript
// hooks/useGuide.ts

interface UseGuideOptions {
  guideId: string;
}

interface UseGuideReturn {
  guide: Guide | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useGuide({ guideId }: UseGuideOptions): UseGuideReturn {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchGuide = async () => {
    try {
      setIsLoading(true);
      const data = await getGuide(guideId);
      setGuide(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuide();
  }, [guideId]);

  return { guide, isLoading, error, refetch: fetchGuide };
}
```

---

## 5. API 규칙

### 5.1 Route Handler 패턴

```typescript
// app/api/guides/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    // 인증 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 데이터 조회
    const { data, error } = await supabase
      .from("guides")
      .select("*")
      .eq("user_id", user.id);

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/guides error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
```

### 5.2 에러 응답 형식

```typescript
// 성공 응답
return NextResponse.json(data);
return NextResponse.json({ success: true });

// 에러 응답
return NextResponse.json(
  { error: "에러 메시지" },
  { status: 400 | 401 | 404 | 500 }
);
```

---

## 6. Supabase 규칙

### 6.1 클라이언트 생성

```typescript
// lib/supabase/client.ts (Client Component용)
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// lib/supabase/server.ts (Server Component용)
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

### 6.2 쿼리 패턴

```typescript
// 단일 조회
const { data, error } = await supabase
  .from("guides")
  .select("*")
  .eq("id", guideId)
  .single();

// 목록 조회 (관계 포함)
const { data, error } = await supabase
  .from("guides")
  .select(`
    *,
    accommodation:accommodations(name),
    stories(*)
  `)
  .eq("user_id", userId)
  .order("created_at", { ascending: false });

// 생성
const { data, error } = await supabase
  .from("guides")
  .insert({ title, slug, content_blocks: [] })
  .select()
  .single();

// 수정
const { error } = await supabase
  .from("guides")
  .update({ title, content_blocks })
  .eq("id", guideId);

// 삭제
const { error } = await supabase
  .from("guides")
  .delete()
  .eq("id", guideId);
```

---

## 7. TypeScript 규칙

### 7.1 타입 정의

```typescript
// types/guide.ts

export interface Guide {
  id: string;
  slug: string;
  title: string;
  content_blocks: ContentBlock[];
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export type BlockType =
  | "wifi"
  | "rules"
  | "facilities"
  | "contact"
  | "story"
  | "gallery"
  | "text"
  | "map";

export interface ContentBlock {
  id: string;
  type: BlockType;
  order: number;
  data: BlockData;
}

export type BlockData =
  | WifiBlockData
  | RulesBlockData
  | TextBlockData
  | GalleryBlockData;
```

### 7.2 타입 가드

```typescript
// 타입 가드 함수
function isWifiBlock(block: ContentBlock): block is ContentBlock & { data: WifiBlockData } {
  return block.type === "wifi";
}

// 사용
if (isWifiBlock(block)) {
  // block.data는 WifiBlockData로 추론됨
  console.log(block.data.ssid);
}
```

---

## 8. 에러 처리

### 8.1 try-catch 패턴

```typescript
// API 호출
async function fetchGuide(id: string) {
  try {
    const response = await fetch(`/api/guides/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch guide:", error);
    throw error; // 상위로 전파
  }
}

// 컴포넌트에서
try {
  await saveGuide(guide);
  toast.success("저장되었습니다");
} catch (error) {
  toast.error("저장에 실패했습니다");
}
```

### 8.2 에러 바운더리

```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2>문제가 발생했습니다</h2>
      <button onClick={() => reset()}>다시 시도</button>
    </div>
  );
}
```

---

## 9. 스타일 가이드

### 9.1 색상 팔레트 (Tailwind 확장)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
        },
        accent: {
          500: '#8b5cf6',
        },
      },
    },
  },
};
```

### 9.2 반응형 브레이크포인트

```typescript
// 모바일 퍼스트
<div className="px-4 md:px-8 lg:px-12" />

// 기준
// sm: 640px
// md: 768px  (태블릿)
// lg: 1024px (데스크톱)
// xl: 1280px
```

---

## 10. Git 규칙

### 10.1 커밋 메시지

```
<type>(<scope>): <subject>

type:
- feat: 새 기능
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 포맷팅
- refactor: 코드 리팩토링
- test: 테스트 추가
- chore: 빌드 설정 등

예시:
feat(editor): 블록 드래그 앤 드롭 구현
fix(guest): Wi-Fi 복사 버튼 동작 안 함
docs: 06-screens.md 작성
```

### 10.2 브랜치 전략

```
main          # 프로덕션
├── develop   # 개발
└── feature/* # 기능 개발
    ├── feature/auth
    ├── feature/editor
    └── feature/guest-viewer
```

---

## 11. 주석 규칙

```typescript
// 한 줄 주석: 코드 위에
const MAX_BLOCKS = 20; // 인라인 주석은 피하기

/**
 * 가이드를 생성합니다.
 * @param title - 가이드 제목
 * @param templateId - 템플릿 ID
 * @returns 생성된 가이드
 */
async function createGuide(title: string, templateId: string): Promise<Guide> {
  // ...
}

// TODO: 나중에 구현할 것
// FIXME: 버그 있음
// HACK: 임시 해결책
```

---

## 12. 테스트 규칙 (향후)

```typescript
// __tests__/components/GuideCard.test.tsx
import { render, screen } from "@testing-library/react";
import { GuideCard } from "@/components/dashboard/GuideCard";

describe("GuideCard", () => {
  it("가이드 제목을 표시한다", () => {
    const guide = { id: "1", title: "테스트 가이드", ... };
    render(<GuideCard guide={guide} />);
    expect(screen.getByText("테스트 가이드")).toBeInTheDocument();
  });
});
```

---

## 요약 체크리스트

- [ ] 컴포넌트는 PascalCase, 함수는 camelCase
- [ ] Props는 interface로 정의
- [ ] 'use client'는 필요한 경우만
- [ ] API는 try-catch로 에러 처리
- [ ] Tailwind 클래스는 cn() 사용
- [ ] 타입은 명시적으로 정의
- [ ] 커밋 메시지는 컨벤션 따르기
