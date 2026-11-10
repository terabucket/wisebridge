"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import type { Faq } from "@/lib/seo";
import { cn } from "@/lib/utils";

/**
 * Accessible accordion. Answers always stay in the HTML (only visually collapsed) so
 * search engines and AI answer engines can read every Q&A pair.
 */
export function FaqList({ faqs, defaultOpen = 0 }: { faqs: Faq[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <div className="divide-y rounded-3xl border bg-card">
      {faqs.map((f, i) => {
        const isOpen = open === i;
        const id = `faq-${i}`;
        return (
          <div key={f.q}>
            <h3>
              <button
                type="button"
                id={`${id}-q`}
                aria-controls={`${id}-a`}
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-medium"
              >
                {f.q}
                <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition", isOpen && "bg-foreground text-background")}>
                  {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                </span>
              </button>
            </h3>
            <motion.div
              id={`${id}-a`}
              role="region"
              aria-labelledby={`${id}-q`}
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
