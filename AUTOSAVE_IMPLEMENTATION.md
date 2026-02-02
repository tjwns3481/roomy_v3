# P1-T3: 자동 저장 기능 구현 완료

## 개요
블록 에디터에서 사용자의 변경사항을 자동으로 서버에 저장하는 기능을 구현했습니다.

## 구현된 파일

### 1. `/src/hooks/useAutoSave.ts` (기존 완료)
**책임**: 자동 저장 로직 관리

**주요 기능**:
- 디바운스를 적용한 자동 저장 (기본 1.5초)
- 저장 중 발생한 변경사항 대기열 처리
- 저장 상태 관리 (idle, saving, saved, error)
- 수동 저장 함수 제공

**인터페이스**:
```typescript
interface UseAutoSaveOptions {
  guideId: string;
  data: GuideAutoSaveData; // { title?, content_blocks?, wifi_ssid?, wifi_password? }
  debounceMs?: number; // 기본 1500ms
  enabled?: boolean; // 기본 true
}

interface UseAutoSaveResult {
  status: "idle" | "saving" | "saved" | "error";
  lastSavedAt: Date | null;
  error: Error | null;
  save: () => Promise<void>;
}
```

### 2. `/src/components/editor/SaveStatusIndicator.tsx` (기존 완료)
**책임**: 저장 상태 시각화

**상태별 표시**:
- **saving**: 노란색 점 + "저장 중..." (pulse 애니메이션)
- **saved**: 초록색 점 + "저장됨 · 3분 전"
- **error**: 빨간색 점 + "저장 실패: 에러메시지 [재시도]"
- **idle**: 마지막 저장 시간만 표시 또는 null

**Props**:
```typescript
interface SaveStatusIndicatorProps {
  status: "idle" | "saving" | "saved" | "error";
  lastSavedAt: Date | null;
  error: Error | null;
  onRetry?: () => void;
}
```

### 3. `/src/components/editor/EditorLayout.tsx` (수정됨)
**변경 사항**:

1. **Import 추가**
   ```typescript
   import { SaveStatusIndicator } from "./SaveStatusIndicator";
   import { useAutoSave } from "@/hooks/useAutoSave";
   ```

2. **useAutoSave 훅 연결**
   ```typescript
   const { status, lastSavedAt, error, save } = useAutoSave({
     guideId,
     data: { content_blocks: blocks },
     debounceMs: 2000, // 2초로 설정
     enabled: true,
   });
   ```

3. **기존 수동 상태 관리 제거**
   - `const [saveStatus, setSaveStatus]` 제거
   - `setSaveStatus("unsaved")` 호출 모두 제거

4. **SaveStatusIndicator 통합**
   ```typescript
   <SaveStatusIndicator
     status={status}
     lastSavedAt={lastSavedAt}
     error={error}
     onRetry={save}
   />
   ```

### 4. `/src/app/(host)/editor/[guideId]/page.tsx` (변경 없음)
이미 `EditorLayout`을 사용하고 있어 별도 수정 불필요:
```typescript
<EditorLayout guideId={guideId} initialBlocks={guide.content_blocks || []} />
```

## 작동 플로우

```
사용자 액션 (블록 추가/수정/삭제)
    ↓
setBlocks() 호출
    ↓
useAutoSave가 blocks 변경 감지
    ↓
기존 디바운스 타이머 취소 + 새 타이머 시작 (2초)
    ↓
[2초 대기 중 추가 변경 발생하면 타이머 재시작]
    ↓
타이머 만료 → performSave() 실행
    ↓
status = "saving" + SaveStatusIndicator 업데이트
    ↓
PATCH /api/guides/[guideId] 호출
    ↓
성공: status = "saved", lastSavedAt 업데이트
실패: status = "error", error 객체 설정
    ↓
3초 후 status → "idle" (저장됨 표시 유지)
```

## API 엔드포인트

### PATCH /api/guides/[id]
- **파일**: `/src/app/api/guides/[id]/route.ts`
- **인증**: 필수 (Supabase auth)
- **권한**: 가이드 소유자만 수정 가능
- **Request Body**:
  ```typescript
  {
    content_blocks?: ContentBlock[];
    title?: string;
    wifi_ssid?: string | null;
    wifi_password?: string | null;
  }
  ```
- **Response**: `{ success: true, data: { guide: Guide } }`

## 핵심 기술

### 1. 디바운싱 (Debouncing)
```typescript
// 기존 타이머 취소
if (debounceTimer.current) {
  clearTimeout(debounceTimer.current);
}

// 새 타이머 시작
debounceTimer.current = setTimeout(() => {
  performSave(data);
}, debounceMs);
```

**효과**:
- 연속 입력 시 마지막 변경만 저장
- API 호출 횟수 최소화 (예: 10번 변경 → 1번 저장)

### 2. 저장 중 변경사항 대기열
```typescript
if (isSavingRef.current) {
  pendingDataRef.current = saveData; // 대기열에 추가
  return;
}
// ... 저장 로직 ...
finally {
  if (pendingDataRef.current) {
    const pendingData = pendingDataRef.current;
    pendingDataRef.current = null;
    performSave(pendingData); // 저장 완료 후 대기 데이터 저장
  }
}
```

**효과**:
- 저장 중에도 편집 가능
- 저장 완료 후 누락 없이 재저장

### 3. JSON 깊은 비교로 불필요한 저장 방지
```typescript
const currentData = JSON.stringify(data);
if (currentData === prevDataRef.current) {
  return; // 데이터 변경 없음 → 저장 스킵
}
```

### 4. 낙관적 업데이트 (Optimistic Update)
- 서버 응답을 기다리지 않고 UI 즉시 업데이트
- 저장 실패 시에만 에러 표시

## 테스트

### E2E 테스트 파일
`/e2e/auto-save.spec.ts`

**주요 시나리오**:
1. 블록 추가 후 2초 후 자동 저장
2. 연속 변경 시 마지막 변경만 저장
3. 저장 실패 시 재시도 버튼 표시
4. 저장 상태 표시 변화 (idle → saving → saved)
5. 블록 수정/삭제 후 자동 저장

**실행 방법**:
```bash
npm run test:e2e -- auto-save
```

## 사용자 경험 개선

### Before (수동 저장)
1. 블록 추가/수정
2. "저장" 버튼 클릭 필요
3. 저장 잊으면 데이터 손실 위험

### After (자동 저장)
1. 블록 추가/수정
2. 자동 저장 (사용자 액션 불필요)
3. 저장 상태 실시간 피드백
4. 에러 발생 시 명확한 안내

## 성능 최적화

### API 호출 최소화
- **Before**: 블록 10번 수정 → 10번 API 호출
- **After**: 블록 10번 수정 (2초 내) → 1번 API 호출
- **절감률**: 90% (디바운스 효과)

### 메모리 관리
- `useRef`로 타이머/플래그 관리 (재렌더링 방지)
- `useCallback`로 함수 메모이제이션
- cleanup 함수로 메모리 누수 방지

## 에러 처리

### 자동 처리되는 에러
- 401 Unauthorized → "로그인이 필요합니다"
- 403 Forbidden → "수정 권한이 없습니다"
- 404 Not Found → "가이드를 찾을 수 없습니다"
- 500 Server Error → "저장에 실패했습니다 (500)"
- Network Error → "저장에 실패했습니다"

### 사용자 액션
- "재시도" 버튼 클릭 → 즉시 재저장 (디바운스 없음)
- Ctrl+S (향후 구현) → 수동 저장

## 향후 개선 사항

### 1. Ctrl+S 단축키
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      save(); // 수동 저장
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [save]);
```

### 2. 오프라인 지원
- IndexedDB에 변경사항 저장
- 온라인 복귀 시 자동 동기화

### 3. 충돌 감지
- 다른 사용자가 동시 수정 시 경고
- 버전 관리로 충돌 해결

### 4. 저장 이력
- 변경 이력 추적
- "되돌리기" 기능

## 배포 체크리스트

- [x] useAutoSave 훅 구현
- [x] SaveStatusIndicator 컴포넌트 구현
- [x] EditorLayout 통합
- [x] API 엔드포인트 확인 (PATCH /api/guides/[id])
- [x] E2E 테스트 작성
- [ ] 실제 환경에서 테스트
- [ ] 사용자 피드백 수집

## 관련 문서
- **TRD**: `/docs/planning/02-trd.md#가이드-API`
- **API 문서**: `/src/app/api/guides/[id]/route.ts`
- **타입 정의**: `/src/types/index.ts`
