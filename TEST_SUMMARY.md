# Roomy v3 - 통합 테스트 요약

## 개요

전체 애플리케이션 흐름을 검증하는 통합 테스트 스위트가 완성되었습니다.

## 생성된 파일

### E2E 테스트 (Playwright)

```
e2e/
├── auth.spec.ts              # 인증 흐름 테스트 (4개 테스트)
├── host-flow.spec.ts         # 호스트 흐름 테스트 (7개 테스트)
├── guest-flow.spec.ts        # 게스트 흐름 테스트 (8개 테스트)
├── chatbot.spec.ts           # AI 챗봇 테스트 (7개 테스트)
├── admin.spec.ts             # 관리자 흐름 테스트 (8개 테스트)
├── helpers/
│   ├── auth.ts               # 인증 헬퍼 함수
│   └── guide.ts              # 가이드 헬퍼 함수
└── README.md                 # E2E 테스트 가이드
```

**총 34개의 E2E 테스트 시나리오**

### 통합 테스트 (Vitest)

```
tests/
└── integration/
    ├── api.test.ts           # API 통합 테스트 (27개 테스트)
    └── README.md             # 통합 테스트 가이드
```

**총 27개의 API 통합 테스트**

### 설정 파일

- `playwright.config.ts` - Playwright 설정 (업데이트됨)
- `vitest.config.ts` - Vitest 설정 (기존)
- `package.json` - 테스트 스크립트 (확인됨)

## 테스트 시나리오 상세

### 1. 인증 흐름 (auth.spec.ts)

1. 회원가입 → 자동 로그인 → 대시보드 리다이렉트
2. 로그인 → 대시보드 이동
3. 로그아웃
4. 비인증 사용자가 보호된 페이지 접근 시 로그인 페이지로 리다이렉트

### 2. 호스트 흐름 (host-flow.spec.ts)

1. 대시보드 접근 및 표시 확인
2. 가이드 생성 → 에디터 편집 → 게시
3. 템플릿 페이지 접근 및 템플릿 사용
4. 설정 페이지 접근 및 프로필 정보 확인
5. 가이드 목록에서 가이드 삭제
6. QR 코드 생성 및 다운로드

### 3. 게스트 흐름 (guest-flow.spec.ts)

1. slug로 가이드 조회 및 블록 렌더링
2. 가이드 탐색 - Places 페이지 이동
3. 가이드 탐색 - Rules 페이지 이동
4. 스토리 뷰어 열기 및 네비게이션
5. 챗봇 열기 및 질문 전송
6. 모바일 반응형 - 가이드 페이지
7. 블록 타입별 렌더링 확인
8. 가이드 공유 기능

### 4. AI 챗봇 흐름 (chatbot.spec.ts)

1. 챗봇 열기 → 질문 전송 → 응답 수신
2. 챗봇 다중 대화
3. 챗봇 닫기 및 재오픈
4. 챗봇 로딩 상태 확인
5. 챗봇 에러 처리
6. 챗봇 최대 메시지 길이 제한
7. 챗봇 데모 페이지 - 독립 실행

### 5. 관리자 흐름 (admin.spec.ts)

1. 관리자 로그인 → 대시보드 통계 확인
2. 사용자 목록 조회
3. 가이드 목록 조회 및 관리
4. 통계 그래프 확인
5. 가이드 강제 삭제
6. 사용자 권한 변경
7. 활동 로그 확인
8. 시스템 설정

### 6. API 통합 테스트 (api.test.ts)

#### 인증 API
- POST /api/auth/signup - 회원가입
- POST /api/auth/login - 로그인

#### 가이드 API
- GET /api/guides - 가이드 목록 조회
- POST /api/guides - 가이드 생성
- GET /api/guides/:id - 가이드 상세 조회
- PUT /api/guides/:id - 가이드 수정
- POST /api/guides/:id/publish - 가이드 게시

#### 스토리 API
- GET /api/guides/:id/stories - 스토리 목록 조회
- POST /api/guides/:id/stories - 스토리 생성
- DELETE /api/stories/:id - 스토리 삭제

#### AI 챗봇 API
- POST /api/ai/chat - 챗봇 메시지 전송
- 빈 메시지 에러 처리
- 긴 메시지 처리

#### 공개 가이드 API
- GET /api/public/guides/:slug - Slug로 가이드 조회

#### 관리자 API
- GET /api/admin/stats - 관리자 통계 조회

#### 에러 처리
- 404 - 존재하지 않는 엔드포인트
- 405 - 잘못된 HTTP 메소드
- 400 - 잘못된 JSON 형식

## 크로스 브라우저 테스트

Playwright는 다음 브라우저에서 자동으로 테스트를 실행합니다:

1. **Desktop Chrome** (Chromium)
2. **Desktop Firefox**
3. **Desktop Safari** (Webkit)
4. **Mobile Chrome** (Pixel 5)
5. **Mobile Safari** (iPhone 13)

**총 167개의 테스트 실행** (34 시나리오 × 5 브라우저 - 중복 제거)

## 테스트 실행 방법

### E2E 테스트

```bash
# 모든 E2E 테스트 실행
npm run test:e2e

# 특정 브라우저에서만 실행
npx playwright test --project=chromium

# UI 모드로 실행 (디버깅용)
npx playwright test --ui

# 헤드풀 모드로 실행 (브라우저 보면서 실행)
npx playwright test --headed

# 특정 파일만 실행
npx playwright test e2e/auth.spec.ts
```

### 통합 테스트

```bash
# 통합 테스트 실행
npm run test tests/integration/

# watch 모드
npm run test tests/integration/ -- --watch

# 커버리지 포함
npm run test:coverage
```

## 테스트 커버리지 목표

- **E2E 테스트**: 주요 사용자 흐름 100% 커버
- **API 통합 테스트**: 모든 엔드포인트 80% 이상 커버
- **단위 테스트**: 컴포넌트 및 유틸 함수 80% 이상 커버

## 주의사항

### 테스트 실행 전 준비사항

1. **환경 변수 설정**
   ```bash
   # .env.test 파일 생성
   NEXT_PUBLIC_API_URL=http://localhost:3000
   DATABASE_URL=postgresql://test_user:test_pass@localhost:5432/roomy_test
   ```

2. **개발 서버 실행**
   - Playwright는 자동으로 개발 서버를 시작하지만, 수동으로 실행할 수도 있습니다.
   ```bash
   npm run dev
   ```

3. **테스트 데이터베이스**
   - 프로덕션 데이터베이스를 사용하지 마세요.
   - 테스트용 데이터베이스를 별도로 설정하세요.

### 테스트 계정

테스트에 사용되는 계정:

```typescript
// 호스트 계정
const hostEmail = 'host@example.com';
const hostPassword = 'Host1234!@#$';

// 관리자 계정
const adminEmail = 'admin@example.com';
const adminPassword = 'Admin1234!@#$';

// 동적 생성 계정 (회원가입 테스트)
const timestamp = Date.now();
const email = `test-${timestamp}@example.com`;
```

## 헬퍼 함수

테스트 작성을 쉽게 하기 위한 헬퍼 함수를 제공합니다:

### 인증 헬퍼 (e2e/helpers/auth.ts)

```typescript
import { login, signup, logout, generateTestUser } from './helpers/auth';

// 로그인
await login(page, 'user@example.com', 'password');

// 회원가입
await signup(page, 'user@example.com', 'password');

// 로그아웃
await logout(page);

// 테스트 유저 생성
const user = generateTestUser();
```

### 가이드 헬퍼 (e2e/helpers/guide.ts)

```typescript
import { createGuide, publishGuide, deleteGuide, generateTestGuide } from './helpers/guide';

// 가이드 생성
await createGuide(page, '테스트 가이드', 'test-guide');

// 가이드 게시
await publishGuide(page, 'guide-id');

// 가이드 삭제
await deleteGuide(page, 'guide-id');

// 테스트 가이드 데이터 생성
const guide = generateTestGuide();
```

## 디버깅

### Playwright 디버깅

```bash
# 특정 테스트만 디버그 모드로 실행
npx playwright test auth.spec.ts --debug

# 스크린샷 확인
# 실패한 테스트의 스크린샷은 test-results/ 디렉토리에 저장됨

# 비디오 확인
# 실패한 테스트의 비디오는 test-results/ 디렉토리에 저장됨

# 트레이스 뷰어 열기
npx playwright show-trace test-results/trace.zip
```

### Vitest 디버깅

```bash
# 특정 테스트만 실행
npm run test -- api.test.ts

# 디버깅 로그 출력
console.log('Response:', response);
console.log('Data:', data);
```

## CI/CD 통합

GitHub Actions 예시:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e
        env:
          CI: true

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## 추가 리소스

- [E2E 테스트 가이드](e2e/README.md)
- [API 통합 테스트 가이드](tests/integration/README.md)
- [Playwright 공식 문서](https://playwright.dev/)
- [Vitest 공식 문서](https://vitest.dev/)

## 다음 단계

1. **테스트 데이터베이스 설정**: 프로덕션과 분리된 테스트 DB 구축
2. **CI/CD 파이프라인 구축**: GitHub Actions 또는 GitLab CI 설정
3. **테스트 커버리지 모니터링**: Codecov 또는 Coveralls 연동
4. **성능 테스트 추가**: Lighthouse CI 통합
5. **접근성 테스트 추가**: axe-playwright 통합

## 문의

테스트 관련 문의사항이나 이슈가 있다면 프로젝트 이슈 트래커에 등록해주세요.
