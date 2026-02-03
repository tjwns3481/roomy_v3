"use client";

import { useState } from "react";
import { GuideTheme, defaultTheme, themePresets } from "@/types/theme";
import { cn } from "@/lib/utils";

interface ThemePanelProps {
  theme: GuideTheme;
  onThemeChange: (theme: GuideTheme) => void;
  onClose?: () => void;
}

const colorOptions = [
  { name: "Yellow", value: "#FACC15" },
  { name: "Sky", value: "#0EA5E9" },
  { name: "Green", value: "#22C55E" },
  { name: "Orange", value: "#F97316" },
  { name: "Violet", value: "#A78BFA" },
  { name: "Rose", value: "#F43F5E" },
  { name: "Slate", value: "#64748B" },
];

const fontOptions = [
  { label: "기본", value: "default" as const },
  { label: "세리프", value: "serif" as const },
  { label: "모노", value: "mono" as const },
];

const radiusOptions = [
  { label: "없음", value: "none" as const },
  { label: "작게", value: "sm" as const },
  { label: "중간", value: "md" as const },
  { label: "크게", value: "lg" as const },
  { label: "둥글게", value: "full" as const },
];

export function ThemePanel({ theme, onThemeChange, onClose }: ThemePanelProps) {
  const [activeTab, setActiveTab] = useState<"presets" | "custom">("presets");

  const handlePresetSelect = (presetKey: string) => {
    onThemeChange(themePresets[presetKey]);
  };

  const handleColorChange = (color: string) => {
    onThemeChange({ ...theme, primaryColor: color });
  };

  const handleFontChange = (font: GuideTheme["fontFamily"]) => {
    onThemeChange({ ...theme, fontFamily: font });
  };

  const handleRadiusChange = (radius: GuideTheme["borderRadius"]) => {
    onThemeChange({ ...theme, borderRadius: radius });
  };

  const handleDarkModeToggle = () => {
    onThemeChange({ ...theme, darkMode: !theme.darkMode });
  };

  return (
    <aside className="w-[300px] bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col shrink-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-500">
            palette
          </span>
          <h2 className="font-semibold text-sm text-slate-800 dark:text-white">
            테마 설정
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab("presets")}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
            activeTab === "presets"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          프리셋
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
            activeTab === "custom"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          커스텀
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {activeTab === "presets" ? (
          <div className="space-y-3">
            {Object.entries(themePresets).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => handlePresetSelect(key)}
                className={cn(
                  "w-full p-4 rounded-xl border-2 transition-all text-left",
                  theme.primaryColor === preset.primaryColor &&
                    theme.backgroundColor === preset.backgroundColor
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-8 h-8 rounded-lg"
                    style={{ backgroundColor: preset.primaryColor }}
                  />
                  <span className="font-medium text-sm text-slate-800 dark:text-white capitalize">
                    {key}
                  </span>
                </div>
                <div className="flex gap-1">
                  <div
                    className="w-6 h-4 rounded"
                    style={{ backgroundColor: preset.backgroundColor }}
                  />
                  <div
                    className="w-6 h-4 rounded"
                    style={{ backgroundColor: preset.surfaceColor }}
                  />
                  <div
                    className="w-6 h-4 rounded"
                    style={{ backgroundColor: preset.textColor }}
                  />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Primary Color */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                메인 색상
              </label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorChange(color.value)}
                    className={cn(
                      "w-10 h-10 rounded-xl transition-all",
                      theme.primaryColor === color.value
                        ? "ring-2 ring-offset-2 ring-blue-500 scale-110"
                        : "hover:scale-105"
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                폰트
              </label>
              <div className="flex gap-2">
                {fontOptions.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => handleFontChange(font.value)}
                    className={cn(
                      "flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all",
                      theme.fontFamily === font.value
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    )}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                모서리 둥글기
              </label>
              <div className="flex gap-2 flex-wrap">
                {radiusOptions.map((radius) => (
                  <button
                    key={radius.value}
                    onClick={() => handleRadiusChange(radius.value)}
                    className={cn(
                      "py-2 px-3 rounded-lg text-sm font-medium transition-all",
                      theme.borderRadius === radius.value
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                    )}
                  >
                    {radius.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                다크 모드
              </label>
              <button
                onClick={handleDarkModeToggle}
                className={cn(
                  "w-full py-3 px-4 rounded-lg flex items-center justify-between transition-all",
                  theme.darkMode
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-800"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">
                    {theme.darkMode ? "dark_mode" : "light_mode"}
                  </span>
                  <span className="font-medium">
                    {theme.darkMode ? "다크 모드" : "라이트 모드"}
                  </span>
                </div>
                <div
                  className={cn(
                    "w-10 h-6 rounded-full relative transition-colors",
                    theme.darkMode ? "bg-blue-500" : "bg-slate-300"
                  )}
                >
                  <div
                    className={cn(
                      "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform",
                      theme.darkMode ? "translate-x-5" : "translate-x-1"
                    )}
                  />
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <div className="p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <button
          onClick={() => onThemeChange(defaultTheme)}
          className="w-full py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        >
          기본값으로 초기화
        </button>
      </div>
    </aside>
  );
}
