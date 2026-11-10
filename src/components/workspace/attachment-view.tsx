"use client";

import { FileAudio, FileCode2, FileText, FileVideo, File as FileIcon, Image as ImageIcon, Loader2, X } from "lucide-react";
import type { Attachment, AttachmentKind } from "@/lib/types";
import { cn, formatBytes } from "@/lib/utils";

const KIND_ICON: Record<AttachmentKind, typeof FileIcon> = {
  image: ImageIcon,
  pdf: FileText,
  text: FileCode2,
  docx: FileText,
  video: FileVideo,
  audio: FileAudio,
  other: FileIcon,
};

const KIND_COLOR: Record<AttachmentKind, string> = {
  image: "bg-pink-500/15 text-pink-600 dark:text-pink-300",
  pdf: "bg-red-500/15 text-red-600 dark:text-red-300",
  text: "bg-slate-500/15 text-slate-600 dark:text-slate-300",
  docx: "bg-blue-500/15 text-blue-600 dark:text-blue-300",
  video: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
  audio: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
  other: "bg-zinc-500/15 text-zinc-600 dark:text-zinc-300",
};

/** Attachment as shown inside a sent message bubble. */
export function MessageAttachment({ a, onUser }: { a: Attachment; onUser: boolean }) {
  if ((a.kind === "image" || a.kind === "video") && a.preview) {
    return (
      <figure className="relative overflow-hidden rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={a.preview} alt={a.name} className="max-h-64 w-full object-cover" />
        {a.kind === "video" && (
          <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
            <FileVideo className="h-3 w-3" /> Video
          </span>
        )}
        <figcaption className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-2.5 pt-6 pb-1.5 text-[11px] text-white">
          {a.name}
        </figcaption>
      </figure>
    );
  }
  return <FileChip a={a} tone={onUser ? "onBrand" : "default"} />;
}

export function FileChip({
  a,
  tone = "default",
  onRemove,
  loading,
}: {
  a: Pick<Attachment, "name" | "size" | "kind" | "note">;
  tone?: "default" | "onBrand";
  onRemove?: () => void;
  loading?: boolean;
}) {
  const Icon = KIND_ICON[a.kind];
  return (
    <div
      className={cn(
        "group/chip flex max-w-full items-center gap-2.5 rounded-xl p-2 pr-3",
        tone === "onBrand" ? "bg-white/15" : "border bg-card",
      )}
      title={a.note}
    >
      <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", tone === "onBrand" ? "bg-white/20 text-white" : KIND_COLOR[a.kind])}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-medium">{a.name}</span>
        <span className={cn("block text-[11px]", tone === "onBrand" ? "text-white/70" : "text-muted-foreground")}>
          {loading ? "Processing…" : `${a.kind.toUpperCase()} · ${formatBytes(a.size)}`}
        </span>
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${a.name}`}
          className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
