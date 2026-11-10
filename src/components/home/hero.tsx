"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, CheckCircle2, Paperclip, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { EASE } from "@/components/motion";
import { unsplash } from "@/lib/utils";

const WORDS = ["Figma designs", "websites", "SEO growth", "AI automations"];

export function Hero() {
  const [index, setIndex] = useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 80]);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % WORDS.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative isolate pt-32 pb-20 sm:pt-40">
      <Backdrop />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border bg-card/70 py-1 pr-3 pl-1 text-xs font-medium shadow-sm"
          >
            <span className="rounded-full bg-brand px-2 py-0.5 text-white">New</span>
            AI consultant available 24/7
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mt-6 text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-[4.2rem]"
          >
            Bridge your ideas to{" "}
            <span className="relative inline-flex h-[1.1em] min-w-[7ch] overflow-hidden align-bottom">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={WORDS[index]}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "0%", opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="font-serif font-normal whitespace-nowrap italic text-gradient pr-2"
                >
                  {WORDS[index]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground"
          >
            Chat with our AI consultant, share your brief, files or videos, confirm the requirements — and get
            expert-reviewed design, development and SEO work delivered in days, not months.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Link
              href="/services"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background shadow-lg shadow-primary/20 transition hover:shadow-xl hover:shadow-primary/30"
            >
              <span className="absolute inset-0 -z-0 bg-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative">Explore services</span>
              <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/#how-it-works"
              className="inline-flex items-center justify-center gap-2 rounded-full border bg-card/60 px-6 py-3.5 text-sm font-medium transition hover:bg-muted"
            >
              See how it works
            </Link>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"
          >
            {["From $100", "Pay only after scoping", "Expert-reviewed delivery"].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" /> {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <motion.div style={{ y }} className="relative mx-auto w-full max-w-md lg:max-w-none">
          <ChatPreview />
        </motion.div>
      </div>
    </section>
  );
}

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="animate-aurora absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.35),transparent_60%)] blur-3xl" />
      <div className="animate-aurora absolute top-20 -right-40 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.28),transparent_60%)] blur-3xl [animation-delay:-6s]" />
      <div className="animate-aurora absolute top-60 -left-40 h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.25),transparent_60%)] blur-3xl [animation-delay:-12s]" />
    </div>
  );
}

type Line = { from: "ai" | "user"; text: string; file?: string };
const SCRIPT: Line[] = [
  { from: "ai", text: "Hi! I'm Wise 👋 What are we building today?" },
  { from: "user", text: "A landing page for my coffee subscription brand.", file: "brand-guide.pdf" },
  { from: "ai", text: "Love it. I see warm earthy tones in your guide — should the hero lead with the subscription offer?" },
  { from: "user", text: "Yes! And add a quiz to pick your roast." },
  { from: "ai", text: "Perfect — I've prepared your requirements summary for review ✨" },
];

function ChatPreview() {
  const [count, setCount] = useState(1);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (count >= SCRIPT.length) {
      const reset = setTimeout(() => setCount(1), 4200);
      return () => clearTimeout(reset);
    }
    const next = SCRIPT[count];
    const t1 = setTimeout(() => setTyping(true), 500);
    const t2 = setTimeout(() => {
      setTyping(false);
      setCount((c) => c + 1);
    }, next.from === "ai" ? 1900 : 1300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [count]);

  const nextFrom = SCRIPT[count]?.from;

  return (
    <div className="relative">
      {/* floating image cards */}
      <motion.div
        initial={{ opacity: 0, rotate: -8, x: -30 }}
        animate={{ opacity: 1, rotate: -6, x: 0 }}
        transition={{ delay: 0.6, duration: 0.9, ease: EASE }}
        className="animate-float absolute -top-8 -left-10 hidden w-40 overflow-hidden rounded-2xl border bg-card p-1.5 shadow-2xl sm:block"
      >
        <Image src={unsplash("1561070791-2526d30994b5", 400, 280)} alt="Brand color palette" width={400} height={280} className="rounded-xl" priority />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, rotate: 10, x: 30 }}
        animate={{ opacity: 1, rotate: 6, x: 0 }}
        transition={{ delay: 0.8, duration: 0.9, ease: EASE }}
        className="animate-float absolute -right-8 -bottom-10 z-20 hidden w-44 overflow-hidden rounded-2xl border bg-card p-1.5 shadow-2xl [animation-delay:-3s] sm:block"
      >
        <Image src={unsplash("1547658719-da2b51169166", 400, 280)} alt="Landing page design" width={400} height={280} className="rounded-xl" priority />
        <div className="flex items-center gap-1.5 px-1.5 pt-1.5 pb-0.5 text-[11px] font-medium">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Design delivered
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.9, ease: EASE }}
        className="glass relative z-10 overflow-hidden rounded-3xl border shadow-2xl shadow-primary/10"
      >
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <div className="relative">
            <LogoMark className="h-9 w-9" />
            <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Wise · AI Consultant</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">{typing && nextFrom === "ai" ? "typing…" : "online"}</p>
          </div>
          <span className="ml-auto rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            Landing Page · $100
          </span>
        </div>

        <div className="flex h-[23rem] flex-col justify-end gap-2.5 overflow-hidden p-4">
          <AnimatePresence initial={false}>
            {SCRIPT.slice(0, count).map((m, i) => (
              <motion.div
                key={`${i}-${m.text}`}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className={m.from === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={
                    m.from === "user"
                      ? "max-w-[80%] rounded-2xl rounded-br-md bg-brand px-3.5 py-2 text-sm text-white shadow-md shadow-primary/20"
                      : "max-w-[80%] rounded-2xl rounded-bl-md border bg-card px-3.5 py-2 text-sm shadow-sm"
                  }
                >
                  {m.file && (
                    <span className="mb-1.5 flex items-center gap-1.5 rounded-lg bg-white/15 px-2 py-1 text-xs">
                      <Paperclip className="h-3 w-3" /> {m.file}
                    </span>
                  )}
                  {m.text}
                </div>
              </motion.div>
            ))}
            {typing && (
              <motion.div
                key="typing"
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={nextFrom === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <TypingDots tone={nextFrom === "user" ? "brand" : "card"} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export function TypingDots({ tone = "card" }: { tone?: "card" | "brand" }) {
  return (
    <div
      className={
        tone === "brand"
          ? "flex gap-1 rounded-2xl rounded-br-md bg-brand/80 px-3.5 py-3"
          : "flex gap-1 rounded-2xl rounded-bl-md border bg-card px-3.5 py-3"
      }
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={tone === "brand" ? "h-1.5 w-1.5 rounded-full bg-white" : "h-1.5 w-1.5 rounded-full bg-muted-foreground"}
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}
