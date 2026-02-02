import { EditorLayout } from "@/components/editor/EditorLayout";
import { ContentBlock, Story } from "@/types";

interface EditorPageProps {
  params: Promise<{
    guideId: string;
  }>;
}

// Mock data for development
const mockBlocks: ContentBlock[] = [
  {
    id: "1",
    type: "wifi",
    order: 0,
    data: {
      ssid: "Jeju_Ocean_5G",
      password: "ocean1234!",
      note: "자동 연결 가능",
    },
  },
  {
    id: "2",
    type: "text",
    order: 1,
    data: {
      title: "환영합니다! 👋",
      content:
        "편안한 휴식을 위해 준비된 공간입니다. 머무시는 동안 불편함이 없도록 아래 가이드를 참고해주세요.",
    },
  },
  {
    id: "3",
    type: "rules",
    order: 2,
    data: {
      checkIn: "15:00",
      checkOut: "11:00",
      items: [
        {
          id: "r1",
          text: "실내 흡연 금지",
          icon: "no_smoking",
          category: "notice",
        },
        {
          id: "r2",
          text: "반려동물 동반 가능",
          icon: "pets",
          category: "guide",
        },
      ],
    },
  },
];

const mockStories: Story[] = [
  {
    id: "s1",
    guide_id: "guide-123",
    media_url: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=600&fit=crop",
    media_type: "image",
    order_index: 0,
    label: "Welcome",
    created_at: new Date().toISOString(),
  },
  {
    id: "s2",
    guide_id: "guide-123",
    media_url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=600&fit=crop",
    media_type: "image",
    order_index: 1,
    label: "Pool",
    created_at: new Date().toISOString(),
  },
];

export default async function EditorPage({ params }: EditorPageProps) {
  const { guideId } = await params;

  // TODO: Fetch guide data from API
  // const guide = await getGuide(guideId);

  return (
    <EditorLayout
      guideId={guideId}
      guideTitle="제주 오션 뷰 풀빌라"
      guideSlug="jeju-ocean-villa"
      heroImage="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80"
      initialBlocks={mockBlocks}
      initialStories={mockStories}
    />
  );
}
