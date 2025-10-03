"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

export default function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <button
      aria-label="Copy message"
      className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-1 py-0.5 rounded-md border cursor-pointer bg-white text-black dark:bg-black dark:text-white"
      onClick={handleCopy}
    >
      {copied ? (
        <span className="text-[9px]">Copied</span>
      ) : (
        <div className="flex items-center gap-1">
          <Copy className="h-3.5 w-3.5" />
          <span className="text-[9px] hidden sm:inline">Copy</span>
        </div>
      )}
    </button>
  );
}
