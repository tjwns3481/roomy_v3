import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateStreamingResponse } from "@/lib/gemini/client";
import { buildRAGContext, buildSystemPrompt } from "@/lib/gemini/rag";
import type { Guide } from "@/types";

interface ChatRequest {
  guideId: string;
  sessionId: string;
  question: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequest;
    const { guideId, sessionId, question } = body;

    if (!guideId || !sessionId || !question) {
      return NextResponse.json(
        { error: "guideId, sessionId, and question are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 가이드 정보 조회
    const { data: guide, error: guideError } = await supabase
      .from("guides")
      .select("*")
      .eq("id", guideId)
      .single();

    if (guideError || !guide) {
      return NextResponse.json(
        { error: "Guide not found" },
        { status: 404 }
      );
    }

    // RAG 컨텍스트 빌드
    const guideContext = buildRAGContext(guide as Guide);
    const systemPrompt = buildSystemPrompt(guideContext);

    // Gemini 스트리밍 응답 생성
    const stream = await generateStreamingResponse(systemPrompt, question);

    // 응답 텍스트를 수집하여 DB에 저장
    let fullAnswer = "";
    const reader = stream.getReader();
    const decoder = new TextDecoder();

    // 스트리밍 응답을 수집하고 클라이언트로 전달하는 새 스트림 생성
    const transformStream = new ReadableStream({
      async start(controller) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });

            // SSE 데이터에서 텍스트 추출
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ") && !line.includes("[DONE]")) {
                try {
                  const data = JSON.parse(line.substring(6));
                  if (data.text) {
                    fullAnswer += data.text;
                  }
                } catch {
                  // JSON 파싱 실패 무시
                }
              }
            }

            controller.enqueue(value);
          }
          controller.close();

          // 스트리밍 완료 후 DB에 저장
          if (fullAnswer) {
            await supabase.from("ai_conversations").insert({
              guide_id: guideId,
              session_id: sessionId,
              question,
              answer: fullAnswer,
            });
          }
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(transformStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
