// @TASK P2-R2-T3 - 가이드 발행/발행취소 API
// @SPEC docs/planning/02-trd.md#가이드-API

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { publishGuideSchema } from "@/lib/validations/guide";
import type { Guide, ApiResponse } from "@/types";

/**
 * PATCH /api/guides/[id]/publish
 * 가이드 발행 상태 토글 (소유자만)
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
    const parseResult = publishGuideSchema.safeParse(body);
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

    const { is_published } = parseResult.data;

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
            message: "발행 권한이 없습니다",
          },
        },
        { status: 403 }
      );
    }

    // 6. 가이드 발행 상태 변경
    const { data: updatedGuide, error: updateError } = await supabase
      .from("guides")
      .update({ is_published })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Guide publish error:", updateError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DB_ERROR",
            message: "발행 상태 변경에 실패했습니다",
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
    console.error("Publish guide error:", error);
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
