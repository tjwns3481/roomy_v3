'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { PlaceItem } from '@/types';

const MapView = dynamic(() => import('./MapView').then(mod => ({ default: mod.MapView })), {
  ssr: false,
  loading: () => (
    <div className="relative rounded-2xl overflow-hidden bg-slate-100 shadow-lg">
      <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm">지도 로딩 중...</p>
        </div>
      </div>
    </div>
  ),
});

interface DynamicMapViewProps {
  places: PlaceItem[];
  center?: { lat: number; lng: number };
  onMarkerClick?: (place: PlaceItem) => void;
  selectedPlace?: PlaceItem | null;
}

export default function DynamicMapView(props: DynamicMapViewProps) {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <MapView {...props} />
    </Suspense>
  );
}
