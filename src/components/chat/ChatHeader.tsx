"use client";

import { ArrowLeft, Menu, PanelsLeftRight, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store";
import {
  setMobileDrawerOpen,
  toggleShowHistory,
  setSearchQuery,
} from "@/store/slices/uiSlice";
import { Button } from "@/components/ui/button";
import { createChat } from "@/store/slices/chatsSlice";
import { useState } from "react";

export default function ChatHeader({ title }: { title: string }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const showHistory = useAppSelector((s: RootState) => s.ui.showHistory);
  const [creating, setCreating] = useState(false);

  const handleCreate = () => {
    if (creating) return;
    setCreating(true);
    // Clear search so the new chat is not hidden by a filter
    dispatch(setSearchQuery(""));
    const action = dispatch(createChat({ title: "New chat" }));
    const id = action.payload?.id as string | undefined;
    if (id) router.push(`/chat/${id}`);
    setTimeout(() => setCreating(false), 600);
  };
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-3 md:px-4 h-14 flex items-center gap-3">
        <button
          className="md:hidden p-2 rounded hover:bg-muted"
          aria-label="Open chats"
          onClick={() => dispatch(setMobileDrawerOpen(true))}
        >
          <Menu className="h-5 w-5" />
        </button>
        <button
          className="hidden md:inline-flex p-2 rounded hover:bg-muted"
          aria-label={showHistory ? "Hide history" : "Show history"}
          onClick={() => dispatch(toggleShowHistory())}
        >
          <PanelsLeftRight className="h-5 w-5" />
        </button>
        <button
          className="p-2 rounded hover:bg-muted"
          aria-label="Back"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="font-medium truncate">{title}</div>
        <div className="flex-1" />
        <Button
          size="sm"
          className="gap-2"
          onClick={handleCreate}
          disabled={creating}
        >
          <Plus className="h-4 w-4" /> New
        </Button>
      </div>
    </header>
  );
}
