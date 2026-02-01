// @TASK P2-R3-T2 - 가이드별 스토리 목록/생성 API
// @SPEC docs/planning/02-trd.md#스토리-API

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createStorySchema } from "@/lib/validations/story";
import type { Story, ApiResponse } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/guides/[id]/stories
 * 해당 가이드의 스토리 목록 조회 (order_index 순)
 * - 공개 가이드: 누구나 접근 가능
 * - 비공개 가이드: 소유자만 접근 가능
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: guideId } = await params;
    const supabase = await createClient();

    // 1. 가이드 정보 조회 (공개 여부 확인)
    const { data: guide, error: guideError } = await supabase
      .from("guides")
      .select("id, is_published, accommodation_id")
      .eq("id", guideId)
      .single();

    if (guideError || !guide) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "GUIDE_NOT_FOUND",
            message: "가이드를 찾을 수 없습니다",
          },
        },
        { status: 404 }
      );
    }

    // 2. 비공개 가이드인 경우 소유자 확인
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

      // 가이드 소유자 확인 (accommodation -> user_id)
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

    // 3. 스토리 목록 조회
    const { data: stories, error: storiesError } = await supabase
      .from("stories")
      .select("*")
      .eq("guide_id", guideId)
      .order("order_index", { ascending: true });

    if (storiesError) {
      console.error("Stories fetch error:", storiesError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "FETCH_ERROR",
            message: "스토리 목록을 불러오는데 실패했습니다",
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{ stories: Story[] }>>(
      {
        success: true,
        data: { stories: stories || [] },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET stories error:", error);
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
 * POST /api/guides/[id]/stories
 * 새 스토리 생성
 * - 인증 필수 (가이드 소유자만)
 * - order_index 자동 계산 (마지막 + 1)
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: guideId } = await params;
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

    // 2. 가이드 존재 및 소유권 확인
    const { data: guide, error: guideError } = await supabase
      .from("guides")
      .select("id, accommodation_id")
      .eq("id", guideId)
      .single();

    if (guideError || !guide) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "GUIDE_NOT_FOUND",
            message: "가이드를 찾을 수 없습니다",
          },
        },
        { status: 404 }
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
            message: "가이드 수정 권한이 없습니다",
          },
        },
        { status: 403 }
      );
    }

    // 3. 요청 본문 파싱 및 유효성 검사
    const body = await request.json();
    const parseResult = createStorySchema.safeParse(body);

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

    // 4. 마지막 order_index 조회
    const { data: lastStory } = await supabase
      .from("stories")
      .select("order_index")
      .eq("guide_id", guideId)
      .order("order_index", { ascending: false })
      .limit(1)
      .single();

    const nextOrderIndex = lastStory ? lastStory.order_index + 1 : 0;

    // 5. 스토리 생성
    const { data: newStory, error: createError } = await supabase
      .from("stories")
      .insert({
        guide_id: guideId,
        media_url: parseResult.data.media_url,
        media_type: parseResult.data.media_type,
        order_index: nextOrderIndex,
        label: parseResult.data.label || null,
      })
      .select()
      .single();

    if (createError) {
      console.error("Story create error:", createError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "CREATE_ERROR",
            message: "스토리 생성에 실패했습니다",
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse<{ story: Story }>>(
      {
        success: true,
        data: { story: newStory },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST story error:", error);
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
