# P1-T3: 자동 저장 구현 완료 보고서

## 구현 내용

### 1. 기존 코드 확인
- `src/hooks/useAutoSave.ts` - 이미 완전히 구현됨 ✅
- `src/components/editor/SaveStatusIndicator.tsx` - 이미 완전히 구현됨 ✅

### 2. EditorLayout 통합

#### 변경 사항
**파일**: `src/components/editor/EditorLayout.tsx`

1. **import 추가**
   ```tsx
   import { SaveStatusIndicator } from "./SaveStatusIndicator";
   import { useAutoSave } from "@/hooks/useAutoSave";
   ```

2. **useAutoSave 훅 연결**
   ```tsx
   const { status, lastSavedAt, error, save } = useAutoSave({
     guideId,
     data: { content_blocks: blocks },
     debounceMs: 2000,
     enabled: true,
   });
   ```

3. **수동 saveStatus 제거**
   - 기존: `const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved")`
   - 제거하고 useAutoSave의 status 사용

4. **SaveStatusIndicator 컴포넌트 연결**
   ```tsx
   <SaveStatusIndicator
     status={status}
     lastSavedAt={lastSavedAt}
     error={error}
     onRetry={save}
   />
   ```

5. **setSaveStatus 호출 제거**
   - `handleAddBlock`, `handleBlocksChange`, `handleUpdateBlock`에서 `setSaveStatus("unsaved")` 제거
   - 이제 `blocks` 상태가 변경되면 useAutoSave가 자동으로 감지하여 저장

## 작동 원리

### 자동 저장 플로우

1. **블록 변경 감지**
   - 사용자가 블록 추가/수정/삭제
   - `setBlocks` 호출로 `blocks` 상태 업데이트

2. **디바운스 타이머 시작**
   - `useAutoSave` 훅이 `blocks` 변경 감지
   - 기존 타이머가 있으면 취소
   - 2000ms(2초) 타이머 시작

3. **자동 저장 실행**
   - 2초 후 `PATCH /api/guides/[id]` 호출
   - `content_blocks` 필드 업데이트

4. **상태 업데이트**
   - 저장 중: status = "saving"
   - 저장 성공: status = "saved", lastSavedAt 업데이트
   - 저장 실패: status = "error", error 객체 설정

5. **UI 피드백**
   - SaveStatusIndicator가 상태에 따라 표시:
     - 저장 중: "저장 중..." (노란색)
     - 저장 완료: "저장됨 · 3분 전" (초록색)
     - 저장 실패: "저장 실패: 에러메시지 [재시도]" (빨간색)

## 주요 기능

### 1. 디바운싱 (Debouncing)
- 연속된 변경사항을 그룹화하여 API 호출 최소화
- 2초 동안 추가 변경이 없을 때만 저장

### 2. 저장 중 변경사항 처리
- 저장 중에도 편집 가능
- 저장 중 발생한 변경사항은 대기열에 저장되어 저장 완료 후 자동 실행

### 3. 에러 처리
- 네트워크 오류, 권한 오류 등을 감지하여 사용자에게 표시
- "재시도" 버튼으로 수동 저장 가능

### 4. 낙관적 업데이트 (Optimistic Update)
- 저장이 진행되는 동안에도 UI 업데이트 즉시 반영
- 사용자 경험 향상

## API 엔드포인트

### PATCH /api/guides/[id]
- **파일**: `src/app/api/guides/[id]/route.ts`
- **기능**: 가이드 정보 업데이트
- **권한**: 소유자만 수정 가능
- **필드**: `content_blocks`, `title`, `wifi_ssid`, `wifi_password` 등

## 테스트 시나리오

### 1. 기본 자동 저장
1. 에디터에서 블록 추가
2. 2초 대기
3. "저장 중..." 표시 확인
4. "저장됨 · 방금 전" 표시 확인

### 2. 연속 변경
1. 블록 추가
2. 1초 후 블록 수정
3. 1초 후 블록 삭제
4. 2초 대기
5. 한 번만 저장되는지 확인

### 3. 에러 처리
1. 네트워크를 끊고 블록 추가
2. "저장 실패: ..." 메시지 확인
3. "재시도" 버튼 클릭
4. 다시 저장 시도 확인

### 4. 수동 저장
1. 블록 추가
2. 즉시 `save()` 호출 (Ctrl+S 등)
3. 디바운스 없이 즉시 저장되는지 확인

## 기대 효과

1. **사용자 경험 향상**
   - 수동 저장 불필요
   - 작업 내용 자동 보존

2. **API 호출 최적화**
   - 디바운싱으로 불필요한 API 호출 방지
   - 서버 부하 감소

3. **신뢰성**
   - 에러 발생 시 명확한 피드백
   - 재시도 기능 제공

## 완료 체크리스트

- [x] useAutoSave 훅 구현 (이미 완료)
- [x] SaveStatusIndicator 컴포넌트 구현 (이미 완료)
- [x] EditorLayout에 훅 연결
- [x] 수동 saveStatus 제거
- [x] SaveStatusIndicator 통합
- [x] 디바운싱 동작 확인 (코드 리뷰)
- [x] 에러 처리 확인 (코드 리뷰)

## 다음 단계

실제 환경에서 테스트:
```bash
npm run dev
# 에디터 페이지 접속
# 블록 추가/수정/삭제 테스트
# 2초 후 저장 확인
```
