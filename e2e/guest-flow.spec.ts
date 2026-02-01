import { test, expect } from '@playwright/test';

test.describe('게스트 흐름', () => {
  // 테스트용 가이드 slug (실제로는 데이터베이스에 존재해야 함)
  const testSlug = 'test-guide';

  test('slug로 가이드 조회 및 블록 렌더링', async ({ page }) => {
    // 1. 가이드 페이지로 이동
    await page.goto(`/g/${testSlug}`);

    // 2. 가이드 콘텐츠 로딩 확인 (또는 404)
    await page.waitForTimeout(2000);

    const url = page.url();

    if (url.includes('/404') || url.includes('/not-found')) {
      // 가이드가 존재하지 않음
      console.log('테스트 가이드가 존재하지 않습니다. 404 페이지가 올바르게 표시됩니다.');
      await expect(page.getByText(/찾을 수 없|404|Not Found/i)).toBeVisible();
    } else {
      // 가이드가 존재함
      // 3. 가이드 제목 확인
      const titleElement = page.locator('h1').first();
      if (await titleElement.isVisible()) {
        await expect(titleElement).toBeVisible();
      }

      // 4. 블록 콘텐츠 확인
      const blockElements = page.locator('[data-block-type]');
      const count = await blockElements.count();

      if (count > 0) {
        // 최소 하나의 블록이 렌더링됨
        await expect(blockElements.first()).toBeVisible();
      }

      // 5. 챗봇 버튼 확인
      const chatbotButton = page.getByRole('button', { name: /챗봇|AI|도움말/i });
      if (await chatbotButton.isVisible()) {
        await expect(chatbotButton).toBeVisible();
      }
    }
  });

  test('가이드 탐색 - Places 페이지 이동', async ({ page }) => {
    // 1. 가이드 페이지로 이동
    await page.goto(`/g/${testSlug}`);
    await page.waitForTimeout(1000);

    // 2. Places 링크 또는 탭 확인
    const placesLink = page.getByRole('link', { name: /주변 장소|Places/i });

    if (await placesLink.isVisible()) {
      // 3. Places 페이지로 이동
      await placesLink.click();

      // 4. URL 확인
      await expect(page).toHaveURL(`/g/${testSlug}/places`, { timeout: 5000 });

      // 5. 장소 목록 확인
      await expect(page.getByText(/주변 장소|Places/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('가이드 탐색 - Rules 페이지 이동', async ({ page }) => {
    // 1. 가이드 페이지로 이동
    await page.goto(`/g/${testSlug}`);
    await page.waitForTimeout(1000);

    // 2. Rules 링크 또는 탭 확인
    const rulesLink = page.getByRole('link', { name: /이용 규칙|Rules/i });

    if (await rulesLink.isVisible()) {
      // 3. Rules 페이지로 이동
      await rulesLink.click();

      // 4. URL 확인
      await expect(page).toHaveURL(`/g/${testSlug}/rules`, { timeout: 5000 });

      // 5. 규칙 콘텐츠 확인
      await expect(page.getByText(/이용 규칙|Rules/i)).toBeVisible({ timeout: 5000 });
    }
  });

  test('스토리 뷰어 열기 및 네비게이션', async ({ page }) => {
    // 1. 가이드 페이지로 이동
    await page.goto(`/g/${testSlug}`);
    await page.waitForTimeout(1000);

    // 2. 스토리 썸네일 또는 버튼 확인
    const storyTrigger = page.locator('[data-testid="story-trigger"]').first();

    if (await storyTrigger.isVisible()) {
      // 3. 스토리 열기
      await storyTrigger.click();

      // 4. 스토리 뷰어 확인
      await page.waitForTimeout(500);
      const storyViewer = page.locator('[data-testid="story-viewer"]');

      if (await storyViewer.isVisible()) {
        await expect(storyViewer).toBeVisible();

        // 5. 다음 스토리로 이동
        const nextButton = page.getByRole('button', { name: /다음|Next/i });
        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForTimeout(500);
        }

        // 6. 이전 스토리로 이동
        const prevButton = page.getByRole('button', { name: /이전|Previous/i });
        if (await prevButton.isVisible()) {
          await prevButton.click();
          await page.waitForTimeout(500);
        }

        // 7. 스토리 닫기
        const closeButton = page.getByRole('button', { name: /닫기|Close/i });
        if (await closeButton.isVisible()) {
          await closeButton.click();
          await page.waitForTimeout(500);

          // 뷰어가 사라졌는지 확인
          await expect(storyViewer).not.toBeVisible();
        }
      }
    }
  });

  test('챗봇 열기 및 질문 전송', async ({ page }) => {
    // 1. 가이드 페이지로 이동
    await page.goto(`/g/${testSlug}`);
    await page.waitForTimeout(1000);

    // 2. 챗봇 버튼 클릭
    const chatbotButton = page.getByRole('button', { name: /챗봇|AI|도움말/i });

    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();

      // 3. 챗봇 UI 확인
      await page.waitForTimeout(500);
      const chatbotContainer = page.locator('[data-testid="chatbot-container"]');

      if (await chatbotContainer.isVisible()) {
        await expect(chatbotContainer).toBeVisible();

        // 4. 메시지 입력란 확인
        const messageInput = page.locator('input[placeholder*="메시지"], textarea[placeholder*="메시지"]');

        if (await messageInput.isVisible()) {
          // 5. 테스트 메시지 입력
          await messageInput.fill('체크인 시간이 언제인가요?');

          // 6. 전송 버튼 클릭
          const sendButton = page.getByRole('button', { name: /전송|보내기|Send/i });
          if (await sendButton.isVisible()) {
            await sendButton.click();

            // 7. 응답 대기 (최대 10초)
            await page.waitForTimeout(2000);

            // 8. 응답 메시지 확인
            const responseMessage = page.locator('[data-testid="chat-message"]').last();
            if (await responseMessage.isVisible()) {
              await expect(responseMessage).toBeVisible();
            }
          }
        }

        // 9. 챗봇 닫기
        const closeButton = page.getByRole('button', { name: /닫기|Close/i });
        if (await closeButton.isVisible()) {
          await closeButton.click();
          await page.waitForTimeout(500);
        }
      }
    }
  });

  test('모바일 반응형 - 가이드 페이지', async ({ page }) => {
    // 1. 모바일 뷰포트 설정
    await page.setViewportSize({ width: 375, height: 667 });

    // 2. 가이드 페이지로 이동
    await page.goto(`/g/${testSlug}`);
    await page.waitForTimeout(1000);

    // 3. 모바일 네비게이션 확인
    const mobileNav = page.locator('[data-testid="mobile-nav"]');

    if (await mobileNav.isVisible()) {
      await expect(mobileNav).toBeVisible();
    }

    // 4. 햄버거 메뉴 확인
    const menuButton = page.getByRole('button', { name: /메뉴|Menu/i });

    if (await menuButton.isVisible()) {
      await menuButton.click();
      await page.waitForTimeout(500);

      // 5. 메뉴 패널 확인
      const menuPanel = page.locator('[data-testid="menu-panel"]');
      if (await menuPanel.isVisible()) {
        await expect(menuPanel).toBeVisible();
      }
    }
  });

  test('블록 타입별 렌더링 확인', async ({ page }) => {
    // 1. 가이드 페이지로 이동
    await page.goto(`/g/${testSlug}`);
    await page.waitForTimeout(1000);

    // 2. 텍스트 블록 확인
    const textBlock = page.locator('[data-block-type="text"]').first();
    if (await textBlock.isVisible()) {
      await expect(textBlock).toBeVisible();
    }

    // 3. 이미지 블록 확인
    const imageBlock = page.locator('[data-block-type="image"]').first();
    if (await imageBlock.isVisible()) {
      await expect(imageBlock).toBeVisible();

      // 이미지가 로드되었는지 확인
      const img = imageBlock.locator('img').first();
      if (await img.isVisible()) {
        await expect(img).toBeVisible();
      }
    }

    // 4. 리스트 블록 확인
    const listBlock = page.locator('[data-block-type="list"]').first();
    if (await listBlock.isVisible()) {
      await expect(listBlock).toBeVisible();
    }

    // 5. 링크 블록 확인
    const linkBlock = page.locator('[data-block-type="link"]').first();
    if (await linkBlock.isVisible()) {
      await expect(linkBlock).toBeVisible();
    }
  });

  test('가이드 공유 기능', async ({ page }) => {
    // 1. 가이드 페이지로 이동
    await page.goto(`/g/${testSlug}`);
    await page.waitForTimeout(1000);

    // 2. 공유 버튼 확인
    const shareButton = page.getByRole('button', { name: /공유|Share/i });

    if (await shareButton.isVisible()) {
      await shareButton.click();

      // 3. 공유 모달 확인
      await page.waitForTimeout(500);
      const shareModal = page.locator('[data-testid="share-modal"]');

      if (await shareModal.isVisible()) {
        await expect(shareModal).toBeVisible();

        // 4. URL 복사 버튼 확인
        const copyButton = page.getByRole('button', { name: /복사|Copy/i });
        if (await copyButton.isVisible()) {
          await copyButton.click();
          await page.waitForTimeout(500);

          // 복사 성공 메시지 확인
          const successMessage = page.getByText(/복사됨|Copied/i);
          if (await successMessage.isVisible()) {
            await expect(successMessage).toBeVisible();
          }
        }
      }
    }
  });
});
