"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  pointerWithin,
  useSensor,
  useSensors,
  PointerSensor,
  useDroppable,
} from "@dnd-kit/core";
import { Sidebar } from "./Sidebar";
import { PropertyPanel } from "./PropertyPanel";
import { StoryEditor } from "./StoryEditor";
import { EditorPhonePreview } from "./EditorPhonePreview";
import { ThemePanel } from "./ThemePanel";
import { BlockType, ContentBlock, Story } from "@/types";
import { GuideTheme, defaultTheme } from "@/types/theme";
import { defaultBlockData, generateBlockId } from "@/data/defaultBlockData";
import { useSaveGuide } from "@/hooks/useSaveGuide";
import { HeroProperties, HeroData } from "./properties/HeroProperties";

interface EditorLayoutProps {
  guideId: string;
  guideTitle?: string;
  guideSlug?: string;
  heroImage?: string;
  heroSubtitle?: string;
  initialBlocks?: ContentBlock[];
  initialStories?: Story[];
  initialShowStory?: boolean;
  children?: React.ReactNode;
}

type EditMode = "block" | "hero" | "story" | "theme" | null;

// 디바이스 프리셋
const DEVICE_PRESETS = {
  mobile: { name: "iPhone 14", width: 375, height: 812 },
  "mobile-se": { name: "iPhone SE", width: 375, height: 667 },
  "mobile-max": { name: "iPhone 14 Pro Max", width: 430, height: 932 },
  tablet: { name: "iPad Mini", width: 744, height: 1133 },
  desktop: { name: "Desktop", width: 1200, height: 800 },
} as const;

type DevicePreset = keyof typeof DEVICE_PRESETS;

export function EditorLayout({
  guideId,
  guideTitle = "새 가이드",
  guideSlug = "preview",
  heroImage,
  heroSubtitle = "",
  initialBlocks = [],
  initialStories = [],
  initialShowStory = true,
  children,
}: EditorLayoutProps) {
  const router = useRouter();
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [deviceMode, setDeviceMode] = useState<"mobile" | "desktop">("mobile");
  const [isPublished, setIsPublished] = useState(false);
  const [showStory, setShowStory] = useState(initialShowStory);

  // Hero data state
  const [heroData, setHeroData] = useState<HeroData>({
    heroImage: heroImage || "",
    heroTitle: guideTitle,
    heroSubtitle: heroSubtitle,
  });

  // Theme state
  const [theme, setTheme] = useState<GuideTheme>(defaultTheme);

  const { saveStatus, saveGuide, loadGuide, error } = useSaveGuide();

  // 드래그 중인 사이드바 블록 타입
  const [draggingSidebarBlock, setDraggingSidebarBlock] = useState<BlockType | null>(null);

  // DnD 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // 캔버스 드롭 영역
  const { setNodeRef: setCanvasRef, isOver: isOverCanvas } = useDroppable({
    id: "canvas-drop-area",
  });

  // 컴포넌트 마운트 시 로컬 스토리지에서 데이터 불러오기
  useEffect(() => {
    const savedData = loadGuide(guideId);
    if (savedData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial data load
      setBlocks(savedData.blocks);
      setStories(savedData.stories);
      if (savedData.heroImage || savedData.heroTitle || savedData.heroSubtitle) {
        setHeroData({
          heroImage: savedData.heroImage || "",
          heroTitle: savedData.heroTitle || guideTitle,
          heroSubtitle: savedData.heroSubtitle || heroSubtitle,
        });
      }
    }
  }, [guideId, loadGuide]);

  // 저장 핸들러
  const handleSave = async () => {
    try {
      await saveGuide(
        guideId,
        blocks,
        stories,
        heroData.heroImage,
        heroData.heroTitle,
        heroData.heroSubtitle
      );
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  const handleAddBlock = (type: BlockType) => {
    // 1. 고유 ID 생성
    const newBlockId = generateBlockId(type);

    // 2. 새 블록 생성
    const newBlock: ContentBlock = {
      id: newBlockId,
      type,
      order: blocks.length, // 현재 블록 배열의 길이를 순서로 사용
      data: defaultBlockData[type],
    };

    // 3. 블록 배열에 추가
    setBlocks((prev) => [...prev, newBlock]);

    // 5. 새로 추가된 블록 선택
    setSelectedBlockId(newBlockId);
  };

  const handleSelectBlock = (blockId: string) => {
    setSelectedBlockId(blockId);
    setEditMode("block");
  };

  const handleBlocksReorder = (reorderedBlocks: ContentBlock[]) => {
    setBlocks(reorderedBlocks);
  };

  const handleBlockDelete = (blockId: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
  };

  const handleBlockDuplicate = (blockId: string) => {
    const blockToDuplicate = blocks.find((b) => b.id === blockId);
    if (blockToDuplicate) {
      const newBlock = {
        ...blockToDuplicate,
        id: `${blockToDuplicate.id}-copy-${Date.now()}`,
        order: blocks.length,
      };
      setBlocks((prev) => [...prev, newBlock]);
    }
  };

  const handleBlockUpdate = (blockId: string, data: Record<string, unknown>) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId
          ? { ...block, data: { ...block.data, ...data } as typeof block.data }
          : block
      )
    );
  };

  const handleStoryClick = (storyId: string) => {
    setEditMode("story");
    setSelectedBlockId(null);
  };

  const handleAddStory = (storyData: Partial<Story>) => {
    const newStory: Story = {
      id: `story-${Date.now()}`,
      guide_id: guideId,
      media_url: storyData.media_url || "",
      media_type: storyData.media_type || "image",
      order_index: stories.length,
      label: storyData.label,
      created_at: new Date().toISOString(),
    };
    setStories((prev) => [...prev, newStory]);
  };

  const handleUpdateStory = (storyId: string, storyData: Partial<Story>) => {
    setStories((prev) =>
      prev.map((story) =>
        story.id === storyId ? { ...story, ...storyData } : story
      )
    );
  };

  const handleDeleteStory = (storyId: string) => {
    setStories((prev) => prev.filter((s) => s.id !== storyId));
  };

  const handleReorderStories = (reorderedStories: Story[]) => {
    setStories(reorderedStories);
  };

  const handleHeroClick = () => {
    setEditMode("hero");
    setSelectedBlockId(null);
  };

  const handleHeroUpdate = (data: Partial<HeroData>) => {
    setHeroData((prev) => ({ ...prev, ...data }));
  };

  const handleQuickAccessClick = (type: string) => {
    console.log("Quick access clicked:", type);
    // TODO: Scroll to relevant block
  };

  // P2-T3: 뒤로가기
  const handleBack = useCallback(() => {
    router.push("/dashboard");
  }, [router]);

  // P2-T4: 미리보기 (새 탭에서 열기)
  const handlePreview = useCallback(() => {
    // guideSlug가 없거나 "preview"인 경우 guideId를 사용
    const slug = guideSlug && guideSlug !== "preview" ? guideSlug : guideId;
    window.open(`/stay/${slug}`, "_blank");
  }, [guideSlug, guideId]);

  // P3-T1: 사이드바 드래그 이벤트 핸들러
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === "sidebar-block") {
      setDraggingSidebarBlock(active.data.current.blockType as BlockType);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    // 드래그 상태 초기화
    setDraggingSidebarBlock(null);

    // 사이드바에서 드래그된 블록인 경우
    if (active.data.current?.type === "sidebar-block" && over) {
      const blockType = active.data.current.blockType as BlockType;
      handleAddBlock(blockType);
    }
  }, [handleAddBlock]);

  // P3-T4: 발행 상태 토글
  const handlePublish = useCallback(async () => {
    try {
      // 먼저 저장
      await handleSave();

      // 발행 상태 토글
      const newPublishState = !isPublished;
      setIsPublished(newPublishState);

      // TODO: API 호출하여 발행 상태 업데이트
      // await fetch(`/api/guides/${guideId}/publish`, {
      //   method: isPublished ? 'DELETE' : 'POST',
      // });

      // 발행 성공 시 알림
      if (newPublishState) {
        const slug = guideSlug && guideSlug !== "preview" ? guideSlug : guideId;
        const publishedUrl = `${window.location.origin}/stay/${slug}`;

        // Toast 메시지 대신 간단한 alert 사용 (나중에 toast 라이브러리로 교체 가능)
        alert(`발행되었습니다!\n\n발행된 URL:\n${publishedUrl}\n\n미리보기 버튼을 클릭하거나 URL을 복사하여 공유하세요.`);
      }
    } catch (err) {
      console.error('Publish failed:', err);
      alert('발행에 실패했습니다. 다시 시도해주세요.');
    }
  }, [handleSave, isPublished, guideSlug, guideId]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 z-20">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-4 w-1/3">
          <button
            onClick={handleBack}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-300"
            title="대시보드로 이동"
          >
            <span className="material-symbols-outlined text-[20px]">
              arrow_back
            </span>
          </button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
          <input
            className="bg-transparent border-none text-lg font-bold text-slate-800 dark:text-white focus:ring-0 p-0 hover:text-blue-500 transition-colors cursor-text truncate w-full"
            type="text"
            defaultValue={guideTitle}
          />
        </div>

        {/* Center: Status & Device Toggle */}
        <div className="flex items-center justify-center gap-6 w-1/3">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <span
              className={`material-symbols-outlined text-[16px] ${
                saveStatus === "saved"
                  ? "text-green-500"
                  : saveStatus === "saving"
                    ? "text-yellow-500"
                    : "text-slate-400"
              }`}
            >
              {saveStatus === "saved" ? "check_circle" : "pending"}
            </span>
            <span>
              {saveStatus === "saved"
                ? "저장됨"
                : saveStatus === "saving"
                  ? "저장 중..."
                  : "저장되지 않음"}
            </span>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex items-center gap-1">
            <button
              onClick={() => setDeviceMode("mobile")}
              className={`p-1.5 rounded transition-colors ${
                deviceMode === "mobile"
                  ? "bg-white dark:bg-slate-600 shadow-sm text-blue-500 dark:text-white"
                  : "hover:bg-white/50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                smartphone
              </span>
            </button>
            <button
              onClick={() => setDeviceMode("desktop")}
              className={`p-1.5 rounded transition-colors ${
                deviceMode === "desktop"
                  ? "bg-white dark:bg-slate-600 shadow-sm text-blue-500 dark:text-white"
                  : "hover:bg-white/50 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                desktop_windows
              </span>
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-3 w-1/3">
          {/* 스토리 토글 버튼 */}
          <button
            onClick={() => setShowStory(!showStory)}
            className={`flex items-center justify-center size-9 rounded-lg transition-colors ${
              showStory
                ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
                : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
            }`}
            title={showStory ? "스토리 숨기기" : "스토리 표시"}
          >
            <span className="material-symbols-outlined text-[20px]">
              {showStory ? "auto_stories" : "hide_image"}
            </span>
          </button>
          <button
            onClick={() => {
              if (!showStory) {
                setShowStory(true); // 스토리가 숨겨져 있으면 먼저 표시
              }
              setEditMode("story");
              setSelectedBlockId(null);
            }}
            className={`flex items-center justify-center size-9 rounded-lg transition-colors ${
              editMode === "story"
                ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
            title="Story Editor"
          >
            <span className="material-symbols-outlined text-[20px]">
              photo_library
            </span>
          </button>
          <button
            onClick={() => {
              setEditMode("theme");
              setSelectedBlockId(null);
            }}
            className={`flex items-center justify-center size-9 rounded-lg transition-colors ${
              editMode === "theme"
                ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            }`}
            title="Theme Settings"
          >
            <span className="material-symbols-outlined text-[20px]">
              palette
            </span>
          </button>
          <button
            onClick={handlePreview}
            className="flex items-center justify-center size-9 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="새 탭에서 미리보기"
          >
            <span className="material-symbols-outlined text-[20px]">
              visibility
            </span>
          </button>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="bg-slate-700 hover:bg-slate-800 disabled:bg-slate-400 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-2"
            title="Save"
          >
            <span>
              {saveStatus === 'saving' ? '저장 중...' : '저장'}
            </span>
            <span className="material-symbols-outlined text-[16px]">
              {saveStatus === 'saving' ? 'sync' : 'save'}
            </span>
          </button>
          <button
            onClick={handlePublish}
            className={`px-5 py-2 rounded-lg text-sm font-semibold shadow-sm transition-colors flex items-center gap-2 ${
              isPublished
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            <span>{isPublished ? "발행됨" : "발행"}</span>
            <span className="material-symbols-outlined text-[16px]">
              {isPublished ? "check_circle" : "rocket_launch"}
            </span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Component Library */}
        <Sidebar onAddBlock={handleAddBlock} />

        {/* Center: Canvas / Mobile Preview */}
        <main
          ref={setCanvasRef}
          className={`flex-1 bg-slate-100 dark:bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center p-8 transition-colors ${
            isOverCanvas && draggingSidebarBlock
              ? "bg-blue-50 dark:bg-blue-950/30 ring-2 ring-inset ring-blue-500/50"
              : ""
          }`}
        >
          {/* EditorPhonePreview */}
          <EditorPhonePreview
            blocks={blocks}
            stories={stories}
            heroImage={heroData.heroImage}
            heroTitle={heroData.heroTitle}
            heroSubtitle={heroData.heroSubtitle}
            deviceMode={deviceMode}
            slug={guideSlug}
            selectedBlockId={selectedBlockId}
            showStory={showStory}
            onBlockSelect={handleSelectBlock}
            onBlocksReorder={handleBlocksReorder}
            onBlockDelete={handleBlockDelete}
            onStoryClick={handleStoryClick}
            onHeroClick={handleHeroClick}
            onQuickAccessClick={handleQuickAccessClick}
          />
        </main>

        {/* Right Sidebar: Conditional Panel */}
        {editMode === "hero" ? (
          <aside className="w-[300px] bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col shrink-0">
            {/* Header */}
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500">
                  photo_camera
                </span>
                <h2 className="font-semibold text-sm text-slate-800 dark:text-white">
                  히어로 섹션
                </h2>
              </div>
              <button
                onClick={() => setEditMode(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Close"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5">
              <HeroProperties data={heroData} onUpdate={handleHeroUpdate} />
            </div>
          </aside>
        ) : editMode === "story" ? (
          <StoryEditor
            stories={stories}
            onAddStory={handleAddStory}
            onUpdateStory={handleUpdateStory}
            onDeleteStory={handleDeleteStory}
            onReorderStories={handleReorderStories}
          />
        ) : editMode === "theme" ? (
          <ThemePanel
            theme={theme}
            onThemeChange={setTheme}
            onClose={() => setEditMode(null)}
          />
        ) : (
          <PropertyPanel
            selectedBlock={blocks.find((b) => b.id === selectedBlockId) || null}
            onBlockUpdate={handleBlockUpdate}
            onBlockDelete={handleBlockDelete}
          />
        )}
      </div>

      {/* 사이드바 드래그 오버레이 */}
      <DragOverlay>
        {draggingSidebarBlock && (
          <div className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border-2 border-blue-500">
            <span className="material-symbols-outlined text-blue-500 text-[24px]">
              {draggingSidebarBlock === "wifi" && "wifi"}
              {draggingSidebarBlock === "text" && "article"}
              {draggingSidebarBlock === "rules" && "gavel"}
              {draggingSidebarBlock === "devices" && "home"}
              {draggingSidebarBlock === "places" && "location_on"}
              {draggingSidebarBlock === "gallery" && "grid_view"}
              {draggingSidebarBlock === "image" && "image"}
              {draggingSidebarBlock === "video" && "smart_display"}
              {draggingSidebarBlock === "map" && "map"}
              {draggingSidebarBlock === "contact" && "phone"}
            </span>
            <span className="text-sm font-medium text-slate-800 dark:text-white">
              블록 추가
            </span>
          </div>
        )}
      </DragOverlay>
    </div>
    </DndContext>
  );
}
