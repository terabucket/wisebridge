"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, Lock, Paperclip, Sparkles } from "lucide-react";
import { MAX_FILE_BYTES, detectKind, processFile } from "@/lib/files";
import type { Attachment } from "@/lib/types";
import { cn, uid } from "@/lib/utils";
import { FileChip } from "./attachment-view";

type Pending = { key: string; file: File; attachment?: Attachment; error?: string };

export interface ComposerHandle {
  addFiles: (files: FileList | File[]) => void;
  focus: () => void;
}

export const Composer = forwardRef<
  ComposerHandle,
  {
    disabled: boolean;
    lockedReason?: string;
    busy: boolean;
    suggestions: string[];
    canSummarize: boolean;
    highlightSummarize: boolean;
    onSend: (text: string, attachments: Attachment[]) => void;
    onSummarize: () => void;
  }
>(function Composer({ disabled, lockedReason, busy, suggestions, canSummarize, highlightSummarize, onSend, onSummarize }, ref) {
  const [text, setText] = useState("");
  const [pending, setPending] = useState<Pending[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const addFiles = (list: FileList | File[]) => {
    const files = Array.from(list).slice(0, 8);
    const items: Pending[] = files.map((file) => ({
      key: uid(),
      file,
      error: file.size > MAX_FILE_BYTES ? "File is larger than 25 MB" : undefined,
    }));
    setPending((p) => [...p, ...items]);
    for (const item of items) {
      if (item.error) continue;
      processFile(item.file).then((attachment) =>
        setPending((p) => p.map((x) => (x.key === item.key ? { ...x, attachment } : x))),
      );
    }
  };

  useImperativeHandle(ref, () => ({ addFiles, focus: () => textareaRef.current?.focus() }));

  const processing = pending.some((p) => !p.attachment && !p.error);
  const ready = pending.filter((p) => p.attachment).map((p) => p.attachment!);
  const canSend = !disabled && !busy && !processing && (text.trim().length > 0 || ready.length > 0);

  const send = () => {
    if (!canSend) return;
    onSend(text.trim(), ready);
    setText("");
    setPending([]);
    requestAnimationFrame(() => {
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    });
  };

  if (disabled) {
    return (
      <div className="border-t bg-background/80 px-4 py-4 backdrop-blur">
        <p className="mx-auto flex max-w-3xl items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <Lock className="h-4 w-4" /> {lockedReason}
        </p>
      </div>
    );
  }

  return (
    <div className="border-t bg-background/80 px-3 pt-3 pb-3 backdrop-blur sm:px-6 sm:pb-5">
      <div className="mx-auto max-w-3xl">
        <AnimatePresence>
          {(suggestions.length > 0 || canSummarize) && !text && pending.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mb-2.5 flex gap-2 overflow-x-auto pb-1 scrollbar-thin"
            >
              {canSummarize && (
                <button
                  type="button"
                  onClick={onSummarize}
                  disabled={busy}
                  className={cn(
                    "relative inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition disabled:opacity-50",
                    highlightSummarize ? "bg-brand text-white shadow-lg shadow-primary/30" : "border bg-card text-foreground hover:bg-muted",
                  )}
                >
                  {highlightSummarize && <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />}
                  <Sparkles className="relative h-3.5 w-3.5" />
                  <span className="relative">Prepare requirements summary</span>
                </button>
              )}
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setText(s);
                    textareaRef.current?.focus();
                  }}
                  className="shrink-0 rounded-full border bg-card px-3.5 py-1.5 text-xs whitespace-nowrap text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="rounded-3xl border bg-card shadow-lg shadow-black/5 transition focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
          <AnimatePresence initial={false}>
            {pending.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-2 overflow-x-auto p-2.5 pb-0 scrollbar-thin">
                  {pending.map((p) =>
                    p.attachment?.preview ? (
                      <motion.div key={p.key} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="group relative shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.attachment.preview} alt={p.file.name} className="h-14 w-14 rounded-xl border object-cover" />
                        <button
                          type="button"
                          aria-label={`Remove ${p.file.name}`}
                          onClick={() => setPending((x) => x.filter((y) => y.key !== p.key))}
                          className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] text-background shadow"
                        >
                          ×
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div key={p.key} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-56 shrink-0">
                        <FileChip
                          a={{ name: p.file.name, size: p.file.size, kind: p.attachment?.kind ?? detectKind(p.file), note: p.error ?? p.attachment?.note }}
                          loading={!p.attachment && !p.error}
                          onRemove={() => setPending((x) => x.filter((y) => y.key !== p.key))}
                        />
                        {p.error && <p className="mt-1 px-1 text-[11px] text-red-500">{p.error}</p>}
                      </motion.div>
                    ),
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-1.5 p-2">
            <input
              ref={fileRef}
              type="file"
              multiple
              hidden
              onChange={(e) => {
                if (e.target.files) addFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              aria-label="Attach files"
              title="Attach files (docs, PDFs, images, videos…)"
              onClick={() => fileRef.current?.click()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <textarea
              ref={textareaRef}
              rows={1}
              value={text}
              placeholder="Message Wise…"
              onChange={(e) => {
                setText(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send();
                }
              }}
              onPaste={(e) => {
                if (e.clipboardData.files.length) {
                  e.preventDefault();
                  addFiles(e.clipboardData.files);
                }
              }}
              className="max-h-[200px] min-h-10 flex-1 resize-none bg-transparent px-1 py-2.5 text-[0.95rem] outline-none placeholder:text-muted-foreground"
            />
            <motion.button
              type="button"
              aria-label="Send message"
              onClick={send}
              disabled={!canSend}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition-all",
                canSend ? "bg-brand text-white shadow-md shadow-primary/30" : "bg-muted text-muted-foreground",
              )}
            >
              <ArrowUp className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
        <p className="mt-2 hidden text-center text-[11px] text-muted-foreground sm:block">
          Enter to send · Shift + Enter for a new line · Drop or paste files anywhere
        </p>
      </div>
    </div>
  );
});
