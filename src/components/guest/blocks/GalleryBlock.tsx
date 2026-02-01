'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GalleryBlockData } from '@/types';

interface GalleryBlockProps {
  data: GalleryBlockData;
}

export function GalleryBlock({ data }: GalleryBlockProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const layout = data.layout || 'grid';

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (lightboxIndex === null) return;

    const newIndex = direction === 'prev'
      ? (lightboxIndex - 1 + data.images.length) % data.images.length
      : (lightboxIndex + 1) % data.images.length;

    setLightboxIndex(newIndex);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (lightboxIndex === null) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox('prev');
    if (e.key === 'ArrowRight') navigateLightbox('next');
  };

  // Sort images by order
  const sortedImages = [...data.images].sort((a, b) => a.order - b.order);

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {layout === 'grid' ? (
          /* Grid Layout */
          <div className="grid grid-cols-2 gap-3">
            {sortedImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => openLightbox(index)}
                className="relative aspect-square rounded-xl overflow-hidden hover:opacity-90 transition-opacity group"
              >
                <Image
                  src={image.url}
                  alt={image.caption || `Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {image.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">
                      {image.caption}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          /* Slider Layout */
          <div className="overflow-x-auto -mx-6 px-6">
            <div className="flex gap-3" style={{ width: 'max-content' }}>
              {sortedImages.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => openLightbox(index)}
                  className="relative w-64 aspect-[4/3] rounded-xl overflow-hidden flex-shrink-0 hover:opacity-90 transition-opacity group"
                >
                  <Image
                    src={image.url}
                    alt={image.caption || `Gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  {image.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm font-medium">
                        {image.caption}
                      </p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            aria-label="Close lightbox"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Previous Button */}
          {sortedImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox('prev');
              }}
              className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
              aria-label="Previous image"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Next Button */}
          {sortedImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox('next');
              }}
              className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
              aria-label="Next image"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={sortedImages[lightboxIndex].url}
                alt={sortedImages[lightboxIndex].caption || `Gallery image ${lightboxIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>

            {/* Caption */}
            {sortedImages[lightboxIndex].caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="text-white text-center text-lg">
                  {sortedImages[lightboxIndex].caption}
                </p>
              </div>
            )}

            {/* Counter */}
            <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1.5 rounded-lg text-sm font-medium">
              {lightboxIndex + 1} / {sortedImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
