import { Page } from '@playwright/test';

/**
 * 테스트 헬퍼: 가이드 관련 유틸리티
 */

export async function createGuide(page: Page, title: string, slug?: string) {
  await page.goto('/dashboard');
  await page.waitForTimeout(1000);

  const createButton = page.getByRole('button', { name: /새 가이드|가이드 만들기/i });

  if (await createButton.isVisible()) {
    await createButton.click();

    const titleInput = page.locator('input[name="title"]').first();
    await titleInput.waitFor({ state: 'visible', timeout: 5000 });
    await titleInput.fill(title);

    if (slug) {
      const slugInput = page.locator('input[name="slug"]');
      if (await slugInput.isVisible()) {
        await slugInput.fill(slug);
      }
    }

    const submitButton = page.getByRole('button', { name: /생성|만들기/i }).first();
    await submitButton.click();
    await page.waitForTimeout(2000);

    return page.url();
  }

  return null;
}

export async function publishGuide(page: Page, guideId: string) {
  await page.goto(`/editor/${guideId}`);
  await page.waitForTimeout(1000);

  const publishButton = page.getByRole('button', { name: /게시|발행/i }).first();
  if (await publishButton.isVisible()) {
    await publishButton.click();
    await page.waitForTimeout(1000);
  }
}

export async function deleteGuide(page: Page, guideId: string) {
  await page.goto('/dashboard');
  await page.waitForTimeout(1000);

  const guideCard = page.locator(`[data-guide-id="${guideId}"]`);
  if (await guideCard.isVisible()) {
    const deleteButton = guideCard.getByRole('button', { name: /삭제/i });
    if (await deleteButton.isVisible()) {
      await deleteButton.click();

      const confirmButton = page.getByRole('button', { name: /확인|삭제/i }).last();
      if (await confirmButton.isVisible()) {
        await confirmButton.click();
        await page.waitForTimeout(1000);
      }
    }
  }
}

export function generateTestGuide() {
  const timestamp = Date.now();
  return {
    title: `테스트 가이드 ${timestamp}`,
    slug: `test-guide-${timestamp}`,
    description: '테스트 설명',
  };
}
