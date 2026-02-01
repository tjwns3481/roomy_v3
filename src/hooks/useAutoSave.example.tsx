// @TASK P3-S2-T6 - useAutoSave 사용 예시
// @SPEC 자동저장 훅 사용법 데모

"use client";

import { useState } from "react";
import { useAutoSave } from "./useAutoSave";
import { SaveStatusIndicator } from "@/components/editor/SaveStatusIndicator";
import type { ContentBlock } from "@/types";

/**
 * 가이드 에디터 예시 컴포넌트
 */
export function GuideEditorExample() {
  const guideId = "example-guide-id";

  // 에디터 상태
  const [title, setTitle] = useState("제주도 숙소 가이드");
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [wifiSsid, setWifiSsid] = useState("MyWiFi");
  const [wifiPassword, setWifiPassword] = useState("password123");

  // 자동저장 훅
  const { status, lastSavedAt, error, save } = useAutoSave({
    guideId,
    data: {
      title,
      content_blocks: blocks,
      wifi_ssid: wifiSsid,
      wifi_password: wifiPassword,
    },
    debounceMs: 1500, // 1.5초 디바운스
    enabled: true,
  });

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">가이드 편집</h1>

        {/* 저장 상태 표시 */}
        <SaveStatusIndicator
          status={status}
          lastSavedAt={lastSavedAt}
          error={error}
          onRetry={save}
        />
      </div>

      {/* 제목 입력 */}
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2"
          placeholder="가이드 제목을 입력하세요"
        />
      </div>

      {/* WiFi 정보 */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium">WiFi SSID</label>
          <input
            type="text"
            value={wifiSsid}
            onChange={(e) => setWifiSsid(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            placeholder="WiFi 네트워크 이름"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">WiFi 비밀번호</label>
          <input
            type="text"
            value={wifiPassword}
            onChange={(e) => setWifiPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            placeholder="WiFi 비밀번호"
          />
        </div>
      </div>

      {/* 수동 저장 버튼 */}
      <div className="mt-6">
        <button
          onClick={save}
          disabled={status === "saving"}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {status === "saving" ? "저장 중..." : "지금 저장"}
        </button>
      </div>

      {/* 디버그 정보 */}
      <div className="mt-8 rounded-lg bg-gray-100 p-4 text-sm">
        <h3 className="mb-2 font-medium">디버그 정보</h3>
        <div className="space-y-1 text-gray-600">
          <div>상태: {status}</div>
          <div>
            마지막 저장:{" "}
            {lastSavedAt ? lastSavedAt.toLocaleString("ko-KR") : "없음"}
          </div>
          <div>에러: {error?.message || "없음"}</div>
        </div>
      </div>
    </div>
  );
}

/**
 * 블록 에디터와 함께 사용하는 예시
 */
export function BlockEditorWithAutoSave() {
  const guideId = "example-guide-id";
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  // 자동저장 (블록 변경만 감지)
  const { status, lastSavedAt, error } = useAutoSave({
    guideId,
    data: {
      content_blocks: blocks,
    },
    debounceMs: 2000, // 2초 디바운스
  });

  const addTextBlock = () => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type: "text",
      order: blocks.length,
      data: {
        content: "새 텍스트 블록",
      },
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">블록 에디터</h1>
        <SaveStatusIndicator
          status={status}
          lastSavedAt={lastSavedAt}
          error={error}
        />
      </div>

      <button
        onClick={addTextBlock}
        className="mb-4 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        텍스트 블록 추가
      </button>

      <div className="space-y-4">
        {blocks.map((block) => (
          <div
            key={block.id}
            className="flex items-center justify-between rounded-lg border border-gray-300 p-4"
          >
            <div>
              <div className="font-medium">{block.type} 블록</div>
              <div className="text-sm text-gray-600">Order: {block.order}</div>
            </div>
            <button
              onClick={() => removeBlock(block.id)}
              className="text-red-600 hover:text-red-700"
            >
              삭제
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
