"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import {
  ArrowRight,
  Check,
  CreditCard,
  FileCheck2,
  MessagesSquare,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from "lucide-react";
import { Reveal, SectionHeading, Stagger, StaggerItem } from "@/components/motion";
import { ServiceCard } from "@/components/service-card";
import { FaqList } from "@/components/faq-list";
import type { Faq as FaqItem } from "@/lib/seo";
import { SERVICES, TIERS } from "@/lib/services";
import { cn, unsplash } from "@/lib/utils";

/* ───────────────────────── Tools marquee ───────────────────────── */

const TOOLS = ["Figma", "Next.js", "Shopify", "Webflow", "Framer", "WordPress", "OpenAI", "Stripe", "Zapier", "n8n", "Search Console", "Tailwind CSS", "Vercel", "Make"];

export function ToolsMarquee() {
  return (
    <section className="border-y bg-card/40 py-6">
      <p className="mb-4 text-center text-xs font-medium tracking-widest text-muted-foreground uppercase">
        Delivered with the tools you already trust
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="animate-marquee flex w-max gap-10 pr-10 hover:[animation-play-state:paused]">
          {[...TOOLS, ...TOOLS].map((t, i) => (
            <span key={i} className="text-lg font-semibold whitespace-nowrap text-muted-foreground/70 transition hover:text-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Stats ───────────────────────── */

export function Stats() {
  const stats = [
    { value: "18", label: "Productized services" },
    { value: "$100", label: "Starting price" },
    { value: "24/7", label: "AI consultant availability" },
    { value: "1–3 days", label: "Fastest delivery" },
  ];
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <Stagger className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border bg-border md:grid-cols-4">
        {stats.map((s) => (
          <StaggerItem key={s.label} className="bg-background p-6 text-center sm:p-8">
            <p className="text-3xl font-semibold tracking-tight text-gradient sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ───────────────────────── Pricing tiers ───────────────────────── */

export function Pricing() {
  return (
    <section id="pricing" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
      <SectionHeading
        eyebrow="Simple, transparent pricing"
        title={
          <>
            Three tiers. <span className="font-serif font-normal italic text-gradient">Zero</span> surprises.
          </>
        }
        description="Every service has a fixed price. You only pay after the AI consultant and you have agreed on the exact requirements."
      />

      <Stagger className="mt-14 grid gap-5 lg:grid-cols-3">
        {TIERS.map((tier) => {
          const featured = tier.id === "professional";
          const services = SERVICES.filter((s) => s.tier === tier.id);
          return (
            <StaggerItem key={tier.id} className="h-full">
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-1",
                  featured ? "border-transparent bg-foreground text-background shadow-2xl shadow-primary/25" : "bg-card hover:shadow-xl",
                )}
              >
                {featured && (
                  <>
                    <div className="absolute -inset-px -z-10 rounded-3xl bg-brand opacity-60 blur-xl" />
                    <span className="absolute -top-3 left-7 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white shadow-lg">
                      Most popular
                    </span>
                  </>
                )}
                <p className={cn("text-sm font-medium", featured ? "text-background/70" : "text-muted-foreground")}>{tier.name}</p>
                <p className="mt-3 text-4xl font-semibold tracking-tight">{tier.priceLabel}</p>
                <p className={cn("mt-1 text-sm", featured ? "text-background/60" : "text-muted-foreground")}>
                  per project · {tier.delivery}
                </p>
                <p className={cn("mt-5 text-sm leading-relaxed", featured ? "text-background/80" : "text-muted-foreground")}>{tier.blurb}</p>

                <ul className="mt-6 space-y-2.5 text-sm">
                  {tier.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full", featured ? "bg-background/15" : "bg-primary/10")}>
                        <Check className={cn("h-3 w-3", featured ? "text-background" : "text-primary")} />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>

                <div className={cn("my-6 h-px", featured ? "bg-background/15" : "bg-border")} />
                <p className={cn("mb-3 text-xs font-semibold tracking-wider uppercase", featured ? "text-background/60" : "text-muted-foreground")}>
                  Includes {services.length} services
                </p>
                <ul className="mb-8 space-y-1.5 text-sm">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link href={`/services/${s.slug}`} className={cn("transition hover:underline", featured ? "text-background/85" : "text-foreground/80")}>
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/services?tier=${tier.id}`}
                  className={cn(
                    "group mt-auto inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition",
                    featured ? "bg-background text-foreground hover:opacity-90" : "bg-foreground text-background hover:opacity-90",
                  )}
                >
                  Browse {tier.name.toLowerCase()} services
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}

/* ───────────────────────── Featured services ───────────────────────── */

export function FeaturedServices() {
  const featured = ["landing-page-figma-mockup", "seo-audit-report", "figma-ui-design", "portfolio-website", "business-website", "ai-automation-workflows"]
    .map((slug) => SERVICES.find((s) => s.slug === slug)!)
    .filter(Boolean);

  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          align="left"
          eyebrow="Popular services"
          title={
            <>
              Everything you need to <span className="font-serif font-normal italic text-gradient">launch & grow</span>
            </>
          }
        />
        <Reveal>
          <Link href="/services" className="group inline-flex items-center gap-2 rounded-full border bg-card px-5 py-2.5 text-sm font-medium transition hover:bg-muted">
            View all 18 services <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
      <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((s) => (
          <StaggerItem key={s.slug}>
            <ServiceCard service={s} />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/* ───────────────────────── How it works ───────────────────────── */

const STEPS = [
  {
    icon: MessagesSquare,
    title: "Chat with Wise",
    text: "Pick a service and talk to our AI consultant. It asks the right questions — no forms, no calls.",
    image: "1620712943543-bcc4688e7485",
  },
  {
    icon: Upload,
    title: "Share anything",
    text: "Drop in briefs, Word docs, PDFs, screenshots or a quick video walkthrough. Wise reads them all.",
    image: "1586717791821-3f44a563fa4c",
  },
  {
    icon: FileCheck2,
    title: "Confirm requirements",
    text: "Wise drafts a clear requirements spec. Review it, request changes, and approve when it's right.",
    image: "1531403009284-440f080d1e12",
  },
  {
    icon: CreditCard,
    title: "Pay securely",
    text: "Checkout with your card through Stripe. Fixed price — exactly what you saw on the service page.",
    image: "1556742049-0cfed4f6a45d",
  },
  {
    icon: PackageCheck,
    title: "Get your deliverable",
    text: "Your design, solution or strategy is generated, expert-reviewed and delivered right in the chat.",
    image: "1600880292203-757bb62b4baf",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how-it-works" className="relative scroll-mt-24 py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-muted/50 to-transparent" />
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              From idea to delivery in <span className="font-serif font-normal italic text-gradient">five steps</span>
            </>
          }
          description="A guided, transparent process — you're always in control of scope and price."
        />

        <div ref={ref} className="mt-16 grid items-start gap-12 lg:grid-cols-2">
          <div className="relative space-y-3 pl-8">
            <div className="absolute top-2 bottom-2 left-[11px] w-px bg-border" />
            <motion.div style={{ height: lineHeight }} className="absolute top-2 left-[11px] w-px bg-brand" />
            {STEPS.map((s, i) => (
              <motion.button
                key={s.title}
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                onViewportEnter={() => setActive(i)}
                viewport={{ margin: "-45% 0px -45% 0px" }}
                className={cn(
                  "relative block w-full rounded-2xl border p-5 text-left transition-all duration-300",
                  active === i ? "bg-card shadow-lg shadow-primary/5" : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <span
                  className={cn(
                    "absolute top-6 -left-8 flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors",
                    active >= i ? "border-transparent bg-brand text-white" : "bg-background text-muted-foreground",
                  )}
                >
                  {i + 1}
                </span>
                <div className="flex items-center gap-3">
                  <s.icon className={cn("h-5 w-5 transition-colors", active === i ? "text-primary" : "text-muted-foreground")} />
                  <h3 className="font-semibold">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </motion.button>
            ))}
          </div>

          <div className="sticky top-28 hidden aspect-[4/5] overflow-hidden rounded-3xl border shadow-2xl lg:block">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image src={unsplash(STEPS[active].image, 1000, 1250)} alt={STEPS[active].title} fill sizes="50vw" className="object-cover" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute right-6 bottom-6 left-6 text-white">
              <p className="text-xs font-medium tracking-widest text-white/70 uppercase">Step {active + 1}</p>
              <p className="mt-1 text-2xl font-semibold">{STEPS[active].title}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Why WiseBridge (bento) ───────────────────────── */

export function WhyBento() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        eyebrow="Why WiseBridge"
        title={
          <>
            AI speed. <span className="font-serif font-normal italic text-gradient">Human</span> standards.
          </>
        }
        description="We pair purpose-built AI agents with experienced designers, developers and SEO specialists."
      />
      <Stagger className="mt-14 grid auto-rows-[minmax(13rem,auto)] gap-4 md:grid-cols-6">
        <StaggerItem className="group relative overflow-hidden rounded-3xl border md:col-span-4 md:row-span-2">
          <Image src={unsplash("1551434678-e076c223a692", 1400, 900)} alt="Team reviewing work" fill sizes="(max-width:768px) 100vw, 66vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute right-0 bottom-0 left-0 p-7 text-white">
            <ShieldCheck className="h-7 w-7" />
            <h3 className="mt-3 text-2xl font-semibold">Every deliverable is expert-reviewed</h3>
            <p className="mt-2 max-w-md text-sm text-white/80">
              AI produces the first 90% in minutes. Our specialists check quality, accuracy and brand-fit before it reaches you.
            </p>
          </div>
        </StaggerItem>
        <StaggerItem className="relative overflow-hidden rounded-3xl border bg-card p-6 md:col-span-2">
          <Zap className="h-6 w-6 text-primary" />
          <h3 className="mt-4 text-lg font-semibold">10× faster turnaround</h3>
          <p className="mt-2 text-sm text-muted-foreground">Starter projects ship in 1–3 days — not the weeks a traditional agency needs.</p>
          <div className="absolute -right-6 -bottom-6 h-28 w-28 rounded-full bg-brand opacity-20 blur-2xl" />
        </StaggerItem>
        <StaggerItem className="relative overflow-hidden rounded-3xl border bg-card p-6 md:col-span-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h3 className="mt-4 text-lg font-semibold">Scope before you pay</h3>
          <p className="mt-2 text-sm text-muted-foreground">Approve a written requirements spec first. Payment only unlocks once you&apos;re happy with it.</p>
        </StaggerItem>
        <StaggerItem className="group relative overflow-hidden rounded-3xl border md:col-span-3">
          <Image src={unsplash("1559028012-481c04fa702d", 1000, 600)} alt="Web design on screen" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 to-transparent" />
          <div className="relative max-w-xs p-6 text-white">
            <h3 className="text-lg font-semibold">Design & dev under one roof</h3>
            <p className="mt-2 text-sm text-white/80">From Figma mockups to deployed websites — one consistent team and process.</p>
          </div>
        </StaggerItem>
        <StaggerItem className="group relative overflow-hidden rounded-3xl border md:col-span-3">
          <Image src={unsplash("1460925895917-afdab827c52f", 1000, 600)} alt="Analytics dashboard" fill sizes="(max-width:768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 to-transparent" />
          <div className="relative max-w-xs p-6 text-white">
            <h3 className="text-lg font-semibold">Built to be found</h3>
            <p className="mt-2 text-sm text-white/80">SEO is baked into everything we ship, with data-backed strategies to keep growing.</p>
          </div>
        </StaggerItem>
      </Stagger>
    </section>
  );
}

/* ───────────────────────── FAQ ───────────────────────── */

export function Faq({ faqs }: { faqs: FaqItem[] }) {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-6 py-24">
      <SectionHeading eyebrow="FAQ" title="Questions, answered" />
      <Reveal className="mt-12">
        <FaqList faqs={faqs} />
      </Reveal>
    </section>
  );
}

/* ───────────────────────── CTA ───────────────────────── */

export function Cta() {
  return (
    <section className="mx-auto max-w-6xl px-6">
      <Reveal className="relative isolate overflow-hidden rounded-[2rem] px-8 py-16 text-center text-white sm:px-16 sm:py-20">
        <Image src={unsplash("1504384308090-c894fdcc538d", 1600, 800)} alt="" fill sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-950/95 via-violet-900/85 to-cyan-900/85" />
        <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
          Ready to cross the bridge from <span className="font-serif font-normal italic">idea</span> to done?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-white/75">
          Start a conversation with Wise in seconds. No account, no commitment — you only pay once the scope is agreed.
        </p>
        <Link
          href="/services"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-indigo-950 shadow-xl transition hover:scale-[1.03]"
        >
          Start your project <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Reveal>
    </section>
  );
}
