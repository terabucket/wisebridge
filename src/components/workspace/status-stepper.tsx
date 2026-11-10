"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import type { ProjectStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = ["Discovery", "Requirements", "Payment", "Delivery"] as const;

export function stepIndex(status: ProjectStatus) {
  switch (status) {
    case "gathering":
      return 0;
    case "spec_review":
      return 1;
    case "awaiting_payment":
      return 2;
    case "paid":
    case "generating":
      return 3;
    case "delivered":
      return 4;
  }
}

export function StatusStepper({ status, className }: { status: ProjectStatus; className?: string }) {
  const current = stepIndex(status);
  return (
    <ol className={cn("flex items-center gap-1.5", className)}>
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className="flex items-center gap-1.5">
            <span
              className={cn(
                "relative flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                done && "text-primary",
                active && "text-foreground",
                !done && !active && "text-muted-foreground",
              )}
            >
              {active && <motion.span layoutId="step-pill" className="absolute inset-0 -z-10 rounded-full bg-muted ring-1 ring-border" />}
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold",
                  done ? "bg-primary text-white" : active ? "bg-brand text-white" : "bg-muted text-muted-foreground",
                )}
              >
                {done ? <Check className="h-2.5 w-2.5" /> : i + 1}
              </span>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className={cn("h-px w-3 lg:w-5", done ? "bg-primary" : "bg-border")} />}
          </li>
        );
      })}
    </ol>
  );
}
