"use client";

export default function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-1 px-3 py-2 rounded-full bg-muted text-muted-foreground text-xs">
      <span className="sr-only">Gemini is typing</span>
      <span className="inline-flex gap-1">
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.2s]"></span>
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.1s]"></span>
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-bounce"></span>
      </span>
      <span className="ml-2">Gemini is typing…</span>
    </div>
  );
}
