# Hooks

React 커스텀 훅 모음

## useGuides

가이드 목록을 조회하고 관리하는 훅입니다.

### 기본 사용법

```tsx
import { useGuides } from "@/hooks";

function GuidesPage() {
  const { guides, isLoading, error, refetch } = useGuides();

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;

  return (
    <div>
      {guides.map((guide) => (
        <GuideCard key={guide.id} guide={guide} />
      ))}
    </div>
  );
}
```

### 검색 기능

```tsx
const [searchTerm, setSearchTerm] = useState("");

const { guides } = useGuides({
  search: searchTerm,
});

return (
  <>
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="가이드 검색..."
    />
    <GuidesList guides={guides} />
  </>
);
```

### 필터 기능

```tsx
const { guides } = useGuides({
  status: "published", // 'all' | 'published' | 'draft'
});
```

### 특정 숙소의 가이드만 조회

```tsx
const { guides } = useGuides({
  accommodation_id: "abc-123",
});
```

### 복합 조건

```tsx
const { guides, refetch } = useGuides({
  search: "제주도",
  status: "published",
  accommodation_id: "abc-123",
});

// 수동 새로고침
<button onClick={refetch}>새로고침</button>
```

## 인터페이스

### UseGuidesOptions

```typescript
interface UseGuidesOptions {
  search?: string; // 제목 검색어
  status?: "all" | "published" | "draft"; // 발행 상태
  accommodation_id?: string; // 숙소 ID
}
```

### UseGuidesResult

```typescript
interface UseGuidesResult {
  guides: Guide[]; // 필터링된 가이드 목록
  isLoading: boolean; // 로딩 상태
  error: Error | null; // 에러 객체
  refetch: () => void; // 재조회 함수
}
```

## 성능 최적화

- API 호출은 `accommodation_id` 변경 시에만 발생합니다
- `search`와 `status`는 클라이언트 사이드에서 필터링됩니다
- 불필요한 재조회를 방지하기 위해 `useCallback`을 사용합니다

## 에러 처리

```tsx
const { error } = useGuides();

if (error) {
  // 인증 에러
  if (error.message.includes("로그인")) {
    router.push("/login");
  }

  // 일반 에러 표시
  return <ErrorMessage message={error.message} />;
}
```

## 테스트

테스트 페이지: `/guides-test`

이 페이지에서 검색, 필터, 새로고침 기능을 직접 테스트할 수 있습니다.
