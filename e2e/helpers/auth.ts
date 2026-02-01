import { Page } from '@playwright/test';

/**
 * 테스트 헬퍼: 인증 관련 유틸리티
 */

export async function login(page: Page, email: string, password: string) {
  await page.goto('/auth/login');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
}

export async function signup(page: Page, email: string, password: string) {
  await page.goto('/auth/signup');
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirmPassword"]', password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
}

export async function logout(page: Page) {
  const logoutButton = page.getByRole('button', { name: /로그아웃/i });
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await page.waitForTimeout(1000);
  }
}

export function generateTestUser() {
  const timestamp = Date.now();
  return {
    email: `test-${timestamp}@example.com`,
    password: 'Test1234!@#$',
  };
}
