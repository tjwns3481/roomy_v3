"use client";

import { Story } from "@/types";

interface EditorStoryBubblesProps {
  stories: Story[];
  onStoryClick?: (storyId: string, index: number) => void;
  onAddClick?: () => void;
}

export function EditorStoryBubbles({
  stories,
  onStoryClick,
  onAddClick,
}: EditorStoryBubblesProps) {
  const handleBubbleClick = (storyId: string, index: number) => {
    onStoryClick?.(storyId, index);
  };

  const handleAddClick = () => {
    onAddClick?.();
  };

  // 빈 상태일 때 플레이스홀더 표시
  if (stories.length === 0) {
    return (
      <div className="w-full overflow-hidden pt-2 pb-4">
        <div className="flex flex-row items-start justify-start gap-5 px-4">
          <button
            onClick={handleAddClick}
            className="flex flex-col items-center justify-center gap-2 min-w-[72px] cursor-pointer group hover:opacity-80 transition-opacity"
          >
            {/* Add button with dashed border */}
            <div className="size-[72px] rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors">
              <span className="material-symbols-outlined text-slate-400 text-3xl">
                add
              </span>
            </div>

            {/* Label */}
            <p className="text-xs font-medium text-slate-500">스토리 추가</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden pt-2 pb-4">
      <div className="flex flex-row items-start justify-start gap-5 px-4 overflow-x-auto no-scrollbar snap-x">
        {stories.map((story, index) => (
          <button
            key={story.id}
            onClick={() => handleBubbleClick(story.id, index)}
            className={`flex flex-col items-center justify-center gap-2 min-w-[72px] snap-start cursor-pointer group ${
              index === 0 ? "" : "opacity-90 hover:opacity-100 transition-opacity"
            }`}
          >
            {/* Story bubble with gradient border (active story only) */}
            <div
              className={`size-[72px] rounded-full p-[3px] ${
                index === 0
                  ? "story-gradient-border"
                  : "border border-slate-200"
              }`}
            >
              <div
                className={`w-full h-full bg-cover bg-center rounded-full ${
                  index === 0 ? "border-2 border-white" : ""
                }`}
                style={{
                  backgroundImage: `url(${story.media_url})`,
                }}
              />
            </div>

            {/* Label */}
            <p
              className={`text-xs font-medium text-center ${
                index === 0 ? "text-slate-900" : "text-slate-600"
              }`}
            >
              {story.label || `Story ${index + 1}`}
            </p>
          </button>
        ))}

        {/* Add button at the end */}
        <button
          onClick={handleAddClick}
          className="flex flex-col items-center justify-center gap-2 min-w-[72px] snap-start cursor-pointer group hover:opacity-80 transition-opacity"
        >
          {/* Add button with dashed border */}
          <div className="size-[72px] rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors">
            <span className="material-symbols-outlined text-slate-400 text-3xl">
              add
            </span>
          </div>

          {/* Label */}
          <p className="text-xs font-medium text-slate-500">추가</p>
        </button>
      </div>
    </div>
  );
}
