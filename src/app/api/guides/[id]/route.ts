// @TASK P2-R2-T3 - 단일 가이드 조회/수정/삭제 API
// @SPEC docs/planning/02-trd.md#가이드-API

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateGuideSchema } from "@/lib/validations/guide";
import type { Guide, ApiResponse } from "@/types";

/**
 * GET /api/guides/[id]
 * 단일 가이드 조회 (공개 가이드 또는 소유자의 가이드)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Supabase 클라이언트 생성
    const supabase = await createClient();

    // 2. 인증 정보 확인 (선택적)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 3. 가이드 조회
    const { data: guide, error: guideError } = await supabase
      .from("guides")
      .select("*")
      .eq("id", id)
      .single();

    if (guideError || !guide) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "가이드를 찾을 수 없습니다",
          },
        },
        { status: 404 }
      );
    }

    // 4. 접근 권한 확인
    // - 공개된 가이드는 누구나 조회 가능
    // - 비공개 가이드는 소유자만 조회 가능
    if (!guide.is_published) {
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

      // 소유자 확인
      const { data: accommodation, error: accError } = await supabase
        .from("accommodations")
        .select("user_id")
        .eq("id", guide.accommodation_id)
        .single();

      if (accError || !accommodation) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: "NOT_FOUND",
              message: "숙소 정보를 찾을 수 없습니다",
            },
          },
          { status: 404 }
        );
      }

      if (accommodation.user_id !== user.id) {
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

    // 5. 조회수 증가 (공개 가이드만, 소유자가 아닌 경우만)
    if (guide.is_published) {
      let shouldIncrementView = true;

      if (user) {
        const { data: accommodation } = await supabase
          .from("accommodations")
          .select("user_id")
          .eq("id", guide.accommodation_id)
          .single();

        if (accommodation?.user_id === user.id) {
          shouldIncrementView = false;
        }
      }

      if (shouldIncrementView) {
        await supabase
          .from("guides")
          .update({ view_count: guide.view_count + 1 })
          .eq("id", id);

        guide.view_count += 1;
      }
    }

    // 6. 성공 응답
    return NextResponse.json<ApiResponse<{ guide: Guide }>>(
      {
        success: true,
        data: { guide },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get guide error:", error);
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
 * PATCH /api/guides/[id]
 * 가이드 수정 (소유자만)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. 요청 본문 파싱
    const body = await request.json();

    // 2. Zod 유효성 검사
    const parseResult = updateGuideSchema.safeParse(body);
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

    // 3. Supabase 클라이언트 생성
    const supabase = await createClient();

    // 4. 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
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

    // 5. 가이드 존재 여부 및 소유권 확인
    const { data: guide, error: guideError } = await supabase
      .from("guides")
      .select("*, accommodations!inner(user_id)")
      .eq("id", id)
      .single();

    if (guideError || !guide) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "가이드를 찾을 수 없습니다",
          },
        },
        { status: 404 }
      );
    }

    // Type assertion for accommodations
    const accommodations = guide.accommodations as unknown as { user_id: string };

    if (accommodations.user_id !== user.id) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "수정 권한이 없습니다",
          },
        },
        { status: 403 }
      );
    }

    // 6. 가이드 업데이트
    const updateData = parseResult.data;
    const { data: updatedGuide, error: updateError } = await supabase
      .from("guides")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Guide update error:", updateError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DB_ERROR",
            message: "가이드 수정에 실패했습니다",
          },
        },
        { status: 500 }
      );
    }

    // 7. 성공 응답
    return NextResponse.json<ApiResponse<{ guide: Guide }>>(
      {
        success: true,
        data: { guide: updatedGuide },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update guide error:", error);
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
 * DELETE /api/guides/[id]
 * 가이드 삭제 (소유자만)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1. Supabase 클라이언트 생성
    const supabase = await createClient();

    // 2. 인증 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
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

    // 3. 가이드 존재 여부 및 소유권 확인
    const { data: guide, error: guideError } = await supabase
      .from("guides")
      .select("*, accommodations!inner(user_id)")
      .eq("id", id)
      .single();

    if (guideError || !guide) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "가이드를 찾을 수 없습니다",
          },
        },
        { status: 404 }
      );
    }

    // Type assertion for accommodations
    const accommodations = guide.accommodations as unknown as { user_id: string };

    if (accommodations.user_id !== user.id) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "삭제 권한이 없습니다",
          },
        },
        { status: 403 }
      );
    }

    // 4. 가이드 삭제
    const { error: deleteError } = await supabase
      .from("guides")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Guide delete error:", deleteError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DB_ERROR",
            message: "가이드 삭제에 실패했습니다",
          },
        },
        { status: 500 }
      );
    }

    // 5. 성공 응답
    return NextResponse.json<ApiResponse<{ message: string }>>(
      {
        success: true,
        data: { message: "가이드가 삭제되었습니다" },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete guide error:", error);
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
