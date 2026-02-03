"use client";

import { ContentBlock } from "@/types";

interface VideoPropertiesProps {
  block: ContentBlock;
  onUpdate: (data: Record<string, unknown>) => void;
}

/**
 * YouTube/Vimeo URL을 embed URL로 변환
 */
function convertToEmbedUrl(url: string): string {
  if (!url) return "";

  // YouTube 정규 표현식
  const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const youtubeMatch = url.match(youtubeRegex);

  if (youtubeMatch && youtubeMatch[1]) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  // Vimeo 정규 표현식
  const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
  const vimeoMatch = url.match(vimeoRegex);

  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // 이미 embed URL이거나 다른 URL인 경우 그대로 반환
  return url;
}

export function VideoProperties({ block, onUpdate }: VideoPropertiesProps) {
  // Video 블록은 현재 타입 정의에 없으므로 기본 구조로 처리
  const data = block.data as {
    url?: string;
    caption?: string;
    autoplay?: boolean;
  };

  const handleUrlChange = (newUrl: string) => {
    const embedUrl = convertToEmbedUrl(newUrl);
    onUpdate({ ...data, url: embedUrl });
  };

  return (
    <div className="space-y-6">
      {/* Section: Video */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          비디오
        </h3>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            비디오 URL
          </label>
          <input
            type="url"
            value={data.url || ""}
            onChange={(e) => handleUrlChange(e.target.value)}
            onBlur={(e) => handleUrlChange(e.target.value)}
            className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <p className="text-xs text-slate-400">
            YouTube, Vimeo URL을 입력하세요
          </p>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            캡션 (선택)
          </label>
          <input
            type="text"
            value={data.caption || ""}
            onChange={(e) => onUpdate({ ...data, caption: e.target.value })}
            className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
            placeholder="비디오 설명을 입력하세요"
          />
        </div>
        <div className="flex items-center justify-between py-1">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            자동 재생
          </label>
          <button
            onClick={() =>
              onUpdate({ ...data, autoplay: !data.autoplay })
            }
            className={`w-9 h-5 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              data.autoplay ? "bg-blue-500" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                data.autoplay ? "right-0.5" : "left-0.5"
              }`}
            ></span>
          </button>
        </div>
      </div>

      <hr className="border-slate-200 dark:border-slate-700" />

      {/* Section: Upload Button */}
      <div className="space-y-2">
        <button className="w-full py-2.5 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[20px]">
            upload
          </span>
          파일 업로드
        </button>
        <p className="text-xs text-slate-400 text-center">
          MP4, MOV (최대 50MB)
        </p>
      </div>
    </div>
  );
}
