// User
export interface User {
  id: string;
  clerk_id: string;
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
  | ImageBlockData
  | GalleryBlockData
  | VideoBlockData
  | MapBlockData
  | ContactBlockData;

export interface WifiBlockData {
  ssid: string;
  password: string;
  networkType?: "WPA" | "WPA2" | "WEP" | "None";
  note?: string;
}

export interface RuleItem {
  id: string;
  text: string;
  icon?: string;
  category?: "checkin" | "guide" | "notice";
}

export interface RulesBlockData {
  checkIn: string;
  checkOut: string;
  items: RuleItem[];
}

export interface DevicesBlockData {
  title?: string;
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
  title?: string;
  content: string;
  alignment?: "left" | "center" | "right";
  fontSize?: "sm" | "md" | "lg";
}

export interface ImageBlockData {
  url: string;
  caption?: string;
}

export interface GalleryBlockData {
  images: GalleryImage[];
  layout?: "grid" | "slider";
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  order: number;
}

export interface VideoBlockData {
  url: string;
  caption?: string;
  autoplay?: boolean;
}

export interface MapBlockData {
  latitude: number;
  longitude: number;
  zoom?: number;
  address?: string;
}

export interface ContactBlockData {
  name: string;
  phone: string;
  email?: string;
  kakaoId?: string;
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

// Template
export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: string;
  heroImage?: string; // 히어로 이미지 URL
  is_popular?: boolean;
  is_available: boolean;
  showStory?: boolean; // 스토리 영역 표시 여부
  blocks: ContentBlock[];
}

// Chat Message
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
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
