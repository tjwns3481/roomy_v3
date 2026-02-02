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
import { ContentBlock } from "@/types";
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

interface PhonePreviewProps {
  blocks: ContentBlock[];
  title?: string;
  deviceMode: "mobile" | "desktop";
  slug?: string;
  selectedBlockId?: string | null;
  onBlockSelect?: (blockId: string) => void;
  onBlocksReorder?: (blocks: ContentBlock[]) => void;
  onBlockDelete?: (blockId: string) => void;
  onBlockDuplicate?: (blockId: string) => void;
}

interface SortableBlockCardProps {
  block: ContentBlock;
  isSelected: boolean;
  onSelect: () => void;
  slug: string;
  onDelete?: (blockId: string) => void;
  onDuplicate?: (blockId: string) => void;
}

function SortableBlockCard({
  block,
  isSelected,
  onSelect,
  slug,
  onDelete,
  onDuplicate,
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
            onDuplicate?.(block.id);
          }}
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-lg",
            "bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700",
            "text-slate-400 hover:text-blue-500 hover:border-blue-300",
            "transition-all"
          )}
          title="복제"
        >
          <span className="material-symbols-outlined text-[16px]">content_copy</span>
        </button>
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

export function PhonePreview({
  blocks,
  title,
  deviceMode,
  slug = "preview",
  selectedBlockId,
  onBlockSelect,
  onBlocksReorder,
  onBlockDelete,
  onBlockDuplicate,
}: PhonePreviewProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start dragging
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

  return (
    <div
      className={cn(
        "relative bg-white dark:bg-black shadow-2xl overflow-hidden ring-1 ring-slate-900/5 shrink-0 transition-all duration-300",
        deviceMode === "mobile"
          ? "w-[375px] h-full max-h-[812px] rounded-[3rem] border-[8px] border-slate-900 dark:border-slate-800"
          : "w-full h-full max-w-[1200px] max-h-[800px] rounded-[1rem] border border-slate-300 dark:border-slate-700"
      )}
    >
      {/* Notch (mobile only) */}
      {deviceMode === "mobile" && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-7 bg-slate-900 rounded-b-xl z-20"></div>
      )}

      {/* Screen Content */}
      <div className="h-full w-full overflow-y-auto bg-slate-50 relative pb-10">
        {/* Header */}
        {title && (
          <div className="bg-white border-b border-gray-100 p-4 sticky top-0 z-10">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          </div>
        )}

        {/* Content Area with DnD */}
        <DndContext
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
                    onDuplicate={onBlockDuplicate}
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

      {/* Bottom Bar Indicator (mobile only) */}
      {deviceMode === "mobile" && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-900 dark:bg-slate-700 rounded-full z-20"></div>
      )}
    </div>
  );
}
