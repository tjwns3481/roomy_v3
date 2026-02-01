"use client";

import { useState } from "react";
import { Story } from "@/types";
import { motion } from "framer-motion";
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
    <div className="py-4">
      {/* 가로 스크롤 컨테이너 */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-4 pb-2">
          {stories.map((story, index) => (
            <motion.button
              key={story.id}
              onClick={() => handleBubbleClick(story.id, index)}
              className="flex-shrink-0 focus:outline-none"
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* 스토리 버블 */}
              <div className="flex flex-col items-center gap-2 w-[70px]">
                {/* 원형 썸네일 */}
                <div className="relative">
                  {/* 그라데이션 테두리 (인스타 스타일) */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                    <div className="bg-white rounded-full w-full h-full" />
                  </div>

                  {/* 썸네일 이미지 */}
                  <div className="relative w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-white">
                    {story.media_type === "video" ? (
                      <video
                        src={story.media_url}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <img
                        src={story.media_url}
                        alt={story.label || `Story ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}

                    {/* 비디오 아이콘 */}
                    {story.media_type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* 라벨 */}
                <span className="text-xs text-slate-600 text-center line-clamp-2 w-full">
                  {story.label || `Story ${index + 1}`}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* 스토리 뷰어 */}
      <StoryViewer
        stories={stories}
        initialIndex={initialIndex}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
      />
    </div>
  );
}
