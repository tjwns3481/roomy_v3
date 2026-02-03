'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { GuideCard, EmptyState, NewGuideCard } from '@/components/dashboard';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import type { GuideCardData } from '@/types/dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [guides, setGuides] = useState<GuideCardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // TODO: Replace with actual API call
    const mockGuides: GuideCardData[] = [];

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

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 lg:px-10">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
            Roomy
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button className="flex items-center justify-center rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10",
              },
            }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 md:px-8 lg:px-40 flex justify-center">
        <div className="flex w-full max-w-[1200px] flex-col gap-8">
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
