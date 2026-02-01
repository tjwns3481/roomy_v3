// @TASK P3-S2-T6 - 디바운스 자동저장 훅
// @SPEC 변경 후 1-2초 대기 후 자동 저장, 저장 상태 표시

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Guide, ApiResponse, ContentBlock } from "@/types";
import type { UpdateGuideRequest } from "@/lib/validations/guide";

/**
 * 가이드 자동저장 데이터 타입
 */
export interface GuideAutoSaveData {
  title?: string;
  content_blocks?: ContentBlock[];
  wifi_ssid?: string | null;
  wifi_password?: string | null;
}

/**
 * useAutoSave 훅 옵션 인터페이스
 */
export interface UseAutoSaveOptions {
  /**
   * 가이드 ID
   */
  guideId: string;

  /**
   * 저장할 데이터 (title, content_blocks, wifi_ssid, wifi_password)
   */
  data: GuideAutoSaveData;

  /**
   * 디바운스 시간 (밀리초)
   * @default 1500
   */
  debounceMs?: number;

  /**
   * 자동저장 활성화 여부
   * @default true
   */
  enabled?: boolean;
}

/**
 * useAutoSave 훅 반환 타입
 */
export interface UseAutoSaveResult {
  /**
   * 저장 상태
   * - idle: 대기 중
   * - saving: 저장 중
   * - saved: 저장 완료
   * - error: 저장 실패
   */
  status: "idle" | "saving" | "saved" | "error";

  /**
   * 마지막 저장 시간
   */
  lastSavedAt: Date | null;

  /**
   * 에러 객체
   */
  error: Error | null;

  /**
   * 수동 저장 함수
   */
  save: () => Promise<void>;
}

/**
 * 가이드 자동저장 훅
 *
 * @description
 * - 데이터 변경 시 디바운스를 적용하여 자동 저장
 * - 저장 중에는 새 저장 요청 대기
 * - 저장 상태 및 에러 관리
 *
 * @example
 * ```tsx
 * function GuideEditor() {
 *   const [title, setTitle] = useState("");
 *   const [blocks, setBlocks] = useState([]);
 *
 *   const { status, lastSavedAt, error, save } = useAutoSave({
 *     guideId: "guide-123",
 *     data: { title, content_blocks: blocks },
 *     debounceMs: 1500,
 *   });
 *
 *   return (
 *     <div>
 *       <input value={title} onChange={(e) => setTitle(e.target.value)} />
 *       <SaveStatus status={status} lastSavedAt={lastSavedAt} />
 *       {error && <ErrorMessage error={error} onRetry={save} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useAutoSave(options: UseAutoSaveOptions): UseAutoSaveResult {
  const {
    guideId,
    data,
    debounceMs = 1500,
    enabled = true,
  } = options;

  // 상태 관리
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // 디바운스 타이머 참조
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // 저장 중 플래그
  const isSavingRef = useRef(false);

  // 대기 중인 데이터 참조 (저장 중 새 변경사항 발생 시 저장 대기)
  const pendingDataRef = useRef<GuideAutoSaveData | null>(null);

  // 이전 데이터 참조 (불필요한 저장 방지)
  const prevDataRef = useRef<string>("");

  /**
   * 실제 저장 함수
   */
  const performSave = useCallback(async (saveData: GuideAutoSaveData) => {
    // 이미 저장 중이면 대기열에 추가
    if (isSavingRef.current) {
      pendingDataRef.current = saveData;
      return;
    }

    try {
      isSavingRef.current = true;
      setStatus("saving");
      setError(null);

      // ContentBlock을 API가 기대하는 형태로 변환
      const apiData: UpdateGuideRequest = {
        title: saveData.title,
        wifi_ssid: saveData.wifi_ssid,
        wifi_password: saveData.wifi_password,
      };

      if (saveData.content_blocks) {
        apiData.content_blocks = saveData.content_blocks.map((block) => ({
          id: block.id,
          type: block.type,
          order: block.order,
          data: block.data as unknown as Record<string, unknown>,
        }));
      }

      const response = await fetch(`/api/guides/${guideId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다");
        }
        if (response.status === 403) {
          throw new Error("수정 권한이 없습니다");
        }
        if (response.status === 404) {
          throw new Error("가이드를 찾을 수 없습니다");
        }
        throw new Error(`저장에 실패했습니다 (${response.status})`);
      }

      const result: ApiResponse<{ guide: Guide }> = await response.json();

      if (!result.success) {
        throw new Error(result.error?.message || "저장에 실패했습니다");
      }

      // 저장 성공
      setStatus("saved");
      setLastSavedAt(new Date());
      prevDataRef.current = JSON.stringify(saveData);

      // 3초 후 idle 상태로 전환 (UI 피드백)
      setTimeout(() => {
        setStatus((current) => (current === "saved" ? "idle" : current));
      }, 3000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다";
      setError(new Error(errorMessage));
      setStatus("error");
    } finally {
      isSavingRef.current = false;

      // 대기 중인 데이터가 있으면 저장
      if (pendingDataRef.current) {
        const pendingData = pendingDataRef.current;
        pendingDataRef.current = null;
        performSave(pendingData);
      }
    }
  }, [guideId]);

  /**
   * 수동 저장 함수
   */
  const save = useCallback(async () => {
    // 타이머가 있으면 취소 (즉시 저장)
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }

    await performSave(data);
  }, [data, performSave]);

  /**
   * 데이터 변경 감지 및 디바운스 자동 저장
   */
  useEffect(() => {
    if (!enabled) return;

    const currentData = JSON.stringify(data);

    // 데이터가 변경되지 않았으면 무시
    if (currentData === prevDataRef.current) {
      return;
    }

    // 빈 데이터는 저장하지 않음
    if (!data.title && !data.content_blocks && !data.wifi_ssid && !data.wifi_password) {
      return;
    }

    // 기존 타이머 취소
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // 새 타이머 시작
    debounceTimer.current = setTimeout(() => {
      performSave(data);
    }, debounceMs);

    // cleanup
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [data, debounceMs, enabled, performSave]);

  /**
   * 컴포넌트 언마운트 시 정리
   */
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    status,
    lastSavedAt,
    error,
    save,
  };
}
