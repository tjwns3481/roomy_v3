import {
  BlockType,
  BlockData,
  WifiBlockData,
  RulesBlockData,
  DevicesBlockData,
  PlacesBlockData,
  TextBlockData,
  ImageBlockData,
  GalleryBlockData,
  VideoBlockData,
  MapBlockData,
  ContactBlockData,
} from "@/types";

/**
 * 각 블록 타입별 기본 데이터 정의
 * 새 블록 추가 시 사용됩니다
 */
export const defaultBlockData: Record<BlockType, BlockData> = {
  wifi: {
    ssid: "",
    password: "",
    networkType: "WPA2",
    note: "",
  } as WifiBlockData,

  rules: {
    checkIn: "15:00",
    checkOut: "11:00",
    items: [],
  } as RulesBlockData,

  devices: {
    title: "시설 안내",
    items: [],
  } as DevicesBlockData,

  places: {
    items: [],
  } as PlacesBlockData,

  text: {
    title: "",
    content: "여기에 내용을 입력하세요.",
    alignment: "left",
    fontSize: "md",
  } as TextBlockData,

  image: {
    url: "",
    caption: "",
  } as ImageBlockData,

  gallery: {
    images: [],
    layout: "grid",
  } as GalleryBlockData,

  video: {
    url: "",
    caption: "",
    autoplay: false,
  } as VideoBlockData,

  map: {
    latitude: 0,
    longitude: 0,
    zoom: 15,
    address: "",
  } as MapBlockData,

  contact: {
    name: "",
    phone: "",
    email: "",
    kakaoId: "",
  } as ContactBlockData,
};

/**
 * 고유 블록 ID 생성
 * @param type 블록 타입
 * @returns 고유 ID (예: "wifi-1738523456789-a1b2c3d")
 */
export function generateBlockId(type: BlockType): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${type}-${timestamp}-${random}`;
}
