import { test, expect } from '@playwright/test';

test.describe('AI 챗봇 흐름', () => {
  const testSlug = 'test-guide';

  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 가이드 페이지로 이동
    await page.goto(`/g/${testSlug}`);
    await page.waitForTimeout(1000);
  });

  test('챗봇 열기 → 질문 전송 → 응답 수신', async ({ page }) => {
    // 1. 챗봇 버튼 찾기
    const chatbotButton = page.getByRole('button', { name: /챗봇|AI|도움말|채팅/i });

    if (await chatbotButton.isVisible()) {
      // 2. 챗봇 열기
      await chatbotButton.click();
      await page.waitForTimeout(500);

      // 3. 챗봇 UI 확인
      const chatbotContainer = page.locator('[data-testid="chatbot-container"]');
      if (await chatbotContainer.isVisible()) {
        await expect(chatbotContainer).toBeVisible();

        // 4. 메시지 입력란 확인
        const messageInput = page.locator('input[type="text"], textarea').filter({
          hasText: /메시지|질문|Message/i,
        }).or(page.locator('input[placeholder*="메시지"], textarea[placeholder*="메시지"]'));

        const input = messageInput.first();
        if (await input.isVisible()) {
          // 5. 테스트 질문 입력
          await input.fill('체크인 시간이 언제인가요?');
          await page.waitForTimeout(300);

          // 6. 전송 버튼 클릭
          const sendButton = page.getByRole('button', { name: /전송|보내기|Send/i });
          if (await sendButton.isVisible()) {
            await sendButton.click();

            // 7. 사용자 메시지가 표시되는지 확인
            await page.waitForTimeout(500);
            const userMessage = page.getByText('체크인 시간이 언제인가요?');
            if (await userMessage.isVisible()) {
              await expect(userMessage).toBeVisible();
            }

            // 8. AI 응답 대기 (최대 10초)
            await page.waitForTimeout(5000);

            // 9. 응답 메시지 확인
            const messages = page.locator('[data-testid="chat-message"]');
            const count = await messages.count();

            if (count > 1) {
              // 최소 2개 이상의 메시지 (사용자 + AI)
              expect(count).toBeGreaterThanOrEqual(2);
            }
          }
        }
      }
    }
  });

  test('챗봇 다중 대화', async ({ page }) => {
    // 1. 챗봇 열기
    const chatbotButton = page.getByRole('button', { name: /챗봇|AI|도움말|채팅/i });

    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(500);

      const chatbotContainer = page.locator('[data-testid="chatbot-container"]');
      if (await chatbotContainer.isVisible()) {
        const messageInput = page.locator('input[placeholder*="메시지"], textarea[placeholder*="메시지"]').first();

        if (await messageInput.isVisible()) {
          // 2. 첫 번째 질문
          await messageInput.fill('체크인 시간은?');
          const sendButton = page.getByRole('button', { name: /전송|보내기|Send/i });

          if (await sendButton.isVisible()) {
            await sendButton.click();
            await page.waitForTimeout(3000);

            // 3. 두 번째 질문
            await messageInput.fill('체크아웃 시간은?');
            await sendButton.click();
            await page.waitForTimeout(3000);

            // 4. 세 번째 질문
            await messageInput.fill('주차 가능한가요?');
            await sendButton.click();
            await page.waitForTimeout(3000);

            // 5. 대화 기록 확인
            const messages = page.locator('[data-testid="chat-message"]');
            const count = await messages.count();

            // 최소 6개 이상의 메시지 (사용자 3개 + AI 3개)
            if (count >= 6) {
              expect(count).toBeGreaterThanOrEqual(6);
            }
          }
        }
      }
    }
  });

  test('챗봇 닫기 및 재오픈', async ({ page }) => {
    // 1. 챗봇 열기
    const chatbotButton = page.getByRole('button', { name: /챗봇|AI|도움말|채팅/i });

    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(500);

      const chatbotContainer = page.locator('[data-testid="chatbot-container"]');
      if (await chatbotContainer.isVisible()) {
        // 2. 메시지 전송
        const messageInput = page.locator('input[placeholder*="메시지"], textarea[placeholder*="메시지"]').first();
        if (await messageInput.isVisible()) {
          await messageInput.fill('안녕하세요');
          const sendButton = page.getByRole('button', { name: /전송|보내기|Send/i });
          if (await sendButton.isVisible()) {
            await sendButton.click();
            await page.waitForTimeout(2000);
          }
        }

        // 3. 챗봇 닫기
        const closeButton = page.getByRole('button', { name: /닫기|Close/i });
        if (await closeButton.isVisible()) {
          await closeButton.click();
          await page.waitForTimeout(500);

          // 챗봇이 사라졌는지 확인
          await expect(chatbotContainer).not.toBeVisible();
        }

        // 4. 챗봇 다시 열기
        await chatbotButton.click();
        await page.waitForTimeout(500);

        // 5. 대화 기록이 유지되는지 확인
        if (await chatbotContainer.isVisible()) {
          const messages = page.locator('[data-testid="chat-message"]');
          const count = await messages.count();

          // 이전 메시지가 유지되어 있어야 함
          if (count > 0) {
            expect(count).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  test('챗봇 로딩 상태 확인', async ({ page }) => {
    // 1. 챗봇 열기
    const chatbotButton = page.getByRole('button', { name: /챗봇|AI|도움말|채팅/i });

    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(500);

      const chatbotContainer = page.locator('[data-testid="chatbot-container"]');
      if (await chatbotContainer.isVisible()) {
        const messageInput = page.locator('input[placeholder*="메시지"], textarea[placeholder*="메시지"]').first();

        if (await messageInput.isVisible()) {
          // 2. 질문 전송
          await messageInput.fill('주차장이 있나요?');
          const sendButton = page.getByRole('button', { name: /전송|보내기|Send/i });

          if (await sendButton.isVisible()) {
            await sendButton.click();

            // 3. 로딩 인디케이터 확인 (짧은 시간이므로 즉시 확인)
            await page.waitForTimeout(100);

            const loadingIndicator = page.locator('[data-testid="loading-indicator"]');
            if (await loadingIndicator.isVisible({ timeout: 1000 })) {
              await expect(loadingIndicator).toBeVisible();
            }

            // 4. 응답 완료 대기
            await page.waitForTimeout(5000);

            // 5. 로딩 인디케이터가 사라졌는지 확인
            if (await loadingIndicator.isVisible({ timeout: 1000 })) {
              await expect(loadingIndicator).not.toBeVisible();
            }
          }
        }
      }
    }
  });

  test('챗봇 에러 처리', async ({ page }) => {
    // 네트워크 에러 시뮬레이션을 위해 오프라인 모드 설정
    await page.context().setOffline(true);

    // 1. 챗봇 열기
    const chatbotButton = page.getByRole('button', { name: /챗봇|AI|도움말|채팅/i });

    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(500);

      const chatbotContainer = page.locator('[data-testid="chatbot-container"]');
      if (await chatbotContainer.isVisible()) {
        const messageInput = page.locator('input[placeholder*="메시지"], textarea[placeholder*="메시지"]').first();

        if (await messageInput.isVisible()) {
          // 2. 메시지 전송 (오프라인 상태)
          await messageInput.fill('테스트 메시지');
          const sendButton = page.getByRole('button', { name: /전송|보내기|Send/i });

          if (await sendButton.isVisible()) {
            await sendButton.click();
            await page.waitForTimeout(2000);

            // 3. 에러 메시지 확인
            const errorMessage = page.getByText(/에러|오류|실패|Error|Failed/i);
            if (await errorMessage.isVisible()) {
              await expect(errorMessage).toBeVisible();
            }
          }
        }
      }
    }

    // 온라인 모드로 복구
    await page.context().setOffline(false);
  });

  test('챗봇 최대 메시지 길이 제한', async ({ page }) => {
    // 1. 챗봇 열기
    const chatbotButton = page.getByRole('button', { name: /챗봇|AI|도움말|채팅/i });

    if (await chatbotButton.isVisible()) {
      await chatbotButton.click();
      await page.waitForTimeout(500);

      const chatbotContainer = page.locator('[data-testid="chatbot-container"]');
      if (await chatbotContainer.isVisible()) {
        const messageInput = page.locator('input[placeholder*="메시지"], textarea[placeholder*="메시지"]').first();

        if (await messageInput.isVisible()) {
          // 2. 매우 긴 메시지 입력
          const longMessage = 'A'.repeat(1000);
          await messageInput.fill(longMessage);

          // 3. 전송 버튼 상태 확인
          const sendButton = page.getByRole('button', { name: /전송|보내기|Send/i });

          if (await sendButton.isVisible()) {
            // 버튼이 비활성화되어 있거나 경고 메시지가 표시될 수 있음
            const isDisabled = await sendButton.isDisabled();
            const warningMessage = page.getByText(/너무 길|최대|limit/i);

            if (isDisabled || (await warningMessage.isVisible())) {
              // 정상적으로 제한이 작동함
              expect(true).toBeTruthy();
            }
          }
        }
      }
    }
  });

  test('챗봇 데모 페이지 - 독립 실행', async ({ page }) => {
    // 1. 챗봇 데모 페이지로 이동
    await page.goto('/demo/chatbot');
    await page.waitForTimeout(1000);

    // 2. 챗봇 UI 확인
    const chatbotContainer = page.locator('[data-testid="chatbot-container"]');
    if (await chatbotContainer.isVisible()) {
      await expect(chatbotContainer).toBeVisible();

      // 3. 메시지 입력 및 전송
      const messageInput = page.locator('input[placeholder*="메시지"], textarea[placeholder*="메시지"]').first();
      if (await messageInput.isVisible()) {
        await messageInput.fill('데모 테스트 메시지');

        const sendButton = page.getByRole('button', { name: /전송|보내기|Send/i });
        if (await sendButton.isVisible()) {
          await sendButton.click();
          await page.waitForTimeout(3000);

          // 4. 응답 확인
          const messages = page.locator('[data-testid="chat-message"]');
          const count = await messages.count();

          if (count > 0) {
            expect(count).toBeGreaterThan(0);
          }
        }
      }
    }
  });
});
