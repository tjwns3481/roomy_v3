# E2E 테스트 가이드

Roomy v3의 E2E (End-to-End) 테스트 스위트입니다.

## 설치

```bash
# Playwright 설치
npm install -D @playwright/test

# 브라우저 설치
npx playwright install
```

## 테스트 실행

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

## 테스트 구조

```
e2e/
├── auth.spec.ts          # 인증 흐름 테스트
├── host-flow.spec.ts     # 호스트 흐름 테스트
├── guest-flow.spec.ts    # 게스트 흐름 테스트
├── chatbot.spec.ts       # AI 챗봇 테스트
├── admin.spec.ts         # 관리자 흐름 테스트
└── helpers/              # 테스트 헬퍼 함수
    ├── auth.ts           # 인증 헬퍼
    └── guide.ts          # 가이드 헬퍼
```

## 테스트 시나리오

### 1. 인증 흐름 (auth.spec.ts)
- 회원가입 → 자동 로그인 → 대시보드 리다이렉트
- 로그인 → 대시보드 이동
- 로그아웃
- 비인증 사용자 접근 제어

### 2. 호스트 흐름 (host-flow.spec.ts)
- 대시보드 접근 및 표시
- 가이드 생성 → 에디터 편집 → 게시
- 템플릿 페이지 접근 및 사용
- 설정 페이지 접근
- 가이드 삭제
- QR 코드 생성 및 다운로드

### 3. 게스트 흐름 (guest-flow.spec.ts)
- slug로 가이드 조회
- 블록 렌더링 확인
- Places/Rules 페이지 이동
- 스토리 뷰어 열기 및 네비게이션
- 챗봇 사용
- 모바일 반응형 확인
- 블록 타입별 렌더링
- 가이드 공유 기능

### 4. AI 챗봇 (chatbot.spec.ts)
- 챗봇 열기 → 질문 전송 → 응답 수신
- 다중 대화
- 챗봇 닫기 및 재오픈
- 로딩 상태 확인
- 에러 처리
- 최대 메시지 길이 제한
- 데모 페이지 독립 실행

### 5. 관리자 흐름 (admin.spec.ts)
- 관리자 로그인 및 대시보드
- 사용자 목록 조회
- 가이드 목록 조회 및 관리
- 통계 그래프 확인
- 가이드 강제 삭제
- 사용자 권한 변경
- 활동 로그 확인
- 시스템 설정

## 테스트 데이터

테스트는 다음과 같은 테스트 계정을 사용합니다:

```typescript
// 호스트 계정
const hostEmail = 'host@example.com';
const hostPassword = 'Host1234!@#$';

// 관리자 계정
const adminEmail = 'admin@example.com';
const adminPassword = 'Admin1234!@#$';

// 동적 생성 계정
const timestamp = Date.now();
const email = `test-${timestamp}@example.com`;
```

## 헬퍼 함수 사용

```typescript
import { login, signup, generateTestUser } from './helpers/auth';
import { createGuide, publishGuide, generateTestGuide } from './helpers/guide';

test('가이드 생성 테스트', async ({ page }) => {
  // 로그인
  const user = generateTestUser();
  await signup(page, user.email, user.password);

  // 가이드 생성
  const guide = generateTestGuide();
  await createGuide(page, guide.title, guide.slug);

  // 가이드 게시
  await publishGuide(page, guideId);
});
```

## 디버깅

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

## CI/CD

GitHub Actions 등의 CI 환경에서 실행 시:

```yaml
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

## 주의사항

1. **테스트 격리**: 각 테스트는 독립적으로 실행되어야 하며, 다른 테스트에 영향을 주지 않아야 합니다.

2. **타임아웃**: 네트워크 요청이 느린 경우 타임아웃을 적절히 설정하세요.

3. **데이터 정리**: 테스트 후 생성된 데이터는 정리해야 합니다.

4. **환경 변수**: 민감한 정보는 환경 변수로 관리하세요.

5. **병렬 실행**: 테스트가 병렬로 실행될 수 있도록 작성하세요.

## 트러블슈팅

### 브라우저 설치 실패
```bash
npx playwright install --force
```

### 포트 충돌
개발 서버가 이미 실행 중인지 확인하세요.

### 타임아웃 에러
`playwright.config.ts`에서 타임아웃 설정을 늘리세요.

```typescript
export default defineConfig({
  timeout: 60000, // 60초
});
```

## 추가 리소스

- [Playwright 공식 문서](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-test)
