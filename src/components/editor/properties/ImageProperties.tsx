"use client";

import { ContentBlock, ImageBlockData } from "@/types";

interface ImagePropertiesProps {
  block: ContentBlock;
  onUpdate: (data: Partial<ImageBlockData>) => void;
}

export function ImageProperties({ block, onUpdate }: ImagePropertiesProps) {
  const data = block.data as ImageBlockData;

  return (
    <div className="space-y-6">
      {/* Section: Image */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          이미지
        </h3>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            이미지 URL
          </label>
          <input
            type="url"
            value={data.url}
            onChange={(e) => onUpdate({ url: e.target.value })}
            className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        {data.url && (
          <div className="mt-3 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
            <img
              src={data.url}
              alt="Preview"
              className="w-full h-auto"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            캡션 (선택)
          </label>
          <input
            type="text"
            value={data.caption || ""}
            onChange={(e) => onUpdate({ caption: e.target.value })}
            className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
            placeholder="이미지 설명을 입력하세요"
          />
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
          JPG, PNG, GIF (최대 5MB)
        </p>
      </div>
    </div>
  );
}
