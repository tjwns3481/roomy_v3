import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PlacesContent } from "./PlacesContent";
import type { ContentBlock, PlacesBlockData } from "@/types";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PlacesPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // 가이드 조회
  const { data: guide, error } = await supabase
    .from("guides")
    .select("id, title, content_blocks, accommodation:accommodations(name, latitude, longitude)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !guide) {
    notFound();
  }

  // Places 블록 찾기
  const placesBlock = (guide.content_blocks as ContentBlock[]).find((block: ContentBlock) => block.type === "places");

  if (!placesBlock) {
    notFound();
  }

  const placesData = placesBlock.data as PlacesBlockData;
  if (!placesData.items) {
    notFound();
  }

  // 숙소 정보 추출
  const accommodation = Array.isArray(guide.accommodation)
    ? guide.accommodation[0]
    : guide.accommodation;

  const accommodationName = accommodation?.name || guide.title;
  const center = accommodation?.latitude && accommodation?.longitude
    ? { lat: accommodation.latitude, lng: accommodation.longitude }
    : undefined;

  return (
    <PlacesContent
      slug={slug}
      guideTitle={guide.title}
      accommodationName={accommodationName}
      places={placesData.items}
      center={center}
    />
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
    title: guide ? `주변 맛집 - ${guide.title} | Roomy` : "주변 장소",
    description: guide
      ? `${guide.title} 주변 추천 맛집 및 관광지`
      : "주변 장소 안내",
  };
}
