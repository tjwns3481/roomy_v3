"use client";

import { ContentBlock, TextBlockData } from "@/types";

interface TextPropertiesProps {
  block: ContentBlock;
  onUpdate: (data: Partial<TextBlockData>) => void;
}

export function TextProperties({ block, onUpdate }: TextPropertiesProps) {
  const data = block.data as TextBlockData;

  return (
    <div className="space-y-6">
      {/* Section: Content */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          콘텐츠 입력
        </h3>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            제목 (선택)
          </label>
          <input
            type="text"
            value={data.title || ""}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
            placeholder="제목을 입력하세요"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            내용
          </label>
          <textarea
            value={data.content}
            onChange={(e) => onUpdate({ content: e.target.value })}
            className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-2 px-3 resize-none"
            rows={6}
            placeholder="내용을 입력하세요"
          />
        </div>
      </div>

      <hr className="border-slate-200 dark:border-slate-700" />

      {/* Section: Style */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          스타일 설정
        </h3>
        {/* Font Size */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            글자 크기
          </label>
          <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
            <button
              onClick={() => onUpdate({ fontSize: "sm" })}
              className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
                data.fontSize === "sm"
                  ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              작게
            </button>
            <button
              onClick={() => onUpdate({ fontSize: "md" })}
              className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
                data.fontSize === "md" || !data.fontSize
                  ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              보통
            </button>
            <button
              onClick={() => onUpdate({ fontSize: "lg" })}
              className={`flex-1 py-1.5 rounded text-xs font-medium transition-colors ${
                data.fontSize === "lg"
                  ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              크게
            </button>
          </div>
        </div>
        {/* Alignment */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            정렬
          </label>
          <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
            <button
              onClick={() => onUpdate({ alignment: "left" })}
              className={`flex-1 py-1 rounded transition-colors ${
                data.alignment === "left" || !data.alignment
                  ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              } flex items-center justify-center`}
            >
              <span className="material-symbols-outlined text-[18px]">
                format_align_left
              </span>
            </button>
            <button
              onClick={() => onUpdate({ alignment: "center" })}
              className={`flex-1 py-1 rounded transition-colors ${
                data.alignment === "center"
                  ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              } flex items-center justify-center`}
            >
              <span className="material-symbols-outlined text-[18px]">
                format_align_center
              </span>
            </button>
            <button
              onClick={() => onUpdate({ alignment: "right" })}
              className={`flex-1 py-1 rounded transition-colors ${
                data.alignment === "right"
                  ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              } flex items-center justify-center`}
            >
              <span className="material-symbols-outlined text-[18px]">
                format_align_right
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
