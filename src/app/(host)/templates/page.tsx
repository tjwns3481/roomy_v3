"use client";

import { useRouter } from "next/navigation";
import { templates } from "@/data/templates";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { useState } from "react";

export default function TemplatesPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);

  const handleSelectTemplate = (templateId: string) => {
    if (isCreating) return;

    setIsCreating(true);

    // 항상 temp 형식 사용 - 에디터에서 템플릿 데이터를 로컬로 로드
    // 실제 DB 저장은 발행(publish) 시에 수행
    const tempGuideId = `temp-${templateId}-${Date.now()}`;
    router.push(`/editor/${tempGuideId}`);
  };

  const handleBlankStart = () => {
    if (isCreating) return;

    setIsCreating(true);

    // 빈 페이지로 시작 - temp 형식 사용
    const tempGuideId = `temp-${Date.now()}`;
    router.push(`/editor/${tempGuideId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors group"
              >
                <svg
                  className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                뒤로
              </button>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Roomy
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-16">
        {/* Page Title with Decorative Elements */}
        <div className="mb-16 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <svg className="w-64 h-64" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" className="text-blue-600" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.2,73.1,42.8C64.8,56.4,53.8,69,40.3,76.1C26.8,83.2,13.4,84.8,-0.5,85.6C-14.4,86.4,-28.8,86.4,-42.2,80.2C-55.6,74,-68,61.6,-75.8,46.8C-83.6,32,-86.8,16,-85.4,0.7C-84,-14.6,-78,-29.2,-69.4,-42.2C-60.8,-55.2,-49.6,-66.6,-36.3,-74.2C-23,-81.8,-11.5,-85.6,1.4,-88C14.3,-90.4,28.6,-91.4,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
          </div>
          <h2 className="relative mb-4 text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            템플릿 선택
          </h2>
          <p className="relative text-xl text-slate-600 dark:text-slate-400 font-medium">
            숙소 유형에 맞는 템플릿으로 <span className="text-blue-600 dark:text-blue-400 font-bold">3분만에</span> 시작하세요
          </p>
        </div>

        {/* Template Grid with Enhanced Cards */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template, index) => (
            <div
              key={template.id}
              className="group relative"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <TemplateCard
                template={template}
                onSelect={handleSelectTemplate}
              />
            </div>
          ))}
        </div>

        {/* Blank Start Section */}
        <div className="flex flex-col items-center justify-center gap-6 py-12">
          <div className="h-px w-64 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>
          <div className="text-center space-y-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              템플릿이 필요 없으신가요?
            </p>
            <button
              onClick={handleBlankStart}
              disabled={isCreating}
              className="group relative inline-flex items-center gap-3 px-8 py-4 text-base font-bold text-slate-700 dark:text-slate-200 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 rounded-2xl border-2 border-slate-300 dark:border-slate-600 group-hover:border-slate-400 dark:group-hover:border-slate-500 transition-colors"></div>
              <span className="relative flex items-center gap-2">
                <svg
                  className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                {isCreating ? "생성 중..." : "빈 페이지로 시작하기"}
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* Decorative Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-600/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>
    </div>
  );
}
