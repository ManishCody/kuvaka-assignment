"use client";

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, Send, Copy } from 'lucide-react';

export default function MessageInput({
  value,
  onChange,
  onSend,
  images = [],
  onSelectImages,
  onRemoveImage,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  images?: string[];
  onSelectImages: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
  disabled?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const textRef = useRef<HTMLTextAreaElement | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-resize the textarea height based on content
  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px'; // cap height ~200px
  }, [value]);

  return (
    <div className="flex items-center gap-2 p-2 border rounded-xl bg-background ">
      <button
        aria-label="Upload images"
        className="p-2 rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onClick={() => fileRef.current?.click()}
      >
        <ImageIcon className="h-5 w-5" />
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = e.target.files ? Array.from(e.target.files) : [];
          if (files.length) onSelectImages(files);
        }}
      />
      {/* Image previews are rendered above the input bar in the page container */}
      <textarea
        ref={textRef}
        aria-label="Message input"
        placeholder="Ask anything…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSend();
          }
        }}
        rows={1}
        className="flex-1 resize-none rounded-md border px-3 py-2 bg-white text-black dark:bg-black dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring max-h-52"
      />
      <Button onClick={onSend} disabled={disabled} className="gap-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
        <Send className="h-4 w-4" />
        Send
      </Button>
    </div>
  );
}

