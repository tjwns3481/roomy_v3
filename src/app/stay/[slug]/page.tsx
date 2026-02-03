import { createClient } from "@/lib/supabase/server";
import { GuestLayout } from "@/components/guest/GuestLayout";
import { Header } from "@/components/guest/Header";
import { StoryBubbles } from "@/components/guest/StoryBubbles";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import type { Story } from "@/types";

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
  const stories = ((guide.stories || []) as Story[]).sort(
    (a: Story, b: Story) => a.order_index - b.order_index
  );

  // Use first story image or placeholder for hero
  const heroImage =
    stories.length > 0
      ? stories[0].media_url
      : "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800";

  return (
    <GuestLayout
      variant="gradient"
      heroImage={heroImage}
      heroTitle={guide.title}
      heroSubtitle="환영합니다!"
    >
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
