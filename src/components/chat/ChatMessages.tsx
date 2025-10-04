"use client";

import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store";
import MessageBubble from "@/components/chat/MessageBubble";
import TypingIndicator from "@/components/chat/TypingIndicator";
import MessageSkeleton from "@/components/chat/MessageSkeleton";
import { MessageSquare } from "lucide-react";
import type { Message } from "@/store/slices/chatsSlice";

export default function ChatMessages({
  chatId,
  bottomPad,
  isTyping,
}: {
  chatId: string;
  bottomPad: string;
  isTyping: boolean;
}) {
  const messages = useAppSelector(
    (s: RootState) => s.chats.messages[chatId] || [],
  ) as Message[];
  const [visibleCount, setVisibleCount] = useState(20);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const isNearBottom = () => {
    const el = scrollRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  const scrollToBottom = (immediate = false) => {
    const el = scrollRef.current;
    if (!el) return;
    if (immediate) {
      el.scrollTop = el.scrollHeight;
    } else {
      try {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
      } catch {
        el.scrollTop = el.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom(true);
    requestAnimationFrame(() => scrollToBottom(false));
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (isNearBottom() || last?.role === "user") {
      scrollToBottom(false);
    }
  }, [messages]);

  useEffect(() => {
    if (isTyping && isNearBottom()) {
      scrollToBottom(false);
    }
  }, [isTyping]);

  const onScrollMessages = () => {
    const el = scrollRef.current;
    if (!el || loadingOlder) return;
    if (el.scrollTop <= 0 && visibleCount < messages.length) {
      setLoadingOlder(true);
      const prevHeight = el.scrollHeight;
      setTimeout(() => {
        setVisibleCount((c) => Math.min(messages.length, c + 20));
        setLoadingOlder(false);
        requestAnimationFrame(() => {
          const container = scrollRef.current;
          if (container) {
            const diff = container.scrollHeight - prevHeight;
            container.scrollTop = diff;
          }
        });
      }, 700);
    }
  };

  return (
    <div
      ref={scrollRef}
      onScroll={onScrollMessages}
      className={`flex-1 flex flex-col gap-4 ${bottomPad} border-b overflow-y-auto px-3 pr-4 md:px-4`}
    >
      {messages.length === 0 && (
        <div className="text-center text-muted-foreground border rounded-lg p-8 my-4">
          <div className="flex flex-col items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            <div className="text-sm">No messages yet. Type a message below to start the conversation.</div>
          </div>
        </div>
      )}

      {loadingOlder && <MessageSkeleton />}

      {messages.slice(Math.max(0, messages.length - visibleCount)).map((m) => (
        <MessageBubble key={m.id} {...m} />
      ))}

      {isTyping && (
        <div className="mr-auto">
          <TypingIndicator />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
