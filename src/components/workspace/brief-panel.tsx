"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Clock, ExternalLink, FolderOpen, RefreshCcw, Trash2 } from "lucide-react";
import type { Service } from "@/lib/services";
import type { Project } from "@/lib/types";
import { useProjects } from "@/lib/store";
import { formatPrice, unsplash } from "@/lib/utils";
import { TierBadge } from "@/components/service-card";
import { FileChip } from "./attachment-view";
import { STATUS_META } from "./shell";

export function BriefPanel({ project, service }: { project: Project; service: Service }) {
  const router = useRouter();
  const deleteProject = useProjects((s) => s.deleteProject);
  const [confirming, setConfirming] = useState(false);
  const files = project.messages.flatMap((m) => m.attachments ?? []);
  const meta = STATUS_META[project.status];

  return (
    <aside className="hidden w-80 shrink-0 flex-col overflow-y-auto border-l bg-card/40 scrollbar-thin xl:flex">
      <div className="relative aspect-[16/10] shrink-0">
        <Image src={unsplash(service.image, 640, 400)} alt={service.title} fill sizes="320px" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
        <div className="absolute right-4 bottom-4 left-4 text-white">
          <TierBadge tier={service.tier} className="bg-white/90 dark:bg-black/60" />
          <p className="mt-2 font-semibold">{service.title}</p>
        </div>
      </div>

      <div className="space-y-6 p-5">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="rounded-2xl bg-muted/70 p-3">
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="mt-0.5 font-semibold">{formatPrice(service.price)}</p>
          </div>
          <div className="rounded-2xl bg-muted/70 p-3">
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="mt-0.5 flex items-center gap-1.5 font-semibold">
              <span className={`h-2 w-2 rounded-full ${meta.dot}`} /> {meta.label}
            </p>
          </div>
          <div className="rounded-2xl bg-muted/70 p-3">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="mt-1 text-xs font-medium">{service.turnaround}</p>
          </div>
          <div className="rounded-2xl bg-muted/70 p-3">
            <RefreshCcw className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="mt-1 text-xs font-medium">{service.revisions}</p>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Included</h3>
          <ul className="mt-2 space-y-1.5 text-sm">
            {service.deliverables.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" /> {d}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="flex items-center justify-between text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Shared files <span className="rounded-full bg-muted px-2 py-0.5 text-[10px]">{files.length}</span>
          </h3>
          {files.length === 0 ? (
            <p className="mt-3 flex items-center gap-2 rounded-2xl border border-dashed p-4 text-xs text-muted-foreground">
              <FolderOpen className="h-4 w-4" /> Files you share in the chat appear here.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {files.map((f) => (
                <FileChip key={f.id} a={f} />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2 border-t pt-5">
          <Link href={`/services/${service.slug}`} className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
            <ExternalLink className="h-4 w-4" /> View service details
          </Link>
          {confirming ? (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Delete this project?</span>
              <button
                type="button"
                className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-medium text-white"
                onClick={() => {
                  router.push("/workspace");
                  deleteProject(project.id);
                }}
              >
                Delete
              </button>
              <button type="button" className="rounded-lg border px-2.5 py-1 text-xs" onClick={() => setConfirming(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirming(true)} className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-red-500">
              <Trash2 className="h-4 w-4" /> Delete project
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
