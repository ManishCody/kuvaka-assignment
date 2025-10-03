"use client";

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ChatList from '@/components/dashboard/ChatList';
import ChatDrawer from '@/components/dashboard/ChatDrawer';
import RequireAuth from '@/components/auth/RequireAuth';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useState } from 'react';
import { createChat } from '@/store/slices/chatsSlice';
import { useRouter } from 'next/navigation';
import type { RootState } from '@/store';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  // Dashboard always shows chat history list
  const [creating, setCreating] = useState(false);
  const chats = useAppSelector((s: RootState) => s.chats.chats);

  const handleCreate = () => {
    if (creating) return; // guard against rapid clicks
    setCreating(true);
    const action = dispatch(createChat({ title: 'New chat' }));
    const id = (action as any).payload?.id as string | undefined;
    if (id) router.push(`/chat/${id}`);
    // small timeout to re-enable in case navigation doesn't unmount immediately
    setTimeout(() => setCreating(false), 600);
  };

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col">
        <DashboardHeader />
        <ChatDrawer />
        <main className="mx-auto max-w-6xl w-full px-4 py-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground">Your chats</h2>
            <Button size="sm" className="gap-2" onClick={handleCreate} disabled={creating}>
              <Plus className="h-4 w-4" /> New
            </Button>
          </div>

          {chats.length === 0 ? (
            <div className="border rounded-lg py-16 text-center text-muted-foreground">
              <div className="mb-4 text-sm">You don't have any chats yet.</div>
              <Button onClick={handleCreate} disabled={creating} className="gap-2">
                <Plus className="h-4 w-4" /> Start a new chat
              </Button>
            </div>
          ) : (
            <ChatList />
          )}
        </main>
      </div>
    </RequireAuth>
  );
}


