"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";

export default function RequireAuth({
  children,
  fallback,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthed = useAppSelector((s) => s.auth.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthed) {
      router.replace("/");
    }
  }, [mounted, isAuthed, router]);

  if (!mounted) {
    return fallback ? <>{fallback}</> : <div className="min-h-screen" />;
  }

  if (!isAuthed) return fallback ? <>{fallback}</> : <div className="min-h-screen" />;
  return <>{children}</>;
}
