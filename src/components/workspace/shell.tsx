"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Search } from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ServiceIcon } from "@/components/service-icon";
import { useProjects } from "@/lib/store";
import { getService } from "@/lib/services";
import type { Project, ProjectStatus } from "@/lib/types";
import { cn, relativeDay } from "@/lib/utils";

export const STATUS_META: Record<ProjectStatus, { label: string; dot: string }> = {
  gathering: { label: "Discovery", dot: "bg-sky-500" },
  spec_review: { label: "Review spec", dot: "bg-amber-500" },
  awaiting_payment: { label: "Awaiting payment", dot: "bg-orange-500" },
  paid: { label: "Paid", dot: "bg-violet-500" },
  generating: { label: "In production", dot: "bg-violet-500 animate-pulse" },
  delivered: { label: "Delivered", dot: "bg-emerald-500" },
};

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const inChat = pathname !== "/workspace";

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <aside
        className={cn(
          "w-full shrink-0 flex-col border-r bg-card/40 md:flex md:w-80 lg:w-[22rem]",
          inChat ? "hidden" : "flex",
        )}
      >
        <Sidebar />
      </aside>
      <main className={cn("relative min-w-0 flex-1 flex-col", inChat ? "flex" : "hidden md:flex")}>{children}</main>
    </div>
  );
}

function Sidebar() {
  const pathname = usePathname();
  const projects = useProjects((s) => s.projects);
  const hydrated = useProjects((s) => s.hydrated);
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return Object.values(projects)
      .filter((p) => !q || p.title.toLowerCase().includes(q) || (p.spec?.title ?? "").toLowerCase().includes(q))
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }, [projects, query]);

  return (
    <>
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <Link href="/" aria-label="WiseBridge home">
          <Logo />
        </Link>
        <ThemeToggle />
      </div>

      <div className="flex items-center gap-2 px-4 pb-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects"
            className="w-full rounded-xl border-0 bg-muted py-2.5 pr-3 pl-9 text-sm outline-none ring-primary/30 transition focus:ring-2"
          />
        </div>
        <Link
          href="/services"
          aria-label="New project"
          title="New project"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-md shadow-primary/30 transition hover:scale-105"
        >
          <Plus className="h-5 w-5" />
        </Link>
      </div>

      <p className="px-5 pt-2 pb-2 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Projects</p>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 pb-4 scrollbar-thin">
        {!hydrated ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl px-3 py-3">
              <div className="h-11 w-11 animate-pulse rounded-2xl bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))
        ) : list.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <LogoMark className="mx-auto h-12 w-12 opacity-80" />
            <p className="mt-4 text-sm font-medium">No projects yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Pick a service to start chatting with Wise.</p>
            <Link href="/services" className="mt-4 inline-flex rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background">
              Browse services
            </Link>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {list.map((p) => (
              <ProjectRow key={p.id} project={p} active={pathname === `/workspace/${p.id}`} />
            ))}
          </AnimatePresence>
        )}
      </nav>

      <div className="border-t px-5 py-3 text-[11px] text-muted-foreground">
        Projects are saved in this browser.
      </div>
    </>
  );
}

function ProjectRow({ project, active }: { project: Project; active: boolean }) {
  const service = getService(project.serviceSlug);
  const last = [...project.messages].reverse().find((m) => m.kind === "text" || m.kind === "event");
  const preview =
    project.status === "delivered"
      ? "✅ Your deliverable is ready"
      : project.status === "spec_review"
        ? "📋 Requirements ready for review"
        : last
          ? `${last.role === "user" ? "You: " : ""}${last.content.replace(/[*#_`>\[\]]/g, "").slice(0, 80) || "📎 Attachment"}`
          : "";
  const meta = STATUS_META[project.status];

  return (
    <motion.div layout initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}>
      <Link
        href={`/workspace/${project.id}`}
        className={cn(
          "relative flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors",
          active ? "bg-card shadow-sm ring-1 ring-border" : "hover:bg-muted/70",
        )}
      >
        {active && <motion.span layoutId="active-project" className="absolute top-3 bottom-3 left-0 w-1 rounded-full bg-brand" />}
        <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/15 to-cyan-500/15 text-primary">
          {service && <ServiceIcon name={service.icon} className="h-5 w-5" />}
          <span className={cn("absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-background", meta.dot)} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className="truncate text-sm font-semibold">{project.spec?.title || project.title}</span>
            <span className="shrink-0 text-[11px] text-muted-foreground">{relativeDay(project.updatedAt)}</span>
          </span>
          <span className="mt-0.5 flex items-center justify-between gap-2">
            <span className="truncate text-xs text-muted-foreground">{preview}</span>
            {project.unread && <span className="h-2 w-2 shrink-0 rounded-full bg-primary" />}
          </span>
        </span>
      </Link>
    </motion.div>
  );
}
