"use client";

import { ContentBlock, GalleryBlockData, GalleryImage } from "@/types";

interface GalleryPropertiesProps {
  block: ContentBlock;
  onUpdate: (data: Partial<GalleryBlockData>) => void;
}

export function GalleryProperties({
  block,
  onUpdate,
}: GalleryPropertiesProps) {
  const data = block.data as GalleryBlockData;

  const handleAddImage = () => {
    const newImage: GalleryImage = {
      id: `img-${Date.now()}`,
      url: "",
      caption: "",
      order: data.images.length,
    };
    onUpdate({ images: [...data.images, newImage] });
  };

  const handleUpdateImage = (
    imageId: string,
    updates: Partial<GalleryImage>
  ) => {
    const updatedImages = data.images.map((img) => {
      if (img.id === imageId) {
        const updated = { ...img, ...updates };
        // URL 유효성 검사 (간단한 체크)
        if (updates.url !== undefined && updates.url.trim() === "") {
          // 빈 URL은 허용하되 에러 방지
          updated.url = "";
        }
        return updated;
      }
      return img;
    });
    onUpdate({ images: updatedImages });
  };

  const handleDeleteImage = (imageId: string) => {
    if (!confirm("이미지를 삭제하시겠습니까?")) {
      return;
    }
    const updatedImages = data.images
      .filter((img) => img.id !== imageId)
      .map((img, index) => ({ ...img, order: index })); // order 재정렬
    onUpdate({ images: updatedImages });
  };

  return (
    <div className="space-y-6">
      {/* Section: Layout */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          레이아웃
        </h3>
        <div className="flex bg-slate-100 dark:bg-slate-900 rounded-lg p-1">
          <button
            onClick={() => onUpdate({ layout: "grid" })}
            className={`flex-1 py-2 rounded text-xs font-medium transition-colors ${
              data.layout === "grid" || !data.layout
                ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            그리드
          </button>
          <button
            onClick={() => onUpdate({ layout: "slider" })}
            className={`flex-1 py-2 rounded text-xs font-medium transition-colors ${
              data.layout === "slider"
                ? "bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-white"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            }`}
          >
            슬라이더
          </button>
        </div>
      </div>

      <hr className="border-slate-200 dark:border-slate-700" />

      {/* Section: Images List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            이미지 목록
          </h3>
          <button
            onClick={handleAddImage}
            className="text-xs font-medium text-blue-500 hover:text-blue-600 flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            추가
          </button>
        </div>
        <div className="space-y-3">
          {data.images.map((image) => (
            <div
              key={image.id}
              className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 space-y-2"
            >
              <div className="flex items-start gap-2">
                <input
                  type="url"
                  value={image.url}
                  onChange={(e) =>
                    handleUpdateImage(image.id, { url: e.target.value })
                  }
                  className="flex-1 text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-1.5 px-2"
                  placeholder="이미지 URL"
                />
                <button
                  onClick={() => handleDeleteImage(image.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    delete
                  </span>
                </button>
              </div>
              <input
                type="text"
                value={image.caption || ""}
                onChange={(e) =>
                  handleUpdateImage(image.id, { caption: e.target.value })
                }
                className="w-full text-sm rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-blue-500 focus:border-blue-500 py-1.5 px-2"
                placeholder="캡션 (선택)"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
