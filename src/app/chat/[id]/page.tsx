"use client";

import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store";
import { addMessage } from "@/store/slices/chatsSlice";
import type { Chat, Message } from "@/store/slices/chatsSlice";
import ChatHeader from "@/components/chat/ChatHeader";
import RequireAuth from "@/components/auth/RequireAuth";
import ChatDrawer from "@/components/dashboard/ChatDrawer";
import ChatList from "@/components/dashboard/ChatList";
import ChatEmptyState from "@/components/chat/ChatEmptyState";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatFooter from "@/components/chat/ChatFooter";
import ImageModal from "@/components/chat/ImageModal";

export default function ChatRoomPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const chat = useAppSelector((s: RootState) =>
    s.chats.chats.find((c: Chat) => c.id === id),
  );
  const messages = useAppSelector(
    (s: RootState) => s.chats.messages[id!] || [],
  ) as Message[];
  const showHistory = useAppSelector((s: RootState) => s.ui.showHistory);

  const title = chat?.title || "Chat";

  const [draft, setDraft] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [pageSize] = useState(20);
  const [visibleCount, setVisibleCount] = useState(20);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const nextAiAtRef = useRef<number>(0);
  const pendingAiRef = useRef<number>(0);
  const [imageModalSrc, setImageModalSrc] = useState<string | null>(null);

  const bottomPad = imagePreviews.length > 0 ? "pb-48 md:pb-40" : "pb-32";

  const scrollToBottom = (immediate = false) => {
    const el = scrollRef.current;
    if (!el) return;
    if (immediate) {
      el.scrollTop = el.scrollHeight;
    } else {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          const target = scrollRef.current.scrollHeight;
          try {
            scrollRef.current.scrollTo({ top: target, behavior: "smooth" });
          } catch {
            scrollRef.current.scrollTop = target;
          }
        }
      });
    }
  };

  useLayoutEffect(() => {
    scrollToBottom(true);
  }, []);

  useEffect(() => {
    setVisibleCount((prev) => Math.min(messages.length, Math.max(pageSize, prev)));
  }, [messages.length, pageSize]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const lastMessage = messages[messages.length - 1];
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;

    if (lastMessage?.role === "user" || nearBottom) {
      scrollToBottom(false);
    }
  }, [messages.length, showHistory]);

  const handleSend = () => {
    if (!id) return;
    if (!draft && imagePreviews.length === 0) return;
    const now = new Date().toISOString();
    dispatch(
      addMessage({
        chatId: id,
        role: "user",
        content: draft || "",
        createdAt: now,
        imageUrls: imagePreviews,
      }),
    );
    setDraft("");
    setImagePreviews([]);
    scrollToBottom(false);

    const baseDelay = 900;
    const nowMs = Date.now();
    const scheduledAt = Math.max(nowMs, nextAiAtRef.current) + baseDelay;
    nextAiAtRef.current = scheduledAt;
    const delay = scheduledAt - nowMs;
    pendingAiRef.current += 1;
    setIsTyping(true);
    setTimeout(() => {
      const reply = "Here is a helpful answer with insights…";
      dispatch(
        addMessage({
          chatId: id,
          role: "ai",
          content: reply,
          createdAt: new Date().toISOString(),
        }),
      );
      pendingAiRef.current -= 1;
      setIsTyping(pendingAiRef.current > 0);
      scrollToBottom(false);
    }, delay);
  };

  const onScrollMessages = () => {
    const el = scrollRef.current;
    if (!el || loadingOlder) return;
    if (el.scrollTop <= 0 && visibleCount < messages.length) {
      setLoadingOlder(true);
      const prevHeight = el.scrollHeight;
      setTimeout(() => {
        setVisibleCount((c) => Math.min(messages.length, c + pageSize));
        setLoadingOlder(false);
        requestAnimationFrame(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight - prevHeight;
          }
        });
      }, 700);
    }
  };

  if (!chat) {
    return (
      <RequireAuth>
        <ChatEmptyState />
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="h-screen flex flex-col overflow-hidden">
        <ChatHeader title={title} />
        <ChatDrawer />

        <main
          className={`w-full flex-1 px-4 py-4 grid gap-6 ${
            showHistory ? "grid-cols-[320px_1fr]" : "grid-cols-1"
          } grid-rows-[1fr_auto] overflow-hidden h-full min-h-0`}
        >
          {showHistory && (
            <aside className="block pr-4 border-r h-full min-h-0 row-span-2">
              <ChatList activeId={id} />
            </aside>
          )}

          <ChatMessages chatId={id} bottomPad={bottomPad} isTyping={isTyping} />

          <ChatFooter
            draft={draft}
            setDraft={setDraft}
            imagePreviews={imagePreviews}
            setImagePreviews={setImagePreviews}
            onSend={handleSend}
            onOpenImage={setImageModalSrc}
          />
        </main>

        {imageModalSrc && (
          <ImageModal src={imageModalSrc} onClose={() => setImageModalSrc(null)} />
        )}
      </div>
    </RequireAuth>
  );
}
