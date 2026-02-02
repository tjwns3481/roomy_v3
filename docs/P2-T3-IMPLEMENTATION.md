# P2-T3 - 실시간 미리보기 동기화 구현

## 개요
폰 미리보기에서 실제 블록 데이터를 렌더링하여 편집 내용이 실시간으로 반영되도록 구현

## 구현 내용

### 1. PhonePreview 컴포넌트 생성
**파일**: `/src/components/editor/PhonePreview.tsx`

게스트가 실제로 보는 것과 동일한 UI로 블록을 렌더링하는 미리보기 컴포넌트

**주요 기능**:
- 블록 정렬 및 렌더링
- 모바일/데스크톱 모드 지원
- 블록 선택 시 하이라이트
- 빈 상태 메시지 표시
- 폰 노치 및 하단 바 UI

**사용 방법**:
```tsx
<PhonePreview
  blocks={blocks}
  title={title}
  deviceMode="mobile" // 또는 "desktop"
  slug="preview"
  selectedBlockId={selectedBlockId}
  onBlockSelect={handleSelectBlock}
/>
```

### 2. EditorLayout 업데이트
**파일**: `/src/components/editor/EditorLayout.tsx`

BlockList 대신 PhonePreview를 사용하여 실제 게스트 뷰 렌더링

**변경 사항**:
- `BlockList` 제거
- `PhonePreview` 추가
- 블록 삭제/복제 핸들러 추가
- PreviewPanel에 실제 블록 데이터 전달

### 3. PreviewPanel 개선
**파일**: `/src/components/editor/PreviewPanel.tsx`

BlockEditor를 사용하여 실제 블록 편집 가능

**주요 기능**:
- 선택된 블록의 BlockEditor 렌더링
- 블록 삭제/복제 버튼
- 실시간 데이터 업데이트

## 컴포넌트 구조

```
EditorLayout
├── Sidebar (블록 추가)
├── PhonePreview (중앙 미리보기)
│   └── BlockRenderer (게스트 뷰 블록)
│       ├── WifiBlock
│       ├── RulesBlock
│       ├── DevicesBlock
│       ├── PlacesBlock
│       ├── TextBlock
│       └── GalleryBlock
└── PreviewPanel (오른쪽 편집 패널)
    └── BlockEditor
        ├── WifiEditor
        ├── RulesEditor
        ├── DevicesEditor
        ├── PlacesEditor
        ├── TextEditor
        └── GalleryEditor
```

## 데이터 흐름

1. **블록 추가**:
   - Sidebar → `handleAddBlock` → `blocks` state 업데이트 → PhonePreview 렌더링

2. **블록 편집**:
   - PhonePreview 클릭 → `selectedBlockId` 업데이트 → PreviewPanel 표시
   - BlockEditor 입력 → `onChange` → `handleUpdateBlock` → `blocks` state 업데이트
   - PhonePreview 자동 재렌더링

3. **블록 삭제/복제**:
   - PreviewPanel 버튼 클릭 → `handleDeleteBlock` / `handleDuplicateBlock`
   - `blocks` state 업데이트 → PhonePreview 재렌더링

## 주요 특징

### 1. 실시간 동기화
- 블록 편집 시 debounce 없이 즉시 미리보기 반영
- React state 변경으로 자동 재렌더링
- 자동 저장은 별도로 2초 debounce 적용

### 2. 게스트 뷰 재사용
- `/components/guest/BlockRenderer.tsx` 재사용
- 게스트가 보는 것과 동일한 UI
- 일관된 사용자 경험

### 3. 디바이스 모드 전환
- 모바일 (375px) / 데스크톱 (1200px) 전환
- 폰 프레임 UI (노치, 하단 바)
- 반응형 레이아웃

### 4. 블록 선택 시각화
- 선택된 블록 하이라이트 (ring-2 ring-primary)
- 호버 시 ring-1 효과
- 편집 패널 자동 열림

## E2E 테스트

**파일**: `/e2e/editor-preview-sync.spec.ts`

**테스트 시나리오**:
1. 블록 추가 시 미리보기 즉시 반영
2. 블록 편집 시 실시간 업데이트
3. 블록 삭제 시 미리보기에서 제거
4. 텍스트 블록 편집 실시간 반영
5. 여러 블록 순서 변경
6. 모바일/데스크톱 모드 전환
7. 블록 복제 시 미리보기 추가
8. 빈 상태 메시지 표시

**실행**:
```bash
npm run test:e2e -- editor-preview-sync
```

## 성능 최적화

1. **메모이제이션**: 불필요한 재렌더링 방지 (향후 React.memo 적용 가능)
2. **자동 저장 분리**: 미리보기 업데이트와 API 저장 분리
3. **블록 정렬 최적화**: `useMemo`로 정렬된 블록 캐싱 가능

## 알려진 제약사항

1. **드래그 앤 드롭**: 현재 PhonePreview에서는 순서 변경 불가 (향후 구현 가능)
2. **확대/축소**: Zoom 기능 미구현 (UI만 존재)
3. **테마 설정**: 팔레트 버튼 미구현

## 향후 개선 사항

1. **드래그 앤 드롭 순서 변경**: PhonePreview에서 직접 블록 순서 변경
2. **키보드 단축키**: 블록 선택/삭제/복제 단축키
3. **실행 취소/다시 실행**: 편집 히스토리 관리
4. **멀티 선택**: 여러 블록 동시 편집/삭제
5. **블록 접기/펼치기**: 긴 콘텐츠 미리보기 최적화

## 관련 파일

- `/src/components/editor/PhonePreview.tsx` (신규)
- `/src/components/editor/EditorLayout.tsx` (수정)
- `/src/components/editor/PreviewPanel.tsx` (수정)
- `/src/components/editor/BlockEditor.tsx` (기존)
- `/src/components/guest/BlockRenderer.tsx` (재사용)
- `/e2e/editor-preview-sync.spec.ts` (신규)

## 완료 기준

- [x] PhonePreview 컴포넌트 생성
- [x] EditorLayout에 PhonePreview 통합
- [x] PreviewPanel에서 BlockEditor 사용
- [x] 블록 추가 시 미리보기 반영
- [x] 블록 편집 시 실시간 업데이트
- [x] 블록 삭제/복제 기능
- [x] 모바일/데스크톱 모드 전환
- [x] 블록 선택 시각화
- [x] E2E 테스트 작성

## 테스트 결과

- 빌드 상태: 미확인 (sign-in 페이지 타입 오류로 인한 실패)
- E2E 테스트: 미실행
- 수동 테스트: 필요

## 다음 단계

1. sign-in 페이지 타입 오류 수정
2. 개발 서버 실행 및 수동 테스트
3. E2E 테스트 실행 및 검증
4. 필요시 버그 수정

---

**작성일**: 2026-02-02
**담당자**: Frontend Specialist
**상태**: 구현 완료 (테스트 대기)
