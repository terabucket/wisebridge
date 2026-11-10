"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export const Markdown = memo(function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div
      className={cn(
        "chat-prose prose prose-sm max-w-none dark:prose-invert prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-headings:mt-3 prose-headings:mb-1.5 prose-headings:tracking-tight prose-pre:my-2 prose-code:before:content-none prose-code:after:content-none prose-a:text-primary",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
          table: ({ ...props }) => (
            <div className="my-3 overflow-x-auto rounded-lg border">
              <table {...props} className="my-0!" />
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
