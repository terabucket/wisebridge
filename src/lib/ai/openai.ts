import "server-only";
import OpenAI from "openai";
import type { ChatCompletionContentPart, ChatCompletionMessageParam } from "openai/resources/chat/completions";
import type { Attachment, ChatMessage } from "../types";

export const MODEL = process.env.OPENAI_MODEL || "gpt-5-mini";

let client: OpenAI | null = null;
export function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new MissingKeyError();
  }
  client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

export class MissingKeyError extends Error {
  constructor() {
    super("OPENAI_API_KEY is not set. Add it to .env.local (and to your Vercel project settings).");
  }
}

/** Reasoning models accept `reasoning_effort`; classic chat models reject it. */
export function reasoningOptions(effort: "minimal" | "low" | "medium") {
  return /^(gpt-5|o\d)/.test(MODEL) ? { reasoning_effort: effort } : {};
}

/** Map stored chat history (with attachments) to OpenAI chat messages. */
export function toOpenAIMessages(messages: ChatMessage[]): ChatCompletionMessageParam[] {
  return messages
    .filter((m) => m.kind === "text" && !m.error && (m.content.trim() || m.attachments?.length))
    .map((m) => {
      if (m.role === "assistant") return { role: "assistant", content: m.content };
      const parts: ChatCompletionContentPart[] = [];
      if (m.content.trim()) parts.push({ type: "text", text: m.content });
      for (const a of m.attachments ?? []) parts.push(...attachmentParts(a));
      return { role: "user", content: parts.length ? parts : "(empty message)" };
    });
}

function attachmentParts(a: Attachment): ChatCompletionContentPart[] {
  const header = `📎 Attached file: "${a.name}" (${a.mime}, ${Math.round(a.size / 1024)} KB)${a.note ? ` — ${a.note}` : ""}`;
  switch (a.kind) {
    case "image":
    case "video":
      return [
        { type: "text", text: header },
        ...(a.dataUrls ?? []).map((url) => ({ type: "image_url" as const, image_url: { url, detail: "low" as const } })),
      ];
    case "pdf":
      return a.dataUrls?.[0]
        ? [{ type: "text", text: header }, { type: "file", file: { filename: a.name, file_data: a.dataUrls[0] } }]
        : [{ type: "text", text: header }];
    case "text":
    case "docx":
      return [{ type: "text", text: `${header}\n\n--- file contents ---\n${a.text ?? ""}\n--- end of file ---` }];
    default:
      return [{ type: "text", text: header }];
  }
}

/** Stream plain text deltas from a Chat Completions stream as a web Response. */
export function streamText(stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>) {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) controller.enqueue(encoder.encode(delta));
        }
      } catch (err) {
        controller.enqueue(encoder.encode(`\n\n[[ERROR]] ${errorMessage(err)}`));
      } finally {
        controller.close();
      }
    },
  });
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}

export function errorMessage(err: unknown) {
  if (err instanceof OpenAI.APIError) return `OpenAI error (${err.status}): ${err.message}`;
  if (err instanceof Error) return err.message;
  return "Unexpected error";
}

export function errorResponse(err: unknown) {
  const status = err instanceof MissingKeyError ? 503 : err instanceof OpenAI.APIError ? (err.status ?? 500) : 500;
  return Response.json({ error: errorMessage(err) }, { status });
}
