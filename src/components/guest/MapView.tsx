'use client';

import { PlaceItem } from '@/types';
import { useState, useEffect } from 'react';

interface MapViewProps {
  places: PlaceItem[];
  center?: { lat: number; lng: number };
  onMarkerClick?: (place: PlaceItem) => void;
  selectedPlace?: PlaceItem | null;
}

export function MapView({ places, center, onMarkerClick, selectedPlace }: MapViewProps) {
  const [mapError, setMapError] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  // 대표 주소 추출 (첫 번째 장소 또는 센터)
  const getMapCenterAddress = () => {
    if (center) return `${center.lat},${center.lng}`;
    if (places.length > 0) return encodeURIComponent(places[0].address);
    return encodeURIComponent('서울특별시');
  };

  // Static Map URL 생성 (Google Maps Static API)
  const getStaticMapUrl = () => {
    if (!apiKey || mapError) return null;

    const centerAddr = getMapCenterAddress();
    const zoom = 14;
    const size = '600x400';

    // 마커들 추가
    const markers = places
      .slice(0, 10) // 최대 10개 마커
      .map((place, index) => {
        const color = place.isHostPick ? 'red' : 'blue';
        const label = (index + 1).toString();
        return `markers=color:${color}%7Clabel:${label}%7C${encodeURIComponent(place.address)}`;
      })
      .join('&');

    return `https://maps.googleapis.com/maps/api/staticmap?center=${centerAddr}&zoom=${zoom}&size=${size}&${markers}&key=${apiKey}`;
  };

  // 에러 처리
  const handleImageError = () => {
    setMapError(true);
  };

  const staticMapUrl = getStaticMapUrl();

  // API 키가 없거나 에러 발생 시 Fallback
  if (!apiKey || mapError || !staticMapUrl) {
    return (
      <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]">
        <svg
          className="w-16 h-16 text-slate-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <p className="text-slate-600 text-sm font-medium mb-2">
          지도를 불러올 수 없습니다
        </p>
        <p className="text-slate-500 text-xs text-center max-w-xs">
          아래 장소 목록에서 각 장소의 지도 링크를 확인해 주세요
        </p>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-100 shadow-lg">
      {/* Static Map Image */}
      <img
        src={staticMapUrl}
        alt="주변 장소 지도"
        className="w-full h-[300px] md:h-[400px] object-cover"
        onError={handleImageError}
      />

      {/* 지도 범례 (오버레이) */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 max-w-xs">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-slate-700 font-medium">호스트 추천</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-slate-700 font-medium">일반 장소</span>
          </div>
        </div>
        <p className="text-[10px] text-slate-500 mt-1.5">
          숫자는 아래 목록 순서입니다
        </p>
      </div>

      {/* 선택된 장소 하이라이트 (옵션) */}
      {selectedPlace && (
        <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3">
          <div className="flex items-start gap-2">
            <div className="text-2xl">{getCategoryEmoji(selectedPlace.category)}</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 text-sm truncate">
                {selectedPlace.name}
              </h4>
              <p className="text-xs text-slate-600 truncate">
                {selectedPlace.address}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 카테고리 이모지 헬퍼
function getCategoryEmoji(category: string): string {
  switch (category) {
    case 'restaurant':
      return '🍽️';
    case 'cafe':
      return '☕';
    case 'attraction':
      return '🎡';
    default:
      return '📍';
  }
}
