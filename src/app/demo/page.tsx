"use client";

import { GuestLayout } from "@/components/guest/GuestLayout";
import { Header } from "@/components/guest/Header";
import { StoryBubbles } from "@/components/guest/StoryBubbles";
import { Story } from "@/types";

// Static demo data
const demoStories: Story[] = [
  {
    id: "1",
    guide_id: "demo",
    label: "인사말",
    media_url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400",
    media_type: "image",
    order_index: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    guide_id: "demo",
    label: "숙소 시설",
    media_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
    media_type: "image",
    order_index: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    guide_id: "demo",
    label: "주변 맛집",
    media_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
    media_type: "image",
    order_index: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    guide_id: "demo",
    label: "관광지",
    media_url: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=400",
    media_type: "image",
    order_index: 3,
    created_at: new Date().toISOString(),
  },
];

export default function DemoPage() {
  const heroImage = "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800";

  // 데모용 Quick Access 아이템 (실제로는 블록 데이터에서 생성됨)
  const demoQuickAccess = [
    { type: "wifi", icon: "wifi", label: "Wi-Fi", color: "blue" },
    { type: "rules", icon: "gavel", label: "Rules", color: "purple" },
    { type: "places", icon: "restaurant", label: "Local Food", color: "red" },
    { type: "map", icon: "map", label: "Map", color: "green" },
    { type: "contact", icon: "call", label: "Contact", color: "gray" },
  ];

  return (
    <GuestLayout
      variant="gradient"
      heroImage={heroImage}
      heroTitle="제주 풀빌라"
      heroSubtitle="환영합니다!"
      quickAccessItems={demoQuickAccess}
    >
      <Header title="제주 풀빌라 가이드" />

      {/* Story Bubbles */}
      <StoryBubbles
        stories={demoStories}
        onStoryClick={(storyId, index) => {
          console.log("Demo Story clicked:", storyId, index);
        }}
      />
    </GuestLayout>
  );
}
