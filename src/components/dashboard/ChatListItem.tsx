"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { deleteChat } from "@/store/slices/chatsSlice";
import { toast } from "sonner";

export default function ChatListItem({
  id,
  title,
  lastMessage,
  updatedAt,
  active,
}: {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  active?: boolean;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  return (
    <div
      className={cn(
        "group flex relative items-start gap-3 p-3 rounded-lg border hover:bg-muted cursor-pointer",
        active && "bg-muted",
      )}
      onClick={() => router.push(`/chat/${id}`)}
    >
      <div className="flex-1 min-w-0 ">
        <div className="flex items-center justify-between gap-2">
          <div className="font-medium truncate">{title}</div>
          <div className="text-xs text-muted-foreground shrink-0">
            {new Date(updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 bottom-[-7] right-[-3] absolute hover:bg-transparent "
              onClick={(e) => {
                e.stopPropagation();
                toast("Chat deleted", { description: `Deleted “${title}”` });
                dispatch(deleteChat(id));
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {lastMessage}
        </div>
      </div>
    </div>
  );
}
