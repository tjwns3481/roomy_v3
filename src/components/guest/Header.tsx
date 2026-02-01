"use client";

import { useState } from "react";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    // Web Share API 지원 확인
    if (!navigator.share) {
      // 폴백: 클립보드 복사
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("링크가 복사되었습니다");
      } catch (err) {
        console.error("Failed to copy:", err);
      }
      return;
    }

    setIsSharing(true);
    try {
      await navigator.share({
        title: title,
        url: window.location.href,
      });
    } catch (err) {
      // 사용자가 취소한 경우 무시
      if ((err as Error).name !== "AbortError") {
        console.error("Share failed:", err);
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between py-4">
        {/* 가이드 제목 */}
        <h1 className="text-lg font-bold text-slate-900 truncate flex-1">
          {title}
        </h1>

        {/* 공유 버튼 */}
        <button
          onClick={handleShare}
          disabled={isSharing}
          className="ml-3 p-2 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors disabled:opacity-50"
          aria-label="공유하기"
        >
          <svg
            className="w-5 h-5 text-slate-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
