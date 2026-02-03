"use client";

import { ContentBlock, BlockType } from "@/types";
import { defaultBlockData } from "@/data/defaultBlockData";
import { WifiProperties } from "./properties/WifiProperties";
import { TextProperties } from "./properties/TextProperties";
import { RulesProperties } from "./properties/RulesProperties";
import { ContactProperties } from "./properties/ContactProperties";
import { PlacesProperties } from "./properties/PlacesProperties";
import { DevicesProperties } from "./properties/DevicesProperties";
import { GalleryProperties } from "./properties/GalleryProperties";
import { ImageProperties } from "./properties/ImageProperties";
import { VideoProperties } from "./properties/VideoProperties";
import { MapProperties } from "./properties/MapProperties";

interface PropertyPanelProps {
  selectedBlock: ContentBlock | null;
  onBlockUpdate: (blockId: string, data: Record<string, unknown>) => void;
  onBlockDelete?: (blockId: string) => void;
  onClose?: () => void;
}

const blockTypeIcons: Record<BlockType, string> = {
  wifi: "wifi",
  rules: "checklist",
  devices: "devices",
  places: "location_on",
  text: "text_fields",
  image: "image",
  video: "videocam",
  gallery: "collections",
  map: "map",
  contact: "contacts",
};

const blockTypeLabels: Record<BlockType, string> = {
  wifi: "Wi-Fi 설정",
  rules: "이용 규칙",
  devices: "기기 안내",
  places: "추천 장소",
  text: "텍스트",
  image: "이미지",
  video: "비디오",
  gallery: "갤러리",
  map: "지도",
  contact: "연락처",
};

export function PropertyPanel({
  selectedBlock,
  onBlockUpdate,
  onBlockDelete,
  onClose,
}: PropertyPanelProps) {
  if (!selectedBlock) {
    return null;
  }

  const handleUpdate = (data: Record<string, unknown>) => {
    onBlockUpdate(selectedBlock.id, data);
  };

  const handleReset = () => {
    if (
      confirm(
        "블록 설정을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      // 선택된 블록의 타입에 맞는 기본 데이터로 초기화
      const defaultData = defaultBlockData[selectedBlock.type];
      onBlockUpdate(selectedBlock.id, defaultData as unknown as Record<string, unknown>);
    }
  };

  const renderProperties = () => {
    switch (selectedBlock.type) {
      case "wifi":
        return (
          <WifiProperties block={selectedBlock} onUpdate={handleUpdate} />
        );
      case "text":
        return (
          <TextProperties block={selectedBlock} onUpdate={handleUpdate} />
        );
      case "rules":
        return (
          <RulesProperties block={selectedBlock} onUpdate={handleUpdate} />
        );
      case "contact":
        return (
          <ContactProperties block={selectedBlock} onUpdate={handleUpdate} />
        );
      case "places":
        return (
          <PlacesProperties block={selectedBlock} onUpdate={handleUpdate} />
        );
      case "devices":
        return (
          <DevicesProperties block={selectedBlock} onUpdate={handleUpdate} />
        );
      case "gallery":
        return (
          <GalleryProperties block={selectedBlock} onUpdate={handleUpdate} />
        );
      case "image":
        return (
          <ImageProperties block={selectedBlock} onUpdate={handleUpdate} />
        );
      case "video":
        return (
          <VideoProperties block={selectedBlock} onUpdate={handleUpdate} />
        );
      case "map":
        return (
          <MapProperties block={selectedBlock} onUpdate={handleUpdate} />
        );
      default:
        return (
          <div className="text-sm text-slate-500 text-center py-8">
            이 블록 타입은 아직 지원되지 않습니다.
          </div>
        );
    }
  };

  return (
    <aside className="w-[300px] bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col shrink-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-500">
            {blockTypeIcons[selectedBlock.type]}
          </span>
          <h2 className="font-semibold text-sm text-slate-800 dark:text-white">
            {blockTypeLabels[selectedBlock.type]}
          </h2>
        </div>
        <div className="flex gap-1">
          {onBlockDelete && (
            <button
              onClick={() => onBlockDelete(selectedBlock.id)}
              className="text-slate-400 hover:text-red-500 transition-colors"
              title="Delete Block"
            >
              <span className="material-symbols-outlined text-[18px]">
                delete
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5">{renderProperties()}</div>

      {/* Bottom Action */}
      <div className="p-5 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <button
          onClick={handleReset}
          className="w-full py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
        >
          설정 초기화
        </button>
      </div>
    </aside>
  );
}
