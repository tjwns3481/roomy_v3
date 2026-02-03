'use client';

import { PlaceItem } from '@/types';
import { KakaoMapView } from './KakaoMapView';

interface MapViewProps {
  places: PlaceItem[];
  center?: { lat: number; lng: number };
  onMarkerClick?: (place: PlaceItem) => void;
  selectedPlace?: PlaceItem | null;
}

export function MapView({ places, center, onMarkerClick, selectedPlace }: MapViewProps) {
  // Calculate center from places if not provided
  const mapCenter = center || (places.length > 0
    ? { lat: 37.5665, lng: 126.9780 } // Default to Seoul
    : { lat: 37.5665, lng: 126.9780 });

  const addressText = places.length > 0
    ? `${places.length}개의 추천 장소`
    : '장소 없음';

  return (
    <div className="space-y-4">
      <KakaoMapView
        latitude={mapCenter.lat}
        longitude={mapCenter.lng}
        zoom={14}
        address={addressText}
        markerTitle="추천 장소"
      />

      {/* 지도 범례 */}
      {places.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                호스트 추천
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-slate-700 dark:text-slate-300 font-medium">
                일반 장소
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 선택된 장소 표시 */}
      {selectedPlace && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-3xl">{getCategoryEmoji(selectedPlace.category)}</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">
                {selectedPlace.name}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                {selectedPlace.address}
              </p>
              {selectedPlace.isHostPick && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-medium">
                  <span className="material-symbols-outlined text-[14px]">favorite</span>
                  호스트 추천
                </span>
              )}
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
