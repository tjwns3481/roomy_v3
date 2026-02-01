# API 통합 테스트 가이드

Roomy v3의 API 통합 테스트 스위트입니다.

## 개요

이 테스트는 실제 API 엔드포인트를 호출하여 통합 테스트를 수행합니다.
Vitest를 사용하며, 실제 서버가 실행 중이어야 합니다.

## 테스트 실행

```bash
# 통합 테스트 실행
npm run test tests/integration/

# watch 모드
npm run test tests/integration/ -- --watch

# 커버리지 포함
npm run test:coverage
```

## 테스트 구조

```
tests/
└── integration/
    ├── api.test.ts       # API 통합 테스트
    └── README.md         # 이 파일
```

## 테스트 시나리오

### 1. 인증 API
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인

### 2. 가이드 API
- `GET /api/guides` - 가이드 목록 조회
- `POST /api/guides` - 가이드 생성
- `GET /api/guides/:id` - 가이드 상세 조회
- `PUT /api/guides/:id` - 가이드 수정
- `POST /api/guides/:id/publish` - 가이드 게시

### 3. 스토리 API
- `GET /api/guides/:id/stories` - 스토리 목록 조회
- `POST /api/guides/:id/stories` - 스토리 생성
- `DELETE /api/stories/:id` - 스토리 삭제

### 4. AI 챗봇 API
- `POST /api/ai/chat` - 챗봇 메시지 전송
- 빈 메시지 에러 처리
- 긴 메시지 처리

### 5. 공개 가이드 API
- `GET /api/public/guides/:slug` - Slug로 가이드 조회

### 6. 관리자 API
- `GET /api/admin/stats` - 관리자 통계 조회

### 7. 에러 처리
- 404 - 존재하지 않는 엔드포인트
- 405 - 잘못된 HTTP 메소드
- 400 - 잘못된 JSON 형식

## 환경 설정

```bash
# .env.test 파일 생성
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=postgresql://test_user:test_pass@localhost:5432/roomy_test
```

## 테스트 작성 예시

```typescript
import { describe, it, expect } from 'vitest';

describe('가이드 API', () => {
  it('가이드 목록 조회', async () => {
    const response = await fetch('http://localhost:3000/api/guides', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });
});
```

## 주의사항

1. **서버 실행**: 테스트를 실행하기 전에 개발 서버가 실행 중이어야 합니다.
   ```bash
   npm run dev
   ```

2. **테스트 데이터**: 테스트는 실제 데이터베이스를 사용합니다. 테스트용 데이터베이스를 별도로 설정하는 것을 권장합니다.

3. **인증 토큰**: 일부 테스트는 인증이 필요합니다. 테스트 계정으로 로그인하여 토큰을 얻어야 합니다.

4. **순서 의존성**: 테스트는 가능한 한 독립적으로 작성해야 하지만, 일부 테스트는 이전 테스트에서 생성된 데이터를 사용할 수 있습니다.

5. **에러 처리**: API가 실패할 수 있는 경우를 고려하여 테스트를 작성하세요.

## 모범 사례

### 1. 테스트 격리
```typescript
describe('가이드 API', () => {
  let testGuideId: string;

  beforeEach(async () => {
    // 테스트용 가이드 생성
    testGuideId = await createTestGuide();
  });

  afterEach(async () => {
    // 테스트 데이터 정리
    await deleteTestGuide(testGuideId);
  });

  it('가이드 조회', async () => {
    // 테스트 로직
  });
});
```

### 2. 에러 상태 테스트
```typescript
it('존재하지 않는 가이드 조회 시 404', async () => {
  const response = await fetch(`${API_BASE_URL}/api/guides/nonexistent-id`);
  expect(response.status).toBe(404);
});
```

### 3. 인증 테스트
```typescript
it('인증 없이 보호된 엔드포인트 접근 시 401', async () => {
  const response = await fetch(`${API_BASE_URL}/api/guides`, {
    method: 'POST',
    // Authorization 헤더 없음
  });
  expect(response.status).toBe(401);
});
```

## 디버깅

```typescript
// 응답 로깅
const response = await fetch(url);
console.log('Status:', response.status);
console.log('Headers:', response.headers);
const data = await response.json();
console.log('Data:', data);
```

## CI/CD

```yaml
- name: Run integration tests
  run: |
    npm run dev &
    sleep 10
    npm run test tests/integration/
  env:
    DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
    NEXT_PUBLIC_API_URL: http://localhost:3000
```

## 추가 리소스

- [Vitest 공식 문서](https://vitest.dev/)
- [Fetch API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [HTTP 상태 코드](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
