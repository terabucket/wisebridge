"use client";

import { create } from "zustand";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import type { ChatMessage, Project, ProjectStatus, RequirementSpec } from "./types";
import { getService } from "./services";
import { uid } from "./utils";

/** IndexedDB-backed storage: chats with attachments outgrow localStorage quickly. */
const hasIDB = () => typeof indexedDB !== "undefined";
const idbStorage: StateStorage = {
  getItem: async (name) => (hasIDB() ? ((await get<string>(name)) ?? null) : null),
  setItem: async (name, value) => {
    if (hasIDB()) await set(name, value);
  },
  removeItem: async (name) => {
    if (hasIDB()) await del(name);
  },
};

interface ProjectState {
  projects: Record<string, Project>;
  hydrated: boolean;
  createProject: (serviceSlug: string) => string;
  deleteProject: (id: string) => void;
  addMessage: (id: string, message: ChatMessage) => void;
  updateMessage: (id: string, messageId: string, patch: Partial<ChatMessage>) => void;
  removeMessage: (id: string, messageId: string) => void;
  setStatus: (id: string, status: ProjectStatus) => void;
  patchProject: (id: string, patch: Partial<Project>) => void;
  setSpec: (id: string, spec: RequirementSpec) => void;
  markRead: (id: string) => void;
}

export const useProjects = create<ProjectState>()(
  persist(
    (setState) => ({
      projects: {},
      hydrated: false,

      createProject: (serviceSlug) => {
        const service = getService(serviceSlug);
        const id = uid("p_");
        const now = Date.now();
        const welcome: ChatMessage = {
          id: uid("m_"),
          role: "assistant",
          kind: "text",
          createdAt: now,
          content: `Hi! I'm **Wise**, your WiseBridge AI consultant 👋\n\nYou picked **${service?.title ?? "a service"}**. I'll ask a few quick questions to understand exactly what you need — feel free to share files like briefs, screenshots, documents or videos at any point.\n\nTo start: **tell me a little about your project and what you'd like to achieve.**`,
        };
        setState((s) => ({
          projects: {
            ...s.projects,
            [id]: {
              id,
              serviceSlug,
              title: service?.title ?? "New project",
              status: "gathering",
              messages: [welcome],
              createdAt: now,
              updatedAt: now,
            },
          },
        }));
        return id;
      },

      deleteProject: (id) =>
        setState((s) => {
          const next = { ...s.projects };
          delete next[id];
          return { projects: next };
        }),

      addMessage: (id, message) =>
        setState((s) => mutate(s, id, (p) => ({ messages: [...p.messages, message] }))),

      updateMessage: (id, messageId, patch) =>
        setState((s) =>
          mutate(s, id, (p) => ({
            messages: p.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
          })),
        ),

      removeMessage: (id, messageId) =>
        setState((s) => mutate(s, id, (p) => ({ messages: p.messages.filter((m) => m.id !== messageId) }))),

      setStatus: (id, status) => setState((s) => mutate(s, id, () => ({ status }))),

      patchProject: (id, patch) => setState((s) => mutate(s, id, () => patch)),

      setSpec: (id, spec) => setState((s) => mutate(s, id, () => ({ spec, status: "spec_review" }))),

      markRead: (id) =>
        setState((s) => (s.projects[id]?.unread ? mutate(s, id, () => ({ unread: false }), false) : s)),
    }),
    {
      name: "wisebridge-projects",
      storage: createJSONStorage(() => idbStorage),
      partialize: (s) => ({ projects: s.projects }),
      // IndexedDB hydration is async: keep anything created before it finished.
      merge: (persisted, current) => ({
        ...current,
        projects: { ...((persisted as Partial<ProjectState>)?.projects ?? {}), ...current.projects },
      }),
      onRehydrateStorage: () => () => {
        useProjects.setState({ hydrated: true });
      },
    },
  ),
);

function mutate(
  s: ProjectState,
  id: string,
  fn: (p: Project) => Partial<Project>,
  touch = true,
): Partial<ProjectState> {
  const p = s.projects[id];
  if (!p) return {};
  return {
    projects: {
      ...s.projects,
      [id]: { ...p, ...fn(p), ...(touch ? { updatedAt: Date.now() } : {}) },
    },
  };
}
