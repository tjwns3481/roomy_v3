"use client";

import { ContentBlock, WifiBlockData } from "@/types";
import { useState } from "react";

interface WifiPropertiesProps {
  block: ContentBlock;
  onUpdate: (data: Partial<WifiBlockData>) => void;
}

export function WifiProperties({ block, onUpdate }: WifiPropertiesProps) {
  const data = block.data as WifiBlockData;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Section: Content */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          콘텐츠 입력
        </h3>
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
              value={data.ssid}
              onChange={(e) => onUpdate({ ssid: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 pl-9 py-2 pr-3"
              placeholder="Wi-Fi 이름을 입력하세요"
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
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={(e) => onUpdate({ password: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 pl-9 py-2 pr-10"
              placeholder="비밀번호를 입력하세요"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
            >
              <span className="material-symbols-outlined text-[18px]">
                {showPassword ? "visibility" : "visibility_off"}
              </span>
            </button>
          </div>
        </div>
        {data.note !== undefined && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              참고사항 (선택)
            </label>
            <textarea
              value={data.note || ""}
              onChange={(e) => onUpdate({ note: e.target.value })}
              className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-2 px-3 resize-none"
              rows={2}
              placeholder="추가 안내사항을 입력하세요"
            />
          </div>
        )}
      </div>
    </div>
  );
}
