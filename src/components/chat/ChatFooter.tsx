import MessageInput from "@/components/chat/MessageInput";
import ImagePreviewList from "./ImagePreviewList";

export default function ChatFooter({
  draft,
  setDraft,
  imagePreviews,
  setImagePreviews,
  onSend,
  onOpenImage,
}: {
  draft: string;
  setDraft: (v: string) => void;
  imagePreviews: string[];
  setImagePreviews: (v: string[]) => void;
  onSend: () => void;
  onOpenImage: (src: string) => void;
}) {
  return (
    <div className="w-full flex flex-col gap-2 px-4 py-3 border-t bg-background/80 backdrop-blur">
      {imagePreviews.length > 0 && (
        <ImagePreviewList
          previews={imagePreviews}
          onOpen={onOpenImage}
          onRemove={(i) => setImagePreviews(imagePreviews.filter((_, idx) => idx !== i))}
        />
      )}
      <MessageInput
        value={draft}
        onChange={setDraft}
        onSend={onSend}
        images={imagePreviews}
        onSelectImages={(files) => {
          const urls = files.map((f) => URL.createObjectURL(f));
          setImagePreviews([...imagePreviews, ...urls]);
        }}
      />
    </div>
  );
}
