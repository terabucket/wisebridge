"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Search } from "lucide-react";
import { ServiceCard } from "@/components/service-card";
import { CATEGORIES, SERVICES, TIERS, type Category, type TierId } from "@/lib/services";
import { cn } from "@/lib/utils";

type TierFilter = TierId | "all";

export function ServiceCatalog() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialTier = (params.get("tier") as TierFilter) || "all";
  const [tier, setTier] = useState<TierFilter>(TIERS.some((t) => t.id === initialTier) ? initialTier : "all");
  const [category, setCategory] = useState<Category | "all">("all");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return SERVICES.filter(
      (s) =>
        (tier === "all" || s.tier === tier) &&
        (category === "all" || s.category === category) &&
        (!q || `${s.title} ${s.tagline} ${s.description}`.toLowerCase().includes(q)),
    );
  }, [tier, category, query]);

  const changeTier = (t: TierFilter) => {
    setTier(t);
    const next = new URLSearchParams(params);
    if (t === "all") next.delete("tier");
    else next.set("tier", t);
    router.replace(`${pathname}${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  return (
    <div className="mt-12">
      <div className="glass sticky top-24 z-30 flex flex-col gap-3 rounded-2xl border p-2 shadow-sm md:flex-row md:items-center">
        <LayoutGroup id="tier">
          <div className="flex gap-1 overflow-x-auto scrollbar-thin">
            {[{ id: "all" as const, name: "All tiers", priceLabel: "" }, ...TIERS].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => changeTier(t.id)}
                className={cn(
                  "relative shrink-0 rounded-xl px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                  tier === t.id ? "text-background" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tier === t.id && (
                  <motion.span layoutId="tier-pill" className="absolute inset-0 -z-10 rounded-xl bg-foreground" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                )}
                {t.name}
                {t.priceLabel && <span className="ml-1.5 opacity-60">{t.priceLabel}</span>}
              </button>
            ))}
          </div>
        </LayoutGroup>
        <div className="relative md:ml-auto md:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services…"
            className="w-full rounded-xl border bg-background/70 py-2 pr-3 pl-9 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
              category === c.id ? "border-primary bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {c.label}
          </button>
        ))}
        <span className="ml-auto self-center text-xs text-muted-foreground">{results.length} services</span>
      </div>

      <motion.div layout className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {results.map((s, i) => (
            <motion.div
              key={s.slug}
              layout
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: Math.min(i * 0.04, 0.3), duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
            >
              <ServiceCard service={s} priority={i < 3} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {results.length === 0 && (
        <p className="py-20 text-center text-muted-foreground">No services match your filters. Try another search.</p>
      )}
    </div>
  );
}
