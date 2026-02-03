"use client";

import { ContentBlock } from "@/types";
import { useState } from "react";

interface MapPropertiesProps {
  block: ContentBlock;
  onUpdate: (data: Record<string, unknown>) => void;
}

interface SearchResult {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

// Kakao types are declared in src/types/kakao.d.ts

export function MapProperties({ block, onUpdate }: MapPropertiesProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const data = block.data as {
    address?: string;
    latitude?: number;
    longitude?: number;
    zoom?: number;
  };

  // Kakao SDK 로드 대기 함수
  const waitForKakaoSDK = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      const isFullyLoaded = () =>
        window.kakao?.maps?.services?.Geocoder &&
        window.kakao?.maps?.services?.Places;

      // 이미 완전히 로드된 경우
      if (isFullyLoaded()) {
        resolve();
        return;
      }

      if (!window.kakao) {
        reject(new Error("카카오맵 SDK가 로드되지 않았습니다. 페이지를 새로고침해주세요."));
        return;
      }

      // kakao.maps.load 함수로 SDK 로드
      const loadKakaoMaps = () => {
        if (window.kakao.maps?.load) {
          window.kakao.maps.load(() => {
            // 로드 후 서비스 확인을 위한 재시도
            let checkCount = 0;
            const maxChecks = 20;
            const checkServices = setInterval(() => {
              checkCount++;
              if (isFullyLoaded()) {
                clearInterval(checkServices);
                resolve();
              } else if (checkCount >= maxChecks) {
                clearInterval(checkServices);
                // 서비스가 로드되지 않아도 기본 Geocoder는 시도해봄
                if (window.kakao?.maps?.services) {
                  resolve();
                } else {
                  reject(new Error("카카오맵 서비스 초기화에 실패했습니다. 페이지를 새로고침해주세요."));
                }
              }
            }, 100);
          });
        } else {
          reject(new Error("카카오맵 로드 함수를 찾을 수 없습니다"));
        }
      };

      // maps 객체가 있으면 바로 로드, 없으면 대기
      if (window.kakao.maps) {
        loadKakaoMaps();
      } else {
        let attempts = 0;
        const maxAttempts = 50;
        const checkInterval = setInterval(() => {
          attempts++;
          if (window.kakao?.maps) {
            clearInterval(checkInterval);
            loadKakaoMaps();
          } else if (attempts >= maxAttempts) {
            clearInterval(checkInterval);
            reject(new Error("카카오맵 로딩 시간 초과. 페이지를 새로고침해주세요."));
          }
        }, 100);
      }
    });
  };

  // 키워드로 장소 검색 (여러 결과 반환)
  const searchPlaces = (keyword: string): Promise<SearchResult[]> => {
    return new Promise((resolve, reject) => {
      const places = new window.kakao.maps.services.Places();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      places.keywordSearch(keyword, (result: any[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const results: SearchResult[] = result.slice(0, 5).map((place: any, index: number) => ({
            id: place.id || `place-${index}`,
            name: place.place_name || "",
            address: place.address_name || place.road_address_name || "",
            lat: parseFloat(place.y),
            lng: parseFloat(place.x),
          }));
          resolve(results);
        } else {
          reject(new Error("검색 결과가 없습니다"));
        }
      });
    });
  };

  // 주소로 검색 (여러 결과 반환)
  const searchAddresses = (address: string): Promise<SearchResult[]> => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.kakao.maps.services.Geocoder();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      geocoder.addressSearch(address, (result: any[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK && result.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const results: SearchResult[] = result.slice(0, 5).map((coords: any, index: number) => ({
            id: `addr-${index}`,
            name: coords.address_name || address,
            address: coords.road_address?.address_name || coords.address_name || "",
            lat: parseFloat(coords.y),
            lng: parseFloat(coords.x),
          }));
          resolve(results);
        } else {
          reject(new Error("주소를 찾을 수 없습니다"));
        }
      });
    });
  };

  // 검색 실행
  const handleAddressSearch = async () => {
    if (!data.address) {
      setSearchError("주소를 입력해주세요");
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);

    try {
      await waitForKakaoSDK();

      let results: SearchResult[] = [];

      // 1차: 주소 검색
      try {
        results = await searchAddresses(data.address);
      } catch {
        // 2차: 키워드 검색
        try {
          results = await searchPlaces(data.address);
        } catch {
          setSearchError("주소나 장소를 찾을 수 없습니다. 더 구체적으로 입력해주세요.");
          setIsSearching(false);
          return;
        }
      }

      setSearchResults(results);
      setIsSearching(false);
    } catch (error) {
      console.error("Search error:", error);
      setSearchError(error instanceof Error ? error.message : "검색 중 오류가 발생했습니다");
      setIsSearching(false);
    }
  };

  // 검색 결과 선택
  const handleSelectResult = (result: SearchResult) => {
    onUpdate({
      ...data,
      latitude: result.lat,
      longitude: result.lng,
      address: result.address || result.name,
    });
    setSearchResults([]);
    setSearchError(null);
  };

  return (
    <div className="space-y-6">
      {/* Section: Location */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          위치 정보
        </h3>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            주소 또는 장소명
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-slate-400 text-[18px]">
              location_on
            </span>
            <input
              type="text"
              value={data.address || ""}
              onChange={(e) => {
                onUpdate({ ...data, address: e.target.value });
                setSearchError(null);
                setSearchResults([]);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddressSearch();
                }
              }}
              className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 pl-9 py-2 pr-3"
              placeholder="예: 강남역, 서울시 강남구"
            />
          </div>
          <button
            onClick={handleAddressSearch}
            disabled={isSearching || !data.address}
            className="w-full py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSearching ? (
              <>
                <span className="animate-spin material-symbols-outlined text-[16px]">
                  progress_activity
                </span>
                검색 중...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">search</span>
                주소 검색
              </>
            )}
          </button>

          {/* 검색 결과 목록 */}
          {searchResults.length > 0 && (
            <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800">
              <div className="px-3 py-2 bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  검색 결과 ({searchResults.length}건) - 클릭하여 선택
                </p>
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSelectResult(result)}
                    className="w-full px-3 py-2.5 text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 border-b border-slate-100 dark:border-slate-700 last:border-b-0 transition-colors"
                  >
                    <p className="text-sm font-medium text-slate-800 dark:text-white truncate">
                      {result.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {result.address}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchError && (
            <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-[16px] mt-0.5">
                error
              </span>
              <p className="text-xs text-red-600 dark:text-red-400">
                {searchError}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              위도
            </label>
            <input
              type="number"
              step="0.000001"
              value={data.latitude || ""}
              onChange={(e) =>
                onUpdate({ ...data, latitude: parseFloat(e.target.value) || 0 })
              }
              className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
              placeholder="37.5665"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
              경도
            </label>
            <input
              type="number"
              step="0.000001"
              value={data.longitude || ""}
              onChange={(e) =>
                onUpdate({ ...data, longitude: parseFloat(e.target.value) || 0 })
              }
              className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-2 px-3"
              placeholder="126.9780"
            />
          </div>
        </div>

        {data.latitude && data.longitude && (
          <div className="flex items-start gap-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-[16px] mt-0.5">
              check_circle
            </span>
            <p className="text-xs text-green-600 dark:text-green-400">
              좌표가 설정되었습니다
            </p>
          </div>
        )}
      </div>

      <hr className="border-slate-200 dark:border-slate-700" />

      {/* Section: Display Settings */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          표시 설정
        </h3>
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
            줌 레벨
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={data.zoom || 15}
            onChange={(e) =>
              onUpdate({ ...data, zoom: parseInt(e.target.value) })
            }
            className="w-full"
          />
          <div className="flex justify-between text-xs text-slate-400">
            <span>멀게</span>
            <span className="font-medium text-slate-600 dark:text-slate-300">
              {data.zoom || 15}
            </span>
            <span>가깝게</span>
          </div>
        </div>
      </div>
    </div>
  );
}
