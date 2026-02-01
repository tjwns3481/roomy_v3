// @TASK P2-R3-T2 - 단일 스토리 조회/수정/삭제 API
// @SPEC docs/planning/02-trd.md#스토리-API

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateStorySchema } from "@/lib/validations/story";
import type { Story, ApiResponse } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/stories/[id]
 * 단일 스토리 조회
 * - 공개 가이드의 스토리: 누구나 접근 가능
 * - 비공개 가이드의 스토리: 소유자만 접근 가능
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: storyId } = await params;
    const supabase = await createClient();

    // 1. 스토리 조회 (가이드 정보 포함)
    const { data: story, error: storyError } = await supabase
      .from("stories")
      .select(
        `
        *,
        guide:guides (
          id,
          is_published,
          accommodation_id
        )
      `
      )
      .eq("id", storyId)
      .single();

    if (storyError || !story) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "STORY_NOT_FOUND",
            message: "스토리를 찾을 수 없습니다",
          },
        },
        { status: 404 }
      );
    }

    // 2. 비공개 가이드인 경우 소유자 확인
    const guide = Array.isArray(story.guide) ? story.guide[0] : story.guide;

    if (!guide.is_published) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: "UNAUTHORIZED",
              message: "로그인이 필요합니다",
            },
          },
          { status: 401 }
        );
      }

      // 가이드 소유자 확인
      const { data: accommodation } = await supabase
        .from("accommodations")
        .select("user_id")
        .eq("id", guide.accommodation_id)
        .single();

      if (!accommodation || accommodation.user_id !== user.id) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: "접근 권한이 없습니다",
            },
          },
          { status: 403 }
        );
      }
    }

    // 3. guide 관계 제거 후 반환
    const { guide: _, ...storyData } = story;

    return NextResponse.json<ApiResponse<{ story: Story }>>(
      {
        success: true,
        data: { story: storyData as Story },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET story error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "서버 오류가 발생했습니다",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/stories/[id]
 * 스토리 수정
 * - 인증 필수 (가이드 소유자만)
 * - 수정 가능 필드: label, order_index, media_url
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: storyId } = await params;
    const supabase = await createClient();

    // 1. 인증 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "로그인이 필요합니다",
          },
        },
        { status: 401 }
      );
    }

    // 2. 스토리 존재 확인 및 가이드 정보 조회
    const { data: story, error: storyError } = await supabase
      .from("stories")
      .select(
        `
        id,
        guide_id,
        guide:guides (
          id,
          accommodation_id
        )
      `
      )
      .eq("id", storyId)
      .single();

    if (storyError || !story) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "STORY_NOT_FOUND",
            message: "스토리를 찾을 수 없습니다",
          },
        },
        { status: 404 }
      );
    }

    // 3. 가이드 소유자 확인
    const guide = Array.isArray(story.guide) ? story.guide[0] : story.guide;
    const { data: accommodation } = await supabase
      .from("accommodations")
      .select("user_id")
      .eq("id", guide.accommodation_id)
      .single();

    if (!accommodation || accommodation.user_id !== user.id) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "스토리 수정 권한이 없습니다",
          },
        },
        { status: 403 }
      );
    }

    // 4. 요청 본문 파싱 및 유효성 검사
    const body = await request.json();
    const parseResult = updateStorySchema.safeParse(body);

    if (!parseResult.success) {
      const errors = parseResult.error.errors.map((e) => e.message).join(", ");
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: errors,
            details: parseResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    // 5. 스토리 업데이트
    const updateData: Record<string, unknown> = {};
    if (parseResult.data.label !== undefined) {
      updateData.label = parseResult.data.label;
    }
    if (parseResult.data.order_index !== undefined) {
      updateData.order_index = parseResult.data.order_index;
    }
    if (parseResult.data.media_url !== undefined) {
      updateData.media_url = parseResult.data.media_url;
    }

    const { data: updatedStory, error: updateError } = await supabase
      .from("stories")
      .update(updateData)
      .eq("id", storyId)
      .select()
      .single();

    if (updateError) {
      console.error("Story update error:", updateError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "UPDATE_ERROR",
            message: "스토리 수정에 실패했습니다",
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{ story: Story }>>(
      {
        success: true,
        data: { story: updatedStory },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH story error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "서버 오류가 발생했습니다",
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/stories/[id]
 * 스토리 삭제
 * - 인증 필수 (가이드 소유자만)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: storyId } = await params;
    const supabase = await createClient();

    // 1. 인증 확인
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "로그인이 필요합니다",
          },
        },
        { status: 401 }
      );
    }

    // 2. 스토리 존재 확인 및 가이드 정보 조회
    const { data: story, error: storyError } = await supabase
      .from("stories")
      .select(
        `
        id,
        guide_id,
        guide:guides (
          id,
          accommodation_id
        )
      `
      )
      .eq("id", storyId)
      .single();

    if (storyError || !story) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "STORY_NOT_FOUND",
            message: "스토리를 찾을 수 없습니다",
          },
        },
        { status: 404 }
      );
    }

    // 3. 가이드 소유자 확인
    const guide = Array.isArray(story.guide) ? story.guide[0] : story.guide;
    const { data: accommodation } = await supabase
      .from("accommodations")
      .select("user_id")
      .eq("id", guide.accommodation_id)
      .single();

    if (!accommodation || accommodation.user_id !== user.id) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "스토리 삭제 권한이 없습니다",
          },
        },
        { status: 403 }
      );
    }

    // 4. 스토리 삭제
    const { error: deleteError } = await supabase
      .from("stories")
      .delete()
      .eq("id", storyId);

    if (deleteError) {
      console.error("Story delete error:", deleteError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DELETE_ERROR",
            message: "스토리 삭제에 실패했습니다",
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{ message: string }>>(
      {
        success: true,
        data: { message: "스토리가 삭제되었습니다" },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE story error:", error);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "서버 오류가 발생했습니다",
        },
      },
      { status: 500 }
    );
  }
}
