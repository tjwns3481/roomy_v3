"use client";

import { useEffect, useRef, useState } from "react";

interface KakaoMapViewProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  address?: string;
  markerTitle?: string;
}

// Kakao types are declared in src/types/kakao.d.ts

// XSS 방지를 위한 HTML 이스케이프 함수
function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
}

export function KakaoMapView({
  latitude,
  longitude,
  zoom = 15,
  address,
  markerTitle = "위치",
}: KakaoMapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (mapRef.current) return; // 이미 초기화됨

    const initMap = () => {
      if (!mapContainer.current) return;

      try {
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: Math.max(1, Math.min(14, 20 - zoom)),
        };

        const map = new window.kakao.maps.Map(mapContainer.current, options);
        mapRef.current = map;

        // 마커 추가
        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(latitude, longitude),
        });
        marker.setMap(map);
        markerRef.current = marker;

        // 모던 스타일 커스텀 오버레이 (Airbnb 스타일)
        if (markerTitle) {
          const overlayContent = document.createElement("div");
          overlayContent.innerHTML = `
            <div style="
              position: relative;
              bottom: 45px;
              transform: translateX(-50%);
              left: 50%;
            ">
              <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 8px 14px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 600;
                white-space: nowrap;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                letter-spacing: -0.3px;
              ">${escapeHtml(markerTitle)}</div>
              <div style="
                width: 0;
                height: 0;
                border-left: 8px solid transparent;
                border-right: 8px solid transparent;
                border-top: 8px solid #764ba2;
                margin: 0 auto;
              "></div>
            </div>
          `;

          const customOverlay = new window.kakao.maps.CustomOverlay({
            position: new window.kakao.maps.LatLng(latitude, longitude),
            content: overlayContent,
            yAnchor: 1,
          });
          customOverlay.setMap(map);
        }

        setStatus("ready");
      } catch (e) {
        console.error("Map init error:", e);
        setStatus("error");
      }
    };

    let attempts = 0;
    const maxAttempts = 50;

    const tryInit = () => {
      attempts++;

      // kakao 객체 확인
      if (!window.kakao) {
        if (attempts < maxAttempts) {
          setTimeout(tryInit, 100);
        } else {
          setStatus("error");
        }
        return;
      }

      // autoload=false인 경우 maps.load() 호출 필요
      if (window.kakao.maps?.load && !window.kakao.maps.Map) {
        window.kakao.maps.load(() => {
          initMap();
        });
      } else if (window.kakao.maps?.Map) {
        // 이미 로드된 경우
        initMap();
      } else if (attempts < maxAttempts) {
        setTimeout(tryInit, 100);
      } else {
        setStatus("error");
      }
    };

    tryInit();
  }, [latitude, longitude, zoom, address, markerTitle]);

  // 좌표 변경 시 지도 중심 및 마커 위치 이동
  useEffect(() => {
    if (mapRef.current && window.kakao?.maps) {
      const newPosition = new window.kakao.maps.LatLng(latitude, longitude);
      mapRef.current.setCenter(newPosition);

      // 마커 위치도 업데이트
      if (markerRef.current) {
        markerRef.current.setPosition(newPosition);
      }
    }
  }, [latitude, longitude]);

  if (status === "error") {
    return (
      <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center h-[200px]">
        <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">
          location_off
        </span>
        <p className="text-slate-500 text-xs">지도를 불러올 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
      <div
        ref={mapContainer}
        className="w-full h-[200px]"
        style={{ visibility: status === "ready" ? "visible" : "hidden" }}
      />
      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}
      {address && status === "ready" && (
        <div className="absolute bottom-3 left-3 right-3 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-lg shadow p-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500 text-[18px]">
              location_on
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate">
              {address}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
