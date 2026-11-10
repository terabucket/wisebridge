"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "motion/react";
import { ArrowUpRight, Clock } from "lucide-react";
import { ServiceIcon } from "@/components/service-icon";
import { getTier, type Service } from "@/lib/services";
import { cn, formatPrice, unsplash } from "@/lib/utils";

const TIER_STYLES = {
  starter: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20",
  professional: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 ring-indigo-500/20",
  premium: "bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-amber-500/25",
} as const;

export function TierBadge({ tier, className }: { tier: Service["tier"]; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset", TIER_STYLES[tier], className)}>
      {getTier(tier).name}
    </span>
  );
}

export function ServiceCard({ service, priority = false }: { service: Service; priority?: boolean }) {
  // subtle 3D tilt + spotlight following the cursor
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mx}px ${my}px, color-mix(in oklab, var(--primary) 14%, transparent), transparent 60%)`;

  return (
    <motion.div
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
        rx.set(((e.clientY - r.top) / r.height - 0.5) * -5);
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 5);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
      className="group relative h-full"
    >
      <Link
        href={`/services/${service.slug}`}
        className="relative flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10"
      >
        <motion.div className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: spotlight }} />
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={unsplash(service.image, 800, 500)}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <TierBadge tier={service.tier} className="bg-white/90 dark:bg-black/60 backdrop-blur" />
          </div>
          <div className="absolute right-3 bottom-3 left-3 flex items-end justify-between text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
              <ServiceIcon name={service.icon} className="h-5 w-5" />
            </span>
            <span className="rounded-full bg-black/40 px-3 py-1 text-sm font-semibold backdrop-blur-md">{formatPrice(service.price)}</span>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-lg font-semibold tracking-tight">{service.title}</h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{service.tagline}</p>
          <div className="mt-auto flex items-center justify-between pt-5 text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> {service.turnaround}
            </span>
            <span className="flex items-center gap-1 font-medium text-primary">
              Start <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
