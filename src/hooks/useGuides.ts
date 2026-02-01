// @TASK P3-S1-T2 - 가이드 목록 조회 훅
// @SPEC 검색/필터 기능, 로딩/에러 상태 관리

"use client";

import { useEffect, useState, useCallback } from "react";
import type { Guide, ApiResponse } from "@/types";

/**
 * useGuides 훅 옵션 인터페이스
 */
export interface UseGuidesOptions {
  /**
   * 제목 검색어 (클라이언트 사이드 필터링)
   */
  search?: string;

  /**
   * 발행 상태 필터
   * - 'all': 전체 가이드
   * - 'published': 발행된 가이드만
   * - 'draft': 임시저장된 가이드만
   */
  status?: "all" | "published" | "draft";

  /**
   * 특정 숙소의 가이드만 조회 (선택)
   */
  accommodation_id?: string;
}

/**
 * useGuides 훅 반환 타입
 */
export interface UseGuidesResult {
  /**
   * 필터링된 가이드 목록
   */
  guides: Guide[];

  /**
   * 로딩 상태
   */
  isLoading: boolean;

  /**
   * 에러 객체
   */
  error: Error | null;

  /**
   * 데이터 재조회 함수
   */
  refetch: () => void;
}

/**
 * 가이드 목록을 조회하고 관리하는 훅
 *
 * @example
 * ```tsx
 * function GuidesList() {
 *   const { guides, isLoading, error, refetch } = useGuides({
 *     search: "제주도",
 *     status: "published"
 *   });
 *
 *   if (isLoading) return <div>로딩 중...</div>;
 *   if (error) return <div>에러: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       {guides.map(guide => (
 *         <GuideCard key={guide.id} guide={guide} />
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useGuides(options: UseGuidesOptions = {}): UseGuidesResult {
  const { search = "", status = "all", accommodation_id } = options;

  // 상태 관리
  const [rawGuides, setRawGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * API로부터 가이드 목록 조회
   */
  const fetchGuides = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 쿼리 파라미터 생성
      const params = new URLSearchParams();
      if (accommodation_id) {
        params.append("accommodation_id", accommodation_id);
      }

      const url = `/api/guides${params.toString() ? `?${params.toString()}` : ""}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("로그인이 필요합니다");
        }
        throw new Error(`가이드 목록을 불러올 수 없습니다 (${response.status})`);
      }

      const result: ApiResponse<{ guides: Guide[] }> = await response.json();

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || "가이드 목록을 불러올 수 없습니다");
      }

      setRawGuides(result.data.guides);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다";
      setError(new Error(errorMessage));
      setRawGuides([]);
    } finally {
      setIsLoading(false);
    }
  }, [accommodation_id]);

  /**
   * 검색어와 상태 필터를 적용한 가이드 목록
   */
  const filteredGuides = rawGuides.filter((guide) => {
    // 1. 검색어 필터링 (제목)
    const matchesSearch = !search ||
      guide.title.toLowerCase().includes(search.toLowerCase());

    // 2. 발행 상태 필터링
    let matchesStatus = true;
    if (status === "published") {
      matchesStatus = guide.is_published === true;
    } else if (status === "draft") {
      matchesStatus = guide.is_published === false;
    }
    // status === "all"인 경우 matchesStatus는 true 유지

    return matchesSearch && matchesStatus;
  });

  /**
   * 컴포넌트 마운트 시 및 accommodation_id 변경 시 데이터 조회
   */
  useEffect(() => {
    fetchGuides();
  }, [fetchGuides]);

  return {
    guides: filteredGuides,
    isLoading,
    error,
    refetch: fetchGuides,
  };
}
