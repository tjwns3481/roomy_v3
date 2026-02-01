---
description: Next.js + Supabase 프로젝트의 인터페이스, 타입, 에이전트 간 일관성 검증
---

# Roomy v3 통합 검증

## 검증 항목

### 1. 타입 일관성

```bash
# TypeScript 타입 체크
npx tsc --noEmit

# Supabase 타입 생성
npx supabase gen types typescript --local > src/types/database.types.ts
```

### 2. API 계약 검증

| 검증 대상 | 방법 |
|----------|------|
| API 응답 형식 | Zod 스키마 검증 |
| 요청 파라미터 | Zod 스키마 검증 |
| 에러 코드 | 일관된 형식 확인 |

### 3. 화면-API 연결점

```
specs/screens/{screen}.yaml
  └── data_requirements
        └── API 엔드포인트와 매핑 확인
```

### 4. DB 스키마-타입 일치

```
supabase/migrations/*.sql
  └── src/types/database.types.ts
        └── 필드 일치 확인
```

## 실행 방법

```bash
# 전체 빌드 테스트
npm run build

# 타입 체크
npm run type-check

# 테스트 실행
npm run test
```

## 불일치 발견 시

1. 오케스트레이터에게 보고
2. 담당 에이전트 재호출
3. 수정 후 재검증
