"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, MessageCircle } from "lucide-react";
import { useProjects } from "@/lib/store";
import { cn } from "@/lib/utils";

export function StartProjectButton({ slug, className }: { slug: string; className?: string }) {
  const router = useRouter();
  const createProject = useProjects((s) => s.createProject);
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => {
        setLoading(true);
        const id = createProject(slug);
        router.push(`/workspace/${id}`);
      }}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background shadow-lg shadow-primary/20 transition hover:shadow-xl hover:shadow-primary/30 disabled:opacity-70",
        className,
      )}
    >
      <span className="absolute inset-0 bg-brand opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {loading ? <Loader2 className="relative h-4 w-4 animate-spin" /> : <MessageCircle className="relative h-4 w-4" />}
      <span className="relative">Start with AI consultant</span>
      <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
