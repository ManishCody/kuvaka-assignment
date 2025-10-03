import Image from "next/image";

export default function ImageModal({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="relative max-w-[50vw] max-h-[50vh] w-[50vw] h-[50vh]" onClick={(e) => e.stopPropagation()}>
        <Image src={src} alt="preview" fill sizes="50vw" className="object-contain rounded-md bg-background" />
        <button onClick={onClose} className="absolute -top-3 -right-3 bg-background border rounded-full px-2 py-1 text-xs">
          Close
        </button>
      </div>
    </div>
  );
}
