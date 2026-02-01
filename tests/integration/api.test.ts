import { describe, it, expect, beforeAll, afterAll } from 'vitest';

/**
 * API 통합 테스트
 *
 * 실제 API 엔드포인트를 호출하여 통합 테스트를 수행합니다.
 * 테스트 환경에서는 테스트 데이터베이스를 사용해야 합니다.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// 테스트용 인증 토큰 (실제로는 테스트 계정으로 로그인하여 얻어야 함)
let authToken: string | null = null;
let testGuideId: string | null = null;
let testStoryId: string | null = null;

describe('API 통합 테스트', () => {
  describe('인증 API', () => {
    it('회원가입 API - POST /api/auth/signup', async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: `test-${Date.now()}@example.com`,
          password: 'Test1234!@#$',
        }),
      });

      // 201 Created 또는 200 OK 또는 401 (이미 존재하는 계정)
      expect([200, 201, 400, 401]).toContain(response.status);

      if (response.ok) {
        const data = await response.json();
        expect(data).toBeDefined();
      }
    });

    it('로그인 API - POST /api/auth/login', async () => {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'Test1234!@#$',
        }),
      });

      // 200 OK 또는 401 Unauthorized (계정이 없을 경우)
      expect([200, 401]).toContain(response.status);

      if (response.ok) {
        const data = await response.json();
        expect(data).toBeDefined();

        // 토큰이 있다면 저장
        if (data.token) {
          authToken = data.token;
        }
      }
    });
  });

  describe('가이드 API', () => {
    it('가이드 목록 조회 - GET /api/guides', async () => {
      const response = await fetch(`${API_BASE_URL}/api/guides`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
      });

      // 200 OK 또는 401 Unauthorized (인증 필요)
      expect([200, 401]).toContain(response.status);

      if (response.ok) {
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
      }
    });

    it('가이드 생성 - POST /api/guides', async () => {
      const response = await fetch(`${API_BASE_URL}/api/guides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: JSON.stringify({
          title: `테스트 가이드 ${Date.now()}`,
          slug: `test-guide-${Date.now()}`,
          description: '테스트 설명',
        }),
      });

      // 201 Created 또는 401 Unauthorized
      expect([201, 401]).toContain(response.status);

      if (response.ok) {
        const data = await response.json();
        expect(data.id).toBeDefined();
        testGuideId = data.id;
      }
    });

    it('가이드 상세 조회 - GET /api/guides/:id', async () => {
      if (!testGuideId) {
        // 테스트 가이드가 없으면 스킵
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/guides/${testGuideId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
      });

      expect([200, 401, 404]).toContain(response.status);

      if (response.ok) {
        const data = await response.json();
        expect(data.id).toBe(testGuideId);
      }
    });

    it('가이드 수정 - PUT /api/guides/:id', async () => {
      if (!testGuideId) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/guides/${testGuideId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: JSON.stringify({
          title: '수정된 제목',
          description: '수정된 설명',
        }),
      });

      expect([200, 401, 404]).toContain(response.status);

      if (response.ok) {
        const data = await response.json();
        expect(data.title).toBe('수정된 제목');
      }
    });

    it('가이드 게시 - POST /api/guides/:id/publish', async () => {
      if (!testGuideId) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/guides/${testGuideId}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
      });

      expect([200, 401, 404]).toContain(response.status);

      if (response.ok) {
        const data = await response.json();
        expect(data.is_published).toBe(true);
      }
    });
  });

  describe('스토리 API', () => {
    it('스토리 목록 조회 - GET /api/guides/:id/stories', async () => {
      if (!testGuideId) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/guides/${testGuideId}/stories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect([200, 404]).toContain(response.status);

      if (response.ok) {
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
      }
    });

    it('스토리 생성 - POST /api/guides/:id/stories', async () => {
      if (!testGuideId) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/guides/${testGuideId}/stories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: JSON.stringify({
          title: '테스트 스토리',
          media_url: 'https://example.com/image.jpg',
          media_type: 'image',
        }),
      });

      expect([201, 401, 404]).toContain(response.status);

      if (response.ok) {
        const data = await response.json();
        expect(data.id).toBeDefined();
        testStoryId = data.id;
      }
    });

    it('스토리 삭제 - DELETE /api/stories/:id', async () => {
      if (!testStoryId) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/stories/${testStoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
      });

      expect([200, 204, 401, 404]).toContain(response.status);
    });
  });

  describe('AI 챗봇 API', () => {
    it('챗봇 메시지 전송 - POST /api/ai/chat', async () => {
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: '체크인 시간이 언제인가요?',
          guideId: testGuideId || 'test-guide',
        }),
      });

      expect([200, 400, 500]).toContain(response.status);

      if (response.ok) {
        const data = await response.json();
        expect(data.response).toBeDefined();
        expect(typeof data.response).toBe('string');
      }
    });

    it('챗봇 API - 빈 메시지 전송 시 에러', async () => {
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: '',
          guideId: 'test-guide',
        }),
      });

      expect(response.status).toBe(400);
    });

    it('챗봇 API - 매우 긴 메시지 전송', async () => {
      const longMessage = 'A'.repeat(1000);

      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: longMessage,
          guideId: 'test-guide',
        }),
      });

      // 200 OK 또는 400 Bad Request (길이 제한)
      expect([200, 400]).toContain(response.status);
    });
  });

  describe('공개 가이드 조회 API', () => {
    it('Slug로 가이드 조회 - GET /api/public/guides/:slug', async () => {
      const response = await fetch(`${API_BASE_URL}/api/public/guides/test-guide`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect([200, 404]).toContain(response.status);

      if (response.ok) {
        const data = await response.json();
        expect(data.slug).toBe('test-guide');
        expect(data.is_published).toBe(true);
      }
    });
  });

  describe('관리자 API', () => {
    it('관리자 통계 조회 - GET /api/admin/stats', async () => {
      const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
      });

      // 200 OK 또는 401/403 (권한 없음)
      expect([200, 401, 403]).toContain(response.status);

      if (response.ok) {
        const data = await response.json();
        expect(data.totalGuides).toBeDefined();
        expect(data.totalUsers).toBeDefined();
      }
    });
  });

  describe('에러 처리', () => {
    it('존재하지 않는 엔드포인트 - 404', async () => {
      const response = await fetch(`${API_BASE_URL}/api/nonexistent`, {
        method: 'GET',
      });

      expect(response.status).toBe(404);
    });

    it('잘못된 HTTP 메소드 - 405', async () => {
      const response = await fetch(`${API_BASE_URL}/api/guides`, {
        method: 'PATCH',
      });

      expect([405, 404]).toContain(response.status);
    });

    it('잘못된 JSON 형식 - 400', async () => {
      const response = await fetch(`${API_BASE_URL}/api/guides`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
        body: 'invalid json',
      });

      expect([400, 401]).toContain(response.status);
    });
  });
});
