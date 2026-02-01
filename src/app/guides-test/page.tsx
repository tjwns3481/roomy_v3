// @TASK P3-S1-T2 - useGuides 훅 테스트 페이지
// @NOTE 이 파일은 테스트용이며 실제 배포 시 제거됩니다

"use client";

import { useState } from "react";
import { useGuides } from "@/hooks/useGuides";

export default function GuidesTestPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");

  const { guides, isLoading, error, refetch } = useGuides({
    search,
    status,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">useGuides 훅 테스트</h1>

        {/* 검색 및 필터 */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 검색 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 검색
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="가이드 제목 입력..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 상태 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                발행 상태
              </label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "all" | "published" | "draft")
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">전체</option>
                <option value="published">발행됨</option>
                <option value="draft">임시저장</option>
              </select>
            </div>
          </div>

          <button
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            새로고침
          </button>
        </div>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-gray-600">로딩 중...</div>
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg mb-6">
            <h2 className="text-red-800 font-semibold mb-2">에러 발생</h2>
            <p className="text-red-600">{error.message}</p>
          </div>
        )}

        {/* 가이드 목록 */}
        {!isLoading && !error && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              총 {guides.length}개의 가이드
            </div>

            {guides.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                가이드가 없습니다
              </div>
            ) : (
              guides.map((guide) => (
                <div
                  key={guide.id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {guide.title}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        guide.is_published
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {guide.is_published ? "발행됨" : "임시저장"}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Slug: {guide.slug}</p>
                    <p>조회수: {guide.view_count}</p>
                    <p>블록 개수: {guide.content_blocks?.length || 0}</p>
                    <p>
                      생성일:{" "}
                      {new Date(guide.created_at).toLocaleDateString("ko-KR")}
                    </p>
                    <p>
                      수정일:{" "}
                      {new Date(guide.updated_at).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
