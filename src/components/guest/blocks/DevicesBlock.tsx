'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DevicesBlockData } from '@/types';

interface DevicesBlockProps {
  data: DevicesBlockData;
}

export function DevicesBlock({ data }: DevicesBlockProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setExpandedId(expandedId === index ? null : index);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <h3 className="text-lg font-bold text-gray-900 mb-4">가전제품 사용법</h3>

      {/* Accordion List */}
      <div className="space-y-3">
        {data.items.map((item, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-xl overflow-hidden transition-all"
          >
            {/* Accordion Header */}
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
            >
              {/* Device Image */}
              {item.imageUrl ? (
                <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                    />
                  </svg>
                </div>
              )}

              {/* Device Name */}
              <span className="flex-1 text-left font-semibold text-gray-900">
                {item.name}
              </span>

              {/* Chevron Icon */}
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedId === index ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Accordion Content */}
            {expandedId === index && (
              <div className="px-4 pb-4 pt-0">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
