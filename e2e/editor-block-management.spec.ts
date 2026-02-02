import { test, expect } from '@playwright/test';

test.describe('Editor Block Management', () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 (테스트 계정)
    await page.goto('/sign-in');
    await page.fill('input[name="identifier"]', 'test@example.com');
    await page.fill('input[name="password"]', 'testpassword');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');

    // 첫 번째 가이드의 에디터로 이동
    await page.click('[data-testid="guide-card"]:first-child');
    await page.waitForURL(/\/editor\/[^/]+/);
  });

  test('블록 추가가 정상 동작한다', async ({ page }) => {
    // 초기 블록 개수 확인
    const initialBlockCount = await page.locator('[data-testid="block-item"]').count();

    // 사이드바에서 WiFi 블록 클릭
    await page.click('[data-testid="add-block-wifi"]');

    // 블록이 추가되었는지 확인
    await expect(page.locator('[data-testid="block-item"]')).toHaveCount(initialBlockCount + 1);

    // WiFi 블록이 추가되었는지 확인
    await expect(page.locator('text=WiFi 정보').last()).toBeVisible();

    // 저장 상태가 "저장되지 않음"으로 변경되었는지 확인
    await expect(page.locator('text=저장되지 않음')).toBeVisible();
  });

  test('블록 삭제가 정상 동작한다', async ({ page }) => {
    // WiFi 블록 추가
    await page.click('[data-testid="add-block-wifi"]');
    await page.waitForTimeout(500);

    const blockCount = await page.locator('[data-testid="block-item"]').count();

    // 첫 번째 블록의 삭제 버튼 클릭 (hover 필요)
    const firstBlock = page.locator('[data-testid="block-item"]').first();
    await firstBlock.hover();
    await firstBlock.locator('[aria-label="삭제"]').click();

    // 블록이 삭제되었는지 확인
    await expect(page.locator('[data-testid="block-item"]')).toHaveCount(blockCount - 1);
  });

  test('블록 복제가 정상 동작한다', async ({ page }) => {
    // WiFi 블록 추가
    await page.click('[data-testid="add-block-wifi"]');
    await page.waitForTimeout(500);

    const blockCount = await page.locator('[data-testid="block-item"]').count();

    // 첫 번째 블록의 복제 버튼 클릭
    const firstBlock = page.locator('[data-testid="block-item"]').first();
    await firstBlock.hover();
    await firstBlock.locator('[aria-label="복제"]').click();

    // 블록이 복제되었는지 확인
    await expect(page.locator('[data-testid="block-item"]')).toHaveCount(blockCount + 1);
  });

  test('블록 선택이 정상 동작한다', async ({ page }) => {
    // WiFi 블록 2개 추가
    await page.click('[data-testid="add-block-wifi"]');
    await page.waitForTimeout(300);
    await page.click('[data-testid="add-block-text"]');
    await page.waitForTimeout(300);

    // 첫 번째 블록 클릭
    await page.locator('[data-testid="block-item"]').first().click();

    // 첫 번째 블록이 선택되었는지 확인 (border-primary 클래스)
    await expect(page.locator('[data-testid="block-item"]').first()).toHaveClass(/border-primary/);
  });

  test('블록 드래그앤드롭으로 순서 변경이 가능하다', async ({ page }) => {
    // WiFi와 Text 블록 추가
    await page.click('[data-testid="add-block-wifi"]');
    await page.waitForTimeout(300);
    await page.click('[data-testid="add-block-text"]');
    await page.waitForTimeout(300);

    // 첫 번째 블록의 텍스트 저장
    const firstBlockText = await page.locator('[data-testid="block-item"]').first().textContent();

    // 드래그앤드롭 (첫 번째를 두 번째로)
    const firstBlock = page.locator('[data-testid="block-item"]').first();
    const secondBlock = page.locator('[data-testid="block-item"]').nth(1);

    await firstBlock.dragTo(secondBlock);
    await page.waitForTimeout(500);

    // 순서가 변경되었는지 확인
    const newSecondBlockText = await page.locator('[data-testid="block-item"]').nth(1).textContent();
    expect(newSecondBlockText).toBe(firstBlockText);
  });

  test('비어있는 에디터에 플레이스홀더가 표시된다', async ({ page }) => {
    // 모든 블록 삭제
    const blockCount = await page.locator('[data-testid="block-item"]').count();

    for (let i = 0; i < blockCount; i++) {
      const firstBlock = page.locator('[data-testid="block-item"]').first();
      await firstBlock.hover();
      await firstBlock.locator('[aria-label="삭제"]').click();
      await page.waitForTimeout(200);
    }

    // 플레이스홀더 메시지 확인
    await expect(page.locator('text=왼쪽 사이드바에서 블록을 추가하여 가이드를 만들어보세요')).toBeVisible();
  });

  test('다양한 블록 타입이 추가된다', async ({ page }) => {
    const blockTypes = [
      { testId: 'add-block-wifi', expectedText: 'WiFi 정보' },
      { testId: 'add-block-rules', expectedText: '이용 규칙' },
      { testId: 'add-block-text', expectedText: '텍스트 블록' },
      { testId: 'add-block-devices', expectedText: '기기 사용법' },
      { testId: 'add-block-places', expectedText: '주변 장소' },
    ];

    for (const blockType of blockTypes) {
      await page.click(`[data-testid="${blockType.testId}"]`);
      await page.waitForTimeout(300);
      await expect(page.locator(`text=${blockType.expectedText}`).last()).toBeVisible();
    }
  });
});
