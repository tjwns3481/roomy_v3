import { EditorLayout } from "@/components/editor/EditorLayout";
import { ContentBlock, Story } from "@/types";
import { templates, blankTemplate } from "@/data/templates";

interface EditorPageProps {
  params: Promise<{
    guideId: string;
  }>;
}

// 템플릿 ID에서 초기 데이터 가져오기
function getInitialDataFromTemplate(guideId: string): {
  blocks: ContentBlock[];
  stories: Story[];
  showStory: boolean;
  title: string;
  heroImage: string;
} {
  // temp-{templateId}-{timestamp} 형식인 경우 템플릿 ID 추출
  const templateMatch = guideId.match(/^temp-(\w+)-\d+$/);

  if (templateMatch) {
    const templateId = templateMatch[1];
    const template = templates.find(t => t.id === templateId);

    if (template) {
      return {
        blocks: template.blocks,
        stories: [],
        showStory: template.showStory ?? true,
        title: "새 가이드",
        heroImage: template.heroImage ?? "",
      };
    }
  }

  // 빈 페이지로 시작하기 (temp-{timestamp} 형식)
  if (guideId.match(/^temp-\d+$/)) {
    return {
      blocks: blankTemplate.blocks,
      stories: [],
      showStory: blankTemplate.showStory ?? false,
      title: "새 가이드",
      heroImage: "",
    };
  }

  // 기본값 (빈 상태)
  return {
    blocks: [],
    stories: [],
    showStory: true,
    title: "새 가이드",
    heroImage: "",
  };
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { guideId } = await params;

  // 템플릿 기반 초기 데이터 가져오기
  const initialData = getInitialDataFromTemplate(guideId);

  // TODO: Fetch guide data from API (기존 가이드 수정 시)
  // const guide = await getGuide(guideId);

  return (
    <EditorLayout
      guideId={guideId}
      guideTitle={initialData.title}
      guideSlug={guideId}
      heroImage={initialData.heroImage}
      initialBlocks={initialData.blocks}
      initialStories={initialData.stories}
      initialShowStory={initialData.showStory}
    />
  );
}
