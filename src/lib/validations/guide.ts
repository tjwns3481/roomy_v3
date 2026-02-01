// @TASK P2-R2-T3 - Guide API 유효성 검사 스키마
// @SPEC docs/planning/02-trd.md#가이드-API

import { z } from "zod";

// Slug 생성 유틸 (한글 -> 로마자 음역 또는 랜덤)
export function generateSlug(title: string): string {
  // 한글을 간단한 영문으로 변환하거나 UUID prefix 사용
  const sanitized = title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  // 한글이 포함되어 있거나 빈 문자열이면 랜덤 slug 생성
  if (/[가-힣]/.test(sanitized) || sanitized.length === 0) {
    const randomPart = Math.random().toString(36).substring(2, 10);
    return `guide-${randomPart}`;
  }

  // 영문 slug + 랜덤 suffix
  const randomSuffix = Math.random().toString(36).substring(2, 6);
  return `${sanitized.substring(0, 40)}-${randomSuffix}`;
}

// Slug 유효성 검사
const slugSchema = z
  .string()
  .min(3, "슬러그는 최소 3자 이상이어야 합니다")
  .max(50, "슬러그는 50자를 초과할 수 없습니다")
  .regex(
    /^[a-z0-9-]+$/,
    "슬러그는 소문자, 숫자, 하이픈만 사용할 수 있습니다"
  );

// 가이드 생성 요청 스키마
export const createGuideSchema = z.object({
  accommodation_id: z
    .string()
    .uuid("올바른 숙소 ID 형식이 아닙니다"),
  title: z
    .string()
    .min(1, "제목을 입력해주세요")
    .max(100, "제목은 100자를 초과할 수 없습니다"),
  slug: slugSchema.optional(),
});

// 가이드 수정 요청 스키마
export const updateGuideSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해주세요")
    .max(100, "제목은 100자를 초과할 수 없습니다")
    .optional(),
  content_blocks: z
    .array(
      z.object({
        id: z.string(),
        type: z.enum([
          "wifi",
          "rules",
          "devices",
          "places",
          "text",
          "image",
          "video",
          "gallery",
          "map",
          "contact",
        ]),
        order: z.number().int().min(0),
        data: z.record(z.unknown()),
      })
    )
    .optional(),
  wifi_ssid: z
    .string()
    .max(50, "WiFi SSID는 50자를 초과할 수 없습니다")
    .nullable()
    .optional(),
  wifi_password: z
    .string()
    .max(100, "WiFi 비밀번호는 100자를 초과할 수 없습니다")
    .nullable()
    .optional(),
});

// 가이드 발행 상태 변경 스키마
export const publishGuideSchema = z.object({
  is_published: z.boolean(),
});

// 가이드 목록 조회 쿼리 파라미터 스키마
export const listGuidesQuerySchema = z.object({
  accommodation_id: z.string().uuid().optional(),
});

// 타입 추출
export type CreateGuideRequest = z.infer<typeof createGuideSchema>;
export type UpdateGuideRequest = z.infer<typeof updateGuideSchema>;
export type PublishGuideRequest = z.infer<typeof publishGuideSchema>;
export type ListGuidesQuery = z.infer<typeof listGuidesQuerySchema>;
