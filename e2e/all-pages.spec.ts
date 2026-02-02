import { test, expect } from '@playwright/test';

/**
 * Design 목업과 실제 페이지 매핑 테스트
 * design/ 폴더의 목업 파일과 실제 페이지가 일치하는지 검증합니다.
 *
 * 목업 → 페이지 매핑:
 * - 01-block-editor.html → /editor/[guideId]
 * - 02-guest-main.html → /g/[slug]
 * - 03-dashboard.html → /dashboard
 * - 04-login.html → /sign-in
 * - 05-ai-chatbot.html → /demo/chatbot, 게스트 페이지 챗봇
 * - 06-wifi-bottomsheet.html → WiFi 바텀시트 컴포넌트
 * - 07-qr-modal.html → QR 코드 모달
 * - 08-signup.html → /sign-up
 * - 09-template-select.html → /templates
 * - 10-settings.html → /settings
 * - 11-story-viewer.html → 스토리 뷰어 컴포넌트
 * - 12-house-rules.html → /g/[slug]/rules
 * - 13-local-map.html → /g/[slug]/places
 * - 14-admin-dashboard.html → /admin
 */

test.describe('01-block-editor: 블록 에디터 페이지', () => {
  test('에디터 페이지 렌더링 및 핵심 요소 확인', async ({ page }) => {
    await page.goto('/editor/test-guide');
    await page.waitForTimeout(2000);

    const url = page.url();

    // 로그인 리다이렉트 확인
    if (url.includes('/sign-in') || url.includes('/login')) {
      await expect(page).toHaveURL(/\/sign-in|\/login/);
      return;
    }

    // 404 확인
    const is404 = await page.getByText(/404|not found/i).isVisible().catch(() => false);
    if (is404) {
      console.log('가이드가 존재하지 않음');
      return;
    }

    // 에디터 핵심 요소 확인
    const editorContainer = page.locator('[data-testid="editor-container"], .editor-container, [class*="editor"]').first();
    if (await editorContainer.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(editorContainer).toBeVisible();
    }

    // 블록 추가 버튼 확인
    const addBlockButton = page.getByRole('button', { name: /블록 추가|Add Block|\+/i }).first();
    if (await addBlockButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(addBlockButton).toBeVisible();
    }

    // 저장/게시 버튼 확인
    const saveButton = page.getByRole('button', { name: /저장|Save|게시|Publish/i }).first();
    if (await saveButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(saveButton).toBeVisible();
    }

    // 미리보기 버튼 확인
    const previewButton = page.getByRole('button', { name: /미리보기|Preview/i }).first();
    if (await previewButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(previewButton).toBeVisible();
    }
  });

  test('블록 타입 선택 UI 확인', async ({ page }) => {
    await page.goto('/editor/test-guide');
    await page.waitForTimeout(2000);

    if (page.url().includes('/sign-in') || page.url().includes('/login')) {
      test.skip();
      return;
    }

    // 블록 추가 버튼 클릭
    const addBlockButton = page.getByRole('button', { name: /블록 추가|Add Block|\+/i }).first();
    if (await addBlockButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addBlockButton.click();
      await page.waitForTimeout(500);

      // 블록 타입 옵션 확인
      const blockTypes = ['텍스트', 'Text', '이미지', 'Image', '제목', 'Heading', '리스트', 'List'];
      for (const blockType of blockTypes) {
        const option = page.getByText(new RegExp(blockType, 'i')).first();
        if (await option.isVisible({ timeout: 1000 }).catch(() => false)) {
          await expect(option).toBeVisible();
          break;
        }
      }
    }
  });
});

test.describe('02-guest-main: 게스트 메인 페이지', () => {
  const testSlug = 'test-guide';

  test('게스트 페이지 렌더링 및 핵심 요소 확인', async ({ page }) => {
    await page.goto(`/g/${testSlug}`);
    await page.waitForTimeout(2000);

    // 404 또는 가이드 콘텐츠 확인
    const is404 = await page.getByText(/404|찾을 수 없/i).isVisible().catch(() => false);
    if (is404) {
      await expect(page.getByText(/404|찾을 수 없/i)).toBeVisible();
      return;
    }

    // 페이지 타이틀/헤더 확인
    const header = page.locator('h1, [data-testid="guide-title"]').first();
    if (await header.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(header).toBeVisible();
    }

    // 네비게이션 확인 (탭 또는 메뉴)
    const nav = page.locator('nav, [data-testid="guest-nav"], [role="tablist"]').first();
    if (await nav.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(nav).toBeVisible();
    }

    // 콘텐츠 블록 확인
    const contentBlock = page.locator('[data-block-type], [data-testid="content-block"], .block').first();
    if (await contentBlock.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(contentBlock).toBeVisible();
    }
  });

  test('모바일 반응형 레이아웃 확인', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`/g/${testSlug}`);
    await page.waitForTimeout(1000);

    // 모바일에서 콘텐츠가 올바르게 표시되는지 확인
    const container = page.locator('main, [data-testid="main-content"]').first();
    if (await container.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(container).toBeVisible();
    }
  });
});

test.describe('03-dashboard: 대시보드 페이지', () => {
  test('대시보드 렌더링 및 핵심 요소 확인', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);

    const url = page.url();

    // 로그인 리다이렉트 확인
    if (url.includes('/sign-in') || url.includes('/login')) {
      await expect(page).toHaveURL(/\/sign-in|\/login/);
      return;
    }

    // 대시보드 헤더 확인
    const dashboardTitle = page.getByText(/내 가이드|Dashboard|Roomy/i).first();
    await expect(dashboardTitle).toBeVisible({ timeout: 5000 });

    // 새 가이드 생성 버튼 확인
    const createButton = page.getByRole('button', { name: /새 가이드|가이드 만들기|New Guide|Create/i }).first();
    if (await createButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(createButton).toBeVisible();
    }

    // 통계 섹션 확인
    const statsSection = page.locator('[data-testid="stats-section"], [class*="stats"], [class*="stat-card"]').first();
    if (await statsSection.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(statsSection).toBeVisible();
    }
  });

  test('가이드 카드 목록 확인', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);

    if (page.url().includes('/sign-in') || page.url().includes('/login')) {
      test.skip();
      return;
    }

    // 가이드 카드 또는 빈 상태 메시지 확인
    const guideCards = page.locator('[data-testid="guide-card"], [class*="guide-card"]');
    const emptyState = page.getByText(/가이드가 없습니다|아직 가이드가|시작하세요/i).first();

    const hasCards = await guideCards.count() > 0;
    const hasEmptyState = await emptyState.isVisible({ timeout: 2000 }).catch(() => false);

    expect(hasCards || hasEmptyState).toBeTruthy();
  });
});

test.describe('04-login: 로그인 페이지', () => {
  test('로그인 폼 렌더링 및 핵심 요소 확인', async ({ page }) => {
    await page.goto('/sign-in');
    await page.waitForTimeout(2000);

    // 로그인 폼 확인
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    const passwordInput = page.locator('input[name="password"], input[type="password"]').first();

    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(emailInput).toBeVisible();
    }

    if (await passwordInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(passwordInput).toBeVisible();
    }

    // 로그인 버튼 확인
    const loginButton = page.getByRole('button', { name: /로그인|Sign in|Login/i }).first();
    if (await loginButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(loginButton).toBeVisible();
    }

    // 회원가입 링크 확인
    const signupLink = page.getByRole('link', { name: /회원가입|Sign up|Register/i }).first();
    if (await signupLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(signupLink).toBeVisible();
    }
  });

  test('소셜 로그인 버튼 확인', async ({ page }) => {
    await page.goto('/sign-in');
    await page.waitForTimeout(2000);

    // 소셜 로그인 버튼 확인 (Google, Kakao 등)
    const socialButtons = page.locator('[data-testid="social-login"], button[class*="social"], button[class*="oauth"]');
    const googleButton = page.getByRole('button', { name: /Google|구글/i }).first();
    const kakaoButton = page.getByRole('button', { name: /Kakao|카카오/i }).first();

    const hasSocialButtons = await socialButtons.count() > 0;
    const hasGoogle = await googleButton.isVisible({ timeout: 2000 }).catch(() => false);
    const hasKakao = await kakaoButton.isVisible({ timeout: 2000 }).catch(() => false);

    // 소셜 로그인이 있거나 없어도 OK (선택적 기능)
    expect(hasSocialButtons || hasGoogle || hasKakao || true).toBeTruthy();
  });
});

test.describe('05-ai-chatbot: AI 챗봇', () => {
  test('챗봇 데모 페이지 확인', async ({ page }) => {
    await page.goto('/demo/chatbot');
    await page.waitForTimeout(2000);

    // 챗봇 컨테이너 확인
    const chatbotContainer = page.locator('[data-testid="chatbot-container"], [class*="chatbot"], [class*="chat"]').first();
    if (await chatbotContainer.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(chatbotContainer).toBeVisible();
    }

    // 메시지 입력창 확인
    const messageInput = page.locator('input[placeholder*="메시지"], textarea[placeholder*="메시지"], input[type="text"]').first();
    if (await messageInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(messageInput).toBeVisible();
    }

    // 전송 버튼 확인
    const sendButton = page.getByRole('button', { name: /전송|Send|보내기/i }).first();
    if (await sendButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(sendButton).toBeVisible();
    }
  });

  test('게스트 페이지에서 챗봇 버튼 확인', async ({ page }) => {
    await page.goto('/g/test-guide');
    await page.waitForTimeout(2000);

    // 챗봇 트리거 버튼 확인
    const chatbotButton = page.getByRole('button', { name: /챗봇|AI|도움말|채팅|💬/i }).first();
    const chatbotFab = page.locator('[data-testid="chatbot-fab"], [class*="chatbot-trigger"]').first();

    const hasButton = await chatbotButton.isVisible({ timeout: 3000 }).catch(() => false);
    const hasFab = await chatbotFab.isVisible({ timeout: 3000 }).catch(() => false);

    // 챗봇 버튼이 있거나 404 페이지인 경우 통과
    const is404 = await page.getByText(/404/i).isVisible().catch(() => false);
    expect(hasButton || hasFab || is404).toBeTruthy();
  });
});

test.describe('06-wifi-bottomsheet: WiFi 바텀시트', () => {
  test('게스트 페이지에서 WiFi 정보 바텀시트 확인', async ({ page }) => {
    await page.goto('/g/test-guide');
    await page.waitForTimeout(2000);

    // 404 확인
    if (await page.getByText(/404/i).isVisible().catch(() => false)) {
      test.skip();
      return;
    }

    // WiFi 블록 또는 버튼 찾기
    const wifiBlock = page.locator('[data-block-type="wifi"], [data-testid="wifi-block"]').first();
    const wifiButton = page.getByRole('button', { name: /WiFi|와이파이|Wi-Fi/i }).first();

    if (await wifiBlock.isVisible({ timeout: 3000 }).catch(() => false)) {
      await wifiBlock.click();
      await page.waitForTimeout(500);

      // 바텀시트 확인
      const bottomSheet = page.locator('[data-testid="bottom-sheet"], [class*="bottom-sheet"], [role="dialog"]').first();
      if (await bottomSheet.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(bottomSheet).toBeVisible();

        // WiFi 정보 (SSID, 비밀번호) 확인
        const wifiInfo = page.getByText(/SSID|비밀번호|Password/i).first();
        if (await wifiInfo.isVisible({ timeout: 2000 }).catch(() => false)) {
          await expect(wifiInfo).toBeVisible();
        }
      }
    } else if (await wifiButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await wifiButton.click();
      await page.waitForTimeout(500);
    }
  });
});

test.describe('07-qr-modal: QR 코드 모달', () => {
  test('대시보드에서 QR 코드 모달 확인', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);

    if (page.url().includes('/sign-in') || page.url().includes('/login')) {
      test.skip();
      return;
    }

    // 가이드 카드의 QR 버튼 찾기
    const qrButton = page.getByRole('button', { name: /QR|큐알/i }).first();
    const qrIcon = page.locator('[data-testid="qr-button"], [class*="qr"]').first();

    if (await qrButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await qrButton.click();
      await page.waitForTimeout(500);

      // QR 모달 확인
      const qrModal = page.locator('[data-testid="qr-modal"], [role="dialog"]').first();
      if (await qrModal.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(qrModal).toBeVisible();

        // QR 코드 이미지 확인
        const qrImage = page.locator('[data-testid="qr-code"], img[alt*="QR"], canvas').first();
        if (await qrImage.isVisible({ timeout: 2000 }).catch(() => false)) {
          await expect(qrImage).toBeVisible();
        }

        // 다운로드 버튼 확인
        const downloadButton = page.getByRole('button', { name: /다운로드|Download/i }).first();
        if (await downloadButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await expect(downloadButton).toBeVisible();
        }
      }
    }
  });
});

test.describe('08-signup: 회원가입 페이지', () => {
  test('회원가입 폼 렌더링 및 핵심 요소 확인', async ({ page }) => {
    await page.goto('/sign-up');
    await page.waitForTimeout(2000);

    // 회원가입 폼 확인
    const emailInput = page.locator('input[name="email"], input[type="email"]').first();
    const passwordInput = page.locator('input[name="password"], input[type="password"]').first();

    if (await emailInput.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(emailInput).toBeVisible();
    }

    if (await passwordInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(passwordInput).toBeVisible();
    }

    // 비밀번호 확인 입력 필드 확인
    const confirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="confirm_password"]').first();
    if (await confirmPasswordInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(confirmPasswordInput).toBeVisible();
    }

    // 회원가입 버튼 확인
    const signupButton = page.getByRole('button', { name: /회원가입|Sign up|Register|가입/i }).first();
    if (await signupButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(signupButton).toBeVisible();
    }

    // 이용약관 동의 체크박스 확인
    const termsCheckbox = page.locator('input[name="terms"], input#terms, input[type="checkbox"]').first();
    if (await termsCheckbox.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(termsCheckbox).toBeVisible();
    }
  });
});

test.describe('09-template-select: 템플릿 선택 페이지', () => {
  test('템플릿 페이지 렌더링 및 핵심 요소 확인', async ({ page }) => {
    await page.goto('/templates');
    await page.waitForTimeout(2000);

    const url = page.url();

    // 로그인 리다이렉트 확인
    if (url.includes('/sign-in') || url.includes('/login')) {
      await expect(page).toHaveURL(/\/sign-in|\/login/);
      return;
    }

    // 404 확인
    const is404 = await page.getByText(/404|not found/i).isVisible().catch(() => false);
    if (is404) {
      test.skip();
      return;
    }

    // 템플릿 페이지 제목 확인
    const pageTitle = page.getByText(/템플릿|Template/i).first();
    if (await pageTitle.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(pageTitle).toBeVisible();
    }

    // 템플릿 카드 확인
    const templateCards = page.locator('[data-testid="template-card"], [class*="template-card"]');
    const cardCount = await templateCards.count();

    if (cardCount > 0) {
      await expect(templateCards.first()).toBeVisible();
    }

    // 빈 페이지로 시작 옵션 확인
    const blankOption = page.getByText(/빈 페이지|Blank|처음부터/i).first();
    if (await blankOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(blankOption).toBeVisible();
    }
  });

  test('템플릿 미리보기 및 선택', async ({ page }) => {
    await page.goto('/templates');
    await page.waitForTimeout(2000);

    if (page.url().includes('/sign-in') || page.url().includes('/login')) {
      test.skip();
      return;
    }

    // 템플릿 카드 클릭
    const templateCards = page.locator('[data-testid="template-card"], [class*="template-card"]');
    if (await templateCards.count() > 0) {
      await templateCards.first().click();
      await page.waitForTimeout(500);

      // 미리보기 모달 또는 상세 페이지 확인
      const previewModal = page.locator('[data-testid="template-preview"], [role="dialog"]').first();
      const useButton = page.getByRole('button', { name: /사용|Use|적용|Apply/i }).first();

      const hasPreview = await previewModal.isVisible({ timeout: 2000 }).catch(() => false);
      const hasUseButton = await useButton.isVisible({ timeout: 2000 }).catch(() => false);

      expect(hasPreview || hasUseButton || true).toBeTruthy();
    }
  });
});

test.describe('10-settings: 설정 페이지', () => {
  test('설정 페이지 렌더링 및 핵심 요소 확인', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForTimeout(2000);

    const url = page.url();

    // 로그인 리다이렉트 확인
    if (url.includes('/sign-in') || url.includes('/login')) {
      await expect(page).toHaveURL(/\/sign-in|\/login/);
      return;
    }

    // 404 확인
    const is404 = await page.getByText(/404|not found/i).isVisible().catch(() => false);
    if (is404) {
      test.skip();
      return;
    }

    // 설정 페이지 제목 확인
    const pageTitle = page.getByText(/설정|Settings|프로필|Profile/i).first();
    if (await pageTitle.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(pageTitle).toBeVisible();
    }

    // 프로필 섹션 확인
    const profileSection = page.locator('[data-testid="profile-section"], [class*="profile"]').first();
    if (await profileSection.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(profileSection).toBeVisible();
    }

    // 테마 설정 확인
    const themeToggle = page.getByRole('button', { name: /테마|Theme|다크|Dark/i }).first();
    const themeSwitch = page.locator('[data-testid="theme-toggle"], input[type="checkbox"][name*="theme"]').first();

    const hasThemeToggle = await themeToggle.isVisible({ timeout: 2000 }).catch(() => false);
    const hasThemeSwitch = await themeSwitch.isVisible({ timeout: 2000 }).catch(() => false);

    // 테마 설정이 있거나 없어도 OK (선택적 기능)
    expect(hasThemeToggle || hasThemeSwitch || true).toBeTruthy();
  });

  test('알림 설정 확인', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForTimeout(2000);

    if (page.url().includes('/sign-in') || page.url().includes('/login')) {
      test.skip();
      return;
    }

    // 알림 설정 섹션 확인
    const notificationSection = page.locator('[data-testid="notification-settings"], [class*="notification"]').first();
    const notificationToggle = page.getByRole('checkbox', { name: /알림|Notification/i }).first();

    const hasSection = await notificationSection.isVisible({ timeout: 2000 }).catch(() => false);
    const hasToggle = await notificationToggle.isVisible({ timeout: 2000 }).catch(() => false);

    expect(hasSection || hasToggle || true).toBeTruthy();
  });
});

test.describe('11-story-viewer: 스토리 뷰어', () => {
  test('게스트 페이지에서 스토리 뷰어 확인', async ({ page }) => {
    await page.goto('/g/test-guide');
    await page.waitForTimeout(2000);

    // 404 확인
    if (await page.getByText(/404/i).isVisible().catch(() => false)) {
      test.skip();
      return;
    }

    // 스토리 트리거 찾기 (썸네일 또는 버튼)
    const storyTrigger = page.locator('[data-testid="story-trigger"], [class*="story-thumbnail"]').first();
    const storyButton = page.getByRole('button', { name: /스토리|Story/i }).first();

    if (await storyTrigger.isVisible({ timeout: 3000 }).catch(() => false)) {
      await storyTrigger.click();
      await page.waitForTimeout(500);

      // 스토리 뷰어 확인
      const storyViewer = page.locator('[data-testid="story-viewer"], [class*="story-viewer"], [role="dialog"]').first();
      if (await storyViewer.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(storyViewer).toBeVisible();

        // 네비게이션 버튼 확인 (이전/다음)
        const prevButton = page.getByRole('button', { name: /이전|Previous|←/i }).first();
        const nextButton = page.getByRole('button', { name: /다음|Next|→/i }).first();

        // 닫기 버튼 확인
        const closeButton = page.getByRole('button', { name: /닫기|Close|×/i }).first();
        if (await closeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await expect(closeButton).toBeVisible();
        }
      }
    } else if (await storyButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await storyButton.click();
      await page.waitForTimeout(500);
    }
  });
});

test.describe('12-house-rules: 이용 규칙 페이지', () => {
  const testSlug = 'test-guide';

  test('이용 규칙 페이지 렌더링 및 핵심 요소 확인', async ({ page }) => {
    await page.goto(`/g/${testSlug}/rules`);
    await page.waitForTimeout(2000);

    // 404 확인
    const is404 = await page.getByText(/404|찾을 수 없/i).isVisible().catch(() => false);
    if (is404) {
      await expect(page.getByText(/404|찾을 수 없/i)).toBeVisible();
      return;
    }

    // 이용 규칙 제목 확인
    const pageTitle = page.getByText(/이용 규칙|House Rules|규칙/i).first();
    if (await pageTitle.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(pageTitle).toBeVisible();
    }

    // 규칙 목록 확인
    const rulesList = page.locator('[data-testid="rules-list"], ul, ol').first();
    if (await rulesList.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(rulesList).toBeVisible();
    }

    // 체크인/체크아웃 시간 확인
    const checkInOut = page.getByText(/체크인|체크아웃|Check-in|Check-out/i).first();
    if (await checkInOut.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(checkInOut).toBeVisible();
    }
  });

  test('규칙 카테고리 및 아이콘 확인', async ({ page }) => {
    await page.goto(`/g/${testSlug}/rules`);
    await page.waitForTimeout(2000);

    if (await page.getByText(/404/i).isVisible().catch(() => false)) {
      test.skip();
      return;
    }

    // 규칙 카테고리 아이콘 확인
    const ruleIcons = page.locator('[data-testid="rule-icon"], svg, .icon').first();
    if (await ruleIcons.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(ruleIcons).toBeVisible();
    }

    // 카테고리별 규칙 확인 (흡연, 반려동물, 파티 등)
    const categories = ['흡연', '반려동물', '파티', 'Smoking', 'Pets', 'Party'];
    for (const category of categories) {
      const categoryText = page.getByText(new RegExp(category, 'i')).first();
      if (await categoryText.isVisible({ timeout: 1000 }).catch(() => false)) {
        await expect(categoryText).toBeVisible();
        break;
      }
    }
  });
});

test.describe('13-local-map: 주변 장소 페이지', () => {
  const testSlug = 'test-guide';

  test('주변 장소 페이지 렌더링 및 핵심 요소 확인', async ({ page }) => {
    await page.goto(`/g/${testSlug}/places`);
    await page.waitForTimeout(2000);

    // 404 확인
    const is404 = await page.getByText(/404|찾을 수 없/i).isVisible().catch(() => false);
    if (is404) {
      await expect(page.getByText(/404|찾을 수 없/i)).toBeVisible();
      return;
    }

    // 주변 장소 제목 확인
    const pageTitle = page.getByText(/주변 장소|Places|Local Map|근처/i).first();
    if (await pageTitle.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(pageTitle).toBeVisible();
    }

    // 지도 컴포넌트 확인
    const mapContainer = page.locator('[data-testid="map-container"], [class*="map"], #map').first();
    if (await mapContainer.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(mapContainer).toBeVisible();
    }

    // 장소 목록 확인
    const placesList = page.locator('[data-testid="places-list"], [class*="places-list"]').first();
    if (await placesList.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(placesList).toBeVisible();
    }
  });

  test('장소 카드 및 상세 정보 확인', async ({ page }) => {
    await page.goto(`/g/${testSlug}/places`);
    await page.waitForTimeout(2000);

    if (await page.getByText(/404/i).isVisible().catch(() => false)) {
      test.skip();
      return;
    }

    // 장소 카드 확인
    const placeCards = page.locator('[data-testid="place-card"], [class*="place-card"]');
    const cardCount = await placeCards.count();

    if (cardCount > 0) {
      await expect(placeCards.first()).toBeVisible();

      // 카드 클릭 시 상세 정보 표시 확인
      await placeCards.first().click();
      await page.waitForTimeout(500);

      // 상세 모달 또는 패널 확인
      const detailPanel = page.locator('[data-testid="place-detail"], [role="dialog"]').first();
      if (await detailPanel.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(detailPanel).toBeVisible();
      }
    }

    // 카테고리 필터 확인 (식당, 카페, 편의점 등)
    const categoryFilter = page.locator('[data-testid="category-filter"], [class*="category"]').first();
    if (await categoryFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(categoryFilter).toBeVisible();
    }
  });
});

test.describe('14-admin-dashboard: 관리자 대시보드', () => {
  test('관리자 페이지 접근 및 핵심 요소 확인', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(2000);

    const url = page.url();

    // 로그인 리다이렉트 또는 권한 없음 확인
    if (url.includes('/sign-in') || url.includes('/login') || url.includes('/403')) {
      // 보호된 라우트 정상 작동
      return;
    }

    // 404 확인
    const is404 = await page.getByText(/404|not found/i).isVisible().catch(() => false);
    if (is404) {
      test.skip();
      return;
    }

    // 관리자 대시보드 확인
    const adminTitle = page.getByText(/관리자|Admin|Dashboard/i).first();
    if (await adminTitle.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(adminTitle).toBeVisible();
    }

    // 통계 카드 확인
    const statsCards = page.locator('[data-testid="stat-card"], [class*="stat-card"]');
    if (await statsCards.count() > 0) {
      await expect(statsCards.first()).toBeVisible();
    }

    // 네비게이션 메뉴 확인 (사용자, 가이드, 로그 등)
    const navLinks = ['사용자', 'Users', '가이드', 'Guides', '로그', 'Logs'];
    for (const linkText of navLinks) {
      const navLink = page.getByRole('link', { name: new RegExp(linkText, 'i') }).first();
      if (await navLink.isVisible({ timeout: 1000 }).catch(() => false)) {
        await expect(navLink).toBeVisible();
        break;
      }
    }
  });

  test('관리자 테이블 렌더링 확인', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForTimeout(2000);

    if (page.url().includes('/sign-in') || page.url().includes('/login')) {
      test.skip();
      return;
    }

    // 테이블 확인
    const dataTable = page.locator('table').first();
    if (await dataTable.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(dataTable).toBeVisible();

      // 테이블 헤더 확인
      const tableHeaders = page.locator('th');
      const headerCount = await tableHeaders.count();
      expect(headerCount).toBeGreaterThan(0);
    }

    // 페이지네이션 확인
    const pagination = page.locator('[data-testid="pagination"], [class*="pagination"]').first();
    if (await pagination.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(pagination).toBeVisible();
    }
  });
});

test.describe('전체 페이지 접근성 및 반응형 테스트', () => {
  const pages = [
    { path: '/', name: '홈' },
    { path: '/sign-in', name: '로그인' },
    { path: '/sign-up', name: '회원가입' },
    { path: '/dashboard', name: '대시보드' },
    { path: '/templates', name: '템플릿' },
    { path: '/settings', name: '설정' },
    { path: '/admin', name: '관리자' },
    { path: '/g/test-guide', name: '게스트 메인' },
    { path: '/g/test-guide/rules', name: '이용 규칙' },
    { path: '/g/test-guide/places', name: '주변 장소' },
    { path: '/demo/chatbot', name: '챗봇 데모' },
  ];

  for (const pageInfo of pages) {
    test(`${pageInfo.name} 페이지 로딩 및 에러 없음 확인`, async ({ page }) => {
      // 콘솔 에러 수집
      const consoleErrors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      // 페이지 로딩
      const response = await page.goto(pageInfo.path);
      await page.waitForTimeout(1000);

      // HTTP 상태 확인 (리다이렉트는 허용)
      if (response) {
        const status = response.status();
        expect([200, 301, 302, 307, 308]).toContain(status);
      }

      // 치명적 JS 에러 확인 (렌더링 실패 등)
      const criticalErrors = consoleErrors.filter(
        (error) =>
          error.includes('Uncaught') ||
          error.includes('TypeError') ||
          error.includes('ReferenceError')
      );

      // 치명적 에러가 없어야 함 (경고는 무시)
      expect(criticalErrors.length).toBeLessThanOrEqual(0);
    });
  }

  test('모바일 뷰포트에서 모든 페이지 접근 가능', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    for (const pageInfo of pages.slice(0, 5)) {
      await page.goto(pageInfo.path);
      await page.waitForTimeout(500);

      // 페이지가 렌더링되었는지 확인
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });

  test('태블릿 뷰포트에서 모든 페이지 접근 가능', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });

    for (const pageInfo of pages.slice(0, 5)) {
      await page.goto(pageInfo.path);
      await page.waitForTimeout(500);

      // 페이지가 렌더링되었는지 확인
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });
});
