import { BlockType, ContentBlock } from "./index";

export interface BlockPaletteItem {
  type: BlockType;
  icon: string;
  label: string;
  category: "basic" | "content" | "location";
}

export interface EditorState {
  selectedBlockId: string | null;
  blocks: ContentBlock[];
  isDirty: boolean;
  isSaving: boolean;
}

export interface DeviceMode {
  mode: "mobile" | "desktop";
}
