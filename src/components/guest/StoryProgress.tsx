'use client';

import { motion } from 'framer-motion';

interface StoryProgressProps {
  totalStories: number;
  currentIndex: number;
  progress: number; // 0 ~ 1
}

export function StoryProgress({
  totalStories,
  currentIndex,
  progress,
}: StoryProgressProps) {
  return (
    <div className="flex gap-1 w-full">
      {Array.from({ length: totalStories }).map((_, index) => (
        <div
          key={index}
          className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: '0%' }}
            animate={{
              width:
                index < currentIndex
                  ? '100%'
                  : index === currentIndex
                  ? `${progress * 100}%`
                  : '0%',
            }}
            transition={{
              duration: index === currentIndex ? 0.1 : 0.3,
              ease: 'linear',
            }}
          />
        </div>
      ))}
    </div>
  );
}
