// @TASK P3-S2-T6 - 저장 상태 표시 컴포넌트
// @SPEC 자동저장 상태 및 시간 표시

"use client";

import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface SaveStatusIndicatorProps {
  status: "idle" | "saving" | "saved" | "error";
  lastSavedAt: Date | null;
  error: Error | null;
  onRetry?: () => void;
}

/**
 * 저장 상태 표시 컴포넌트
 *
 * @example
 * ```tsx
 * const { status, lastSavedAt, error, save } = useAutoSave({ ... });
 *
 * <SaveStatusIndicator
 *   status={status}
 *   lastSavedAt={lastSavedAt}
 *   error={error}
 *   onRetry={save}
 * />
 * ```
 */
export function SaveStatusIndicator({
  status,
  lastSavedAt,
  error,
  onRetry,
}: SaveStatusIndicatorProps) {
  // 저장 중
  if (status === "saving") {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
        <span>저장 중...</span>
      </div>
    );
  }

  // 저장 완료
  if (status === "saved" && lastSavedAt) {
    const timeAgo = formatDistanceToNow(lastSavedAt, {
      addSuffix: true,
      locale: ko,
    });

    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="h-2 w-2 rounded-full bg-green-500" />
        <span>저장됨 · {timeAgo}</span>
      </div>
    );
  }

  // 에러
  if (status === "error" && error) {
    return (
      <div className="flex items-center gap-3 text-sm text-red-600">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <span>저장 실패: {error.message}</span>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-red-700 underline hover:text-red-800"
          >
            재시도
          </button>
        )}
      </div>
    );
  }

  // 마지막 저장 시간이 있으면 표시
  if (lastSavedAt) {
    const timeAgo = formatDistanceToNow(lastSavedAt, {
      addSuffix: true,
      locale: ko,
    });

    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>마지막 저장: {timeAgo}</span>
      </div>
    );
  }

  return null;
}
