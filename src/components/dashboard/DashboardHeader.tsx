"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { setMobileDrawerOpen, setSearchQuery } from '@/store/slices/uiSlice';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, LogOut } from 'lucide-react';

export default function DashboardHeader() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const search = useAppSelector((s: RootState) => s.ui.searchQuery);
  const [draft, setDraft] = useState(search);

  // keep local input in sync if search changes elsewhere
  useEffect(() => {
    setDraft(search);
  }, [search]);

  // debounce dispatch to Redux (250ms)
  useEffect(() => {
    const t = setTimeout(() => {
      if (draft !== search) dispatch(setSearchQuery(draft));
    }, 250);
    return () => clearTimeout(t);
  }, [draft, search, dispatch]);
  // Dashboard always shows history list; toggle is only for chat page

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-3 md:px-4 h-14 flex items-center gap-3">
        <button
          className="md:hidden p-2 rounded hover:bg-muted"
          aria-label="Open menu"
          onClick={() => dispatch(setMobileDrawerOpen(true))}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="font-semibold tracking-tight">Gemini Chat</div>
        <div className="flex-1" />
        <div className="hidden md:flex items-center gap-2 w-[420px] max-w-[50vw]">
          <Input
            placeholder="Search chats"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        </div>
        {/* No history toggle on dashboard */}
        <ThemeToggle />
        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => {
            dispatch(logout());
            router.push('/');
          }}
        >
          <LogOut className="h-4 w-4" /> Logout
        </Button>
      </div>
    </header>
  );
}
