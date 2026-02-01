# Roomy v3 - 성능 최적화 가이드

## 개요

Lighthouse 점수 90+ 달성을 위한 성능 최적화 작업 내역

## 적용된 최적화 항목

### 1. 이미지 최적화 (next.config.ts)

```typescript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60,
}
```

- AVIF/WebP 자동 변환
- 디바이스별 최적 사이즈 제공
- 60초 최소 캐시 TTL 설정

**사용법:**
```tsx
import { OptimizedImage } from '@/components/ui/OptimizedImage';

<OptimizedImage
  src="/image.jpg"
  alt="설명"
  width={800}
  height={600}
  priority={true} // LCP 이미지는 priority 설정
/>
```

### 2. 코드 스플리팅 (Dynamic Import)

무거운 컴포넌트들을 lazy loading:

#### 차트 컴포넌트 (recharts)
- `DynamicSignupsChart` - 가입자 추이 차트
- `DynamicGuideTypesChart` - 가이드 유형 파이 차트

#### QR 코드 생성기
- `DynamicQRModal` - QR 코드 모달 (qrcode 라이브러리)

#### 지도 컴포넌트
- `DynamicMapView` - Google Maps Static API

#### 에디터 블록
- `DynamicTextEditor`
- `DynamicWifiEditor`
- `DynamicRulesEditor`
- `DynamicDevicesEditor`
- `DynamicPlacesEditor`
- `DynamicGalleryEditor`

#### 게스트 블록
- `DynamicBlockRenderer` - 모든 guest 블록 lazy loading

**사용법:**
```tsx
import DynamicQRModal from '@/components/dashboard/DynamicQRModal';

// Modal이 실제로 열릴 때만 로드됨
<DynamicQRModal isOpen={isOpen} onClose={onClose} guide={guide} />
```

### 3. SSR/SSG 최적화

#### 게스트 페이지 (`/g/[slug]`)
- Server Component로 구현
- `generateMetadata()` - SEO 최적화
- 향후 `generateStaticParams()` 적용 가능 (ISR)

#### Metadata
```tsx
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  // DB에서 가이드 정보 조회하여 동적 메타데이터 생성
}
```

### 4. 번들 최적화 (next.config.ts)

```typescript
compiler: {
  removeConsole: process.env.NODE_ENV === 'production',
},

experimental: {
  optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
},
```

- Production 빌드 시 console.log 자동 제거
- 주요 패키지 트리쉐이킹 최적화

### 5. 로딩 UI (Suspense Boundaries)

각 주요 페이지에 loading.tsx 추가:

- `/app/(host)/dashboard/loading.tsx` - 대시보드 스켈레톤
- `/app/(host)/editor/[guideId]/loading.tsx` - 에디터 스켈레톤
- `/app/admin/loading.tsx` - 관리자 스켈레톤
- `/app/g/[slug]/loading.tsx` - 게스트 페이지 스켈레톤

**특징:**
- Tailwind animate-pulse 활용
- 실제 UI와 유사한 레이아웃
- CLS(Cumulative Layout Shift) 최소화

### 6. 헤더 최적화

```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      ],
    },
  ];
}
```

## 번들 분석

```bash
# 번들 크기 분석 (향후 @next/bundle-analyzer 추가 가능)
npm run build

# 빌드 출력에서 각 페이지별 번들 사이즈 확인
```

## Lighthouse 점수 목표

| 지표 | 목표 | 현재 |
|------|------|------|
| Performance | 90+ | TBD |
| Accessibility | 95+ | TBD |
| Best Practices | 95+ | TBD |
| SEO | 95+ | TBD |

## 추가 최적화 권장사항

### 1. 이미지 최적화
- Cloudinary / Vercel Image Optimization 사용
- LCP 이미지에 `priority` 속성 추가
- `placeholder="blur"` 활용 (static import 시)

### 2. 폰트 최적화
```tsx
// app/layout.tsx
import { Noto_Sans_KR } from 'next/font/google';

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  preload: true,
});
```

### 3. 프리페치 최적화
```tsx
import Link from 'next/link';

// 중요 페이지만 프리페치
<Link href="/dashboard" prefetch={true}>
  대시보드
</Link>

// 일반 페이지는 프리페치 비활성화
<Link href="/settings" prefetch={false}>
  설정
</Link>
```

### 4. API Route 최적화
- Edge Runtime 사용 고려
- Stale-While-Revalidate 전략
- DB 쿼리 최적화 (인덱스, N+1 방지)

### 5. 서드파티 스크립트 최적화
```tsx
import Script from 'next/script';

<Script
  src="https://analytics.example.com/script.js"
  strategy="afterInteractive" // or "lazyOnload"
/>
```

## 모니터링

### 권장 도구
1. **Vercel Analytics** - Core Web Vitals 모니터링
2. **Lighthouse CI** - CI/CD 파이프라인에 통합
3. **Chrome DevTools** - Performance 탭 프로파일링

### 주요 지표
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FCP (First Contentful Paint)**: < 1.8s
- **TTI (Time to Interactive)**: < 3.8s

## 체크리스트

- [x] next.config.ts 이미지 최적화 설정
- [x] 무거운 컴포넌트 dynamic import (recharts, qrcode)
- [x] loading.tsx 추가 (Suspense boundaries)
- [x] 번들 최적화 (optimizePackageImports)
- [x] OptimizedImage 컴포넌트 생성
- [x] DynamicBlockRenderer 적용
- [ ] 폰트 최적화 (next/font)
- [ ] generateStaticParams (ISR)
- [ ] 서드파티 스크립트 최적화
- [ ] Lighthouse CI 설정

## 참고 자료

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Next.js Dynamic Imports](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [Lighthouse Performance Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring)
- [Web Vitals](https://web.dev/vitals/)
