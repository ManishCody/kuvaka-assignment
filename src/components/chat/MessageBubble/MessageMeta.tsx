"use client";

export default function MessageMeta({
  createdAt,
}: {
  createdAt: string;
}) {
  return (
    <div className="mt-1 flex items-center gap-1 opacity-70 text-[11px]">
      <span>
        {new Date(createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </div>
  );
}
