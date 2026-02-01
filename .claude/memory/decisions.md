# Roomy v3 - 결정 기록

## 형식

```markdown
### [YYYY-MM-DD] 결정 제목
- **배경**: 결정이 필요한 이유
- **선택지**:
  1. Option A - 장점/단점
  2. Option B - 장점/단점
- **결정**: 선택한 옵션
- **이유**: 선택 이유
```

---

## 기록

### [2026-02-01] Supabase 선택

- **배경**: 백엔드 인프라 선택 필요
- **선택지**:
  1. Firebase - 빠른 셋업, NoSQL
  2. Supabase - PostgreSQL, RLS, 오픈소스
  3. 직접 구축 - 유연성, 복잡성
- **결정**: Supabase
- **이유**: PostgreSQL 기반으로 관계형 데이터 처리 용이, RLS로 보안 강화, Auth/Storage 통합
