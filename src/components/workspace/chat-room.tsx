"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowLeft, FileUp, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ServiceIcon } from "@/components/service-icon";
import { READY_TOKEN } from "@/lib/constants";
import { getService } from "@/lib/services";
import { useProjects } from "@/lib/store";
import { postJson, streamPost } from "@/lib/stream";
import type { Attachment, ChatMessage, Project, RequirementSpec } from "@/lib/types";
import { cn, formatPrice, uid } from "@/lib/utils";
import { BriefPanel } from "./brief-panel";
import { Composer, type ComposerHandle } from "./composer";
import { DeliverableCard, PaymentCard, SpecCard } from "./flow-cards";
import { EventPill, MessageBubble } from "./message-bubble";
import { StatusStepper } from "./status-stepper";

type Busy = null | "chat" | "spec" | "pay" | "generate";

const LOCK_REASON: Partial<Record<Project["status"], string>> = {
  spec_review: "Review the requirements above — confirm, request changes, or keep chatting.",
  awaiting_payment: "Requirements locked. Complete payment above to start production.",
  paid: "Payment received — your deliverable is being prepared.",
  generating: "Your deliverable is in production…",
  delivered: "Project delivered 🎉 Download your deliverable above.",
};

const store = () => useProjects.getState();
const now = () => Date.now();

function stripReady(text: string) {
  return text.replace(READY_TOKEN, "").replace(/\[\[[A-Z]*\]?$/, "");
}

/** History sent to the model: text turns only, without UI-only preview images. */
function chatHistory(messages: ChatMessage[]): ChatMessage[] {
  return messages
    .filter((m) => m.kind === "text" && !m.error && !m.pending)
    .map((m) => ({ ...m, attachments: m.attachments?.map((a) => ({ ...a, preview: undefined })) }));
}

function dayLabel(ts: number) {
  const d = new Date(ts);
  const today = new Date();
  const y = new Date();
  y.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
}

export function ChatRoom() {
  const { id } = useParams<{ id: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const project = useProjects((s) => s.projects[id]);
  const hydrated = useProjects((s) => s.hydrated);
  const service = project ? getService(project.serviceSlug) : undefined;

  const [live, setLive] = useState<{ id: string; text: string } | null>(null);
  const [busy, setBusy] = useState<Busy>(null);
  const [dragging, setDragging] = useState(false);
  const [atBottom, setAtBottom] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<ComposerHandle>(null);
  const bootRef = useRef(false);

  /* ───────────── actions ───────────── */

  const runChat = useCallback(async (pid: string, slug: string, history: ChatMessage[]) => {
    const ai: ChatMessage = { id: uid("m_"), role: "assistant", kind: "text", content: "", createdAt: now(), pending: true };
    store().addMessage(pid, ai);
    setBusy("chat");
    try {
      const text = await streamPost("/api/chat", { serviceSlug: slug, messages: history }, (t) => setLive({ id: ai.id, text: stripReady(t) }));
      store().updateMessage(pid, ai.id, { content: stripReady(text).trim(), pending: false, createdAt: now() });
      if (text.includes(READY_TOKEN)) store().patchProject(pid, { readyForSpec: true });
    } catch (e) {
      store().updateMessage(pid, ai.id, { content: (e as Error).message, pending: false, error: true });
    } finally {
      setLive(null);
      setBusy(null);
    }
  }, []);

  const send = (text: string, attachments: Attachment[]) => {
    if (!project) return;
    const msg: ChatMessage = {
      id: uid("m_"),
      role: "user",
      kind: "text",
      content: text,
      attachments: attachments.length ? attachments : undefined,
      createdAt: now(),
    };
    store().addMessage(project.id, msg);
    runChat(project.id, project.serviceSlug, chatHistory([...project.messages, msg]));
  };

  const retryChat = (messageId: string) => {
    if (!project) return;
    store().removeMessage(project.id, messageId);
    const remaining = store().projects[project.id].messages;
    runChat(project.id, project.serviceSlug, chatHistory(remaining));
  };

  const summarize = async (feedback?: string) => {
    if (!project) return;
    const pid = project.id;
    setBusy("spec");
    try {
      const { spec } = await postJson<{ spec: RequirementSpec }>("/api/spec", {
        serviceSlug: project.serviceSlug,
        messages: chatHistory(store().projects[pid].messages),
        feedback,
      });
      store().setSpec(pid, spec);
      store().addMessage(pid, { id: uid("m_"), role: "assistant", kind: "spec", content: "", createdAt: now() });
    } catch (e) {
      store().addMessage(pid, {
        id: uid("m_"),
        role: "assistant",
        kind: "text",
        content: `I couldn't prepare the summary: ${(e as Error).message}`,
        createdAt: now(),
        error: true,
      });
    } finally {
      setBusy(null);
    }
  };

  const confirmSpec = () => {
    if (!project) return;
    store().setStatus(project.id, "awaiting_payment");
    store().addMessage(project.id, { id: uid("m_"), role: "assistant", kind: "event", content: "Requirements confirmed ✓", createdAt: now() });
    store().addMessage(project.id, { id: uid("m_"), role: "assistant", kind: "payment", content: "", createdAt: now() });
  };

  const keepChatting = () => {
    if (!project) return;
    store().patchProject(project.id, { status: "gathering", readyForSpec: false });
    store().addMessage(project.id, {
      id: uid("m_"),
      role: "assistant",
      kind: "text",
      content: "Sure! What else would you like to add or change? When you're ready, I'll prepare an updated summary.",
      createdAt: now(),
    });
    composerRef.current?.focus();
  };

  const generate = useCallback(async (pid: string) => {
    const p = store().projects[pid];
    if (!p?.spec) return;
    store().setStatus(pid, "generating");
    const msg: ChatMessage = { id: uid("m_"), role: "assistant", kind: "deliverable", content: "", createdAt: now(), pending: true };
    store().addMessage(pid, msg);
    setBusy("generate");
    try {
      const text = await streamPost(
        "/api/generate",
        { projectId: pid, serviceSlug: p.serviceSlug, spec: p.spec, sessionId: p.payment?.sessionId },
        (t) => setLive({ id: msg.id, text: t }),
      );
      store().updateMessage(pid, msg.id, { content: text.trim(), pending: false });
      store().patchProject(pid, { deliverable: text.trim(), status: "delivered", unread: true });
    } catch (e) {
      store().updateMessage(pid, msg.id, { content: (e as Error).message, pending: false, error: true });
      store().setStatus(pid, "paid");
    } finally {
      setLive(null);
      setBusy(null);
    }
  }, []);

  const retryGenerate = (messageId: string) => {
    if (!project) return;
    store().removeMessage(project.id, messageId);
    generate(project.id);
  };

  const pay = async () => {
    if (!project || !service) return;
    setBusy("pay");
    try {
      const res = await postJson<{ demo?: boolean; url?: string }>("/api/checkout", {
        projectId: project.id,
        serviceSlug: project.serviceSlug,
        specTitle: project.spec?.title,
      });
      if (res.url) {
        window.location.assign(res.url);
        return;
      }
      if (res.demo) {
        store().patchProject(project.id, { status: "paid", payment: { demo: true, paidAt: now() } });
        store().addMessage(project.id, {
          id: uid("m_"),
          role: "assistant",
          kind: "event",
          content: `Payment of ${formatPrice(service.price)} received (demo mode)`,
          createdAt: now(),
        });
        setBusy(null);
        generate(project.id);
      }
    } catch (e) {
      store().addMessage(project.id, {
        id: uid("m_"),
        role: "assistant",
        kind: "text",
        content: `Checkout couldn't start: ${(e as Error).message}`,
        createdAt: now(),
        error: true,
      });
      setBusy(null);
    }
  };

  /* ───────────── boot: Stripe return & interrupted jobs ───────────── */

  useEffect(() => {
    if (!hydrated || !project || bootRef.current) return;
    bootRef.current = true;
    const pid = project.id;
    const sessionId = search.get("session_id");
    const canceled = search.get("canceled");

    // A reload during streaming leaves a pending message behind — mark it recoverable.
    for (const m of project.messages) {
      if (m.pending) {
        store().updateMessage(pid, m.id, {
          pending: false,
          error: true,
          content: m.kind === "deliverable" ? "Production was interrupted." : "This reply was interrupted.",
        });
      }
    }
    if (project.status === "generating") store().setStatus(pid, "paid");

    if (sessionId && !project.payment) {
      router.replace(`/workspace/${pid}`, { scroll: false });
      queueMicrotask(() => setBusy("pay"));
      fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}&project_id=${pid}`)
        .then((r) => r.json())
        .then(({ paid }) => {
          setBusy(null);
          if (!paid) {
            store().addMessage(pid, { id: uid("m_"), role: "assistant", kind: "event", content: "Payment could not be verified", createdAt: now() });
            return;
          }
          store().patchProject(pid, { status: "paid", payment: { sessionId, paidAt: now() } });
          store().addMessage(pid, { id: uid("m_"), role: "assistant", kind: "event", content: "Payment received — thank you!", createdAt: now() });
          generate(pid);
        })
        .catch(() => setBusy(null));
    } else if (canceled) {
      router.replace(`/workspace/${pid}`, { scroll: false });
      store().addMessage(pid, { id: uid("m_"), role: "assistant", kind: "event", content: "Checkout canceled — you can pay whenever you're ready", createdAt: now() });
    }
  }, [hydrated, project, search, router, generate]);

  useEffect(() => {
    if (project?.unread && project.status === "delivered") store().markRead(project.id);
  }, [project?.unread, project?.status, project?.id]);

  /* ───────────── scrolling ───────────── */

  const scrollToBottom = (smooth = true) => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  };

  useLayoutEffect(() => {
    scrollToBottom(false);
  }, [id, hydrated]);

  const messageCount = project?.messages.length ?? 0;
  useEffect(() => {
    if (atBottom) scrollToBottom(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageCount, live?.text, busy]);

  /* ───────────── render ───────────── */

  if (!hydrated) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project || !service) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-lg font-semibold">Project not found</p>
        <p className="max-w-sm text-sm text-muted-foreground">It may have been deleted, or it was created in a different browser.</p>
        <Link href="/services" className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background">
          Start a new project
        </Link>
      </div>
    );
  }

  const userCount = project.messages.filter((m) => m.role === "user").length;
  const lastSpecIdx = project.messages.findLastIndex((m) => m.kind === "spec");
  const suggestions =
    userCount === 0
      ? ["Here's a quick overview of my project…", "I'll share my brief as a file", "What information do you need from me?"]
      : [];
  const assistantTyping = busy === "chat";

  return (
    <div
      className="relative flex min-h-0 flex-1"
      onDragEnter={(e) => {
        if (project.status === "gathering" && e.dataTransfer.types.includes("Files")) setDragging(true);
      }}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        {/* header */}
        <header className="glass z-20 flex items-center gap-3 border-b px-3 py-2.5 sm:px-5">
          <Link href="/workspace" className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-muted md:hidden" aria-label="Back to projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand text-white shadow-md shadow-primary/25">
            <ServiceIcon name={service.icon} className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{project.spec?.title || service.title}</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={assistantTyping ? "typing" : busy ?? "idle"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className={cn("text-xs", busy ? "text-primary" : "text-muted-foreground")}
              >
                {assistantTyping
                  ? "Wise is typing…"
                  : busy === "spec"
                    ? "Wise is writing your requirements…"
                    : busy === "generate"
                      ? "Producing your deliverable…"
                      : busy === "pay"
                        ? "Processing payment…"
                        : `${formatPrice(service.price)} · ${service.turnaround}`}
              </motion.p>
            </AnimatePresence>
          </div>
          <StatusStepper status={project.status} className="hidden lg:flex" />
          <ThemeToggle className="md:hidden" />
        </header>

        {/* messages */}
        <div
          ref={scrollRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 120);
          }}
          className="relative flex-1 overflow-y-auto scroll-smooth scrollbar-thin"
        >
          <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
          <div className="mx-auto max-w-3xl px-3 pt-4 pb-6 sm:px-6">
            <StatusStepper status={project.status} className="mb-2 flex justify-center overflow-x-auto lg:hidden" />
            {project.messages.map((m, i) => {
              const prev = project.messages[i - 1];
              const next = project.messages[i + 1];
              const newDay = !prev || new Date(prev.createdAt).toDateString() !== new Date(m.createdAt).toDateString();
              const dayPill = newDay && <EventPill>{dayLabel(m.createdAt)}</EventPill>;

              if (m.kind === "event") return <Fragment key={m.id}>{dayPill}<EventPill>{m.content}</EventPill></Fragment>;

              if (m.kind === "spec") {
                return (
                  <Fragment key={m.id}>
                    {dayPill}
                    {i === lastSpecIdx && project.spec ? (
                      <SpecCard
                        spec={project.spec}
                        status={project.status}
                        busy={busy !== null}
                        onConfirm={confirmSpec}
                        onRevise={(f) => summarize(f)}
                        onKeepChatting={keepChatting}
                      />
                    ) : (
                      <EventPill>Earlier draft of requirements</EventPill>
                    )}
                  </Fragment>
                );
              }

              if (m.kind === "payment") {
                return (
                  <Fragment key={m.id}>
                    {dayPill}
                    <PaymentCard service={service} project={project} busy={busy === "pay"} onPay={pay} />
                  </Fragment>
                );
              }

              if (m.kind === "deliverable" && !m.error) {
                return (
                  <Fragment key={m.id}>
                    {dayPill}
                    <DeliverableCard
                      content={live?.id === m.id ? live.text : m.content}
                      generating={!!m.pending}
                      title={project.spec?.title || service.title}
                    />
                  </Fragment>
                );
              }

              const sameAsPrev = prev && prev.role === m.role && (prev.kind === "text" || prev.kind === "deliverable") && !newDay;
              const sameAsNext =
                next && next.role === m.role && next.kind === "text" && new Date(next.createdAt).toDateString() === new Date(m.createdAt).toDateString();
              const seen = m.role === "user" && project.messages.slice(i + 1).some((x) => x.role === "assistant");

              return (
                <Fragment key={m.id}>
                  {dayPill}
                  <MessageBubble
                    message={m}
                    text={live?.id === m.id ? live.text : undefined}
                    grouped={!!sameAsPrev}
                    showTail={!sameAsNext}
                    seen={seen}
                    onRetry={m.error ? () => (m.kind === "deliverable" ? retryGenerate(m.id) : retryChat(m.id)) : undefined}
                  />
                </Fragment>
              );
            })}

            <AnimatePresence>
              {busy === "spec" && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="my-5 ml-10 max-w-2xl rounded-3xl border bg-card p-5 shadow-lg"
                >
                  <p className="shimmer-text text-sm font-semibold">Drafting your requirements specification…</p>
                  <div className="mt-4 space-y-2.5">
                    {[92, 70, 84, 55, 76].map((w, k) => (
                      <motion.div
                        key={k}
                        className="h-2.5 rounded-full bg-muted"
                        initial={{ width: 0 }}
                        animate={{ width: `${w}%` }}
                        transition={{ delay: k * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {!atBottom && (
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.8 }}
              onClick={() => scrollToBottom()}
              aria-label="Scroll to latest"
              className="absolute bottom-36 left-1/2 z-20 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border bg-card shadow-lg xl:left-[calc(50%-10rem)]"
            >
              <ArrowDown className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>

        <Composer
          ref={composerRef}
          disabled={project.status !== "gathering"}
          lockedReason={LOCK_REASON[project.status]}
          busy={busy !== null}
          suggestions={suggestions}
          canSummarize={userCount >= 2}
          highlightSummarize={!!project.readyForSpec}
          onSend={send}
          onSummarize={() => summarize()}
        />
      </div>

      <BriefPanel project={project} service={service} />

      {/* drag & drop overlay */}
      <AnimatePresence>
        {dragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={(e) => {
              if (e.currentTarget === e.target) setDragging(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              if (e.dataTransfer.files.length) composerRef.current?.addFiles(e.dataTransfer.files);
            }}
            className="absolute inset-0 z-40 flex items-center justify-center bg-background/70 p-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="pointer-events-none flex w-full max-w-md flex-col items-center rounded-3xl border-2 border-dashed border-primary bg-card/80 p-10 text-center"
            >
              <motion.span animate={{ y: [0, -8, 0] }} transition={{ duration: 1.2, repeat: Infinity }} className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-white">
                <FileUp className="h-7 w-7" />
              </motion.span>
              <p className="mt-4 font-semibold">Drop files to share with Wise</p>
              <p className="mt-1 text-sm text-muted-foreground">Docs, PDFs, images, videos — up to 25 MB each</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
