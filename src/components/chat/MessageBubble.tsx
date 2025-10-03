"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import MessageImages from "./MessageBubble/MessageImages";
import MessageText from "./MessageBubble/MessageText";
import MessageMeta from "./MessageBubble/MessageMeta";
import CopyButton from "./MessageBubble/CopyButton";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={
        "group relative inline-flex flex-col w-fit max-w-[90%] md:max-w-[40%] rounded-2xl px-3 py-2 pr-8 pb-6 text-sm " +
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
          <MessageImages imageUrl={imageUrl} imageUrls={imageUrls} />
          <MessageText content={content} />
          <MessageMeta createdAt={createdAt} />
        </div>
      </div>

      <CopyButton content={content} />
    </motion.div>
  );
}
