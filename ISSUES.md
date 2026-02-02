# 발견된 이슈 목록

## UI/UX 이슈

### 1. 데모 버튼 문제
- **위치**: 메인 페이지 "데모 보기" 버튼
- **문제**: `/g/demo` 링크가 DB에 demo 가이드가 없어서 404 발생
- **해결**:
  - `/demo` 정적 페이지 생성 (`src/app/demo/page.tsx`)
  - 메인 페이지 링크 `/g/demo` → `/demo`로 변경
- **상태**: ✅ 수정 완료

### 2. 가이드 만들기 문제
- **위치**: 대시보드 "새 가이드" 버튼
- **기능**: `/templates` 페이지로 이동
- **상태**: 정상 작동 (확인 필요)

### 3. 뒤로가기 문제
- **위치**: 에디터 페이지
- **문제**: 뒤로가기 버튼에 onClick 핸들러가 없었음
- **상태**: ✅ 수정 완료 (EditorLayout.tsx에 handleGoBack 연결)

### 4. Roomy 로고 버튼 홈 이동 안됨
- **위치**: 헤더 Roomy 로고
- **문제**: 클릭해도 홈(`/`)으로 이동하지 않음
- **상태**: ✅ 수정 완료 (dashboard/page.tsx에 Link 컴포넌트 적용)

---

## 완료된 수정사항

### 색상 수정 (완료)
- `blue-500` → `primary` (#0d7ff2) 변경 완료
- 30개 이상 파일 수정
- `src/app/page.tsx` 메인 페이지도 blue → primary 색상 수정

### 다크모드 → 라이트모드 (완료)
- `globals.css`에 `@custom-variant dark` 추가
- `layout.tsx`에 `className="light"` 추가
- `src/app/page.tsx` 메인 페이지 dark mode 클래스 제거
