"use client";

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { addMessage } from '@/store/slices/chatsSlice';
import type { Chat, Message } from '@/store/slices/chatsSlice';
import ChatHeader from '@/components/chat/ChatHeader';
import RequireAuth from '@/components/auth/RequireAuth';
import MessageBubble from '@/components/chat/MessageBubble';
import TypingIndicator from '@/components/chat/TypingIndicator';
import MessageInput from '@/components/chat/MessageInput';
import MessageSkeleton from '@/components/chat/MessageSkeleton';
import ChatDrawer from '@/components/dashboard/ChatDrawer';
import ChatList from '@/components/dashboard/ChatList';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ChatRoomPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const chat = useAppSelector((s: RootState) => s.chats.chats.find((c: Chat) => c.id === id));
  const messages = useAppSelector((s: RootState) => s.chats.messages[id!] || []) as Message[];
  const showHistory = useAppSelector((s: RootState) => s.ui.showHistory);

  const title = chat?.title || 'Chat';

  const [draft, setDraft] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [pageSize] = useState(20);
  const [visibleCount, setVisibleCount] = useState(20);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  // AI response throttling/queuing
  const nextAiAtRef = useRef<number>(0); // timestamp when next AI reply can be sent
  const pendingAiRef = useRef<number>(0); // how many AI replies are pending
  const [imageModalSrc, setImageModalSrc] = useState<string | null>(null);
  // Dynamic bottom padding for message list to avoid overlap with sticky footer
  const bottomPad = imagePreviews.length > 0 ? 'pb-48 md:pb-40' : 'pb-32';

  // Helper: scroll to bottom (smooth by default unless immediate)
  const scrollToBottom = (immediate = false) => {
    const el = scrollRef.current;
    if (!el) return;
    if (immediate) {
      el.scrollTop = el.scrollHeight;
    } else {
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          const target = scrollRef.current.scrollHeight;
          // Prefer native smooth scrolling when available
          try {
            scrollRef.current.scrollTo({ top: target, behavior: 'smooth' });
          } catch {
            scrollRef.current.scrollTop = target;
          }
        }
      });
    }
  };

  // Ensure visibleCount reflects current messages length (at least up to pageSize)
  useEffect(() => {
    setVisibleCount((prev) => {
      const base = Math.max(pageSize, prev);
      return Math.min(messages.length, base);
    });
  }, [messages.length, pageSize]);

  // Auto-scroll to bottom when new message arrives if user is near bottom (smooth)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    if (nearBottom) {
      try {
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      } catch {
        el.scrollTop = el.scrollHeight;
      }
    }
  }, [messages.length]);

  // If the latest message is from the user, snap to bottom regardless of current position
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === 'user') {
      scrollToBottom(false);
    }
  }, [messages]);

  // Ensure we start at the bottom on first mount (so latest isn’t hidden)
  useEffect(() => {
    scrollToBottom(true);
    // also after one frame in case layout shifts (fonts, images)
    scrollToBottom(false);
  }, []);

  // When toggling history sidebar, maintain bottom position
  useEffect(() => {
    scrollToBottom(false);
  }, [showHistory]);

  const handleSend = () => {
    if (!id) return;
    if (!draft && imagePreviews.length === 0) return;
    const now = new Date().toISOString();
    // 1) Store user message immediately
    dispatch(
      addMessage({ chatId: id, role: 'user', content: draft || '', createdAt: now, imageUrls: imagePreviews })
    );
    // 2) Clear input and show typing
    setDraft('');
    setImagePreviews([]);
    // 2.5) Smooth scroll to bottom after sending user message
    scrollToBottom(false);
    // 3) Schedule AI response with throttling/queuing
    const baseDelay = 900; // base thinking time
    const nowMs = Date.now();
    const scheduledAt = Math.max(nowMs, nextAiAtRef.current) + baseDelay;
    nextAiAtRef.current = scheduledAt; // push schedule forward for subsequent messages
    const delay = scheduledAt - nowMs;
    pendingAiRef.current += 1;
    setIsTyping(true);
    setTimeout(() => {
      const reply = 'Here is a helpful answer with insights…';
      dispatch(
        addMessage({ chatId: id, role: 'ai', content: reply, createdAt: new Date().toISOString() })
      );
      pendingAiRef.current -= 1;
      setIsTyping(pendingAiRef.current > 0);
      // After AI reply arrives, smooth scroll to bottom
      scrollToBottom(false);
    }, delay);
  };

  // Load older messages when scrolled to top
  const onScrollMessages = () => {
    const el = scrollRef.current;
    if (!el || loadingOlder) return;
    if (el.scrollTop <= 0 && visibleCount < messages.length) {
      setLoadingOlder(true);
      const prevHeight = el.scrollHeight;
      setTimeout(() => {
        setVisibleCount((c) => Math.min(messages.length, c + pageSize));
        setLoadingOlder(false);
        // maintain scroll position after prepending
        requestAnimationFrame(() => {
          if (scrollRef.current) {
            const diff = scrollRef.current.scrollHeight - prevHeight;
            scrollRef.current.scrollTop = diff;
          }
        });
      }, 700);
    }
  };

  // If chat not found, show a friendly empty state
  if (!chat) {
    return (
      <RequireAuth>
        <div className="min-h-screen flex flex-col">
          <ChatHeader title={"Chat"} />
          <div className="flex-1 grid place-items-center px-6">
            <div className="text-center text-muted-foreground border rounded-lg p-10 max-w-md w-full">
              <MessageSquare className="h-8 w-8 mx-auto mb-3" />
              <div className="mb-4">This chat was not found. It may have been deleted or the link is invalid.</div>
              <Link href="/dashboard">
                <Button className="gap-2"><ArrowLeft className="h-4 w-4" /> Back to dashboard</Button>
              </Link>
            </div>
          </div>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="h-screen flex flex-col overflow-hidden">
        <ChatHeader title={title} />
        <ChatDrawer />

      <main className={`w-full flex-1 px-4 py-4 grid gap-6 ${showHistory ? 'grid-cols-[320px_1fr]' : 'grid-cols-1'} grid-rows-[1fr_auto] overflow-hidden h-full min-h-0 items-stretch`}>
        {showHistory && (
          <aside className="block pr-4 border-r h-full min-h-0 row-span-2">
            <div className={`h-full overflow-y-auto overflow-x-hidden  `}>
              <ChatList activeId={id} />
            </div>
          </aside>
        )}

        <section className="flex flex-col md:pl-4 min-h-0 h-full">
          <div
            ref={scrollRef}
            onScroll={onScrollMessages}
            className={`flex-1 flex flex-col gap-4 ${bottomPad} border-b overflow-y-auto px-3 pr-4 md:px-4 [scrollbar-gutter:stable_both-edges]`}
          >
            {/* Empty: no messages yet */}
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground border rounded-lg p-8 my-4">
                <div className="flex flex-col items-center gap-2">
                  <MessageSquare className="h-6 w-6" />
                  <div className="text-sm">No messages yet. Type a message below to start the conversation.</div>
                </div>
              </div>
            )}

            {/* Loading older skeleton */}
            {loadingOlder && messages.length > 0 && (
              <div className="space-y-2">
                <MessageSkeleton />
                <MessageSkeleton />
              </div>
            )}

            {messages
              .slice(Math.max(0, messages.length - visibleCount))
              .map((m: Message) => (
              <MessageBubble
                key={m.id}
                role={m.role}
                content={m.content}
                createdAt={m.createdAt}
                imageUrl={m.imageUrl}
                imageUrls={(m as any).imageUrls}
              />
            ))}

            {/* Input-time previews are shown inside MessageInput now */}

            {isTyping && (
              <div className="mr-auto">
                <TypingIndicator />
              </div>
            )}
          </div>
        </section>

        {/* Footer row inside the same grid to let history span 100% height */}
        <div className={`row-start-2 ${showHistory ? 'col-start-2' : 'col-start-1'} w-full bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t`}>
          <div className="w-full flex flex-col gap-2 px-4 py-3">
            {imagePreviews.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {imagePreviews.map((src, idx) => (
                  <div key={idx} className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden border">
                    <button
                      aria-label={`Open image ${idx + 1}`}
                      className="block h-full w-full"
                      onClick={() => setImageModalSrc(src)}
                    >
                      <img src={src} alt={`attachment-${idx}`} className="h-full w-full object-cover" />
                    </button>
                    <button
                      aria-label="Remove image"
                      className="absolute -top-1 -right-1 bg-background/90 border rounded-full p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      onClick={() => {
                        setImagePreviews((prev) => prev.filter((_, i) => i !== idx));
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <MessageInput
              value={draft}
              onChange={setDraft}
              onSend={handleSend}
              images={imagePreviews}
              onSelectImages={(files) => {
                const urls = files.map((f) => URL.createObjectURL(f));
                setImagePreviews((prev) => [...prev, ...urls]);
              }}
              onRemoveImage={(index) => {
                setImagePreviews((prev) => prev.filter((_, i) => i !== index));
              }}
            />
          </div>
        </div>
      </main>

        {imageModalSrc && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            role="dialog"
            aria-modal="true"
            onClick={() => setImageModalSrc(null)}
          >
            <div
              className="relative max-w-[50vw] max-h-[50vh] w-[50vw] h-[50vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img src={imageModalSrc} alt="preview" className="h-full w-full object-contain rounded-md bg-background" />
              <button
                className="absolute -top-3 -right-3 bg-background border rounded-full px-2 py-1 text-xs"
                onClick={() => setImageModalSrc(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
