"use client";

import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import type { Chat } from '@/store/slices/chatsSlice';
import ChatListItem from './ChatListItem';
import { MessageSquare, SearchX } from 'lucide-react';

export default function ChatList({ activeId }: { activeId?: string }) {
  const chats = useAppSelector((s: RootState) => s.chats.chats);
  const search = useAppSelector((s: RootState) => s.ui.searchQuery);

  const filtered = useMemo<Chat[]>(() => {
    const q = search.trim().toLowerCase();
    const base = q
      ? chats.filter((c) => c.title.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q))
      : chats;
    // Always sort newest first by updatedAt
    return [...base].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [chats, search]);

  return (
    <div className="space-y-2">
      {/* Empty state: no chats created */}
      {chats.length === 0 && (
        <div className="text-center py-10 text-muted-foreground border rounded-md">
          <div className="flex flex-col items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            <div className="text-sm">No chats yet. Click "New" to start a conversation.</div>
          </div>
        </div>
      )}

      {/* Empty state: search yielded no results */}
      {chats.length > 0 && filtered.length === 0 && (
        <div className="text-center py-10 text-muted-foreground border rounded-md">
          <div className="flex flex-col items-center gap-2">
            <SearchX className="h-6 w-6" />
            <div className="text-sm">No results found{search ? ` for "${search}"` : ''}.</div>
          </div>
        </div>
      )}

      {filtered.map((c: Chat) => (
        <ChatListItem key={c.id} id={c.id} title={c.title} lastMessage={c.lastMessage} updatedAt={c.updatedAt} active={c.id === activeId} />
      ))}
    </div>
  );
}
