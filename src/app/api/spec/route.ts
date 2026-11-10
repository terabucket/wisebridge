import { getService } from "@/lib/services";
import type { ChatMessage, RequirementSpec } from "@/lib/types";
import { SPEC_JSON_SCHEMA, specSystemPrompt } from "@/lib/ai/prompts";
import { MODEL, errorResponse, getOpenAI, reasoningOptions, toOpenAIMessages } from "@/lib/ai/openai";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { serviceSlug, messages, feedback } = (await req.json()) as {
      serviceSlug: string;
      messages: ChatMessage[];
      feedback?: string;
    };
    const service = getService(serviceSlug);
    if (!service) return Response.json({ error: "Unknown service" }, { status: 400 });

    const completion = await getOpenAI().chat.completions.create({
      model: MODEL,
      ...reasoningOptions("low"),
      response_format: { type: "json_schema", json_schema: SPEC_JSON_SCHEMA },
      messages: [
        { role: "system", content: specSystemPrompt(service) },
        ...toOpenAIMessages(messages),
        {
          role: "user",
          content: feedback
            ? `Please produce the requirements specification, applying this change request: ${feedback}`
            : "Please produce the requirements specification now.",
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) return Response.json({ error: "The AI returned an empty specification." }, { status: 502 });
    return Response.json({ spec: JSON.parse(raw) as RequirementSpec });
  } catch (err) {
    return errorResponse(err);
  }
}
