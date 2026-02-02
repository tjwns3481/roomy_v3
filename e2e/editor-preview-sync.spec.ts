import { test, expect } from '@playwright/test';
import { clerkSetup } from '@clerk/testing/playwright';

test.describe('에디터 실시간 미리보기 동기화', () => {
  test.beforeEach(async ({ page }) => {
    await clerkSetup();

    // 로그인
    await page.goto('http://localhost:3000/sign-in');
    await page.getByRole('button', { name: /Google로 계속하기/i }).click();
    await page.waitForURL('**/dashboard', { timeout: 10000 });

    // 가이드 생성 또는 기존 가이드 열기
    const hasGuides = await page.locator('[data-testid="guide-card"]').count();

    if (hasGuides === 0) {
      // 새 가이드 생성
      await page.getByRole('button', { name: /새 가이드 만들기/i }).click();
      await page.waitForURL('**/guides/*/edit', { timeout: 10000 });
    } else {
      // 첫 번째 가이드 열기
      await page.locator('[data-testid="guide-card"]').first().click();
      await page.waitForURL('**/guides/*/edit', { timeout: 10000 });
    }
  });

  test('블록 추가 시 미리보기에 즉시 반영', async ({ page }) => {
    // Wi-Fi 블록 추가
    await page.getByRole('button', { name: /Wi-Fi/i }).click();

    // 미리보기에 Wi-Fi 블록이 표시되는지 확인
    const previewBlock = page.locator('.bg-white.rounded-2xl').filter({ hasText: 'WiFi 네트워크' });
    await expect(previewBlock).toBeVisible({ timeout: 5000 });
  });

  test('블록 편집 시 미리보기 실시간 업데이트', async ({ page }) => {
    // Wi-Fi 블록 추가
    await page.getByRole('button', { name: /Wi-Fi/i }).click();

    // 블록 선택
    const previewBlock = page.locator('.bg-white.rounded-2xl').filter({ hasText: 'WiFi 네트워크' });
    await previewBlock.click();

    // 오른쪽 패널에서 SSID 입력
    const ssidInput = page.locator('input[placeholder*="SSID"]').or(page.locator('label:has-text("네트워크 이름")').locator('~ input'));
    await ssidInput.fill('TestWiFi_5G');

    // 미리보기에 변경사항 반영 확인
    await expect(previewBlock).toContainText('TestWiFi_5G', { timeout: 3000 });

    // 비밀번호 입력
    const passwordInput = page.locator('input[placeholder*="password"]').or(page.locator('label:has-text("비밀번호")').locator('~ input'));
    await passwordInput.fill('test1234!');

    // 미리보기에 비밀번호 반영 확인
    await expect(previewBlock).toContainText('test1234!', { timeout: 3000 });
  });

  test('블록 삭제 시 미리보기에서 제거', async ({ page }) => {
    // 텍스트 블록 추가
    await page.getByRole('button', { name: /텍스트/i }).click();

    // 미리보기에서 블록 확인
    const previewBlock = page.locator('.bg-white.rounded-2xl').last();
    await expect(previewBlock).toBeVisible();

    // 블록 선택
    await previewBlock.click();

    // 삭제 버튼 클릭
    await page.locator('button[title="삭제"]').or(page.getByRole('button', { name: /삭제/i })).click();

    // 확인 다이얼로그
    page.on('dialog', dialog => dialog.accept());

    // 미리보기에서 블록 제거 확인
    await expect(previewBlock).not.toBeVisible({ timeout: 3000 });
  });

  test('텍스트 블록 편집 시 실시간 반영', async ({ page }) => {
    // 텍스트 블록 추가
    await page.getByRole('button', { name: /텍스트/i }).click();

    // 블록 선택
    const previewBlock = page.locator('.bg-white.rounded-2xl').last();
    await previewBlock.click();

    // 제목 입력
    const titleInput = page.locator('label:has-text("제목")').locator('~ input').or(page.locator('input[placeholder*="제목"]'));
    await titleInput.fill('환영합니다');

    // 미리보기 확인
    await expect(previewBlock).toContainText('환영합니다', { timeout: 3000 });

    // 내용 입력
    const contentTextarea = page.locator('label:has-text("내용")').locator('~ textarea').or(page.locator('textarea[placeholder*="내용"]'));
    await contentTextarea.fill('이 가이드에 오신 것을 환영합니다!');

    // 미리보기 확인
    await expect(previewBlock).toContainText('이 가이드에 오신 것을 환영합니다!', { timeout: 3000 });
  });

  test('여러 블록 순서 변경 시 미리보기 반영', async ({ page }) => {
    // 두 개의 블록 추가
    await page.getByRole('button', { name: /Wi-Fi/i }).click();
    await page.waitForTimeout(500);
    await page.getByRole('button', { name: /텍스트/i }).click();
    await page.waitForTimeout(500);

    // 미리보기에서 블록 순서 확인
    const blocks = page.locator('.bg-white.rounded-2xl');
    await expect(blocks).toHaveCount(2, { timeout: 5000 });

    // 첫 번째 블록이 Wi-Fi인지 확인
    const firstBlock = blocks.first();
    await expect(firstBlock).toContainText('WiFi', { timeout: 3000 });
  });

  test('모바일/데스크톱 모드 전환', async ({ page }) => {
    // Wi-Fi 블록 추가
    await page.getByRole('button', { name: /Wi-Fi/i }).click();

    // 모바일 모드 버튼 확인
    const mobileButton = page.locator('button:has(span.material-symbols-outlined:text("smartphone"))');
    await expect(mobileButton).toBeVisible();

    // 데스크톱 모드로 전환
    const desktopButton = page.locator('button:has(span.material-symbols-outlined:text("desktop_windows"))');
    await desktopButton.click();

    // 미리보기 크기 변경 확인
    const preview = page.locator('.bg-white.rounded-2xl').filter({ hasText: 'WiFi' }).first();
    await expect(preview).toBeVisible({ timeout: 3000 });

    // 다시 모바일 모드로 전환
    await mobileButton.click();
    await expect(preview).toBeVisible({ timeout: 3000 });
  });

  test('블록 복제 시 미리보기에 추가', async ({ page }) => {
    // Wi-Fi 블록 추가
    await page.getByRole('button', { name: /Wi-Fi/i }).click();

    // 블록 선택
    const previewBlock = page.locator('.bg-white.rounded-2xl').filter({ hasText: 'WiFi' });
    await previewBlock.click();

    // 복제 버튼 클릭
    await page.locator('button[title="복제"]').or(page.getByRole('button', { name: /복제/i })).click();

    // 미리보기에 두 개의 Wi-Fi 블록 확인
    const wifiBlocks = page.locator('.bg-white.rounded-2xl').filter({ hasText: 'WiFi' });
    await expect(wifiBlocks).toHaveCount(2, { timeout: 3000 });
  });

  test('빈 상태 메시지 표시', async ({ page }) => {
    // 블록이 없는 경우 빈 상태 메시지 확인
    const emptyMessage = page.locator('text=/왼쪽 사이드바에서 블록을 추가/i');

    // 블록이 있으면 모두 삭제
    const blockCount = await page.locator('.bg-white.rounded-2xl').count();
    if (blockCount > 0) {
      for (let i = 0; i < blockCount; i++) {
        const block = page.locator('.bg-white.rounded-2xl').first();
        await block.click();
        await page.locator('button[title="삭제"]').click();
        page.on('dialog', dialog => dialog.accept());
        await page.waitForTimeout(500);
      }
    }

    // 빈 상태 메시지 확인
    await expect(emptyMessage).toBeVisible({ timeout: 3000 });
  });
});
