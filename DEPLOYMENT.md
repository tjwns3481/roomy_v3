# Roomy v3 - Deployment Guide

## Prerequisites

1. **Vercel Account**: https://vercel.com/signup
2. **Supabase Project**: Already configured
3. **Google AI API Key**: For Gemini chatbot

## 1. Vercel 프로젝트 생성

### Option A: GitHub 연동 (권장)

1. Vercel 대시보드에서 "Add New Project" 클릭
2. GitHub 저장소 선택 (roomy_v3)
3. Framework Preset: Next.js (자동 감지)
4. Root Directory: `./` (기본값)
5. Build & Development Settings:
   - Build Command: `npm run build` (기본값)
   - Output Directory: `.next` (기본값)
   - Install Command: `npm install` (기본값)

### Option B: Vercel CLI

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 디렉토리에서 배포
cd C:\Users\zmzmv\Desktop\workspace\vibe\roomy_v3\worktree\phase-7-deploy
vercel

# 프로덕션 배포
vercel --prod
```

## 2. 환경변수 설정

Vercel 대시보드 > Project Settings > Environment Variables

### Required Variables

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` (⚠️ Secret) | Production |
| `GOOGLE_AI_API_KEY` | `AIzaSy...` (⚠️ Secret) | Production, Preview |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Production |

### CLI로 환경변수 설정

```bash
# .env.local 파일을 기반으로 일괄 설정
vercel env pull .env.local

# 또는 개별 설정
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GOOGLE_AI_API_KEY
vercel env add NEXT_PUBLIC_APP_URL
```

## 3. Supabase 설정 확인

### 3.1 Authentication URLs 업데이트

Supabase Dashboard > Authentication > URL Configuration

- **Site URL**: `https://your-domain.vercel.app`
- **Redirect URLs** (추가):
  ```
  https://your-domain.vercel.app/auth/callback
  https://your-domain.vercel.app
  ```

### 3.2 RLS 정책 검증

```sql
-- RLS가 모든 테이블에 활성화되어 있는지 확인
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';

-- 정책 목록 확인
SELECT * FROM pg_policies;
```

### 3.3 CORS 설정 (Optional)

Supabase Dashboard > Settings > API

- Allowed Origins에 Vercel 도메인 추가:
  ```
  https://your-domain.vercel.app
  https://*.vercel.app
  ```

## 4. 도메인 연결 (Optional)

### 4.1 커스텀 도메인 추가

Vercel Dashboard > Project > Settings > Domains

1. "Add" 클릭
2. 도메인 입력 (예: `roomy.example.com`)
3. DNS 레코드 설정:
   ```
   Type: CNAME
   Name: roomy (또는 @)
   Value: cname.vercel-dns.com
   ```

### 4.2 환경변수 업데이트

```bash
# NEXT_PUBLIC_APP_URL을 커스텀 도메인으로 업데이트
vercel env add NEXT_PUBLIC_APP_URL production
# 값: https://roomy.example.com
```

## 5. 빌드 검증

### Local Build Test

```bash
# 로컬에서 프로덕션 빌드 테스트
npm run build

# 빌드 결과 확인
npm run start

# 브라우저에서 http://localhost:3000 확인
```

### Vercel Build Logs

1. Vercel Dashboard > Deployments
2. 최신 배포 클릭 > "Building" 로그 확인
3. 에러가 있다면 상세 로그 확인

## 6. 배포 후 체크리스트

- [ ] 홈페이지 로드 (`/`)
- [ ] 로그인/회원가입 (`/auth/login`, `/auth/signup`)
- [ ] 대시보드 (`/dashboard`)
- [ ] 가이드 에디터 (`/dashboard/guides/new`)
- [ ] 공개 가이드 뷰어 (`/g/:slug`)
- [ ] QR 코드 생성 (`/dashboard/qr`)
- [ ] AI 챗봇 API (`/api/ai/chat`)
- [ ] 이미지 업로드 (Supabase Storage)

## 7. 성능 최적화

### 7.1 Image Optimization

Next.js Image 컴포넌트 사용 확인:
```tsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority
/>
```

### 7.2 Analytics 연동 (Optional)

Vercel Dashboard > Project > Analytics > Enable

### 7.3 Monitoring

- Vercel Dashboard > Project > Deployments > Real-time Logs
- Supabase Dashboard > Database > Logs

## Troubleshooting

### 1. 빌드 실패: "Module not found"

```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install
```

### 2. 환경변수 인식 안됨

- Vercel Dashboard에서 Environment 탭 확인
- `NEXT_PUBLIC_` prefix가 있는지 확인 (클라이언트 사이드)
- Redeploy 실행

### 3. Supabase 연결 실패

- Supabase URL과 Key가 정확한지 확인
- RLS 정책이 올바른지 확인
- Network 탭에서 CORS 에러 확인

### 4. 403 Forbidden (API Routes)

```typescript
// API Route에서 CORS 헤더 추가
export async function POST(req: Request) {
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
    },
  });
}
```

### 5. Serverless Function Timeout

`vercel.json`에서 maxDuration 증가:
```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

## Rollback

### 이전 배포로 롤백

```bash
# CLI로 롤백
vercel rollback <deployment-url>

# 또는 Vercel Dashboard에서
# Deployments > 이전 배포 선택 > "Promote to Production"
```

## CI/CD (Automatic Deployments)

Vercel은 GitHub 연동 시 자동으로 CI/CD를 설정합니다.

- **main/master 브랜치**: Production 배포
- **다른 브랜치**: Preview 배포
- **Pull Request**: Preview 배포 (자동 코멘트)

### Preview 배포 비활성화

Vercel Dashboard > Project > Settings > Git

- Production Branch: `main`
- Preview Deployments: `All branches` 또는 `None`

## Security Checklist

- [ ] `.env.local`이 `.gitignore`에 포함
- [ ] `SUPABASE_SERVICE_ROLE_KEY`는 서버 사이드만 사용
- [ ] `GOOGLE_AI_API_KEY`는 API Route에서만 사용
- [ ] RLS 정책 모두 활성화
- [ ] HTTPS 강제 (Vercel 기본)
- [ ] Rate Limiting 고려 (Vercel Pro 이상)

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Last Updated**: 2026-02-01
**Deployed by**: Claude Code
