"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ContentBlock, Story } from "@/types";
import { BlockRenderer } from "@/components/guest/BlockRenderer";
import { cn } from "@/lib/utils";

const BLOCK_CONFIG: Record<string, { icon: string; label: string }> = {
  wifi: { icon: "wifi", label: "Wi-Fi" },
  text: { icon: "text_fields", label: "텍스트" },
  rules: { icon: "gavel", label: "이용규칙" },
  devices: { icon: "devices", label: "기기안내" },
  places: { icon: "location_on", label: "주변장소" },
  gallery: { icon: "photo_library", label: "갤러리" },
  image: { icon: "image", label: "이미지" },
  video: { icon: "videocam", label: "동영상" },
  map: { icon: "map", label: "지도" },
  contact: { icon: "contact_phone", label: "연락처" },
};

interface EditorPhonePreviewProps {
  blocks: ContentBlock[];
  stories: Story[];
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  deviceMode: "mobile" | "desktop";
  slug?: string;
  selectedBlockId?: string | null;
  showStory?: boolean;
  zoom?: number;
  onBlockSelect?: (blockId: string) => void;
  onBlocksReorder?: (blocks: ContentBlock[]) => void;
  onBlockDelete?: (blockId: string) => void;
  onStoryClick?: (storyId: string) => void;
  onHeroClick?: () => void;
  onQuickAccessClick?: (type: string) => void;
}

interface SortableBlockCardProps {
  block: ContentBlock;
  isSelected: boolean;
  onSelect: () => void;
  slug: string;
  onDelete?: (blockId: string) => void;
}

function SortableBlockCard({
  block,
  isSelected,
  onSelect,
  slug,
  onDelete,
}: SortableBlockCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const blockConfig = BLOCK_CONFIG[block.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative",
        isDragging && "opacity-50 z-50"
      )}
    >
      {/* 블록 타입 배지 (좌측 상단) */}
      <div className={cn(
        "absolute -top-2 left-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
        "bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700",
        "opacity-0 group-hover:opacity-100 transition-opacity",
        isSelected && "opacity-100"
      )}>
        <span className="material-symbols-outlined text-[14px] text-primary">
          {blockConfig?.icon || "widgets"}
        </span>
        <span className="text-slate-600 dark:text-slate-300">
          {blockConfig?.label || "블록"}
        </span>
      </div>

      {/* 드래그 핸들 (좌측 카드 내부) */}
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 z-20",
          "flex items-center justify-center w-6 h-10 rounded-md",
          "bg-slate-100/90 dark:bg-slate-700/90 backdrop-blur-sm",
          "cursor-grab active:cursor-grabbing",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          isDragging && "opacity-100 cursor-grabbing"
        )}
      >
        <span className="material-symbols-outlined text-slate-500 dark:text-slate-400 text-[16px]">
          drag_indicator
        </span>
      </div>

      {/* 액션 버튼들 (우측 상단) */}
      <div className={cn(
        "absolute -top-2 right-3 z-10 flex items-center gap-1",
        "opacity-0 group-hover:opacity-100 transition-opacity",
        isSelected && "opacity-100"
      )}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("이 블록을 삭제하시겠습니까?")) {
              onDelete?.(block.id);
            }
          }}
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-lg",
            "bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700",
            "text-slate-400 hover:text-red-500 hover:border-red-300",
            "transition-all"
          )}
          title="삭제"
        >
          <span className="material-symbols-outlined text-[16px]">delete</span>
        </button>
      </div>

      {/* 블록 콘텐츠 */}
      <div
        onClick={onSelect}
        className={cn(
          "cursor-pointer rounded-xl transition-all overflow-hidden",
          isSelected
            ? "ring-2 ring-primary ring-offset-2 shadow-lg"
            : "hover:ring-1 hover:ring-slate-300 dark:hover:ring-slate-600"
        )}
      >
        <BlockRenderer block={block} slug={slug} />
      </div>
    </div>
  );
}

export function EditorPhonePreview({
  blocks,
  stories,
  heroImage,
  heroTitle,
  heroSubtitle,
  deviceMode,
  slug = "preview",
  selectedBlockId,
  showStory = true,
  zoom = 100,
  onBlockSelect,
  onBlocksReorder,
  onBlockDelete,
  onStoryClick,
  onHeroClick,
  onQuickAccessClick,
}: EditorPhonePreviewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && active.id !== over.id) {
      const oldIndex = sortedBlocks.findIndex((b) => b.id === active.id);
      const newIndex = sortedBlocks.findIndex((b) => b.id === over.id);

      const reorderedBlocks = arrayMove(sortedBlocks, oldIndex, newIndex).map(
        (block, index) => ({ ...block, order: index })
      );

      onBlocksReorder?.(reorderedBlocks);
    }
  };

  const activeBlock = activeId
    ? sortedBlocks.find((b) => b.id === activeId)
    : null;

  // Quick Access 아이템을 블록 기반으로 동적 생성
  const blockTypeToQuickAccess: Record<string, { icon: string; label: string; color: string }> = {
    wifi: { icon: "wifi", label: "Wi-Fi", color: "blue" },
    text: { icon: "home", label: "House Info", color: "orange" },
    rules: { icon: "gavel", label: "Rules", color: "purple" },
    places: { icon: "restaurant", label: "Local Food", color: "red" },
    map: { icon: "map", label: "Map", color: "green" },
    contact: { icon: "call", label: "Contact", color: "gray" },
  };

  // 블록에서 고유한 타입만 추출하여 Quick Access 생성
  const quickAccessItems = Array.from(
    new Set(blocks.map(b => b.type))
  )
    .filter(type => blockTypeToQuickAccess[type])
    .map(type => ({ type, ...blockTypeToQuickAccess[type] }));

  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-500",
    orange: "bg-orange-50 text-orange-500",
    purple: "bg-purple-50 text-purple-500",
    red: "bg-red-50 text-red-500",
    green: "bg-green-50 text-green-500",
    gray: "bg-gray-50 text-gray-600",
  };

  return (
    <div
      className={cn(
        "relative bg-white dark:bg-black shadow-2xl overflow-hidden ring-1 ring-slate-900/5 shrink-0 transition-all duration-300",
        deviceMode === "mobile"
          ? "w-[375px] h-full max-h-[812px] rounded-[3rem] border-[8px] border-slate-900 dark:border-slate-800"
          : "w-full h-full max-w-[1400px] max-h-[900px] rounded-[1rem] border border-slate-300 dark:border-slate-700"
      )}
    >
      {/* Notch (mobile only) */}
      {deviceMode === "mobile" && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-slate-900 rounded-b-xl z-20"></div>
      )}

      {/* Screen Content */}
      <div className="h-full w-full overflow-y-auto no-scrollbar bg-guest-background-light relative">
        {/* Main Container */}
        <div className={cn(
          "mx-auto",
          deviceMode === "mobile" ? "max-w-[428px]" : "max-w-[1200px]"
        )}>
          {/* Header */}
          <header className="sticky top-0 z-40 bg-guest-background-light/80 backdrop-blur-md">
            <div className="flex items-center justify-between p-4 pb-2">
              <div className="flex size-10 shrink-0"></div>
              <h1 className="text-slate-900 text-lg font-bold leading-tight tracking-tight flex-1 text-center">
                {heroTitle || "가이드 제목"}
              </h1>
              <div className="flex size-10 items-center justify-center">
                <button className="relative flex items-center justify-center rounded-full size-10 hover:bg-black/5 transition-colors">
                  <span className="material-symbols-outlined text-slate-900">
                    notifications
                  </span>
                  <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-guest-background-light"></span>
                </button>
              </div>
            </div>
          </header>

          {/* Story Bubbles - showStory가 true일 때만 표시 */}
          {showStory && (
          <div className="w-full overflow-hidden pt-2 pb-4">
            <div className="flex flex-row items-start justify-start gap-5 px-4 overflow-x-auto no-scrollbar snap-x">
              {/* 스토리가 있으면 표시 */}
              {stories.map((story, index) => (
                <button
                  key={story.id}
                  onClick={() => onStoryClick?.(story.id)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 min-w-[72px] snap-start cursor-pointer group",
                    index === 0 ? "" : "opacity-90 hover:opacity-100 transition-opacity"
                  )}
                >
                  <div
                    className={cn(
                      "size-[72px] rounded-full p-[3px]",
                      index === 0 ? "story-gradient-border" : "border border-slate-200"
                    )}
                  >
                    <div
                      className={cn(
                        "w-full h-full bg-cover bg-center rounded-full",
                        index === 0 ? "border-2 border-white" : ""
                      )}
                      style={{
                        backgroundImage: `url(${story.media_url})`,
                      }}
                    />
                  </div>
                  <p
                    className={cn(
                      "text-xs font-medium text-center",
                      index === 0 ? "text-slate-900" : "text-slate-600"
                    )}
                  >
                    {story.label || `Story ${index + 1}`}
                  </p>
                </button>
              ))}
              {/* 스토리 추가 버튼 (빈 원) */}
              <button
                onClick={() => onStoryClick?.("add-new")}
                className="flex flex-col items-center justify-center gap-2 min-w-[72px] snap-start cursor-pointer group"
              >
                <div className="size-[72px] rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center bg-slate-50 dark:bg-slate-800 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                  <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-500 text-[28px]">
                    add
                  </span>
                </div>
                <p className="text-xs font-medium text-center text-slate-400 group-hover:text-blue-500">
                  추가
                </p>
              </button>
            </div>
          </div>
          )}

          {/* Hero Section - 항상 표시 */}
          <div className="px-4 py-2">
            <div
              onClick={onHeroClick}
              className={cn(
                "relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-soft group cursor-pointer",
                !heroImage && "border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800"
              )}
            >
              {heroImage ? (
                <>
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${heroImage})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-start justify-end">
                    {heroSubtitle && (
                      <p className="text-white/90 text-sm font-medium mb-1 tracking-wide">
                        {heroSubtitle}
                      </p>
                    )}
                    {heroTitle && (
                      <h2 className="text-white text-3xl font-bold leading-tight drop-shadow-sm">
                        {heroTitle}
                      </h2>
                    )}
                  </div>
                </>
              ) : (
                /* 히어로 이미지 없을 때 placeholder */
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-blue-500 transition-colors">
                      add_photo_alternate
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    히어로 이미지 추가
                  </h3>
                  <p className="text-xs text-slate-400 max-w-[180px]">
                    클릭하여 대표 이미지를 설정하세요
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Access Grid - 블록이 있을 때만 표시 */}
          {quickAccessItems.length > 0 && (
            <div className="p-4 pt-6">
              <h3 className="text-slate-900 text-lg font-bold mb-4 px-1">
                Quick Access
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {quickAccessItems.map((item) => (
                  <button
                    key={item.type}
                    onClick={() => onQuickAccessClick?.(item.type)}
                    className="bg-guest-surface-light p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-3 aspect-square active:scale-95 transition-transform"
                  >
                    <div
                      className={cn(
                        "size-10 rounded-full flex items-center justify-center",
                        colorClasses[item.color]
                      )}
                    >
                      <span className="material-symbols-outlined">
                        {item.icon}
                      </span>
                    </div>
                    <span className="text-slate-700 text-xs font-bold">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content Blocks with DnD */}
          <DndContext
            id="editor-phone-preview-dnd"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedBlocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="p-4 space-y-3">
                {sortedBlocks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-3xl text-slate-400">
                        widgets
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                      아직 블록이 없습니다
                    </h3>
                    <p className="text-xs text-slate-400 max-w-[200px]">
                      좌측 사이드바에서 원하는 블록을 클릭하여 추가하세요
                    </p>
                  </div>
                ) : (
                  sortedBlocks.map((block) => (
                    <SortableBlockCard
                      key={block.id}
                      block={block}
                      isSelected={selectedBlockId === block.id}
                      onSelect={() => onBlockSelect?.(block.id)}
                      slug={slug}
                      onDelete={onBlockDelete}
                    />
                  ))
                )}
              </div>
            </SortableContext>

            {/* Drag Overlay */}
            <DragOverlay>
              {activeBlock && (
                <div className="rounded-xl shadow-2xl ring-2 ring-primary bg-white p-4 opacity-90">
                  <BlockRenderer block={activeBlock} slug={slug} />
                </div>
              )}
            </DragOverlay>
          </DndContext>

        </div>
      </div>

      {/* Bottom Bar Indicator (mobile only) */}
      {deviceMode === "mobile" && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-900 dark:bg-slate-700 rounded-full z-20"></div>
      )}
    </div>
  );
}
