'use client';

import dynamic from 'next/dynamic';

// Skeleton 컴포넌트
const EditorSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-100 rounded"></div>
      <div className="h-4 bg-gray-100 rounded"></div>
      <div className="h-4 bg-gray-100 rounded w-2/3"></div>
    </div>
  </div>
);

// Dynamic imports
export const DynamicTextEditor = dynamic(
  () => import('./TextEditor').then(mod => ({ default: mod.TextEditor })),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
);

export const DynamicWifiEditor = dynamic(
  () => import('./WifiEditor').then(mod => ({ default: mod.WifiEditor })),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
);

export const DynamicRulesEditor = dynamic(
  () => import('./RulesEditor').then(mod => ({ default: mod.RulesEditor })),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
);

export const DynamicDevicesEditor = dynamic(
  () => import('./DevicesEditor').then(mod => ({ default: mod.DevicesEditor })),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
);

export const DynamicPlacesEditor = dynamic(
  () => import('./PlacesEditor').then(mod => ({ default: mod.PlacesEditor })),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
);

export const DynamicGalleryEditor = dynamic(
  () => import('./GalleryEditor').then(mod => ({ default: mod.GalleryEditor })),
  {
    ssr: false,
    loading: () => <EditorSkeleton />,
  }
);
