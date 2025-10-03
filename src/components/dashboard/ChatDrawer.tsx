"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { setMobileDrawerOpen } from '@/store/slices/uiSlice';
import ChatList from './ChatList';
import { X } from 'lucide-react';

export default function ChatDrawer() {
  const open = useAppSelector((s: RootState) => s.ui.mobileDrawerOpen);
  const dispatch = useAppDispatch();

  // Close on Escape for accessibility
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dispatch(setMobileDrawerOpen(false));
      }
    };
    if (open) {
      window.addEventListener('keydown', onKey);
    }
    return () => window.removeEventListener('keydown', onKey);
  }, [open, dispatch]);

  return (
    <div
      className={
        open
          ? 'fixed inset-0 z-40 md:hidden'
          : 'pointer-events-none fixed inset-0 z-40 md:hidden'
      }
      aria-hidden={!open}
    >
      <div
        className={
          'absolute inset-0 bg-black/40 transition-opacity ' + (open ? 'opacity-100' : 'opacity-0')
        }
        onClick={() => dispatch(setMobileDrawerOpen(false))}
      />
      <div
        className={
          'absolute left-0 top-0 h-full w-80 max-w-[85vw] border-r bg-background shadow-xl transition-transform ' +
          (open ? 'translate-x-0' : '-translate-x-full')
        }
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-3 border-b">
          <div className="font-medium">Your chats</div>
          <button
            className="p-2 rounded hover:bg-muted"
            aria-label="Close"
            onClick={() => dispatch(setMobileDrawerOpen(false))}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-3 overflow-x-hidden overflow-y-auto  h-[calc(100%-52px)]">
          <ChatList />
        </div>
      </div>
    </div>
  );
}
