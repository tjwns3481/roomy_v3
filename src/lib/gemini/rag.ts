import type {
  Guide,
  ContentBlock,
  WifiBlockData,
  RulesBlockData,
  DevicesBlockData,
  PlacesBlockData,
  TextBlockData,
} from "@/types";

/**
 * 가이드의 content_blocks를 자연어 컨텍스트로 변환
 */
export function buildRAGContext(guide: Guide): string {
  const contextParts: string[] = [];

  contextParts.push(`# 숙소 정보: ${guide.title}`);
  contextParts.push("");

  for (const block of guide.content_blocks) {
    const blockContext = extractBlockContext(block);
    if (blockContext) {
      contextParts.push(blockContext);
      contextParts.push("");
    }
  }

  return contextParts.join("\n");
}

/**
 * 블록 타입별 텍스트 추출
 */
function extractBlockContext(block: ContentBlock): string | null {
  switch (block.type) {
    case "wifi":
      return extractWifiContext(block.data as WifiBlockData);
    case "rules":
      return extractRulesContext(block.data as RulesBlockData);
    case "devices":
      return extractDevicesContext(block.data as DevicesBlockData);
    case "places":
      return extractPlacesContext(block.data as PlacesBlockData);
    case "text":
      return extractTextContext(block.data as TextBlockData);
    default:
      return null;
  }
}

function extractWifiContext(data: WifiBlockData): string {
  const parts: string[] = ["## Wi-Fi 정보"];
  parts.push(`- SSID: ${data.ssid}`);
  parts.push(`- 비밀번호: ${data.password}`);
  if (data.networkType) {
    parts.push(`- 보안 유형: ${data.networkType}`);
  }
  if (data.note) {
    parts.push(`- 참고: ${data.note}`);
  }
  return parts.join("\n");
}

function extractRulesContext(data: RulesBlockData): string {
  const parts: string[] = ["## 이용 규칙"];
  parts.push(`- 체크인: ${data.checkIn}`);
  parts.push(`- 체크아웃: ${data.checkOut}`);
  parts.push("");
  parts.push("### 규칙 목록");
  for (const item of data.items) {
    const category = item.category ? `[${item.category}] ` : "";
    parts.push(`- ${category}${item.text}`);
  }
  return parts.join("\n");
}

function extractDevicesContext(data: DevicesBlockData): string {
  const parts: string[] = ["## 기기 사용법"];
  for (const device of data.items) {
    parts.push(`### ${device.name}`);
    parts.push(device.description);
    parts.push("");
  }
  return parts.join("\n");
}

function extractPlacesContext(data: PlacesBlockData): string {
  const parts: string[] = ["## 주변 장소"];
  for (const place of data.items) {
    const hostPick = place.isHostPick ? " (호스트 추천)" : "";
    const rating = place.rating ? ` ⭐ ${place.rating}` : "";
    parts.push(`### ${place.name}${hostPick}${rating}`);
    parts.push(`- 카테고리: ${place.category}`);
    parts.push(`- 주소: ${place.address}`);
    if (place.mapUrl) {
      parts.push(`- 지도: ${place.mapUrl}`);
    }
    parts.push("");
  }
  return parts.join("\n");
}

function extractTextContext(data: TextBlockData): string {
  const parts: string[] = [];
  if (data.title) {
    parts.push(`## ${data.title}`);
  }
  parts.push(data.content);
  return parts.join("\n");
}

/**
 * 시스템 프롬프트 생성
 */
export function buildSystemPrompt(guideContext: string): string {
  return `당신은 숙박 가이드 AI 어시스턴트입니다.

아래는 이 숙소에 대한 가이드 정보입니다:

${guideContext}

역할:
- 게스트의 질문에 친절하고 정확하게 답변하세요.
- 가이드에 있는 정보를 기반으로 답변하세요.
- 가이드에 없는 정보는 "죄송하지만 해당 정보는 가이드에 포함되어 있지 않습니다"라고 안내하세요.
- 한국어로 답변하세요.
- 간결하지만 도움이 되는 답변을 제공하세요.`;
}
