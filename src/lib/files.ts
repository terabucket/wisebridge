"use client";

import type { Attachment, AttachmentKind } from "./types";
import { uid } from "./utils";

export const MAX_FILE_BYTES = 25 * 1024 * 1024; // what we accept from the picker
const MAX_PDF_BYTES = 3 * 1024 * 1024; // what we forward to the model (Vercel body limit ≈ 4.5 MB)
const MAX_TEXT_CHARS = 40_000;

const TEXT_EXT = /\.(txt|md|markdown|csv|tsv|json|xml|html?|css|js|jsx|ts|tsx|py|rb|go|java|php|yml|yaml|sql|log|rtf)$/i;

export function detectKind(file: File): AttachmentKind {
  const t = file.type;
  if (t.startsWith("image/")) return "image";
  if (t === "application/pdf" || /\.pdf$/i.test(file.name)) return "pdf";
  if (t.startsWith("video/")) return "video";
  if (t.startsWith("audio/")) return "audio";
  if (/\.docx$/i.test(file.name) || t.includes("wordprocessingml")) return "docx";
  if (t.startsWith("text/") || t.includes("json") || TEXT_EXT.test(file.name)) return "text";
  return "other";
}

/** Turn a dropped/picked file into something the AI agent can read. */
export async function processFile(file: File): Promise<Attachment> {
  const base: Attachment = {
    id: uid("f_"),
    name: file.name,
    mime: file.type || "application/octet-stream",
    size: file.size,
    kind: detectKind(file),
  };

  try {
    switch (base.kind) {
      case "image": {
        const url = await downscaleImage(file, 1280);
        return { ...base, preview: await downscaleImage(file, 320), dataUrls: [url] };
      }
      case "pdf": {
        if (file.size > MAX_PDF_BYTES) {
          return { ...base, note: "PDF is larger than 3 MB — shared by name only. Consider splitting it." };
        }
        return { ...base, dataUrls: [await readAsDataUrl(file)] };
      }
      case "text": {
        const text = await file.text();
        return { ...base, text: clip(text), note: text.length > MAX_TEXT_CHARS ? "Truncated to 40k characters." : undefined };
      }
      case "docx": {
        const mammoth = await import("mammoth");
        const { value } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        return { ...base, text: clip(value) };
      }
      case "video": {
        const { frames, duration } = await extractVideoFrames(file, 3);
        return {
          ...base,
          preview: frames[0],
          dataUrls: frames,
          note: `Video ${formatDuration(duration)} — ${frames.length} key frames shared with the AI.`,
        };
      }
      case "audio":
        return { ...base, note: "Audio file attached — the consultant will review it manually." };
      default:
        return { ...base, note: "Attached for reference — the consultant will review it manually." };
    }
  } catch {
    return { ...base, kind: "other", note: "Couldn't read this file automatically — attached for reference." };
  }
}

function clip(text: string) {
  return text.length > MAX_TEXT_CHARS ? text.slice(0, MAX_TEXT_CHARS) : text;
}

function readAsDataUrl(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

async function downscaleImage(file: File, max: number): Promise<string> {
  if (file.type === "image/svg+xml" || file.type === "image/gif") return readAsDataUrl(file);
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL("image/jpeg", 0.82);
}

async function extractVideoFrames(file: File, count: number) {
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = url;
  try {
    await once(video, "loadeddata");
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const frames: string[] = [];
    const canvas = document.createElement("canvas");
    const scale = Math.min(1, 768 / Math.max(video.videoWidth || 768, video.videoHeight || 432));
    canvas.width = Math.round((video.videoWidth || 768) * scale);
    canvas.height = Math.round((video.videoHeight || 432) * scale);
    const ctx = canvas.getContext("2d")!;
    for (let i = 0; i < count; i++) {
      video.currentTime = duration ? (duration * (i + 0.5)) / count : 0;
      await once(video, "seeked");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      frames.push(canvas.toDataURL("image/jpeg", 0.75));
    }
    return { frames, duration };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function once(el: HTMLElement, event: string) {
  return new Promise<void>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), 15_000);
    el.addEventListener(event, () => (clearTimeout(t), resolve()), { once: true });
    el.addEventListener("error", () => (clearTimeout(t), reject(new Error("media error"))), { once: true });
  });
}

function formatDuration(s: number) {
  if (!s) return "";
  const m = Math.floor(s / 60);
  const sec = Math.round(s % 60);
  return `(${m}:${sec.toString().padStart(2, "0")})`;
}
