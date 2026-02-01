import { GoogleGenerativeAI } from "@google/generative-ai";

// Lazy initialization - 빌드 타임이 아닌 런타임에만 체크
let genAI: GoogleGenerativeAI | null = null;

function getGeminiClient() {
  if (!genAI) {
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_AI_API_KEY environment variable is required");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export const geminiModel = {
  get instance() {
    return getGeminiClient().getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });
  },
};

export async function generateStreamingResponse(
  systemPrompt: string,
  userMessage: string
): Promise<ReadableStream<Uint8Array>> {
  const chat = geminiModel.instance.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [{ text: "네, 이해했습니다. 숙소 가이드 AI 어시스턴트로서 도와드리겠습니다." }],
      },
    ],
  });

  const result = await chat.sendMessageStream(userMessage);

  const encoder = new TextEncoder();

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          const data = encoder.encode(`data: ${JSON.stringify({ text })}\n\n`);
          controller.enqueue(data);
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
}
