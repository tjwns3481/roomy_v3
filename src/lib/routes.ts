/**
 * 애플리케이션 라우트 상수
 * URL 경로를 중앙에서 관리하여 유지보수성 향상
 */

export const ROUTES = {
  // 게스트 뷰 라우트
  STAY: (slug: string) => `/stay/${slug}`,
  STAY_RULES: (slug: string) => `/stay/${slug}/rules`,
  STAY_PLACES: (slug: string) => `/stay/${slug}/places`,

  // 호스트 라우트
  DASHBOARD: '/dashboard',
  EDITOR: (guideId: string) => `/editor/${guideId}`,
  TEMPLATES: '/templates',
  SETTINGS: '/settings',

  // 인증 라우트
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
} as const;

/**
 * 전체 URL 생성 (origin 포함)
 */
export function getFullUrl(path: string): string {
  if (typeof window === 'undefined') return path;
  return `${window.location.origin}${path}`;
}
