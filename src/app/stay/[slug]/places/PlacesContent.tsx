'use client';

import { useState } from 'react';
import { PlaceItem } from '@/types';
import DynamicMapView from '@/components/guest/DynamicMapView';
import Link from 'next/link';

interface PlacesContentProps {
  slug: string;
  guideTitle: string;
  accommodationName: string;
  places: PlaceItem[];
  center?: { lat: number; lng: number };
}

type CategoryFilter = 'all' | 'restaurant' | 'cafe' | 'attraction' | 'etc';

export function PlacesContent({
  slug,
  guideTitle: _guideTitle, // Reserved for future use
  accommodationName,
  places,
  center,
}: PlacesContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null);

  // 카테고리 필터링
  const filteredPlaces =
    selectedCategory === 'all'
      ? places
      : places.filter((p) => p.category === selectedCategory);

  // 카테고리 정보
  const categories: Array<{
    id: CategoryFilter;
    label: string;
    emoji: string;
    count: number;
  }> = [
    {
      id: 'all',
      label: '전체',
      emoji: '🗺️',
      count: places.length,
    },
    {
      id: 'restaurant',
      label: '맛집',
      emoji: '🍽️',
      count: places.filter((p) => p.category === 'restaurant').length,
    },
    {
      id: 'cafe',
      label: '카페',
      emoji: '☕',
      count: places.filter((p) => p.category === 'cafe').length,
    },
    {
      id: 'attraction',
      label: '관광',
      emoji: '🎡',
      count: places.filter((p) => p.category === 'attraction').length,
    },
    {
      id: 'etc',
      label: '기타',
      emoji: '📍',
      count: places.filter((p) => p.category === 'etc').length,
    },
  ];

  // 카테고리 정보 헬퍼
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

  // 별점 렌더링
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

  // 장소 클릭 핸들러
  const handlePlaceClick = (place: PlaceItem) => {
    setSelectedPlace(place);
    // 지도 영역으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            {/* 뒤로가기 버튼 */}
            <Link
              href={`/stay/${slug}`}
              className="p-2 -ml-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-slate-700"
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
            </Link>

            {/* 제목 */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-slate-900">주변 맛집</h1>
              <p className="text-sm text-slate-600 truncate">{accommodationName}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 카테고리 필터 */}
        <div className="overflow-x-auto -mx-4 px-4 pb-2">
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedPlace(null);
                }}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm
                  transition-all duration-200 whitespace-nowrap
                  ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-lg scale-105'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }
                `}
              >
                <span className="text-lg">{cat.emoji}</span>
                <span>{cat.label}</span>
                <span
                  className={`
                    px-2 py-0.5 rounded-full text-xs font-bold
                    ${
                      selectedCategory === cat.id
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }
                  `}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 지도 */}
        <DynamicMapView
          places={filteredPlaces}
          center={center}
          selectedPlace={selectedPlace}
          onMarkerClick={handlePlaceClick}
        />

        {/* 장소 목록 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              {selectedCategory === 'all' ? '전체 장소' : categories.find(c => c.id === selectedCategory)?.label}
              <span className="text-slate-500 font-normal ml-2">
                {filteredPlaces.length}곳
              </span>
            </h2>
          </div>

          {filteredPlaces.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-slate-500 text-sm">해당 카테고리에 장소가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPlaces.map((place, index) => {
                const categoryInfo = getCategoryInfo(place.category);
                const isSelected = selectedPlace?.name === place.name;

                return (
                  <div
                    key={index}
                    onClick={() => handlePlaceClick(place)}
                    className={`
                      bg-white border rounded-2xl p-4 transition-all duration-200 cursor-pointer
                      ${
                        isSelected
                          ? 'border-slate-900 shadow-lg ring-2 ring-slate-900/10'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {/* 순서 번호 & 이모지 */}
                      <div className="flex-shrink-0 text-center">
                        <div className="text-xs font-bold text-slate-400 mb-1">
                          {index + 1}
                        </div>
                        <div className="text-3xl">{categoryInfo.emoji}</div>
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* 이름 & 호스트 추천 */}
                        <div className="flex items-start gap-2 mb-2">
                          <h3 className="font-bold text-slate-900 flex-1 text-lg">
                            {place.name}
                          </h3>
                          {place.isHostPick && (
                            <span className="flex-shrink-0 px-2.5 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-lg shadow-sm">
                              호스트 추천
                            </span>
                          )}
                        </div>

                        {/* 카테고리 & 별점 */}
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-lg font-medium ${categoryInfo.color}`}
                          >
                            {categoryInfo.label}
                          </span>
                          {renderRating(place.rating)}
                        </div>

                        {/* 주소 */}
                        <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                          {place.address}
                        </p>

                        {/* 지도 보기 버튼 */}
                        {place.mapUrl && (
                          <a
                            href={place.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-medium text-sm hover:bg-slate-800 transition-colors shadow-sm"
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
                            지도 앱에서 열기
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 푸터 */}
      <footer className="mt-12 py-6 border-t border-slate-200">
        <p className="text-center text-xs text-slate-500">Powered by Roomy</p>
      </footer>
    </div>
  );
}
