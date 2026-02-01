"use client";

import { ContentBlock } from "@/types";

interface PreviewPanelProps {
  selectedBlockId: string | null;
  onClose?: () => void;
}

export function PreviewPanel({ selectedBlockId, onClose }: PreviewPanelProps) {
  if (!selectedBlockId) {
    return null;
  }

  return (
    <aside className="w-[300px] bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col shrink-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-500">wifi</span>
          <h2 className="font-semibold text-sm text-slate-800 dark:text-white">
            Wi-Fi 설정
          </h2>
        </div>
        <div className="flex gap-1">
          <button
            className="text-slate-400 hover:text-red-500 transition-colors"
            title="Delete Block"
          >
            <span className="material-symbols-outlined text-[18px]">
              delete
            </span>
          </button>
          <button
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Duplicate"
          >
            <span className="material-symbols-outlined text-[18px]">
              content_copy
            </span>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Section: Content */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            콘텐츠 입력
          </h3>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              제목
            </label>
            <input
              type="text"
              defaultValue="Wi-Fi 연결"
              className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              네트워크 이름 (SSID)
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[18px]">
                router
              </span>
              <input
                type="text"
                defaultValue="Jeju_Ocean_5G"
                className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 pl-9 py-2 pr-3"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              비밀번호
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[18px]">
                lock
              </span>
              <input
                type="text"
                defaultValue="ocean1234!"
                className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 pl-9 py-2 pr-10"
              />
              <button className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined text-[18px]">
                  visibility_off
                </span>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between py-1">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              QR코드 자동 생성
            </label>
            <button className="w-9 h-5 bg-blue-500 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform"></span>
            </button>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-700" />

        {/* Section: Style */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            스타일 설정
          </h3>
          {/* Icon Selector */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              아이콘
            </label>
            <div className="flex gap-2">
              <button className="size-9 rounded-lg bg-blue-50 border border-blue-500 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  wifi
                </span>
              </button>
              <button className="size-9 rounded-lg bg-slate-50 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-500 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  cell_tower
                </span>
              </button>
              <button className="size-9 rounded-lg bg-slate-50 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-500 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  signal_cellular_alt
                </span>
              </button>
              <button className="size-9 rounded-lg bg-slate-50 border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-slate-500 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  add
                </span>
              </button>
            </div>
          </div>
          {/* Color Picker */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              강조 색상
            </label>
            <div className="flex gap-2 flex-wrap">
              <button className="size-6 rounded-full bg-blue-500 ring-2 ring-offset-2 ring-blue-500"></button>
              <button className="size-6 rounded-full bg-red-500 hover:ring-2 hover:ring-offset-2 hover:ring-red-500 transition-all"></button>
              <button className="size-6 rounded-full bg-green-500 hover:ring-2 hover:ring-offset-2 hover:ring-green-500 transition-all"></button>
              <button className="size-6 rounded-full bg-amber-500 hover:ring-2 hover:ring-offset-2 hover:ring-amber-500 transition-all"></button>
              <button className="size-6 rounded-full bg-slate-800 hover:ring-2 hover:ring-offset-2 hover:ring-slate-800 transition-all"></button>
            </div>
          </div>
          {/* Alignment */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              정렬
            </label>
            <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
              <button className="flex-1 py-1 rounded bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">
                  format_align_left
                </span>
              </button>
              <button className="flex-1 py-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">
                  format_align_center
                </span>
              </button>
              <button className="flex-1 py-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">
                  format_align_right
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <button className="w-full py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
          설정 초기화
        </button>
      </div>
    </aside>
  );
}
