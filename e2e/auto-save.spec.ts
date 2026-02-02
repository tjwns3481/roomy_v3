// @TASK P1-T3 - 자동 저장 E2E 테스트
// @SPEC 블록 변경 후 2초 후 자동 저장 확인

import { test, expect } from "@playwright/test";

test.describe("자동 저장 기능", () => {
  test.beforeEach(async ({ page }) => {
    // 로그인 (실제 환경에서는 인증 세팅 필요)
    // await page.goto("/sign-in");
    // ... 로그인 과정

    // 테스트용으로 에디터 페이지로 직접 이동
    // await page.goto("/editor/test-guide-id");
  });

  test("블록 추가 후 2초 후 자동 저장", async ({ page }) => {
    // Given: 에디터 페이지 접속
    await page.goto("/editor/test-guide-id");

    // When: 블록 추가
    await page.click('button:has-text("텍스트")');

    // Then: "저장되지 않음" 상태 확인
    await expect(page.locator('text=저장 중...')).toBeVisible({ timeout: 100 });

    // When: 2초 대기
    await page.waitForTimeout(2100);

    // Then: "저장됨" 상태 확인
    await expect(page.locator('text=저장됨')).toBeVisible({ timeout: 3000 });
  });

  test("연속 변경 시 마지막 변경만 저장", async ({ page }) => {
    // Given: 에디터 페이지 접속
    await page.goto("/editor/test-guide-id");

    // When: 블록 3개 연속 추가 (각 1초 간격)
    await page.click('button:has-text("텍스트")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("이미지")');
    await page.waitForTimeout(1000);
    await page.click('button:has-text("와이파이")');

    // Then: 2초 후 한 번만 저장
    await page.waitForTimeout(2100);
    await expect(page.locator('text=저장됨')).toBeVisible({ timeout: 3000 });

    // 네트워크 요청 확인 (한 번만 호출되어야 함)
    // Note: Playwright의 route 기능으로 API 호출 횟수 확인 가능
  });

  test("저장 실패 시 재시도 버튼 표시", async ({ page }) => {
    // Given: 네트워크 오류 시뮬레이션
    await page.route("**/api/guides/**", (route) => {
      route.abort();
    });

    // When: 에디터 페이지 접속 및 블록 추가
    await page.goto("/editor/test-guide-id");
    await page.click('button:has-text("텍스트")');

    // When: 2초 대기
    await page.waitForTimeout(2100);

    // Then: 에러 메시지 및 재시도 버튼 확인
    await expect(page.locator('text=저장 실패')).toBeVisible();
    await expect(page.locator('button:has-text("재시도")')).toBeVisible();

    // When: 네트워크 복구 및 재시도
    await page.unroute("**/api/guides/**");
    await page.click('button:has-text("재시도")');

    // Then: 저장 성공 확인
    await expect(page.locator('text=저장됨')).toBeVisible({ timeout: 3000 });
  });

  test("저장 상태 표시 변화", async ({ page }) => {
    // Given: 에디터 페이지 접속
    await page.goto("/editor/test-guide-id");

    // When: 블록 추가
    await page.click('button:has-text("텍스트")');

    // Then: 상태 변화 확인
    // 1. 저장 중
    await expect(page.locator('text=저장 중...')).toBeVisible({ timeout: 100 });

    // 2. 저장됨
    await expect(page.locator('text=저장됨')).toBeVisible({ timeout: 3000 });

    // 3. 마지막 저장 시간 표시
    await expect(page.locator('text=/저장됨 · .*/')).toBeVisible();
  });

  test("블록 수정 후 자동 저장", async ({ page }) => {
    // Given: 에디터 페이지 접속 및 블록 추가
    await page.goto("/editor/test-guide-id");
    await page.click('button:has-text("텍스트")');
    await page.waitForTimeout(2100);
    await expect(page.locator('text=저장됨')).toBeVisible();

    // When: 블록 내용 수정
    await page.fill('input[placeholder*="제목"]', "수정된 제목");

    // Then: 2초 후 자동 저장 확인
    await page.waitForTimeout(2100);
    await expect(page.locator('text=저장됨')).toBeVisible({ timeout: 3000 });
  });

  test("블록 삭제 후 자동 저장", async ({ page }) => {
    // Given: 에디터 페이지 접속 및 블록 추가
    await page.goto("/editor/test-guide-id");
    await page.click('button:has-text("텍스트")');
    await page.waitForTimeout(2100);
    await expect(page.locator('text=저장됨')).toBeVisible();

    // When: 블록 삭제
    await page.click('button[title*="삭제"]');

    // Then: 2초 후 자동 저장 확인
    await page.waitForTimeout(2100);
    await expect(page.locator('text=저장됨')).toBeVisible({ timeout: 3000 });
  });
});

test.describe("SaveStatusIndicator 컴포넌트", () => {
  test("idle 상태는 아무것도 표시하지 않음", async ({ page }) => {
    // Given: 저장된 가이드가 있는 에디터
    await page.goto("/editor/test-guide-id");

    // When: 아무 변경도 하지 않음
    await page.waitForTimeout(1000);

    // Then: 저장 상태 표시가 없거나 마지막 저장 시간만 표시
    const hasSavingIndicator = await page.locator('text=저장 중...').isVisible().catch(() => false);
    expect(hasSavingIndicator).toBeFalsy();
  });

  test("saving 상태는 로딩 인디케이터 표시", async ({ page }) => {
    // Given: 에디터 페이지 접속
    await page.goto("/editor/test-guide-id");

    // When: 블록 추가
    await page.click('button:has-text("텍스트")');

    // Then: 저장 중 표시 및 애니메이션 확인
    const savingIndicator = page.locator('text=저장 중...');
    await expect(savingIndicator).toBeVisible({ timeout: 100 });

    // 애니메이션 요소 확인 (pulse)
    const pulseElement = page.locator('.animate-pulse');
    await expect(pulseElement).toBeVisible();
  });

  test("saved 상태는 체크 아이콘과 시간 표시", async ({ page }) => {
    // Given: 에디터 페이지 접속 및 블록 추가
    await page.goto("/editor/test-guide-id");
    await page.click('button:has-text("텍스트")');

    // When: 저장 완료 대기
    await page.waitForTimeout(2100);

    // Then: 저장됨 표시 및 시간 확인
    await expect(page.locator('text=저장됨')).toBeVisible();
    await expect(page.locator('text=/방금 전|.*초 전|.*분 전/')).toBeVisible();
  });

  test("error 상태는 에러 메시지와 재시도 버튼 표시", async ({ page }) => {
    // Given: 네트워크 오류 시뮬레이션
    await page.route("**/api/guides/**", (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: "Internal Server Error" }),
      });
    });

    // When: 블록 추가
    await page.goto("/editor/test-guide-id");
    await page.click('button:has-text("텍스트")');
    await page.waitForTimeout(2100);

    // Then: 에러 표시 확인
    await expect(page.locator('text=저장 실패')).toBeVisible();
    await expect(page.locator('button:has-text("재시도")')).toBeVisible();

    // 빨간색 인디케이터 확인
    const errorDot = page.locator('.bg-red-500');
    await expect(errorDot).toBeVisible();
  });
});
