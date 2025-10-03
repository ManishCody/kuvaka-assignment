"use client";

import { motion } from "framer-motion";
import { Check, Copy, Bot } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function MessageBubble({
  role,
  content,
  createdAt,
  imageUrl,
  imageUrls,
}: {
  role: "user" | "ai";
  content: string;
  createdAt: string;
  imageUrl?: string;
  imageUrls?: string[];
}) {
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const isLong =
    (content?.length || 0) > 600 || (content?.match(/\n/g)?.length || 0) > 6;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={
        "group relative inline-flex flex-col w-fit max-w-[90%] md:max-w-[75%] rounded-2xl px-3 py-2 pr-8 pb-6 text-sm " +
        (isUser
          ? "ml-auto mr-1 md:mr-2 bg-primary text-primary-foreground rounded-br-sm"
          : "mr-auto bg-muted rounded-bl-sm")
      }
    >
      <div className="flex items-start gap-2">
        {!isUser && (
          <div className="mt-0.5 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Bot className="h-4 w-4 text-primary" />
          </div>
        )}
        <div className="min-w-0">
          {Array.isArray(imageUrls) && imageUrls.length > 0 ? (
            <div className="mb-2 grid grid-cols-2 sm:grid-cols-3 gap-2 w-full">
              {imageUrls.map((src, idx) => (
                <div key={idx} className="relative w-full h-40">
                  <Image
                    src={src}
                    alt={`attachment-${idx}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          ) : imageUrl ? (
            <div className="mb-2 w-full overflow-hidden">
              <div className="relative w-full h-60">
                <Image
                  src={imageUrl}
                  alt="attachment"
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="rounded-lg object-contain bg-black/5 dark:bg-white/5"
                />
              </div>
            </div>
          ) : null}
          <div className={isLong ? "relative" : undefined}>
            <div
              className={
                "whitespace-pre-wrap leading-relaxed break-words [overflow-wrap:anywhere] " +
                (!expanded && isLong ? "max-h-48 overflow-hidden pr-1" : "")
              }
            >
              {content}
            </div>
          </div>
          {isLong && (
            <button
              type="button"
              className="mt-2 text-xs underline opacity-80 hover:opacity-100"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
          <div className="mt-1 flex items-center gap-1 opacity-70 text-[11px]">
            <span>
              {new Date(createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {isUser && <Check className="h-3 w-3" />}
          </div>
        </div>
      </div>
      <button
        aria-label="Copy message"
        className={
          "absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded-md border cursor-pointer bg-white text-black dark:bg-black dark:text-white"
        }
        onClick={handleCopy}
      >
        {copied ? (
          <span className="text-[11px] font-medium">Copied</span>
        ) : (
          <div className="flex items-center gap-1">
            <Copy className="h-3.5 w-3.5" />
            <span className="text-[11px] hidden sm:inline">Copy</span>
          </div>
        )}
      </button>
    </motion.div>
  );
}
