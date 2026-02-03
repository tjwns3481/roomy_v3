"use client";

import { EditorLayout } from "@/components/editor/EditorLayout";
import { Story } from "@/types";

// Demo stories
const demoStories: Story[] = [
  {
    id: "story-1",
    guide_id: "demo-guide",
    label: "인사말",
    media_url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400",
    media_type: "image",
    order_index: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: "story-2",
    guide_id: "demo-guide",
    label: "숙소 시설",
    media_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
    media_type: "image",
    order_index: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: "story-3",
    guide_id: "demo-guide",
    label: "주변 맛집",
    media_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
    media_type: "image",
    order_index: 2,
    created_at: new Date().toISOString(),
  },
];

export default function StoryEditorDemoPage() {
  return (
    <EditorLayout
      guideId="demo-guide"
      guideTitle="제주 풀빌라 가이드"
      guideSlug="demo-guide"
      heroImage="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800"
      heroSubtitle="환영합니다!"
      initialStories={demoStories}
      initialBlocks={[]}
    />
  );
}
