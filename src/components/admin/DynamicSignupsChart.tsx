'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const SignupsChart = dynamic(() => import('./SignupsChart'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">가입자 추이</h3>
      <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
        <div className="animate-pulse space-y-4 w-full px-8">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  ),
});

export default function DynamicSignupsChart() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <SignupsChart />
    </Suspense>
  );
}
