"use client";

import { useState } from "react";
import { Story } from "@/types";
import { StoryViewer } from "./StoryViewer";

interface StoryBubblesProps {
  stories: Story[];
  onStoryClick?: (storyId: string, index: number) => void;
}

export function StoryBubbles({ stories, onStoryClick }: StoryBubblesProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const handleBubbleClick = (storyId: string, index: number) => {
    setInitialIndex(index);
    setViewerOpen(true);
    onStoryClick?.(storyId, index);
  };

  if (stories.length === 0) {
    return null;
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
      </div>

      {/* Story Viewer */}
      <StoryViewer
        stories={stories}
        initialIndex={initialIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </div>
  );
}
