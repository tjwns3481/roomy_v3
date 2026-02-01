"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { PreviewPanel } from "./PreviewPanel";
import { BlockType, ContentBlock } from "@/types";

interface EditorLayoutProps {
  guideId: string;
  initialBlocks?: ContentBlock[];
  children?: React.ReactNode;
}

export function EditorLayout({
  guideId,
  initialBlocks = [],
  children,
}: EditorLayoutProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">(
    "saved"
  );

  const handleAddBlock = (type: BlockType) => {
    console.log("Add block:", type);
    // TODO: Implement add block logic
  };

  const handleSelectBlock = (blockId: string) => {
    setSelectedBlockId(blockId);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 z-20">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-4 w-1/3">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-300">
            <span className="material-symbols-outlined text-[20px]">
              arrow_back
            </span>
          </button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
          <input
            className="bg-transparent border-none text-lg font-bold text-slate-800 dark:text-white focus:ring-0 p-0 hover:text-blue-500 transition-colors cursor-text truncate w-full"
            type="text"
            defaultValue="제주 풀빌라 가이드"
          />
        </div>

        {/* Center: Status & Device Toggle */}
        <div className="flex items-center justify-center gap-6 w-1/3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <span
              className={`material-symbols-outlined text-[16px] ${
                saveStatus === "saved"
                  ? "text-green-500"
                  : saveStatus === "saving"
                    ? "text-yellow-500"
                    : "text-slate-400"
              }`}
            >
              {saveStatus === "saved" ? "check_circle" : "pending"}
            </span>
            <span>
              {saveStatus === "saved"
                ? "저장됨"
                : saveStatus === "saving"
                  ? "저장 중..."
                  : "저장되지 않음"}
            </span>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center gap-1">
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`p-1.5 rounded transition-colors ${
                deviceMode === "mobile"
                  ? "bg-white dark:bg-slate-600 shadow-sm text-blue-500 dark:text-white"
                  : "hover:bg-white/50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                smartphone
              </span>
            </button>
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`p-1.5 rounded transition-colors ${
                deviceMode === "desktop"
                  ? "bg-white dark:bg-slate-600 shadow-sm text-blue-500 dark:text-white"
                  : "hover:bg-white/50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                desktop_windows
              </span>
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-3 w-1/3">
          <button
            className="flex items-center justify-center size-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Theme Settings"
          >
            <span className="material-symbols-outlined text-[20px]">
              palette
            </span>
          </button>
          <button
            className="flex items-center justify-center size-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Preview"
          >
            <span className="material-symbols-outlined text-[20px]">
              visibility
            </span>
          </button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-2">
            <span>발행</span>
            <span className="material-symbols-outlined text-[16px]">
              rocket_launch
            </span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Component Library */}
        <Sidebar onAddBlock={handleAddBlock} />

        {/* Center: Canvas / Mobile Preview */}
        <main className="flex-1 bg-slate-100 dark:bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center p-8">
          {/* Canvas Toolbar (Zoom, etc) */}
          <div className="absolute top-6 right-6 flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 z-10">
            <button className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white">
              <span className="material-symbols-outlined text-[18px]">
                remove
              </span>
            </button>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 w-8 text-center">
              100%
            </span>
            <button className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white">
              <span className="material-symbols-outlined text-[18px]">
                add
              </span>
            </button>
          </div>

          {/* Mobile Device Frame */}
          <div
            className={`relative ${
              deviceMode === "mobile"
                ? "w-[375px] h-full max-h-[812px]"
                : "w-full h-full max-w-[1200px] max-h-[800px]"
            } bg-white dark:bg-black rounded-[${deviceMode === "mobile" ? "3rem" : "1rem"}] shadow-2xl ${
              deviceMode === "mobile"
                ? "border-[8px] border-slate-900 dark:border-slate-800"
                : "border border-slate-300 dark:border-slate-700"
            } overflow-hidden ring-1 ring-slate-900/5 shrink-0 transition-all duration-300`}
          >
            {/* Notch (mobile only) */}
            {deviceMode === "mobile" && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-slate-900 rounded-b-xl z-20"></div>
            )}

            {/* Screen Content */}
            <div className="h-full w-full overflow-y-auto bg-slate-50 relative pb-10">
              {children}

              {/* Default placeholder if no children */}
              {!children && (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <span className="material-symbols-outlined text-slate-300 text-[64px] mb-4">
                    add_box
                  </span>
                  <p className="text-slate-400 text-sm">
                    왼쪽 사이드바에서 블록을 추가하여 가이드를 만들어보세요
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Bar Indicator (mobile only) */}
            {deviceMode === "mobile" && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-900 dark:bg-slate-700 rounded-full z-20"></div>
            )}
          </div>
        </main>

        {/* Right Sidebar: Properties Panel */}
        <PreviewPanel selectedBlockId={selectedBlockId} />
      </div>
    </div>
  );
}
