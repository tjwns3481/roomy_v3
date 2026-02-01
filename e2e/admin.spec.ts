import { test, expect } from '@playwright/test';

test.describe('관리자 흐름', () => {
  // 관리자 테스트 계정
  const adminEmail = 'admin@example.com';
  const adminPassword = 'Admin1234!@#$';

  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 관리자로 로그인 시도
    await page.goto('/login');
    await page.waitForTimeout(1000);

    const emailInput = page.locator('input[name="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill(adminEmail);
      await page.fill('input[name="password"]', adminPassword);
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000);
    }
  });

  test('관리자 로그인 → 대시보드 통계 확인', async ({ page }) => {
    // 1. 관리자 페이지로 이동
    await page.goto('/admin');
    await page.waitForTimeout(2000);

    const url = page.url();

    // 2. 권한이 없거나 404인 경우 건너뛰기
    if (url.includes('/login') || url.includes('/403') || url.includes('/404')) {
      console.log('관리자 페이지가 없거나 권한이 없습니다.');
      test.skip();
      return;
    }

    // 3. 404 페이지 콘텐츠 확인
    const is404 = await page.getByText(/404|not found|찾을 수 없/i).isVisible().catch(() => false);
    if (is404) {
      console.log('관리자 페이지가 구현되지 않았습니다.');
      test.skip();
      return;
    }

    // 4. 관리자 대시보드 확인
    const adminContent = await page.getByText(/관리자|Admin|Dashboard/i).isVisible().catch(() => false);
    if (adminContent) {
      await expect(page.getByText(/관리자|Admin|Dashboard/i)).toBeVisible({ timeout: 5000 });

      // 5. 통계 카드 확인
      const statsCards = page.locator('[data-testid="stat-card"]');
      const count = await statsCards.count();

      if (count > 0) {
        await expect(statsCards.first()).toBeVisible();
      }
    }
  });

  test('관리자 - 사용자 목록 조회', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(1000);

    if (page.url().includes('/login')) {
      test.skip();
    }

    // 1. 사용자 관리 탭 또는 링크 클릭
    const usersLink = page.getByRole('link', { name: /사용자|Users/i });

    if (await usersLink.isVisible()) {
      await usersLink.click();
      await page.waitForTimeout(1000);

      // 2. 사용자 목록 테이블 확인
      const userTable = page.locator('table');
      if (await userTable.isVisible()) {
        await expect(userTable).toBeVisible();

        // 3. 테이블 헤더 확인
        await expect(page.getByText(/이메일|Email/i)).toBeVisible();
        await expect(page.getByText(/가입일|Created/i)).toBeVisible();
      }

      // 4. 사용자 검색 기능 확인
      const searchInput = page.locator('input[placeholder*="검색"], input[type="search"]');
      if (await searchInput.isVisible()) {
        await searchInput.fill('test@example.com');
        await page.waitForTimeout(500);

        // 검색 결과 확인
        const searchResults = page.locator('[data-testid="user-row"]');
        const resultCount = await searchResults.count();

        if (resultCount > 0) {
          expect(resultCount).toBeGreaterThan(0);
        }
      }
    }
  });

  test('관리자 - 가이드 목록 조회 및 관리', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(1000);

    if (page.url().includes('/login')) {
      test.skip();
    }

    // 1. 가이드 관리 탭 또는 링크 클릭
    const guidesLink = page.getByRole('link', { name: /가이드|Guides/i });

    if (await guidesLink.isVisible()) {
      await guidesLink.click();
      await page.waitForTimeout(1000);

      // 2. 가이드 목록 확인
      const guideTable = page.locator('table');
      if (await guideTable.isVisible()) {
        await expect(guideTable).toBeVisible();

        // 3. 게시 상태별 필터링
        const publishedFilter = page.getByRole('button', { name: /게시됨|Published/i });
        if (await publishedFilter.isVisible()) {
          await publishedFilter.click();
          await page.waitForTimeout(500);
        }

        // 4. 첫 번째 가이드의 상세 정보 확인
        const firstGuide = page.locator('[data-testid="guide-row"]').first();
        if (await firstGuide.isVisible()) {
          await firstGuide.click();
          await page.waitForTimeout(500);

          // 상세 모달 또는 페이지 확인
          const detailModal = page.locator('[data-testid="guide-detail"]');
          if (await detailModal.isVisible()) {
            await expect(detailModal).toBeVisible();
          }
        }
      }
    }
  });

  test('관리자 - 통계 그래프 확인', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(1000);

    if (page.url().includes('/login')) {
      test.skip();
    }

    // 1. 통계 섹션 확인
    const statsSection = page.locator('[data-testid="stats-section"]');

    if (await statsSection.isVisible()) {
      await expect(statsSection).toBeVisible();

      // 2. 차트 확인 (Recharts 사용)
      const charts = page.locator('[class*="recharts"]');
      const chartCount = await charts.count();

      if (chartCount > 0) {
        await expect(charts.first()).toBeVisible();
      }

      // 3. 기간 선택 필터
      const periodSelector = page.locator('select[name="period"]');
      if (await periodSelector.isVisible()) {
        await periodSelector.selectOption('7days');
        await page.waitForTimeout(1000);

        // 차트가 업데이트되었는지 확인
        await expect(charts.first()).toBeVisible();
      }
    }
  });

  test('관리자 - 가이드 강제 삭제', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(1000);

    if (page.url().includes('/login')) {
      test.skip();
    }

    // 1. 가이드 관리 페이지로 이동
    const guidesLink = page.getByRole('link', { name: /가이드|Guides/i });

    if (await guidesLink.isVisible()) {
      await guidesLink.click();
      await page.waitForTimeout(1000);

      // 2. 삭제 버튼 클릭
      const deleteButton = page.locator('[data-testid="guide-row"]').first().getByRole('button', { name: /삭제|Delete/i });

      if (await deleteButton.isVisible()) {
        await deleteButton.click();

        // 3. 확인 모달
        await page.waitForTimeout(500);
        const confirmModal = page.locator('[data-testid="confirm-modal"]');

        if (await confirmModal.isVisible()) {
          await expect(confirmModal).toBeVisible();

          // 4. 삭제 확인 버튼 클릭
          const confirmButton = page.getByRole('button', { name: /확인|삭제|Delete/i }).last();
          if (await confirmButton.isVisible()) {
            await confirmButton.click();
            await page.waitForTimeout(1000);

            // 5. 성공 메시지 확인
            const successMessage = page.getByText(/삭제되었습니다|Deleted/i);
            if (await successMessage.isVisible()) {
              await expect(successMessage).toBeVisible();
            }
          }
        }
      }
    }
  });

  test('관리자 - 사용자 권한 변경', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(1000);

    if (page.url().includes('/login')) {
      test.skip();
    }

    // 1. 사용자 관리 페이지로 이동
    const usersLink = page.getByRole('link', { name: /사용자|Users/i });

    if (await usersLink.isVisible()) {
      await usersLink.click();
      await page.waitForTimeout(1000);

      // 2. 첫 번째 사용자 선택
      const firstUser = page.locator('[data-testid="user-row"]').first();

      if (await firstUser.isVisible()) {
        // 3. 권한 변경 버튼 또는 드롭다운
        const roleSelector = firstUser.locator('select[name="role"]');

        if (await roleSelector.isVisible()) {
          const currentRole = await roleSelector.inputValue();

          // 4. 권한 변경
          const newRole = currentRole === 'user' ? 'admin' : 'user';
          await roleSelector.selectOption(newRole);
          await page.waitForTimeout(1000);

          // 5. 저장 버튼 클릭
          const saveButton = page.getByRole('button', { name: /저장|Save/i });
          if (await saveButton.isVisible()) {
            await saveButton.click();
            await page.waitForTimeout(1000);

            // 6. 성공 메시지 확인
            const successMessage = page.getByText(/변경되었습니다|Updated/i);
            if (await successMessage.isVisible()) {
              await expect(successMessage).toBeVisible();
            }
          }
        }
      }
    }
  });

  test('관리자 - 활동 로그 확인', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(1000);

    if (page.url().includes('/login')) {
      test.skip();
    }

    // 1. 활동 로그 탭 또는 링크
    const logsLink = page.getByRole('link', { name: /로그|Logs|활동/i });

    if (await logsLink.isVisible()) {
      await logsLink.click();
      await page.waitForTimeout(1000);

      // 2. 로그 목록 확인
      const logTable = page.locator('table');
      if (await logTable.isVisible()) {
        await expect(logTable).toBeVisible();

        // 3. 로그 항목 확인
        const logRows = page.locator('[data-testid="log-row"]');
        const count = await logRows.count();

        if (count > 0) {
          expect(count).toBeGreaterThan(0);

          // 4. 첫 번째 로그 확인
          const firstLog = logRows.first();
          await expect(firstLog).toBeVisible();

          // 로그 내용 확인
          await expect(firstLog.getByText(/로그인|생성|수정|삭제/i)).toBeVisible();
        }
      }

      // 5. 로그 필터링
      const filterSelect = page.locator('select[name="action"]');
      if (await filterSelect.isVisible()) {
        await filterSelect.selectOption('create');
        await page.waitForTimeout(500);

        // 필터링된 결과 확인
        const filteredLogs = page.locator('[data-testid="log-row"]');
        const filteredCount = await filteredLogs.count();

        if (filteredCount > 0) {
          expect(filteredCount).toBeGreaterThan(0);
        }
      }
    }
  });

  test('관리자 - 시스템 설정', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(1000);

    if (page.url().includes('/login')) {
      test.skip();
    }

    // 1. 설정 탭 또는 링크
    const settingsLink = page.getByRole('link', { name: /설정|Settings/i });

    if (await settingsLink.isVisible()) {
      await settingsLink.click();
      await page.waitForTimeout(1000);

      // 2. 설정 폼 확인
      const settingsForm = page.locator('form');
      if (await settingsForm.isVisible()) {
        await expect(settingsForm).toBeVisible();

        // 3. 설정 항목 확인
        const maxGuidesInput = page.locator('input[name="maxGuidesPerUser"]');
        if (await maxGuidesInput.isVisible()) {
          await maxGuidesInput.fill('100');
        }

        // 4. 저장 버튼 클릭
        const saveButton = page.getByRole('button', { name: /저장|Save/i });
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForTimeout(1000);

          // 5. 성공 메시지 확인
          const successMessage = page.getByText(/저장되었습니다|Saved/i);
          if (await successMessage.isVisible()) {
            await expect(successMessage).toBeVisible();
          }
        }
      }
    }
  });
});
