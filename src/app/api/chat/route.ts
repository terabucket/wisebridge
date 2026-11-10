import { getService } from "@/lib/services";
import type { ChatMessage } from "@/lib/types";
import { consultantSystemPrompt } from "@/lib/ai/prompts";
import { MODEL, errorResponse, getOpenAI, reasoningOptions, streamText, toOpenAIMessages } from "@/lib/ai/openai";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { serviceSlug, messages } = (await req.json()) as { serviceSlug: string; messages: ChatMessage[] };
    const service = getService(serviceSlug);
    if (!service) return Response.json({ error: "Unknown service" }, { status: 400 });
    if (!Array.isArray(messages) || messages.length > 80) {
      return Response.json({ error: "Conversation is too long — please confirm the requirements." }, { status: 400 });
    }

    const stream = await getOpenAI().chat.completions.create({
      model: MODEL,
      stream: true,
      ...reasoningOptions("low"),
      messages: [{ role: "system", content: consultantSystemPrompt(service) }, ...toOpenAIMessages(messages)],
    });
    return streamText(stream);
  } catch (err) {
    return errorResponse(err);
  }
}
