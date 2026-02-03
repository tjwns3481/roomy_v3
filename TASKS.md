# Roomy v3 - UI/UX 개선 태스크

## 개요
- **총 태스크**: 26개
- **목표**: 에디터 및 게스트 뷰 UI/UX 전면 개선
- **Worktree**: master (직접 작업)

---

## Phase 1: 초기화 및 기본 설정 개선 (P1)

### P1-T1: 가이드 생성 시 초기 이름 변경 ✅
- **담당**: frontend-specialist
- **설명**: 가이드 생성 시 "제주 오션 뷰 풀빌라" → "새 가이드"로 변경
- **파일**:
  - `src/app/(host)/editor/[guideId]/page.tsx`
  - `src/data/templates.ts`

### P1-T2: 히어로 섹션 초기화 및 이미지 업로드 ✅
- **담당**: frontend-specialist
- **설명**:
  - 히어로 제목 초기값 변경 (빈 값 또는 기본값)
  - "PREMIUM STAY" 삭제
  - 이미지 URL 입력 → 파일 업로드 방식으로 전환
- **파일**:
  - `src/components/editor/EditorLayout.tsx`
  - `src/components/editor/properties/HeroProperties.tsx`
  - `src/components/editor/EditorPhonePreview.tsx`

### P1-T3: 모든 이미지 URL을 파일 업로드로 변경 ✅
- **담당**: frontend-specialist
- **의존성**: P1-T2
- **설명**: 갤러리, 이미지 블록 등 모든 이미지 입력을 파일 업로드로 통일
- **파일**:
  - `src/components/editor/properties/ImageProperties.tsx`
  - `src/components/editor/properties/GalleryProperties.tsx`
  - `src/components/editor/blocks/GalleryEditor.tsx`

### P1-T4: 스토리 관리 초기화 ✅
- **담당**: frontend-specialist
- **설명**: 스토리 관리에서 초기 스토리를 빈 상태로 시작
- **파일**:
  - `src/app/(host)/editor/[guideId]/page.tsx`
  - `src/components/editor/StoryEditor.tsx`

### P1-T5: 내 가이드 목록 초기화 ✅
- **담당**: frontend-specialist
- **설명**: 대시보드의 가이드 목록을 빈 상태로 시작 (샘플 데이터 제거)
- **파일**: `src/app/(host)/dashboard/page.tsx`

---

## Phase 2: 에디터 기능 수정 (P2)

### P2-T1: 블록 드래그 추가 기능 삭제 ✅
- **담당**: frontend-specialist
- **설명**: 왼쪽 블록 드래그 시 추가 기능 삭제 (클릭으로만 추가)
- **파일**: `src/components/editor/Sidebar.tsx`

### P2-T2: 블록 복사 기능 삭제 ✅
- **담당**: frontend-specialist
- **설명**: 블록 복사/복제 버튼 및 기능 제거
- **파일**:
  - `src/components/editor/PropertyPanel.tsx`
  - `src/components/editor/EditorPhonePreview.tsx`

### P2-T3: Zoom in-out 기능 삭제 ✅
- **담당**: frontend-specialist
- **설명**: 줌 기능 UI 및 로직 제거
- **파일**: `src/components/editor/EditorLayout.tsx`

### P2-T4: 하단 메뉴바 삭제 ✅
- **담당**: frontend-specialist
- **설명**: 에디터 미리보기의 하단 네비게이션 제거
- **파일**:
  - `src/components/editor/EditorPhonePreview.tsx`
  - `src/components/editor/preview/EditorBottomNav.tsx`

### P2-T5: 핸드폰 프레임 좌측 상단 로고 삭제 ✅
- **담당**: frontend-specialist
- **설명**: 미리보기 폰 프레임의 Roomy 로고 제거
- **파일**: `src/components/editor/EditorPhonePreview.tsx`

### P2-T6: MO/PC 버튼 개선 ✅
- **담당**: frontend-specialist
- **설명**: PC 모드 선택 시 레이아웃이 실제로 PC 스타일로 변경되도록 수정
- **파일**: `src/components/editor/EditorLayout.tsx`

---

## Phase 3: 기능 동작 수정 (P3)

### P3-T1: 미리보기 버튼 수정 ✅
- **담당**: frontend-specialist
- **설명**: 상단 미리보기 버튼 클릭 시 미리보기가 정상 동작하도록 수정
- **파일**: `src/components/editor/EditorLayout.tsx`

### P3-T2: 테마 버튼 동작 수정 ✅
- **담당**: frontend-specialist
- **설명**: 상단 미리보기 왼쪽 테마 버튼이 정상 동작하도록 수정
- **파일**:
  - `src/components/editor/EditorLayout.tsx`
  - `src/components/editor/ThemePanel.tsx`

### P3-T3: 설정 초기화 버튼 수정 ✅
- **담당**: frontend-specialist
- **설명**: 설정 초기화 버튼이 정상 동작하도록 수정
- **파일**: `src/components/editor/ThemePanel.tsx`

### P3-T4: 동영상 기능 수정 ✅
- **담당**: frontend-specialist
- **설명**: 비디오 블록 기능이 정상 동작하도록 수정
- **파일**:
  - `src/components/editor/properties/VideoProperties.tsx`
  - `src/components/guest/blocks/VideoBlock.tsx`

### P3-T5: 연락처 기능 수정 ✅
- **담당**: frontend-specialist
- **설명**: 연락처 블록 기능이 정상 동작하도록 수정
- **파일**:
  - `src/components/editor/properties/ContactProperties.tsx`
  - `src/components/guest/blocks/ContactBlock.tsx`

### P3-T6: 갤러리 이미지 에러 수정 ✅
- **담당**: frontend-specialist
- **설명**: 갤러리 이미지 목록 추가 시 발생하는 에러 수정
- **파일**:
  - `src/components/editor/properties/GalleryProperties.tsx`
  - `src/components/editor/blocks/GalleryEditor.tsx`

---

## Phase 4: UI 개선 (P4)

### P4-T1: Wi-Fi 네트워크 블록 UI 개선 ✅
- **담당**: frontend-specialist
- **설명**: Wi-Fi 블록 UI를 더 세련되게 개선
- **파일**:
  - `src/components/guest/blocks/WifiBlock.tsx`
  - `src/components/editor/blocks/WifiEditor.tsx`

### P4-T2: 시설 안내 블록 수정 ✅
- **담당**: frontend-specialist
- **설명**:
  - "시설 안내" 추가 시 "기기 안내"가 되는 문제 수정
  - "가전제품 사용법" → 호스트가 커스텀 가능하도록 수정
- **파일**:
  - `src/components/editor/Sidebar.tsx`
  - `src/components/editor/blocks/DevicesEditor.tsx`
  - `src/data/defaultBlockData.ts`

### P4-T3: 템플릿 선택 화면 UI 전면 수정 ✅
- **담당**: frontend-specialist
- **설명**: /templates 페이지 UI 전체 개선
- **파일**: `src/app/(host)/templates/page.tsx`

### P4-T4: Roomy 로고 텍스트로 변경 ✅
- **담당**: frontend-specialist
- **설명**: 모든 페이지에서 Roomy 집 아이콘 로고를 "Roomy" 텍스트로 대체
- **파일**:
  - `src/components/editor/EditorLayout.tsx`
  - `src/components/guest/Header.tsx`
  - 기타 로고 사용 컴포넌트

---

## Phase 5: 네비게이션 및 발행 (P5)

### P5-T1: 대시보드 경로 수정 ✅
- **담당**: frontend-specialist
- **설명**: /host/dashboard → /dashboard로 변경 (기존 경로 복원)
- **파일**:
  - `src/app/(host)/` 폴더 구조 확인
  - 관련 링크/네비게이션 수정

### P5-T2: 발행 테스트 기능 추가 ✅
- **담당**: frontend-specialist
- **설명**: 저장 후 발행 시 실제 발행 확인 가능한 기능 추가
- **파일**: `src/components/editor/EditorLayout.tsx`

### P5-T3: 빈 페이지 시작 에러 수정 ✅
- **담당**: frontend-specialist
- **설명**: 템플릿 선택에서 "빈 페이지로 시작하기" 클릭 시 에러 수정
- **파일**: `src/app/(host)/templates/page.tsx`

### P5-T4: 게스트 URL 경로 변경 ✅
- **담당**: frontend-specialist
- **설명**:
  - /g/[slug] → /stay/[slug] 또는 /view/[slug]로 변경
  - "g" 대신 의미 있는 영단어 사용
- **파일**:
  - `src/app/g/` 폴더명 변경
  - 관련 링크 모두 수정

---

## Phase 6: 지도 및 다크모드 (P6)

### P6-T1: 지도 블록에 카카오맵 API 적용 ✅
- **담당**: frontend-specialist
- **설명**:
  - 지도 블록에 실제 카카오맵 API 사용
  - .env의 KAKAO_MAP_KEY 활용
- **파일**:
  - `src/components/guest/blocks/MapBlock.tsx`
  - `src/components/editor/properties/MapProperties.tsx`

### P6-T2: 다크모드 기능 추가 ✅
- **담당**: frontend-specialist
- **설명**:
  - 사용자가 직접 다크모드 컨트롤 가능
  - 모든 페이지에 다크모드 적용
- **파일**:
  - `src/app/layout.tsx`
  - `src/components/ui/ThemeToggle.tsx` (새로 생성)
  - 관련 모든 페이지 컴포넌트

---

## 진행 상황

| Phase | 태스크 | 완료 | 진행률 |
|-------|--------|------|--------|
| P1 | 5 | 5 | 100% |
| P2 | 6 | 6 | 100% |
| P3 | 6 | 6 | 100% |
| P4 | 4 | 4 | 100% |
| P5 | 4 | 4 | 100% |
| P6 | 2 | 2 | 100% |
| **총계** | **27** | **27** | **100%** |

---

## 실패한 태스크
(없음)

## Lessons Learned
(작업 중 기록 예정)
