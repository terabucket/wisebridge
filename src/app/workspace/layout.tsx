import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkspaceShell } from "@/components/workspace/shell";

export const metadata: Metadata = {
  title: "Workspace",
  robots: { index: false },
};

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="h-dvh bg-background" />}>
      <WorkspaceShell>{children}</WorkspaceShell>
    </Suspense>
  );
}
