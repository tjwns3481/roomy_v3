"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth";
import { templates } from "@/data/templates";
import { generateSlug } from "@/lib/validations/guide";

export async function createGuideAction(templateId: string | null) {
  // 1. 인증 확인
  const user = await getAuthUser();

  if (!user) {
    return {
      success: false,
      error: "로그인이 필요합니다",
    };
  }

  // 2. Supabase 클라이언트 생성
  const supabase = await createClient();

  // 3. 템플릿 기반 초기값 설정
  let initialTitle = "새 가이드";
  let initialBlocks: any[] = [];

  if (templateId) {
    const selectedTemplate = templates.find((t) => t.id === templateId);
    if (selectedTemplate) {
      initialTitle = selectedTemplate.name + " 가이드";
      initialBlocks = selectedTemplate.blocks;
    }
  }

  // 4. 사용자의 첫 번째 숙소 가져오기 (없으면 자동 생성)
  let { data: accommodations, error: accError } = await supabase
    .from("accommodations")
    .select("id")
    .eq("user_id", user.id)
    .limit(1);

  if (accError) {
    console.error("Accommodation fetch error:", accError);
    return {
      success: false,
      error: "숙소 조회에 실패했습니다",
    };
  }

  let accommodationId: string;

  if (!accommodations || accommodations.length === 0) {
    // 기본 숙소 자동 생성
    const { randomUUID } = await import("crypto");
    const newAccId = randomUUID();

    const { data: newAcc, error: createAccError } = await supabase
      .from("accommodations")
      .insert({
        id: newAccId,
        user_id: user.id,
        name: "내 숙소",
      })
      .select("id")
      .single();

    if (createAccError) {
      console.error("Accommodation create error:", createAccError);
      return {
        success: false,
        error: "기본 숙소 생성에 실패했습니다",
      };
    }

    accommodationId = newAcc.id;
  } else {
    accommodationId = accommodations[0].id;
  }

  // 5. Slug 생성
  let slug = generateSlug(initialTitle);

  // Slug 중복 확인
  const { data: existingGuide } = await supabase
    .from("guides")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existingGuide) {
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    slug = `${slug}-${randomSuffix}`;
  }

  // 6. 가이드 생성
  const { data: newGuide, error: createError } = await supabase
    .from("guides")
    .insert({
      accommodation_id: accommodationId,
      title: initialTitle,
      slug,
      content_blocks: initialBlocks,
      wifi_ssid: null,
      wifi_password: null,
      is_published: false,
      view_count: 0,
    })
    .select("id")
    .single();

  if (createError) {
    console.error("Guide create error:", createError);
    return {
      success: false,
      error: "가이드 생성에 실패했습니다",
    };
  }

  return {
    success: true,
    guideId: newGuide.id,
  };
}
