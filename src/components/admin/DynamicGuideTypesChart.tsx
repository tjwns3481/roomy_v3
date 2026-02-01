'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const GuideTypesChart = dynamic(() => import('./GuideTypesChart'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        가이드 유형 분포
      </h3>
      <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    </div>
  ),
});

export default function DynamicGuideTypesChart() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <GuideTypesChart />
    </Suspense>
  );
}
