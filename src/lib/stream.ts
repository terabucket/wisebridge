"use client";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

/** POST JSON and stream the plain-text response, calling onDelta with the accumulated text. */
export async function streamPost(
  url: string,
  body: unknown,
  onDelta: (fullText: string) => void,
  signal?: AbortSignal,
): Promise<string> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => ({}));
    throw new ApiError(data.error || `Request failed (${res.status})`, res.status);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let text = "";
  let last = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
    const now = performance.now();
    if (now - last > 40) {
      onDelta(text);
      last = now;
    }
  }
  text += decoder.decode();
  onDelta(text);

  const errAt = text.indexOf("[[ERROR]]");
  if (errAt !== -1) throw new ApiError(text.slice(errAt + 9).trim(), 500);
  return text;
}

export async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || `Request failed (${res.status})`, res.status);
  return data as T;
}
