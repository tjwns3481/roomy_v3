// @TASK P2-R3-T2 - Story API 유효성 검사 스키마
// @SPEC docs/planning/02-trd.md#스토리-API

import { z } from "zod";

// 스토리 생성 요청 스키마
export const createStorySchema = z.object({
  media_url: z
    .string()
    .min(1, "미디어 URL을 입력해주세요")
    .url("올바른 URL 형식이 아닙니다"),
  media_type: z.enum(["image", "video"], {
    errorMap: () => ({ message: "미디어 타입은 image 또는 video여야 합니다" }),
  }),
  label: z
    .string()
    .max(100, "라벨은 100자를 초과할 수 없습니다")
    .optional(),
});

// 스토리 수정 요청 스키마
export const updateStorySchema = z.object({
  label: z
    .string()
    .max(100, "라벨은 100자를 초과할 수 없습니다")
    .optional(),
  order_index: z
    .number()
    .int("순서는 정수여야 합니다")
    .min(0, "순서는 0 이상이어야 합니다")
    .optional(),
  media_url: z
    .string()
    .url("올바른 URL 형식이 아닙니다")
    .optional(),
});

// 타입 추출
export type CreateStoryRequest = z.infer<typeof createStorySchema>;
export type UpdateStoryRequest = z.infer<typeof updateStorySchema>;
