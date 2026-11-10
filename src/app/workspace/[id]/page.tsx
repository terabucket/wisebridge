import { Suspense } from "react";
import { ChatRoom } from "@/components/workspace/chat-room";

export default function ProjectChatPage() {
  return (
    <Suspense fallback={<div className="flex-1" />}>
      <ChatRoom />
    </Suspense>
  );
}
