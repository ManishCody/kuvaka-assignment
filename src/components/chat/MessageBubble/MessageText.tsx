"use client";

import { useState } from "react";

export default function MessageText({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong =
    (content?.length || 0) > 600 || (content?.match(/\n/g)?.length || 0) > 6;

  return (
    <div className={isLong ? "relative" : undefined}>
      <div
        className={
          "whitespace-pre-wrap leading-relaxed break-words [overflow-wrap:anywhere] " +
          (!expanded && isLong ? "max-h-48 overflow-hidden pr-1" : "")
        }
      >
        {content}
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
    </div>
  );
}
