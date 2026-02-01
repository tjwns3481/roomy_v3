"use client";

import { BlockPaletteItem } from "@/types/editor";
import { BlockType } from "@/types";

const blockPalette: BlockPaletteItem[] = [
  // Basic Info
  { type: "wifi", icon: "wifi", label: "Wi-Fi", category: "basic" },
  { type: "contact", icon: "phone", label: "연락처", category: "basic" },
  { type: "rules", icon: "gavel", label: "이용규칙", category: "basic" },
  { type: "devices", icon: "home", label: "시설안내", category: "basic" },

  // Content
  { type: "text", icon: "article", label: "텍스트", category: "content" },
  { type: "image", icon: "image", label: "이미지", category: "content" },
  { type: "gallery", icon: "grid_view", label: "갤러리", category: "content" },
  { type: "video", icon: "smart_display", label: "동영상", category: "content" },

  // Location
  { type: "map", icon: "map", label: "지도", category: "location" },
  { type: "places", icon: "location_on", label: "주변장소", category: "location" },
];

interface SidebarProps {
  onAddBlock?: (type: BlockType) => void;
}

export function Sidebar({ onAddBlock }: SidebarProps) {
  const basicBlocks = blockPalette.filter((b) => b.category === "basic");
  const contentBlocks = blockPalette.filter((b) => b.category === "content");
  const locationBlocks = blockPalette.filter((b) => b.category === "location");

  const handleBlockClick = (type: BlockType) => {
    if (onAddBlock) {
      onAddBlock(type);
    }
  };

  return (
    <aside className="w-[280px] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shrink-0">
      {/* Search */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="블록 검색..."
            className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-lg pl-10 pr-4 py-2 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Block Categories */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Info */}
        <BlockCategory
          title="기본정보 (Basic)"
          blocks={basicBlocks}
          onBlockClick={handleBlockClick}
        />

        {/* Content */}
        <BlockCategory
          title="콘텐츠 (Content)"
          blocks={contentBlocks}
          onBlockClick={handleBlockClick}
        />

        {/* Location */}
        <BlockCategory
          title="위치 (Location)"
          blocks={locationBlocks}
          onBlockClick={handleBlockClick}
        />
      </div>
    </aside>
  );
}

interface BlockCategoryProps {
  title: string;
  blocks: BlockPaletteItem[];
  onBlockClick: (type: BlockType) => void;
}

function BlockCategory({ title, blocks, onBlockClick }: BlockCategoryProps) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {blocks.map((block) => (
          <button
            key={block.type}
            onClick={() => onBlockClick(block.type)}
            className="group flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer transition-all bg-white dark:bg-slate-900 shadow-sm hover:shadow-md"
          >
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 group-hover:text-blue-500 text-[28px]">
              {block.icon}
            </span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-blue-500">
              {block.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
