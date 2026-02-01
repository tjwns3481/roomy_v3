import { createClient } from "@/lib/supabase/server";
import { GuestLayout } from "@/components/guest/GuestLayout";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface RuleItem {
  id: string;
  text: string;
  icon?: string;
  category?: "checkin" | "guide" | "notice";
}

interface RulesBlockData {
  checkIn: string;
  checkOut: string;
  items: RuleItem[];
}

export default async function RulesPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 가이드 조회
  const { data: guide, error } = await supabase
    .from("guides")
    .select("id, title, content_blocks")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !guide) {
    notFound();
  }

  // rules 블록 찾기
  const rulesBlock = guide.content_blocks?.find(
    (block: any) => block.type === "rules"
  );

  if (!rulesBlock) {
    // rules 블록이 없으면 메인 페이지로 리다이렉트
    redirect(`/g/${slug}`);
  }

  const rulesData = rulesBlock.data as RulesBlockData;

  // 카테고리별 규칙 그룹화
  const checkinRules = rulesData.items.filter(
    (item) => item.category === "checkin"
  );
  const guideRules = rulesData.items.filter(
    (item) => item.category === "guide"
  );
  const noticeRules = rulesData.items.filter(
    (item) => item.category === "notice"
  );

  return (
    <GuestLayout variant="default">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center gap-3 py-4">
          {/* 뒤로가기 버튼 */}
          <Link
            href={`/g/${slug}`}
            className="p-2 rounded-lg hover:bg-slate-100 active:bg-slate-200 transition-colors"
            aria-label="뒤로가기"
          >
            <svg
              className="w-5 h-5 text-slate-700"
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
          </Link>

          {/* 페이지 제목 */}
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-900">이용안내</h1>
            <p className="text-xs text-slate-500 mt-0.5">{guide.title}</p>
          </div>
        </div>
      </header>

      {/* 컨텐츠 */}
      <div className="py-6 space-y-6">
        {/* 체크인/체크아웃 섹션 */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-slate-900">체크인 시간</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/60 rounded-xl p-4">
              <p className="text-xs text-slate-600 mb-1">체크인</p>
              <p className="text-2xl font-bold text-blue-600">
                {rulesData.checkIn}
              </p>
            </div>
            <div className="bg-white/60 rounded-xl p-4">
              <p className="text-xs text-slate-600 mb-1">체크아웃</p>
              <p className="text-2xl font-bold text-indigo-600">
                {rulesData.checkOut}
              </p>
            </div>
          </div>
        </div>

        {/* 입실 안내 */}
        {checkinRules.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900">입실 안내</h3>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
              {checkinRules.map((rule) => (
                <div key={rule.id} className="flex items-start gap-3 p-4">
                  {rule.icon && (
                    <span className="text-xl shrink-0">{rule.icon}</span>
                  )}
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {rule.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 시설 이용 */}
        {guideRules.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900">시설 이용</h3>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
              {guideRules.map((rule) => (
                <div key={rule.id} className="flex items-start gap-3 p-4">
                  {rule.icon && (
                    <span className="text-xl shrink-0">{rule.icon}</span>
                  )}
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {rule.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 주의사항 */}
        {noticeRules.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900">주의사항</h3>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
              {noticeRules.map((rule) => (
                <div key={rule.id} className="flex items-start gap-3 p-4">
                  {rule.icon && (
                    <span className="text-xl shrink-0">{rule.icon}</span>
                  )}
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {rule.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 하단 안전영역 */}
      <div className="h-8" />
    </GuestLayout>
  );
}

// 메타데이터 생성
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: guide } = await supabase
    .from("guides")
    .select("title")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  return {
    title: guide ? `이용안내 - ${guide.title} | Roomy` : "이용안내",
    description: guide
      ? `${guide.title} 숙박 이용안내 및 규칙`
      : "숙박 이용안내를 확인하세요",
  };
}
