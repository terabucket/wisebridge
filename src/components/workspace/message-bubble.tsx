"use client";

import { motion } from "motion/react";
import { AlertTriangle, Check, CheckCheck, RotateCcw } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { TypingDots } from "@/components/home/hero";
import type { ChatMessage } from "@/lib/types";
import { cn, timeLabel } from "@/lib/utils";
import { MessageAttachment } from "./attachment-view";
import { Markdown } from "./markdown";

export function Avatar({ role, hidden }: { role: ChatMessage["role"]; hidden?: boolean }) {
  return (
    <div className={cn("h-8 w-8 shrink-0", hidden && "invisible")}>
      {role === "assistant" ? (
        <LogoMark className="h-8 w-8" />
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-[11px] font-semibold text-white dark:from-slate-200 dark:to-slate-400 dark:text-slate-900">
          You
        </span>
      )}
    </div>
  );
}

export function MessageBubble({
  message,
  text,
  grouped,
  showTail,
  seen,
  onRetry,
}: {
  message: ChatMessage;
  /** Live text while streaming (overrides message.content). */
  text?: string;
  grouped: boolean;
  showTail: boolean;
  seen: boolean;
  onRetry?: () => void;
}) {
  const isUser = message.role === "user";
  const content = text ?? message.content;
  const streaming = message.pending;

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className={cn("flex items-end gap-2.5", isUser ? "flex-row-reverse" : "flex-row", grouped ? "mt-1" : "mt-4")}
    >
      <Avatar role={message.role} hidden={!showTail} />
      <div className={cn("flex max-w-[85%] flex-col gap-1.5 sm:max-w-[75%]", isUser ? "items-end" : "items-start")}>
        {message.attachments && message.attachments.length > 0 && (
          <div className={cn("grid gap-1.5", message.attachments.length > 1 ? "grid-cols-2" : "grid-cols-1", "w-full max-w-sm")}>
            {message.attachments.map((a) => (
              <MessageAttachment key={a.id} a={a} onUser={isUser} />
            ))}
          </div>
        )}

        {(content || streaming) && (
          <div
            className={cn(
              "relative px-4 py-2.5 text-[0.925rem] leading-relaxed shadow-sm",
              isUser
                ? "bg-brand text-white shadow-primary/20"
                : message.error
                  ? "border border-red-500/30 bg-red-500/5"
                  : "border bg-card",
              isUser
                ? cn("rounded-3xl", showTail && "rounded-br-md")
                : cn("rounded-3xl", showTail && "rounded-bl-md"),
            )}
          >
            {streaming && !content ? (
              <TypingDots />
            ) : isUser ? (
              <p className="whitespace-pre-wrap">{content}</p>
            ) : (
              <>
                {message.error && (
                  <p className="mb-1 flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-3.5 w-3.5" /> Something went wrong
                  </p>
                )}
                <Markdown content={content} />
                {streaming && <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse rounded-sm bg-primary" />}
                {message.error && onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition hover:bg-muted"
                  >
                    <RotateCcw className="h-3 w-3" /> Retry
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {showTail && !streaming && (
          <span className="flex items-center gap-1 px-1 text-[10.5px] text-muted-foreground">
            {timeLabel(message.createdAt)}
            {isUser && (seen ? <CheckCheck className="h-3.5 w-3.5 text-primary" /> : <Check className="h-3.5 w-3.5" />)}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function EventPill({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="my-4 flex justify-center">
      <span className="rounded-full border bg-card/80 px-3.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm">{children}</span>
    </motion.div>
  );
}
