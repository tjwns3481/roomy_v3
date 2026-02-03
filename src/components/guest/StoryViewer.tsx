'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { StoryProgress } from './StoryProgress';

interface Story {
  id: string;
  guide_id: string;
  media_url: string;
  media_type: 'image' | 'video';
  order_index: number;
  label?: string;
  created_at: string;
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

const IMAGE_DURATION = 5000; // 5초

export function StoryViewer({
  stories,
  initialIndex = 0,
  isOpen,
  onClose,
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(0); // -1: 이전, 1: 다음

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);

  const currentStory = stories[currentIndex];
  const isVideo = currentStory?.media_type === 'video';

  // 다음 스토리로 이동
  const goToNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setDirection(1);
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  // 이전 스토리로 이동
  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  // 화면 탭 핸들러
  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const threshold = rect.width / 3;

    if (x < threshold) {
      goToPrev();
    } else if (x > rect.width - threshold) {
      goToNext();
    }
  };

  // 일시정지/재개
  const handlePressStart = () => {
    setIsPaused(true);
    pausedTimeRef.current = Date.now();
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handlePressEnd = () => {
    setIsPaused(false);
    if (pausedTimeRef.current > 0) {
      startTimeRef.current += Date.now() - pausedTimeRef.current;
      pausedTimeRef.current = 0;
    }
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  // 이미지 진행률 업데이트
  useEffect(() => {
    if (!isOpen || isVideo || isPaused) return;

    startTimeRef.current = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min(elapsed / IMAGE_DURATION, 1);
      setProgress(newProgress);

      if (newProgress >= 1) {
        goToNext();
      }
    }, 16); // ~60fps

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentIndex, isOpen, isVideo, isPaused, goToNext]);

  // 비디오 진행률 업데이트
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isVideo) return;

    const handleTimeUpdate = () => {
      if (video.duration > 0) {
        setProgress(video.currentTime / video.duration);
      }
    };

    const handleEnded = () => {
      goToNext();
    };

    const handleLoadedMetadata = () => {
      video.play().catch((err) => {
        console.error('비디오 재생 실패:', err);
      });
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [currentIndex, isVideo, goToNext]);

  // 인덱스 변경 시 초기화
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Reset progress on index change
    setProgress(0);
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
  }, [currentIndex]);

  // 스와이프 다운으로 닫기
  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.y > 100) {
      onClose();
    }
  };

  // 키보드 네비게이션
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToPrev, goToNext, onClose]);

  if (!currentStory) return null;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* 진행률 바 */}
          <div className="absolute top-0 left-0 right-0 p-4 z-20">
            <StoryProgress
              totalStories={stories.length}
              currentIndex={currentIndex}
              progress={progress}
            />
          </div>

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="닫기"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>

          {/* 스토리 컨텐츠 */}
          <motion.div
            className="relative w-full h-full flex items-center justify-center"
            onClick={handleTap}
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentStory.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {isVideo ? (
                  <video
                    ref={videoRef}
                    src={currentStory.media_url}
                    className="max-w-full max-h-full object-contain"
                    playsInline
                    preload="auto"
                  />
                ) : (
                  <img
                    src={currentStory.media_url}
                    alt={currentStory.label || '스토리'}
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* 라벨 */}
          {currentStory.label && (
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
              <motion.p
                className="text-white text-lg font-medium text-center drop-shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {currentStory.label}
              </motion.p>
            </div>
          )}

          {/* 탭 영역 시각적 가이드 (개발 시에만, 프로덕션에서는 제거) */}
          {process.env.NODE_ENV === 'development' && (
            <>
              <div className="absolute left-0 top-0 bottom-0 w-1/3 pointer-events-none border-r border-white/10" />
              <div className="absolute right-0 top-0 bottom-0 w-1/3 pointer-events-none border-l border-white/10" />
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
