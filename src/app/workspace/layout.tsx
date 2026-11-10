import type { Metadata } from "next";
import { WorkspaceShell } from "@/components/workspace/shell";

export const metadata: Metadata = {
  title: "Workspace",
  robots: { index: false },
};

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <WorkspaceShell>{children}</WorkspaceShell>;
}
