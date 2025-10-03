import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ChatHeader from "@/components/chat/ChatHeader";

export default function ChatEmptyState() {
  return (
    <div className="min-h-screen flex flex-col">
      <ChatHeader title={"Chat"} />
      <div className="flex-1 grid place-items-center px-6">
        <div className="text-center text-muted-foreground border rounded-lg p-10 max-w-md w-full">
          <MessageSquare className="h-8 w-8 mx-auto mb-3" />
          <div className="mb-4">
            This chat was not found. It may have been deleted or the link is invalid.
          </div>
          <Link href="/dashboard">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
