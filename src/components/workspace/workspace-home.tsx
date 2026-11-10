"use client";

import { motion } from "motion/react";
import { FileUp, MessagesSquare, ShieldCheck } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { ServiceIcon } from "@/components/service-icon";
import { SERVICES } from "@/lib/services";
import { formatPrice } from "@/lib/utils";
import { useProjects } from "@/lib/store";
import { useRouter } from "next/navigation";
import Link from "next/link";

const QUICK = ["landing-page-figma-mockup", "seo-audit-report", "portfolio-website", "figma-ui-design"];

export function WorkspaceHome() {
  const router = useRouter();
  const createProject = useProjects((s) => s.createProject);

  return (
    <div className="relative flex flex-1 items-center justify-center overflow-y-auto p-8">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative max-w-xl text-center"
      >
        <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="mx-auto w-fit">
          <LogoMark className="h-20 w-20 drop-shadow-[0_20px_40px_rgba(99,102,241,0.35)]" />
        </motion.div>
        <h1 className="mt-8 text-3xl font-semibold tracking-tight">Your WiseBridge workspace</h1>
        <p className="mt-3 text-muted-foreground">
          Select a project on the left, or start a new one. Wise will scope it with you, then deliver once requirements and payment are confirmed.
        </p>

        <div className="mt-8 grid gap-2 text-left sm:grid-cols-2">
          {QUICK.map((slug) => {
            const s = SERVICES.find((x) => x.slug === slug)!;
            return (
              <button
                key={slug}
                type="button"
                onClick={() => router.push(`/workspace/${createProject(slug)}`)}
                className="group flex items-center gap-3 rounded-2xl border bg-card p-3 text-left transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-brand group-hover:text-white">
                  <ServiceIcon name={s.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{s.title}</span>
                  <span className="text-xs text-muted-foreground">{formatPrice(s.price)}</span>
                </span>
              </button>
            );
          })}
        </div>

        <Link href="/services" className="mt-5 inline-block text-sm font-medium text-primary hover:underline">
          Browse all 18 services →
        </Link>

        <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <li className="flex items-center gap-1.5"><MessagesSquare className="h-3.5 w-3.5" /> AI-guided discovery</li>
          <li className="flex items-center gap-1.5"><FileUp className="h-3.5 w-3.5" /> Any file type</li>
          <li className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Secure Stripe checkout</li>
        </ul>
      </motion.div>
    </div>
  );
}
