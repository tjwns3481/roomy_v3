# Roomy v3 - TASKS.md (Domain-Guarded)

> 생성일: 2026-02-01
> 모드: Domain-Guarded (화면이 주도하되, 도메인이 방어한다)
> 총 태스크: 52개

---

## Interface Contract Validation

```
✅ 14/14 화면 검증 완료
⚠️ 권장사항: accommodation에 latitude, longitude 필드 추가 (detail-places용)
```

---

## Phase 0: 프로젝트 셋업

### P0-T0.1: 프로젝트 초기화
- **목표**: Next.js 15 + TypeScript + TailwindCSS 프로젝트 생성
- **산출물**:
  - package.json, tsconfig.json
  - tailwind.config.ts, postcss.config.js
  - .env.example
- **검증**: `npm run dev` 성공

### P0-T0.2: Supabase 연동
- **목표**: Supabase 클라이언트 설정 및 환경변수 구성
- **산출물**:
  - src/lib/supabase/client.ts
  - src/lib/supabase/server.ts
  - .env.local 가이드
- **검증**: Supabase 연결 테스트 통과

### P0-T0.3: 공통 UI 컴포넌트
- **목표**: specs/shared/components.yaml 기반 기본 UI 구현
- **산출물**:
  - src/components/ui/Button.tsx
  - src/components/ui/Input.tsx
  - src/components/ui/Card.tsx
  - src/components/ui/Modal.tsx
  - src/components/ui/Toast.tsx
  - src/components/ui/Badge.tsx
  - src/components/ui/Avatar.tsx
- **참조**: specs/shared/components.yaml, design/*.html

### P0-T0.4: 타입 정의
- **목표**: specs/shared/types.yaml 기반 TypeScript 타입 생성
- **산출물**:
  - src/types/user.ts
  - src/types/guide.ts
  - src/types/block.ts
  - src/types/story.ts
  - src/types/index.ts
- **참조**: specs/shared/types.yaml

---

## Phase 1: 인증 (Auth)

### P1-R1-T1: User Resource - DB 스키마
- **목표**: users 테이블 마이그레이션
- **산출물**: supabase/migrations/001_users.sql
- **필드**: id, email, name, role, avatar_url, phone, created_at, updated_at
- **참조**: specs/domain/resources.yaml#user

### P1-R1-T2: User Resource - RLS 정책
- **목표**: Row Level Security 설정
- **산출물**: supabase/migrations/002_users_rls.sql
- **정책**:
  - SELECT: 자기 자신만
  - UPDATE: 자기 자신만
  - Admin은 전체 접근

### P1-R1-T3: User Resource - API
- **목표**: 사용자 API 엔드포인트
- **산출물**:
  - src/app/api/auth/signup/route.ts
  - src/app/api/auth/login/route.ts
  - src/app/api/user/profile/route.ts
- **검증**: API 테스트 통과

### P1-S1-T1: Login 화면 UI
- **목표**: 로그인 페이지 구현
- **산출물**:
  - src/app/(auth)/login/page.tsx
  - src/components/auth/LoginForm.tsx
- **참조**: specs/screens/auth/login.yaml, design/04-login.html
- **의존**: P1-R1-T3

### P1-S1-T2: Login 화면 기능
- **목표**: 로그인 폼 제출 및 에러 처리
- **산출물**: src/hooks/useAuth.ts
- **의존**: P1-S1-T1

### P1-S2-T1: Signup 화면 UI
- **목표**: 회원가입 페이지 구현
- **산출물**:
  - src/app/(auth)/signup/page.tsx
  - src/components/auth/SignupForm.tsx
- **참조**: specs/screens/auth/signup.yaml, design/08-signup.html
- **의존**: P1-R1-T3

### P1-S2-T2: Signup 화면 기능
- **목표**: 회원가입 폼 유효성 검사 및 제출
- **의존**: P1-S2-T1

### P1-S1-V: Auth 연결점 검증
- **목표**: 로그인/회원가입 흐름 E2E 테스트
- **검증항목**:
  - [ ] 회원가입 → 자동 로그인
  - [ ] 로그인 → 대시보드 리다이렉트
  - [ ] 에러 메시지 표시
- **의존**: P1-S1-T2, P1-S2-T2

---

## Phase 2: 핵심 리소스 (Guide, Accommodation, Story)

### P2-R1-T1: Accommodation Resource - DB
- **목표**: accommodations 테이블 마이그레이션
- **산출물**: supabase/migrations/003_accommodations.sql
- **필드**: id, user_id, name, address, latitude, longitude, created_at, updated_at
- **참조**: specs/domain/resources.yaml#accommodation

### P2-R2-T1: Guide Resource - DB
- **목표**: guides 테이블 마이그레이션
- **산출물**: supabase/migrations/004_guides.sql
- **필드**: id, accommodation_id, slug, title, content_blocks(jsonb), wifi_ssid, wifi_password, is_published, view_count, created_at, updated_at
- **참조**: specs/domain/resources.yaml#guide

### P2-R2-T2: Guide Resource - RLS
- **목표**: guides RLS 정책
- **산출물**: supabase/migrations/005_guides_rls.sql
- **정책**:
  - SELECT: 공개된 가이드 또는 소유자
  - INSERT/UPDATE/DELETE: 소유자만

### P2-R2-T3: Guide Resource - API
- **목표**: 가이드 CRUD API
- **산출물**:
  - src/app/api/guides/route.ts (GET, POST)
  - src/app/api/guides/[id]/route.ts (GET, PATCH, DELETE)
  - src/app/api/guides/[id]/publish/route.ts (PATCH)
- **의존**: P2-R1-T1, P2-R2-T1

### P2-R3-T1: Story Resource - DB
- **목표**: stories 테이블 마이그레이션
- **산출물**: supabase/migrations/006_stories.sql
- **필드**: id, guide_id, media_url, media_type, order_index, label, created_at
- **참조**: specs/domain/resources.yaml#story

### P2-R3-T2: Story Resource - API
- **목표**: 스토리 CRUD API
- **산출물**:
  - src/app/api/guides/[id]/stories/route.ts
  - src/app/api/stories/[id]/route.ts
- **의존**: P2-R3-T1

---

## Phase 3: 호스트 화면 (Host Screens)

### P3-S1-T1: Dashboard 화면 UI
- **목표**: 호스트 대시보드 레이아웃 및 카드
- **산출물**:
  - src/app/(host)/dashboard/page.tsx
  - src/components/dashboard/GuideCard.tsx
  - src/components/dashboard/StatsCard.tsx
  - src/components/dashboard/EmptyState.tsx
- **참조**: specs/screens/host/dashboard.yaml, design/03-dashboard.html
- **data_requirements**: guide[id, title, slug, is_published, view_count, updated_at], user[id, name, email]
- **의존**: P2-R2-T3

### P3-S1-T2: Dashboard 기능
- **목표**: 가이드 목록 조회, 검색, 필터
- **산출물**: src/hooks/useGuides.ts
- **의존**: P3-S1-T1

### P3-S2-T1: Editor 화면 레이아웃
- **목표**: 블록 에디터 3단 레이아웃
- **산출물**:
  - src/app/(host)/editor/[guideId]/page.tsx
  - src/components/editor/EditorLayout.tsx
  - src/components/editor/Sidebar.tsx
  - src/components/editor/PreviewPanel.tsx
- **참조**: specs/screens/host/editor.yaml, design/01-block-editor.html
- **의존**: P2-R2-T3

### P3-S2-T2: Editor 블록 추가/삭제
- **목표**: 블록 CRUD 및 드래그앤드롭
- **산출물**:
  - src/components/editor/BlockList.tsx
  - src/components/editor/BlockItem.tsx
  - src/components/editor/AddBlockMenu.tsx
- **의존**: P3-S2-T1

### P3-S2-T3: Editor 블록 에디터 (Wifi, Rules)
- **목표**: Wifi, Rules 블록 에디터 구현
- **산출물**:
  - src/components/editor/blocks/WifiEditor.tsx
  - src/components/editor/blocks/RulesEditor.tsx
- **의존**: P3-S2-T2

### P3-S2-T4: Editor 블록 에디터 (Devices, Places)
- **목표**: Devices, Places 블록 에디터 구현
- **산출물**:
  - src/components/editor/blocks/DevicesEditor.tsx
  - src/components/editor/blocks/PlacesEditor.tsx
- **의존**: P3-S2-T2

### P3-S2-T5: Editor 블록 에디터 (Text, Gallery)
- **목표**: Text, Gallery 블록 에디터 구현
- **산출물**:
  - src/components/editor/blocks/TextEditor.tsx
  - src/components/editor/blocks/GalleryEditor.tsx
- **의존**: P3-S2-T2

### P3-S2-T6: Editor 자동저장
- **목표**: 디바운스 자동저장 구현
- **산출물**: src/hooks/useAutoSave.ts
- **의존**: P3-S2-T3, P3-S2-T4, P3-S2-T5

### P3-S3-T1: Template Select 화면
- **목표**: 템플릿 선택 페이지
- **산출물**:
  - src/app/(host)/templates/page.tsx
  - src/components/templates/TemplateCard.tsx
  - src/data/templates.ts
- **참조**: specs/screens/host/template-select.yaml, design/09-template-select.html
- **의존**: P2-R2-T3

### P3-S4-T1: Settings 화면
- **목표**: 사용자 설정 페이지
- **산출물**:
  - src/app/(host)/settings/page.tsx
  - src/components/settings/ProfileForm.tsx
- **참조**: specs/screens/host/settings.yaml, design/10-settings.html
- **의존**: P1-R1-T3

### P3-S5-T1: QR Modal
- **목표**: QR 코드 생성 및 공유 모달
- **산출물**:
  - src/components/dashboard/QRModal.tsx
  - src/lib/qrcode.ts
- **참조**: specs/screens/host/qr-modal.yaml, design/07-qr-modal.html
- **의존**: P3-S1-T1

### P3-S1-V: Host 화면 연결점 검증
- **목표**: 호스트 흐름 E2E 테스트
- **검증항목**:
  - [ ] 대시보드 → 에디터 이동
  - [ ] 블록 추가/편집/삭제
  - [ ] 자동저장 동작
  - [ ] QR 코드 생성
- **의존**: P3-S1-T2, P3-S2-T6, P3-S5-T1

---

## Phase 4: 게스트 화면 (Guest Screens)

### P4-R1-T1: Visit Resource - DB
- **목표**: visits 테이블 마이그레이션
- **산출물**: supabase/migrations/007_visits.sql
- **필드**: id, guide_id, visitor_ip, user_agent, created_at
- **참조**: specs/domain/resources.yaml#visit

### P4-S1-T1: Guest Main 화면 UI
- **목표**: 게스트 메인 뷰어 (모바일 퍼스트)
- **산출물**:
  - src/app/g/[slug]/page.tsx
  - src/components/guest/GuestLayout.tsx
  - src/components/guest/Header.tsx
  - src/components/guest/StoryBubbles.tsx
- **참조**: specs/screens/guest/main.yaml, design/02-guest-main.html
- **data_requirements**: guide[id, title, content_blocks, wifi_ssid, wifi_password], story[id, media_url, media_type, order_index]
- **의존**: P2-R2-T3, P2-R3-T2

### P4-S1-T2: Guest Main 블록 렌더러
- **목표**: 각 블록 타입별 렌더 컴포넌트
- **산출물**:
  - src/components/guest/blocks/WifiBlock.tsx
  - src/components/guest/blocks/RulesBlock.tsx
  - src/components/guest/blocks/DevicesBlock.tsx
  - src/components/guest/blocks/PlacesBlock.tsx
  - src/components/guest/blocks/TextBlock.tsx
  - src/components/guest/blocks/GalleryBlock.tsx
  - src/components/guest/BlockRenderer.tsx
- **의존**: P4-S1-T1

### P4-S2-T1: Story Viewer 화면
- **목표**: 스토리 전체화면 뷰어 (인스타 스타일)
- **산출물**:
  - src/components/guest/StoryViewer.tsx
  - src/components/guest/StoryProgress.tsx
- **참조**: specs/screens/guest/story-viewer.yaml, design/11-story-viewer.html
- **의존**: P4-S1-T1

### P4-S3-T1: Bottomsheet 컴포넌트
- **목표**: Wifi, Quick Actions 바텀시트
- **산출물**:
  - src/components/guest/WifiBottomsheet.tsx
  - src/components/guest/QuickActionsSheet.tsx
- **참조**: specs/screens/guest/bottomsheet.yaml, design/06-wifi-bottomsheet.html
- **의존**: P4-S1-T2

### P4-S4-T1: Detail Rules 화면
- **목표**: 이용안내 상세 페이지
- **산출물**: src/app/g/[slug]/rules/page.tsx
- **참조**: specs/screens/guest/detail-rules.yaml, design/12-house-rules.html
- **의존**: P4-S1-T2

### P4-S5-T1: Detail Places 화면
- **목표**: 주변 맛집 상세 (지도 포함)
- **산출물**:
  - src/app/g/[slug]/places/page.tsx
  - src/components/guest/MapView.tsx
- **참조**: specs/screens/guest/detail-places.yaml, design/13-local-map.html
- **의존**: P4-S1-T2

### P4-S1-V: Guest 화면 연결점 검증
- **목표**: 게스트 뷰어 E2E 테스트
- **검증항목**:
  - [ ] slug로 가이드 조회
  - [ ] 스토리 네비게이션
  - [ ] Wifi 복사 기능
  - [ ] 지도 연동
- **의존**: P4-S1-T2, P4-S2-T1, P4-S3-T1

---

## Phase 5: AI 챗봇

### P5-R1-T1: AI Conversation Resource - DB
- **목표**: ai_conversations 테이블 마이그레이션
- **산출물**: supabase/migrations/008_ai_conversations.sql
- **필드**: id, guide_id, session_id, question, answer, created_at
- **참조**: specs/domain/resources.yaml#ai_conversation

### P5-R1-T2: AI Conversation - Gemini 연동
- **목표**: Gemini API 클라이언트 및 RAG 구현
- **산출물**:
  - src/lib/gemini/client.ts
  - src/lib/gemini/rag.ts
  - src/app/api/ai/chat/route.ts
- **의존**: P5-R1-T1

### P5-S1-T1: AI Chatbot 화면
- **목표**: 챗봇 UI 구현
- **산출물**:
  - src/components/guest/AIChatbot.tsx
  - src/components/guest/ChatMessage.tsx
  - src/components/guest/ChatInput.tsx
- **참조**: specs/screens/guest/ai-chatbot.yaml, design/05-ai-chatbot.html
- **data_requirements**: guide[id, title, content_blocks], ai_conversation[id, question, answer, created_at]
- **의존**: P5-R1-T2

### P5-S1-T2: AI Chatbot 기능
- **목표**: 스트리밍 응답, 컨텍스트 관리
- **산출물**: src/hooks/useAIChat.ts
- **의존**: P5-S1-T1

### P5-S1-V: AI Chatbot 연결점 검증
- **목표**: AI 챗봇 E2E 테스트
- **검증항목**:
  - [ ] 질문 전송 및 응답
  - [ ] 가이드 컨텍스트 반영
  - [ ] 대화 기록 저장
- **의존**: P5-S1-T2

---

## Phase 6: 관리자 (Admin)

### P6-S1-T1: Admin Dashboard 화면 UI
- **목표**: 관리자 대시보드 구현
- **산출물**:
  - src/app/(admin)/page.tsx
  - src/app/(admin)/layout.tsx
  - src/components/admin/Sidebar.tsx
  - src/components/admin/StatsGrid.tsx
  - src/components/admin/ActivityTable.tsx
- **참조**: specs/screens/admin/dashboard.yaml, design/14-admin-dashboard.html
- **data_requirements**: user[count], guide[count, sum(view_count)], visit[count_today], ai_conversation[count_today]
- **의존**: P1-R1-T2 (admin role)

### P6-S1-T2: Admin Dashboard 차트
- **목표**: 통계 차트 구현
- **산출물**:
  - src/components/admin/SignupsChart.tsx
  - src/components/admin/GuideTypesChart.tsx
- **의존**: P6-S1-T1

### P6-S1-V: Admin 연결점 검증
- **목표**: 관리자 기능 테스트
- **검증항목**:
  - [ ] 관리자 전용 접근
  - [ ] 통계 데이터 표시
  - [ ] 메뉴 네비게이션
- **의존**: P6-S1-T2

---

## Phase 7: 최종 검증 및 배포

### P7-T1: 통합 테스트
- **목표**: 전체 흐름 E2E 테스트
- **검증항목**:
  - [ ] 회원가입 → 대시보드 → 가이드 생성 → 게스트 뷰
  - [ ] AI 챗봇 질문/응답
  - [ ] 관리자 통계 확인

### P7-T2: 성능 최적화
- **목표**: Lighthouse 점수 90+
- **항목**:
  - [ ] 이미지 최적화
  - [ ] 코드 스플리팅
  - [ ] SSR/SSG 적용

### P7-T3: Vercel 배포
- **목표**: 프로덕션 배포
- **산출물**:
  - vercel.json
  - 환경변수 설정
  - 도메인 연결

---

## 의존성 그래프

```
P0 (Setup)
  └─> P1 (Auth)
        ├─> P2 (Resources)
        │     ├─> P3 (Host)
        │     │     └─> P3-S1-V
        │     └─> P4 (Guest)
        │           └─> P5 (AI)
        │                 └─> P5-S1-V
        └─> P6 (Admin)
              └─> P6-S1-V

P7 (Final) <── All Phases
```

---

## 병렬 실행 가능 태스크

| Phase | 병렬 가능 |
|-------|----------|
| P0 | T0.1 → T0.2 → (T0.3 ∥ T0.4) |
| P1 | (R1-T1 → R1-T2 → R1-T3) → (S1-T1 ∥ S2-T1) |
| P2 | (R1-T1 ∥ R2-T1 ∥ R3-T1) → (R2-T2 ∥ R2-T3 ∥ R3-T2) |
| P3 | (S1-T1 ∥ S2-T1 ∥ S3-T1 ∥ S4-T1) → ... |
| P4 | S1-T1 → (S1-T2 ∥ S2-T1 ∥ S3-T1) → (S4-T1 ∥ S5-T1) |
| P5 | R1-T1 → R1-T2 → S1-T1 → S1-T2 |
| P6 | S1-T1 → S1-T2 |

---

## 진행 상황

| Phase | 상태 | 진행률 |
|-------|------|--------|
| P0: Setup | ⬜ | 0% |
| P1: Auth | ⬜ | 0% |
| P2: Resources | ⬜ | 0% |
| P3: Host | ⬜ | 0% |
| P4: Guest | ⬜ | 0% |
| P5: AI | ⬜ | 0% |
| P6: Admin | ⬜ | 0% |
| P7: Deploy | ⬜ | 0% |

**전체 진행률: 0%**
