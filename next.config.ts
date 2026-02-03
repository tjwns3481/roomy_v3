import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 이미지 최적화
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // 성능 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 실험적 기능
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion'],
  },

  // Turbopack 설정 (Next.js 16 기본값)
  turbopack: {},

  // 레거시 경로 리다이렉트
  async redirects() {
    return [
      // /g/* → /stay/* 마이그레이션
      {
        source: '/g/:slug',
        destination: '/stay/:slug',
        permanent: true,
      },
      {
        source: '/g/:slug/places',
        destination: '/stay/:slug/places',
        permanent: true,
      },
      {
        source: '/g/:slug/rules',
        destination: '/stay/:slug/rules',
        permanent: true,
      },
      // 레거시 인증 경로
      {
        source: '/login',
        destination: '/sign-in',
        permanent: true,
      },
      {
        source: '/signup',
        destination: '/sign-up',
        permanent: true,
      },
    ];
  },

  // Supabase 허용
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
