"use client";

import { useState, useMemo } from "react";
import { BlockPaletteItem } from "@/types/editor";
import { BlockType } from "@/types";
import { cn } from "@/lib/utils";

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
  const [searchQuery, setSearchQuery] = useState("");

  // 검색어로 필터링된 블록 목록
  const filteredBlocks = useMemo(() => {
    if (!searchQuery.trim()) {
      return blockPalette;
    }
    const query = searchQuery.toLowerCase();
    return blockPalette.filter(
      (block) =>
        block.label.toLowerCase().includes(query) ||
        block.type.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const basicBlocks = filteredBlocks.filter((b) => b.category === "basic");
  const contentBlocks = filteredBlocks.filter((b) => b.category === "content");
  const locationBlocks = filteredBlocks.filter((b) => b.category === "location");

  const handleBlockClick = (type: BlockType) => {
    if (onAddBlock) {
      onAddBlock(type);
    }
  };

  const hasResults = filteredBlocks.length > 0;

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-lg pl-10 pr-10 py-2 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Block Categories */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {!hasResults ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-3">
              search_off
            </span>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              &quot;{searchQuery}&quot;에 대한 검색 결과가 없습니다
            </p>
          </div>
        ) : (
          <>
            {/* Basic Info */}
            {basicBlocks.length > 0 && (
              <BlockCategory
                title="기본정보 (Basic)"
                blocks={basicBlocks}
                onBlockClick={handleBlockClick}
              />
            )}

            {/* Content */}
            {contentBlocks.length > 0 && (
              <BlockCategory
                title="콘텐츠 (Content)"
                blocks={contentBlocks}
                onBlockClick={handleBlockClick}
              />
            )}

            {/* Location */}
            {locationBlocks.length > 0 && (
              <BlockCategory
                title="위치 (Location)"
                blocks={locationBlocks}
                onBlockClick={handleBlockClick}
              />
            )}
          </>
        )}
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
          <DraggableBlockItem
            key={block.type}
            block={block}
            onClick={() => onBlockClick(block.type)}
          />
        ))}
      </div>
    </div>
  );
}

interface DraggableBlockItemProps {
  block: BlockPaletteItem;
  onClick: () => void;
}

function DraggableBlockItem({ block, onClick }: DraggableBlockItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 cursor-pointer transition-all bg-white dark:bg-slate-900 shadow-sm hover:shadow-md"
      )}
    >
      <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 group-hover:text-blue-500 text-[28px]">
        {block.icon}
      </span>
      <span className="text-xs font-medium text-slate-600 dark:text-slate-300 group-hover:text-blue-500">
        {block.label}
      </span>
    </button>
  );
}
