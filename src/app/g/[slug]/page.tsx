import { createClient } from "@/lib/supabase/server";
import { GuestLayout } from "@/components/guest/GuestLayout";
import { Header } from "@/components/guest/Header";
import { StoryBubbles } from "@/components/guest/StoryBubbles";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function GuestPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 가이드 조회 (스토리 포함)
  const { data: guide, error } = await supabase
    .from("guides")
    .select(
      `
      *,
      stories (*)
    `
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  // 비공개 또는 존재하지 않는 가이드
  if (error || !guide) {
    notFound();
  }

  // 방문 기록 저장
  const headersList = await headers();
  const visitorIp =
    headersList.get("x-forwarded-for") ||
    headersList.get("x-real-ip") ||
    null;
  const userAgent = headersList.get("user-agent") || null;

  await supabase.from("visits").insert({
    guide_id: guide.id,
    visitor_ip: visitorIp,
    user_agent: userAgent,
  });

  // 스토리 정렬 (order_index 기준)
  const stories = (guide.stories || []).sort(
    (a: any, b: any) => a.order_index - b.order_index
  );

  return (
    <GuestLayout variant="gradient">
      <Header title={guide.title} />

      {/* 스토리 버블 */}
      {stories.length > 0 && (
        <StoryBubbles
          stories={stories}
          onStoryClick={(storyId, index) => {
            console.log("Story clicked:", storyId, index);
            // TODO: P4-S1-T2에서 StoryViewer 연동
          }}
        />
      )}

      {/* 가이드 콘텐츠 영역 */}
      <div className="mt-6 space-y-6">
        {/* TODO: P4-S1-T3에서 ContentBlocks 렌더링 */}
        <div className="text-center py-12 text-slate-500">
          <p className="text-sm">콘텐츠 블록 렌더링 예정</p>
          <p className="text-xs mt-2">
            (P4-S1-T3: ContentBlocks 컴포넌트)
          </p>
        </div>
      </div>

      {/* WiFi 정보 (빠른 접근) */}
      {guide.wifi_ssid && guide.wifi_password && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            WiFi 정보
          </h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-blue-700">네트워크:</span>
              <span className="font-mono text-blue-900">{guide.wifi_ssid}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-700">비밀번호:</span>
              <span className="font-mono text-blue-900">
                {guide.wifi_password}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 푸터 */}
      <footer className="mt-12 py-6 border-t border-slate-200">
        <p className="text-center text-xs text-slate-500">
          Powered by Roomy
        </p>
      </footer>
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
    title: guide ? `${guide.title} | Roomy` : "가이드를 찾을 수 없습니다",
    description: guide
      ? `${guide.title} 숙박 가이드`
      : "요청하신 가이드를 찾을 수 없습니다",
  };
}
