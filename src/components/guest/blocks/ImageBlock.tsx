'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ImageBlockData } from '@/types';

interface ImageBlockProps {
  data: ImageBlockData;
}

export function ImageBlock({ data }: ImageBlockProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  if (!data.url) {
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="relative w-full aspect-video hover:opacity-95 transition-opacity"
        >
          <Image
            src={data.url}
            alt={data.caption || 'Image'}
            fill
            className="object-cover"
          />
        </button>

        {data.caption && (
          <div className="p-4">
            <p className="text-gray-600 text-sm">{data.caption}</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          {/* Close Button */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            aria-label="Close"
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

          {/* Image */}
          <div
            className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={data.url}
                alt={data.caption || 'Image'}
                fill
                className="object-contain"
              />
            </div>

            {data.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <p className="text-white text-center text-lg">{data.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
