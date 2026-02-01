'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StatsCard, GuideCard, EmptyState, NewGuideCard } from '@/components/dashboard';
import type { GuideCardData } from '@/types/dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [guides, setGuides] = useState<GuideCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // TODO: Replace with actual API call
    const mockGuides: GuideCardData[] = [
      {
        id: '1',
        title: '제주 풀빌라 가이드',
        slug: 'jeju-poolvilla',
        is_published: true,
        view_count: 523,
        updated_at: new Date('2023-10-12').toISOString(),
        accommodation_name: '제주 풀빌라',
        thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRQZ0tL9IzqNe1agxHZcZxYmDjAVSvQaWJhszGWRHjuVVIf6_YEgVbGS2vQvbd75UlmPDFYoOlT9vChBAC74nTHigd2U2vYZZ8W3Ud-G7dby5Xp42vyHnuoV5Chp40dOjbE3c30Gx-MueiMR92ohdQ7FY0jOciVh6Mj2Eqr2QkXBUCDT-5YU0jYshn5MRS8Pw-aSRkxd6MiLWcX-boWyvt8quyJAYcAZ7lyArmkOsyOHdoDcUxNr0Mn7A9jApi04j1If0N0vE482A',
      },
      {
        id: '2',
        title: '강원 펜션 가이드',
        slug: 'gangwon-pension',
        is_published: false,
        view_count: 0,
        updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        accommodation_name: '강원 펜션',
        thumbnail_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD6W6Ft0rkeKO0q6eU5YdXWU2xWKYKsTvAEtbnaJ7awjDA-_aHjULnOEJ08zSvSgO1XlUm0UqzN5qSTPJBdEBRsA_pXUjGd14gq5D_tml18pbK1GlE1MmmP1e2VPqyxo3c5saEYVHdkJpATtOgEKAtSa4f50lueXCbn0nWXFBadh5ENVI0qVk8YEhfKZv0G0V8eBVo5-omqC2SuFrwq2Ln9VIzG7clgVqX3oJgKKlFuvjx75ca_WcKuKGN2pziT7Nj85IgsLslYA14',
      },
    ];

    setTimeout(() => {
      setGuides(mockGuides);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleNewGuide = () => {
    router.push('/templates');
  };

  const handleEdit = (id: string) => {
    router.push(`/editor/${id}`);
  };

  const handleQRCode = (id: string) => {
    // TODO: Open QR code modal
    console.log('Show QR for guide:', id);
  };

  const handleDelete = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      // TODO: Implement delete
      setGuides((prev) => prev.filter((g) => g.id !== id));
    }
  };

  const totalViews = guides.reduce((sum, guide) => sum + guide.view_count, 0);
  const publishedGuides = guides.filter((g) => g.is_published).length;

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 lg:px-10">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 text-primary">
            <svg
              className="w-full h-full"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
            Roomy
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="h-10 w-10 overflow-hidden rounded-full border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-700">
            <div className="h-full w-full flex items-center justify-center">
              <span className="material-symbols-outlined text-slate-500">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 md:px-8 lg:px-40 flex justify-center">
        <div className="flex w-full max-w-[1200px] flex-col gap-8">
          {/* Stats Section */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              icon="map"
              label="총 가이드 수"
              value={`${guides.length}개`}
              trend={{ direction: 'up', value: '5%' }}
            />
            <StatsCard
              icon="visibility"
              label="이번 달 조회수"
              value={`${totalViews.toLocaleString()}회`}
              trend={{ direction: 'up', value: '12%' }}
            />
            <StatsCard
              icon="qr_code_scanner"
              label="QR 스캔"
              value="89회"
              trend={{ direction: 'up', value: '2%' }}
            />
            <StatsCard
              icon="schedule"
              label="평균 체류시간"
              value="2분 34초"
              trend={{ direction: 'up', value: '1%' }}
            />
          </section>

          {/* Guides Section */}
          <section className="flex flex-col gap-6">
            {/* Heading */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                내 가이드 목록
              </h2>
              <button
                onClick={handleNewGuide}
                className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-blue-600 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                새 가이드
              </button>
            </div>

            {/* Grid or Empty State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            ) : guides.length === 0 ? (
              <EmptyState
                icon="description"
                title="첫 가이드를 만들어보세요"
                description="새로운 게스트 가이드를 생성하여 숙소 정보를 공유하세요"
                ctaText="새 가이드 만들기"
                onCtaClick={handleNewGuide}
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {guides.map((guide) => (
                  <GuideCard
                    key={guide.id}
                    guide={guide}
                    onEdit={handleEdit}
                    onQRCode={handleQRCode}
                    onDelete={handleDelete}
                  />
                ))}
                <NewGuideCard onClick={handleNewGuide} />
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
