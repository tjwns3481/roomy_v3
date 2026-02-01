// User
export interface User {
  id: string;
  email: string;
  name: string | null;
  role: "host" | "admin";
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

// Accommodation
export interface Accommodation {
  id: string;
  user_id: string;
  name: string;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

// Guide
export interface Guide {
  id: string;
  accommodation_id: string;
  slug: string;
  title: string;
  content_blocks: ContentBlock[];
  wifi_ssid: string | null;
  wifi_password: string | null;
  is_published: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
}

// Content Blocks
export type BlockType =
  | "wifi"
  | "rules"
  | "devices"
  | "places"
  | "text"
  | "image"
  | "video"
  | "gallery"
  | "map"
  | "contact";

export interface ContentBlock {
  id: string;
  type: BlockType;
  order: number;
  data: BlockData;
}

export type BlockData =
  | WifiBlockData
  | RulesBlockData
  | DevicesBlockData
  | PlacesBlockData
  | TextBlockData
  | ImageBlockData;

export interface WifiBlockData {
  ssid: string;
  password: string;
  note?: string;
}

export interface RulesBlockData {
  checkIn: string;
  checkOut: string;
  items: string[];
}

export interface DevicesBlockData {
  items: DeviceItem[];
}

export interface DeviceItem {
  name: string;
  description: string;
  imageUrl?: string;
}

export interface PlacesBlockData {
  items: PlaceItem[];
}

export interface PlaceItem {
  name: string;
  category: "restaurant" | "cafe" | "attraction" | "etc";
  address: string;
  mapUrl?: string;
  rating?: number;
  isHostPick?: boolean;
}

export interface TextBlockData {
  title: string;
  content: string;
}

export interface ImageBlockData {
  url: string;
  caption?: string;
}

// Story
export interface Story {
  id: string;
  guide_id: string;
  media_url: string;
  media_type: "image" | "video";
  order_index: number;
  label?: string;
  created_at: string;
}

// AI Conversation
export interface AIConversation {
  id: string;
  guide_id: string;
  session_id: string;
  question: string;
  answer: string;
  created_at: string;
}

// Visit
export interface Visit {
  id: string;
  guide_id: string;
  visitor_ip: string | null;
  user_agent: string | null;
  created_at: string;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
