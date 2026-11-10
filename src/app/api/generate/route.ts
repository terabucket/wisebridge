import { getService } from "@/lib/services";
import type { RequirementSpec } from "@/lib/types";
import { deliverableSystemPrompt } from "@/lib/ai/prompts";
import { MODEL, errorResponse, getOpenAI, reasoningOptions, streamText } from "@/lib/ai/openai";
import { getStripe, verifyPaidSession } from "@/lib/stripe";

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const { projectId, serviceSlug, spec, sessionId } = (await req.json()) as {
      projectId: string;
      serviceSlug: string;
      spec: RequirementSpec;
      sessionId?: string;
    };
    const service = getService(serviceSlug);
    if (!service || !spec) return Response.json({ error: "Invalid request" }, { status: 400 });

    // Payment gate: when Stripe is configured, generation only runs for a verified, paid session.
    if (getStripe()) {
      if (!sessionId) return Response.json({ error: "Payment required" }, { status: 402 });
      const { ok } = await verifyPaidSession(sessionId, projectId);
      if (!ok) return Response.json({ error: "Payment could not be verified" }, { status: 402 });
    }

    const stream = await getOpenAI().chat.completions.create({
      model: MODEL,
      stream: true,
      ...reasoningOptions("medium"),
      messages: [
        { role: "system", content: deliverableSystemPrompt(service, spec) },
        { role: "user", content: "Produce the complete deliverable now." },
      ],
    });
    return streamText(stream);
  } catch (err) {
    return errorResponse(err);
  }
}
