"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export const Markdown = memo(function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn("chat-prose", className)}>
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
