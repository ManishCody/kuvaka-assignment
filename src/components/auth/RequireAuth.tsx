"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthed = useAppSelector((s) => s.auth.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  // Ensure consistent SSR/CSR markup by delaying auth gating until after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthed) {
      router.replace('/');
    }
  }, [mounted, isAuthed, router]);

  // While not mounted, render a stable container to avoid hydration mismatch
  if (!mounted) {
    return <div className="min-h-screen" />;
  }

  if (!isAuthed) return <div className="min-h-screen" />;
  return <>{children}</>;
}
