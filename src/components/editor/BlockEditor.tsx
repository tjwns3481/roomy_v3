"use client";

import { ContentBlock, BlockData } from "@/types";
import { WifiEditor } from "./blocks/WifiEditor";
import { TextEditor } from "./blocks/TextEditor";
import { RulesEditor } from "./blocks/RulesEditor";
import { DevicesEditor } from "./blocks/DevicesEditor";
import { PlacesEditor } from "./blocks/PlacesEditor";
import { GalleryEditor } from "./blocks/GalleryEditor";

interface BlockEditorProps {
  block: ContentBlock;
  onChange: (data: BlockData) => void;
}

const BLOCK_LABELS: Record<string, { icon: string; label: string }> = {
  wifi: { icon: "wifi", label: "Wi-Fi 설정" },
  rules: { icon: "gavel", label: "이용 규칙" },
  devices: { icon: "devices", label: "기기 사용법" },
  places: { icon: "location_on", label: "주변 장소" },
  text: { icon: "text_fields", label: "텍스트" },
  image: { icon: "image", label: "이미지" },
  gallery: { icon: "photo_library", label: "갤러리" },
  video: { icon: "video_library", label: "비디오" },
  map: { icon: "map", label: "지도" },
  contact: { icon: "contact_phone", label: "연락처" },
};

export function BlockEditor({ block, onChange }: BlockEditorProps) {
  const blockInfo = BLOCK_LABELS[block.type] || { icon: "widgets", label: "블록" };

  const renderEditor = () => {
    switch (block.type) {
      case "wifi":
        return <WifiEditor block={block} onChange={onChange} />;
      case "text":
        return <TextEditor block={block} onChange={onChange} />;
      case "rules":
        return <RulesEditor block={block} onChange={onChange} />;
      case "devices":
        return <DevicesEditor block={block} onChange={onChange} />;
      case "places":
        return <PlacesEditor block={block} onChange={onChange} />;
      case "gallery":
        return <GalleryEditor block={block} onChange={onChange} />;
      default:
        return (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-slate-300 text-[48px] mb-2">
              {blockInfo.icon}
            </span>
            <p className="text-slate-500 text-sm">
              이 블록 타입은 아직 편집할 수 없습니다.
            </p>
            <p className="text-slate-400 text-xs mt-1">
              타입: {block.type}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">
          {blockInfo.icon}
        </span>
        <h2 className="font-semibold text-sm text-slate-800 dark:text-white">
          {blockInfo.label}
        </h2>
      </div>

      {/* Editor Content */}
      {renderEditor()}
    </div>
  );
}
