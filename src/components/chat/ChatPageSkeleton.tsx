"use client";

import MessageSkeleton from "@/components/chat/MessageSkeleton";

export default function ChatPageSkeleton() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="h-14 border-b px-4 flex items-center gap-3">
        <div className="h-6 w-6 rounded bg-muted animate-pulse" />
        <div className="h-4 w-40 rounded bg-muted animate-pulse" />
      </div>

      <main className="w-full flex-1 px-4 py-4 grid gap-6 grid-cols-1 grid-rows-[1fr_auto] overflow-hidden h-full min-h-0">
        <div className="flex-1 flex flex-col gap-4 pb-32 border-b overflow-y-auto px-3 pr-4 md:px-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <MessageSkeleton key={i} align={i % 2 === 0 ? "left" : "right"} />
          ))}
        </div>

        <div className="w-full px-4 py-3 border-t bg-background/80 backdrop-blur">
          <div className="h-12 rounded-2xl bg-muted animate-pulse" />
        </div>
      </main>
    </div>
  );
}

