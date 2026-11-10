"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CheckCircle2,
  ClipboardList,
  Copy,
  CreditCard,
  Download,
  Expand,
  Loader2,
  Lock,
  MessageSquarePlus,
  PackageCheck,
  PenLine,
  Sparkles,
  X,
} from "lucide-react";
import type { Project, RequirementSpec } from "@/lib/types";
import type { Service } from "@/lib/services";
import { cn, formatPrice } from "@/lib/utils";
import { Markdown } from "./markdown";

function CardShell({ children, className, accent }: { children: React.ReactNode; className?: string; accent?: boolean }) {
  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn("relative my-5 ml-10 max-w-2xl overflow-hidden rounded-3xl border bg-card shadow-lg shadow-black/5", className)}
    >
      {accent && <div className="absolute inset-x-0 top-0 h-1 bg-brand" />}
      {children}
    </motion.div>
  );
}

/* ───────────────────────── Requirements spec ───────────────────────── */

function Section({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{title}</h4>
      <ul className="mt-2 space-y-1.5">
        {items.map((i) => (
          <li key={i} className="flex gap-2 text-sm">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SpecCard({
  spec,
  status,
  busy,
  onConfirm,
  onRevise,
  onKeepChatting,
}: {
  spec: RequirementSpec;
  status: Project["status"];
  busy: boolean;
  onConfirm: () => void;
  onRevise: (feedback: string) => void;
  onKeepChatting: () => void;
}) {
  const [revising, setRevising] = useState(false);
  const [feedback, setFeedback] = useState("");
  const locked = status !== "spec_review";
  const draft = status === "gathering";

  return (
    <CardShell accent>
      <div className="flex items-start gap-3 border-b p-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ClipboardList className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">Requirements specification</p>
          <h3 className="text-lg font-semibold tracking-tight">{spec.title}</h3>
        </div>
        {locked &&
          (draft ? (
            <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">Draft</span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
              <Lock className="h-3 w-3" /> Confirmed
            </span>
          ))}
      </div>

      <div className="space-y-5 p-5">
        <p className="text-sm leading-relaxed text-muted-foreground">{spec.summary}</p>
        <div className="grid gap-5 sm:grid-cols-2">
          <Section title="Objectives" items={spec.objectives} />
          <Section title="Deliverables" items={spec.deliverables} />
          <Section title="Technical requirements" items={spec.technical_requirements} />
          <Section title="References" items={spec.references} />
        </div>
        <dl className="grid gap-3 rounded-2xl bg-muted/60 p-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">Audience</dt>
            <dd className="mt-0.5 font-medium">{spec.audience}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Style & brand</dt>
            <dd className="mt-0.5 font-medium">{spec.style_and_brand}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Timeline</dt>
            <dd className="mt-0.5 font-medium">{spec.timeline}</dd>
          </div>
        </dl>
        {spec.open_questions.length > 0 && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
            <Section title="Open questions" items={spec.open_questions} />
          </div>
        )}
      </div>

      {!locked && (
        <div className="border-t bg-muted/30 p-4">
          <AnimatePresence mode="wait" initial={false}>
            {revising ? (
              <motion.form
                key="revise"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!feedback.trim()) return;
                  onRevise(feedback.trim());
                  setFeedback("");
                  setRevising(false);
                }}
                className="flex flex-col gap-2 sm:flex-row"
              >
                <input
                  autoFocus
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What should change? e.g. add a pricing section"
                  className="flex-1 rounded-xl border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <div className="flex gap-2">
                  <button type="submit" className="rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background">
                    Update spec
                  </button>
                  <button type="button" onClick={() => setRevising(false)} className="rounded-xl border px-3 py-2.5 text-sm" aria-label="Cancel">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div key="actions" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={onConfirm}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:brightness-110 disabled:opacity-60"
                >
                  <CheckCircle2 className="h-4 w-4" /> Confirm requirements
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => setRevising(true)}
                  className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2.5 text-sm font-medium transition hover:bg-muted disabled:opacity-60"
                >
                  <PenLine className="h-4 w-4" /> Request changes
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={onKeepChatting}
                  className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-60"
                >
                  <MessageSquarePlus className="h-4 w-4" /> Keep chatting
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </CardShell>
  );
}

/* ───────────────────────── Payment ───────────────────────── */

export function PaymentCard({
  service,
  project,
  busy,
  onPay,
}: {
  service: Service;
  project: Project;
  busy: boolean;
  onPay: () => void;
}) {
  const paid = !!project.payment;
  return (
    <CardShell className="max-w-md">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-cyan-600 p-5 text-white">
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <p className="text-xs font-medium text-white/70">Order summary</p>
        <p className="mt-1 text-lg font-semibold">{service.title}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight">{formatPrice(service.price)}</p>
        <p className="text-xs text-white/70">One-time · {service.turnaround} delivery</p>
      </div>
      <div className="space-y-4 p-5">
        {paid ? (
          <div className="flex items-center gap-3 rounded-2xl bg-emerald-500/10 p-3 text-sm font-medium text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="h-5 w-5" />
            Payment received {project.payment?.demo ? "(demo mode)" : ""} — thank you!
          </div>
        ) : (
          <>
            <button
              type="button"
              disabled={busy}
              onClick={onPay}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-foreground px-5 py-3.5 text-sm font-semibold text-background transition hover:opacity-90 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
              Pay {formatPrice(service.price)} with card
            </button>
            <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
              <Lock className="h-3 w-3" /> Secure checkout powered by <span className="font-semibold">Stripe</span>
            </p>
          </>
        )}
      </div>
    </CardShell>
  );
}

/* ───────────────────────── Deliverable ───────────────────────── */

const GEN_STEPS = ["Reviewing your requirements", "Drafting the solution", "Refining details", "Quality pass"];

export function DeliverableCard({ content, generating, title }: { content: string; generating: boolean; title: string }) {
  const [copied, setCopied] = useState(false);
  const [full, setFull] = useState(false);
  const step = Math.min(GEN_STEPS.length - 1, Math.floor(content.length / 1500));

  const download = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-wisebridge.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <CardShell accent className="max-w-3xl">
        <div className="flex items-center gap-3 border-b p-5">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              generating ? "bg-violet-500/10 text-violet-600 dark:text-violet-300" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
            )}
          >
            {generating ? <Sparkles className="h-5 w-5 animate-pulse" /> : <PackageCheck className="h-5 w-5" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-muted-foreground">{generating ? "In production" : "Deliverable ready"}</p>
            <h3 className={cn("truncate text-lg font-semibold tracking-tight", generating && "shimmer-text")}>
              {generating ? GEN_STEPS[step] + "…" : title}
            </h3>
          </div>
          {!generating && (
            <div className="flex gap-1">
              <IconBtn
                label={copied ? "Copied" : "Copy"}
                onClick={() => {
                  navigator.clipboard.writeText(content);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                }}
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </IconBtn>
              <IconBtn label="Download" onClick={download}>
                <Download className="h-4 w-4" />
              </IconBtn>
              <IconBtn label="Expand" onClick={() => setFull(true)}>
                <Expand className="h-4 w-4" />
              </IconBtn>
            </div>
          )}
        </div>

        {generating && (
          <div className="flex gap-1.5 px-5 pt-4">
            {GEN_STEPS.map((s, i) => (
              <div key={s} className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full bg-brand"
                  initial={{ width: 0 }}
                  animate={{ width: i < step ? "100%" : i === step ? "60%" : 0 }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            ))}
          </div>
        )}

        <div className={cn("relative p-5", !full && "max-h-[28rem] overflow-hidden")}>
          {content ? (
            <Markdown content={content} />
          ) : (
            <div className="space-y-2.5">
              {[90, 75, 82, 60].map((w, i) => (
                <div key={i} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${w}%` }} />
              ))}
            </div>
          )}
          {!generating && content.length > 1200 && (
            <div className="absolute inset-x-0 bottom-0 flex h-28 items-end justify-center bg-gradient-to-t from-card to-transparent pb-4">
              <button type="button" onClick={() => setFull(true)} className="rounded-full border bg-card px-4 py-2 text-xs font-medium shadow-sm transition hover:bg-muted">
                Read full deliverable
              </button>
            </div>
          )}
        </div>
      </CardShell>

      <AnimatePresence>
        {full && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-8"
            onClick={() => setFull(false)}
          >
            <motion.div
              initial={{ y: 30, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 30, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-3xl border bg-card shadow-2xl"
            >
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h3 className="truncate font-semibold">{title}</h3>
                <div className="flex gap-1">
                  <IconBtn label="Download" onClick={download}>
                    <Download className="h-4 w-4" />
                  </IconBtn>
                  <IconBtn label="Close" onClick={() => setFull(false)}>
                    <X className="h-4 w-4" />
                  </IconBtn>
                </div>
              </div>
              <div className="overflow-y-auto p-6 scrollbar-thin sm:p-10">
                <Markdown content={content} className="prose-base!" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  );
}
