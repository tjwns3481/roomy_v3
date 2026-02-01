// @TASK P2-R2-T3 - 가이드 목록 조회/생성 API
// @SPEC docs/planning/02-trd.md#가이드-API

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  createGuideSchema,
  listGuidesQuerySchema,
  generateSlug,
} from "@/lib/validations/guide";
import type { Guide, ApiResponse } from "@/types";

/**
 * GET /api/guides
 * 현재 사용자의 가이드 목록 반환
 * 쿼리 파라미터: ?accommodation_id=xxx (선택)
 */
export async function GET(request: NextRequest) {
  try {
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

    // 3. 쿼리 파라미터 파싱
    const { searchParams } = new URL(request.url);
    const queryParams = {
      accommodation_id: searchParams.get("accommodation_id") || undefined,
    };

    const parseResult = listGuidesQuerySchema.safeParse(queryParams);
    if (!parseResult.success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "올바른 숙소 ID 형식이 아닙니다",
            details: parseResult.error.flatten(),
          },
        },
        { status: 400 }
      );
    }

    // 4. 사용자 소유 숙소 ID 목록 조회
    const { data: accommodations, error: accError } = await supabase
      .from("accommodations")
      .select("id")
      .eq("user_id", user.id);

    if (accError) {
      console.error("Accommodations fetch error:", accError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DB_ERROR",
            message: "숙소 정보 조회에 실패했습니다",
          },
        },
        { status: 500 }
      );
    }

    const accommodationIds = accommodations?.map((a) => a.id) || [];

    if (accommodationIds.length === 0) {
      return NextResponse.json<ApiResponse<{ guides: Guide[] }>>(
        {
          success: true,
          data: { guides: [] },
        },
        { status: 200 }
      );
    }

    // 5. 가이드 목록 조회 쿼리 빌드
    let query = supabase
      .from("guides")
      .select("*")
      .in("accommodation_id", accommodationIds)
      .order("created_at", { ascending: false });

    // 특정 숙소 필터링
    if (parseResult.data.accommodation_id) {
      // 해당 숙소가 사용자 소유인지 확인
      if (!accommodationIds.includes(parseResult.data.accommodation_id)) {
        return NextResponse.json<ApiResponse<null>>(
          {
            success: false,
            error: {
              code: "FORBIDDEN",
              message: "접근 권한이 없는 숙소입니다",
            },
          },
          { status: 403 }
        );
      }
      query = query.eq("accommodation_id", parseResult.data.accommodation_id);
    }

    const { data: guides, error: guidesError } = await query;

    if (guidesError) {
      console.error("Guides fetch error:", guidesError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DB_ERROR",
            message: "가이드 목록 조회에 실패했습니다",
          },
        },
        { status: 500 }
      );
    }

    // 6. 성공 응답
    return NextResponse.json<ApiResponse<{ guides: Guide[] }>>(
      {
        success: true,
        data: { guides: guides || [] },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get guides error:", error);
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
 * POST /api/guides
 * 새 가이드 생성
 */
export async function POST(request: NextRequest) {
  try {
    // 1. 요청 본문 파싱
    const body = await request.json();

    // 2. Zod 유효성 검사
    const parseResult = createGuideSchema.safeParse(body);
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

    const { accommodation_id, title, slug: customSlug } = parseResult.data;

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

    // 5. 숙소 소유권 확인
    const { data: accommodation, error: accError } = await supabase
      .from("accommodations")
      .select("id, user_id")
      .eq("id", accommodation_id)
      .single();

    if (accError || !accommodation) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: "존재하지 않는 숙소입니다",
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
            message: "접근 권한이 없는 숙소입니다",
          },
        },
        { status: 403 }
      );
    }

    // 6. Slug 생성 또는 검증
    let slug = customSlug || generateSlug(title);

    // Slug 중복 확인
    const { data: existingGuide } = await supabase
      .from("guides")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existingGuide) {
      // 중복 시 랜덤 suffix 추가
      const randomSuffix = Math.random().toString(36).substring(2, 6);
      slug = `${slug}-${randomSuffix}`;
    }

    // 7. 가이드 생성
    const { data: newGuide, error: createError } = await supabase
      .from("guides")
      .insert({
        accommodation_id,
        title,
        slug,
        content_blocks: [],
        wifi_ssid: null,
        wifi_password: null,
        is_published: false,
        view_count: 0,
      })
      .select()
      .single();

    if (createError) {
      console.error("Guide create error:", createError);
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: {
            code: "DB_ERROR",
            message: "가이드 생성에 실패했습니다",
          },
        },
        { status: 500 }
      );
    }

    // 8. 성공 응답
    return NextResponse.json<ApiResponse<{ guide: Guide }>>(
      {
        success: true,
        data: { guide: newGuide },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create guide error:", error);
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
