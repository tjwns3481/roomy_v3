'use client';

import Link from 'next/link';
import { PlacesBlockData } from '@/types';
import { ROUTES } from '@/lib/routes';

interface PlacesBlockProps {
  data: PlacesBlockData;
  slug: string;
}

export function PlacesBlock({ data, slug }: PlacesBlockProps) {
  // Show only first 3 places in preview
  const displayItems = data.items.slice(0, 3);
  const hasMore = data.items.length > 3;

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'restaurant':
        return { label: '음식점', emoji: '🍽️', color: 'bg-red-50 text-red-700' };
      case 'cafe':
        return { label: '카페', emoji: '☕', color: 'bg-amber-50 text-amber-700' };
      case 'attraction':
        return { label: '관광지', emoji: '🎡', color: 'bg-blue-50 text-blue-700' };
      default:
        return { label: '기타', emoji: '📍', color: 'bg-gray-50 text-gray-700' };
    }
  };

  const renderRating = (rating?: number) => {
    if (!rating) return null;
    const stars = Math.round(rating);
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">주변 추천 장소</h3>
      </div>

      {/* Places List */}
      <div className="space-y-3 mb-4">
        {displayItems.map((place, index) => {
          const categoryInfo = getCategoryInfo(place.category);

          return (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start gap-3">
                {/* Category Icon */}
                <div className="text-3xl flex-shrink-0">
                  {categoryInfo.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name and Host Pick Badge */}
                  <div className="flex items-start gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 flex-1">
                      {place.name}
                    </h4>
                    {place.isHostPick && (
                      <span className="flex-shrink-0 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded">
                        호스트 추천
                      </span>
                    )}
                  </div>

                  {/* Category Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-lg font-medium ${categoryInfo.color}`}>
                      {categoryInfo.label}
                    </span>
                    {renderRating(place.rating)}
                  </div>

                  {/* Address */}
                  <p className="text-sm text-gray-600 mb-2">
                    {place.address}
                  </p>

                  {/* Map Link */}
                  {place.mapUrl && (
                    <a
                      href={place.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      지도 보기
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* More Link */}
      {hasMore && (
        <Link
          href={ROUTES.STAY_PLACES(slug)}
          className="inline-flex items-center gap-2 text-gray-900 font-medium hover:text-gray-700 transition-colors"
        >
          <span>전체 장소 보기 ({data.items.length}개)</span>
          <svg
            className="w-4 h-4"
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
        </Link>
      )}
    </div>
  );
}
