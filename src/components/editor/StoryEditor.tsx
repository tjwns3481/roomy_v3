"use client";

import { useState } from "react";
import { Story } from "@/types";
import { StoryModal } from "./StoryModal";
import { cn } from "@/lib/utils";

interface StoryEditorProps {
  stories: Story[];
  onAddStory: (story: Partial<Story>) => void;
  onUpdateStory: (storyId: string, story: Partial<Story>) => void;
  onDeleteStory: (storyId: string) => void;
  onReorderStories: (stories: Story[]) => void;
}

export function StoryEditor({
  stories,
  onAddStory,
  onUpdateStory,
  onDeleteStory,
  onReorderStories,
}: StoryEditorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<Story | null>(null);

  const sortedStories = [...stories].sort((a, b) => a.order_index - b.order_index);

  const handleAddClick = () => {
    setEditingStory(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (story: Story) => {
    setEditingStory(story);
    setIsModalOpen(true);
  };

  const handleSave = (storyData: Partial<Story>) => {
    if (editingStory) {
      onUpdateStory(editingStory.id, storyData);
    } else {
      onAddStory(storyData);
    }
    setIsModalOpen(false);
    setEditingStory(null);
  };

  const handleDelete = (storyId: string) => {
    if (window.confirm("이 스토리를 삭제하시겠습니까?")) {
      onDeleteStory(storyId);
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newStories = [...sortedStories];
    [newStories[index - 1], newStories[index]] = [
      newStories[index],
      newStories[index - 1],
    ];
    const reordered = newStories.map((story, idx) => ({
      ...story,
      order_index: idx,
    }));
    onReorderStories(reordered);
  };

  const handleMoveDown = (index: number) => {
    if (index === sortedStories.length - 1) return;
    const newStories = [...sortedStories];
    [newStories[index], newStories[index + 1]] = [
      newStories[index + 1],
      newStories[index],
    ];
    const reordered = newStories.map((story, idx) => ({
      ...story,
      order_index: idx,
    }));
    onReorderStories(reordered);
  };

  return (
    <aside className="w-[300px] bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col shrink-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500">
              photo_library
            </span>
            <h2 className="font-semibold text-sm text-slate-800 dark:text-white">
              스토리 관리
            </h2>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {stories.length}개
          </span>
        </div>
        <button
          onClick={handleAddClick}
          className="w-full py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          새 스토리 추가
        </button>
      </div>

      {/* Story List */}
      <div className="flex-1 overflow-y-auto p-4">
        {sortedStories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl text-slate-400">
                photo_library
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
              스토리가 없습니다
            </h3>
            <p className="text-xs text-slate-400 max-w-[200px]">
              스토리를 추가하여 게스트에게 보여줄 콘텐츠를 만드세요
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedStories.map((story, index) => (
              <div
                key={story.id}
                className="group relative bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
              >
                {/* Story Preview */}
                <div className="flex gap-3 p-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0">
                    {story.media_type === "image" ? (
                      <img
                        src={story.media_url}
                        alt={story.label || "Story"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect fill='%23e5e7eb' width='64' height='64'/%3E%3C/svg%3E";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-400">
                          videocam
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                        {story.label || "Untitled"}
                      </h3>
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0",
                          story.media_type === "image"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                        )}
                      >
                        {story.media_type === "image" ? "이미지" : "동영상"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      순서: {index + 1}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-1 px-3 pb-3">
                  {/* Order Controls */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="위로 이동"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        arrow_upward
                      </span>
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === sortedStories.length - 1}
                      className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="아래로 이동"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        arrow_downward
                      </span>
                    </button>
                  </div>

                  {/* Edit & Delete */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditClick(story)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-500 hover:text-blue-500 transition-colors"
                      title="수정"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() => handleDelete(story.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-500 transition-colors"
                      title="삭제"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        delete
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <StoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStory(null);
        }}
        onSave={handleSave}
        story={editingStory}
      />
    </aside>
  );
}
