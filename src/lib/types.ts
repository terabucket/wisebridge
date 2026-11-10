export type AttachmentKind = "image" | "pdf" | "text" | "docx" | "video" | "audio" | "other";

export interface Attachment {
  id: string;
  name: string;
  mime: string;
  size: number;
  kind: AttachmentKind;
  /** Small preview (data URL) for images / video frames. */
  preview?: string;
  /** Payload the model can read: data URLs for images & PDFs. */
  dataUrls?: string[];
  /** Extracted text for text-like documents. */
  text?: string;
  /** Short human-readable note about how the file was processed. */
  note?: string;
}

export type MessageRole = "user" | "assistant";
export type MessageKind = "text" | "spec" | "payment" | "deliverable" | "event";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  kind: MessageKind;
  content: string;
  attachments?: Attachment[];
  createdAt: number;
  /** True while the assistant is still streaming this message. */
  pending?: boolean;
  error?: boolean;
}

export interface RequirementSpec {
  title: string;
  summary: string;
  objectives: string[];
  deliverables: string[];
  audience: string;
  style_and_brand: string;
  technical_requirements: string[];
  references: string[];
  timeline: string;
  open_questions: string[];
}

export type ProjectStatus =
  | "gathering"
  | "spec_review"
  | "awaiting_payment"
  | "paid"
  | "generating"
  | "delivered";

export interface Project {
  id: string;
  serviceSlug: string;
  title: string;
  status: ProjectStatus;
  messages: ChatMessage[];
  spec?: RequirementSpec;
  readyForSpec?: boolean;
  payment?: { sessionId?: string; demo?: boolean; paidAt: number };
  deliverable?: string;
  createdAt: number;
  updatedAt: number;
  unread?: boolean;
}
