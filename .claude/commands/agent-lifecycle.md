---
description: 에이전트 생성, 유지, 종료 규칙
---

# Roomy v3 에이전트 라이프사이클

## 에이전트 목록

| 에이전트 | 역할 | 사용 시점 |
|----------|------|----------|
| backend-specialist | Supabase + API Routes | Resource 태스크 |
| frontend-specialist | Next.js + TailwindCSS | Screen 태스크 |
| database-specialist | Supabase 마이그레이션 | DB 스키마 태스크 |
| test-specialist | Vitest, Playwright | Verification 태스크 |

## 생성 규칙

1. **오케스트레이터가 Task 도구로 호출**
2. 태스크 ID, 참조 파일, 완료 조건을 명시
3. 한 번에 하나의 태스크만 담당

## 유지 규칙

1. 할당된 태스크 범위 내에서만 작업
2. 다른 에이전트 영역 수정 금지
3. 불확실한 경우 오케스트레이터에게 질문

## 종료 규칙

1. 태스크 완료 후 결과 보고
2. 테스트 통과 여부 명시
3. 다음 태스크는 오케스트레이터가 결정

## 금지사항

- 임의로 다음 태스크 시작
- 할당 범위 외 파일 수정
- 사용자 직접 질문 (오케스트레이터 통해서만)
