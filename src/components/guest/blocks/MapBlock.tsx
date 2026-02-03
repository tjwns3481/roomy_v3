"use client";

import { MapBlockData } from "@/types";
import { KakaoMapView } from "../KakaoMapView";

interface MapBlockProps {
  data: MapBlockData;
}

export function MapBlock({ data }: MapBlockProps) {
  const { latitude, longitude, zoom = 15, address } = data;

  // 좌표가 없는 경우 표시하지 않음
  if (!latitude || !longitude) {
    return (
      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8 text-center">
        <span className="material-symbols-outlined text-slate-400 text-5xl mb-3 block">
          location_off
        </span>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          위치 정보가 설정되지 않았습니다
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <KakaoMapView
        latitude={latitude}
        longitude={longitude}
        zoom={zoom}
        address={address}
        markerTitle="숙소 위치"
      />

      {/* Optional: Add directions button */}
      {address && (
        <a
          href={`https://map.kakao.com/link/to/${encodeURIComponent(address)},${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">directions</span>
          길찾기
        </a>
      )}
    </div>
  );
}
