import { useState, useCallback, useRef } from 'react';
import type { ChatMessage } from '@/types';

interface UseAIChatOptions {
  guideId: string;
}

interface UseAIChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (question: string) => Promise<void>;
  clearMessages: () => void;
}

const SESSION_STORAGE_KEY = 'ai_chat_session_id';
const TIMEOUT_MS = 30000; // 30 seconds

/**
 * AI 챗봇 훅
 * - SSE 스트리밍 응답 처리
 * - 세션 관리
 * - 에러 처리
 */
export function useAIChat({ guideId }: UseAIChatOptions): UseAIChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // 세션 ID 가져오기 또는 생성
  const getSessionId = useCallback((): string => {
    if (typeof window === 'undefined') return '';

    let sessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem(SESSION_STORAGE_KEY, sessionId);
    }
    return sessionId;
  }, []);

  // SSE 스트리밍 응답 파싱
  const parseSSEChunk = (chunk: string): string | null => {
    if (chunk.trim() === '') return null;

    // "data: [DONE]" 체크
    if (chunk.includes('[DONE]')) {
      return '[DONE]';
    }

    // "data: {...}" 파싱
    const match = chunk.match(/^data: (.+)$/m);
    if (match && match[1]) {
      try {
        const parsed = JSON.parse(match[1]);
        return parsed.text || null;
      } catch (e) {
        console.error('Failed to parse SSE chunk:', e);
        return null;
      }
    }

    return null;
  };

  // 메시지 전송
  const sendMessage = useCallback(async (question: string) => {
    if (!question.trim()) return;

    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // 사용자 메시지 추가
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: question.trim(),
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // 어시스턴트 메시지 ID 미리 생성
    const assistantMessageId = crypto.randomUUID();
    let accumulatedText = '';

    // 초기 어시스턴트 메시지 추가 (비어있는 상태)
    const initialAssistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, initialAssistantMessage]);

    // 타임아웃 설정
    const timeoutId = setTimeout(() => {
      abortController.abort();
    }, TIMEOUT_MS);

    try {
      const sessionId = getSessionId();
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guideId,
          sessionId,
          question: question.trim(),
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      // 스트리밍 읽기
      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        // 디코딩 및 버퍼에 추가
        buffer += decoder.decode(value, { stream: true });

        // 줄바꿈으로 분리된 청크 처리
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // 마지막 불완전한 줄은 버퍼에 유지

        for (const line of lines) {
          const parsedText = parseSSEChunk(line);

          if (parsedText === '[DONE]') {
            // 완료 시그널
            reader.cancel();
            break;
          } else if (parsedText) {
            // 텍스트 누적
            accumulatedText += parsedText;

            // 메시지 업데이트
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: accumulatedText }
                  : msg
              )
            );
          }
        }
      }

      // 최종 메시지가 비어있으면 에러 처리
      if (!accumulatedText.trim()) {
        throw new Error('Empty response from AI');
      }

    } catch (err) {
      console.error('Failed to send message:', err);

      // 에러 메시지 설정
      let errorMessage = '메시지 전송에 실패했습니다. 다시 시도해주세요.';

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          errorMessage = '요청 시간이 초과되었습니다. 다시 시도해주세요.';
        } else if (err.message.includes('HTTP error')) {
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }
      }

      setError(errorMessage);

      // 어시스턴트 메시지를 에러 메시지로 업데이트
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: errorMessage }
            : msg
        )
      );
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [guideId, getSessionId]);

  // 메시지 초기화
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);

    // 세션 ID도 초기화
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
