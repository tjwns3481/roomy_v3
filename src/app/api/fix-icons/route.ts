import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * POST /api/fix-icons
 * 데이터베이스의 대문자 아이콘을 소문자로 수정
 */
export async function POST() {
  try {
    const supabase = await createClient();

    // 모든 가이드 조회
    const { data: guides, error: fetchError } = await supabase
      .from("guides")
      .select("id, content_blocks");

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    let updatedCount = 0;
    const debugInfo: any[] = [];

    for (const guide of guides || []) {
      if (!guide.content_blocks) continue;

      let hasChanges = false;
      const updatedBlocks = guide.content_blocks.map((block: any) => {
        if (block.type === "rules" && block.data?.items) {
          const updatedItems = block.data.items.map((item: any) => {
            debugInfo.push({ guideId: guide.id, icon: item.icon });

            if (item.icon) {
              hasChanges = true;
              let normalizedIcon = item.icon.toLowerCase();
              // no_smoking -> smoke_free 변환
              if (normalizedIcon === "no_smoking") {
                normalizedIcon = "smoke_free";
              }
              return { ...item, icon: normalizedIcon };
            }
            return item;
          });
          return { ...block, data: { ...block.data, items: updatedItems } };
        }
        return block;
      });

      if (hasChanges) {
        const { error: updateError } = await supabase
          .from("guides")
          .update({ content_blocks: updatedBlocks })
          .eq("id", guide.id);

        if (!updateError) {
          updatedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `${updatedCount}개 가이드의 아이콘이 수정되었습니다.`,
      debug: debugInfo,
    });
  } catch (error) {
    console.error("Fix icons error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
