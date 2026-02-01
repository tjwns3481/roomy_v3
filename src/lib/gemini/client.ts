import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error("GOOGLE_AI_API_KEY environment variable is required");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

export async function generateStreamingResponse(
  systemPrompt: string,
  userMessage: string
): Promise<ReadableStream<Uint8Array>> {
  const chat = geminiModel.startChat({
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
