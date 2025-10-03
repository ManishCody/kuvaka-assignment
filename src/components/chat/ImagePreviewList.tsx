import Image from "next/image";

export default function ImagePreviewList({ previews, onRemove, onOpen }: {
  previews: string[];
  onRemove: (idx: number) => void;
  onOpen: (src: string) => void;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {previews.map((src, idx) => (
        <div key={idx} className="relative h-16 w-16 shrink-0 rounded-md overflow-hidden border">
          <button onClick={() => onOpen(src)} className="block h-full w-full">
            <Image src={src} alt={`preview-${idx}`} fill sizes="64px" className="object-cover" />
          </button>
          <button
            onClick={() => onRemove(idx)}
            className="absolute -top-1 -right-1 bg-background/90 border rounded-full p-0.5"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
