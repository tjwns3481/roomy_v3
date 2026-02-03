# Roomy v3 - CLAUDE.md

## 프로젝트 개요
- **이름**: Roomy v3
- **스택**: Next.js 15 + TypeScript + TailwindCSS + Supabase
- **목적**: 숙박 가이드 관리 플랫폼

## 진행 상황
- Phase 0: ✅ 완료
- Phase 1: ✅ 완료
- Phase 2: ✅ 완료
- Phase 3: ✅ 완료
- Phase 4: ✅ 완료
- Phase 5: ✅ 완료
- Phase 6: ✅ 완료
- Phase 7: ✅ 완료

## 🎉 프로젝트 완료!

## 완료된 태스크
- P0-T0.1 ~ P0-T0.4: 프로젝트 셋업
- P1-R1-T1 ~ P1-S1-V: 인증 시스템
- P2-R1-T1 ~ P2-R3-T2: 핵심 리소스 (Guide, Accommodation, Story)
- P3-S1-T1 ~ P3-S1-V: 호스트 화면 (Dashboard, Editor, Templates, Settings, QR)
- P1-T3: 에디터 라이브 업데이트 (속성 패널 ↔ 미리보기 즉시 반영) ✅

### UI/UX 개선 작업 (26개 항목) ✅
**Phase 1: 초기화 및 기본 설정**
- P1-T1: 가이드 생성 시 초기 이름 "새 가이드"로 변경 ✅
- P1-T2: 히어로 섹션 초기화, PREMIUM STAY 삭제, 이미지 업로드 방식 ✅
- P1-T3: 모든 이미지 URL을 파일 업로드로 변경 ✅
- P1-T4: 스토리 관리 초기 상태 빈 배열 ✅
- P1-T5: 내 가이드 목록 초기화 (샘플 데이터 제거) ✅

**Phase 2: 에디터 기능 수정**
- P2-T1: 블록 드래그 추가 기능 삭제 (클릭만 사용) ✅
- P2-T2: 블록 복사 기능 삭제 ✅
- P2-T3: Zoom in-out 기능 삭제 ✅
- P2-T4: 하단 메뉴바 삭제 ✅
- P2-T5: 핸드폰 프레임 좌측 상단 로고 삭제 ✅
- P2-T6: MO/PC 버튼 개선 (PC 모드 레이아웃 확대) ✅

**Phase 3: 기능 동작 수정**
- P3-T1: 미리보기 버튼 수정 ✅
- P3-T2: 테마 버튼 동작 수정 (ThemePanel 연동) ✅
- P3-T3: 설정 초기화 버튼 수정 ✅
- P3-T4: 동영상 기능 수정 (YouTube/Vimeo embed 변환) ✅
- P3-T5: 연락처 기능 확인 완료 ✅
- P3-T6: 갤러리 이미지 에러 수정 ✅

**Phase 4: UI 개선**
- P4-T1: Wi-Fi 네트워크 블록 UI 개선 (그라데이션, 모던 디자인) ✅
- P4-T2: 시설 안내 블록 수정 (커스텀 제목 지원) ✅
- P4-T3: 템플릿 선택 화면 UI 전면 수정 ✅
- P4-T4: Roomy 로고 텍스트로 변경 (아이콘 제거) ✅

**Phase 5: 네비게이션 및 발행**
- P5-T1: 대시보드 경로 /dashboard로 수정 ✅
- P5-T2: 발행 테스트 기능 추가 (URL 알림) ✅
- P5-T3: 빈 페이지 시작 에러 수정 ✅
- P5-T4: 게스트 URL /g → /stay로 변경 ✅

**Phase 6: 지도 및 다크모드**
- P6-T1: 카카오맵 API 적용 (지도 블록, Geocoding) ✅
- P6-T2: 다크모드 기능 (전역 테마, localStorage 연동) ✅

## 실패한 태스크
(없음)

## Lessons Learned
(추후 기록)

## 주요 경로
- `src/app/` - Next.js App Router
- `src/components/` - UI 컴포넌트
- `src/lib/supabase/` - Supabase 클라이언트
- `supabase/migrations/` - DB 마이그레이션
