"use client";

import Image from "next/image";

export default function MessageImages({
  imageUrl,
  imageUrls,
}: {
  imageUrl?: string;
  imageUrls?: string[];
}) {
  if (Array.isArray(imageUrls) && imageUrls.length > 0) {
    return (
      <div className="mb-2 flex overflow-x-auto gap-2 py-1">
        {imageUrls.map((src, idx) => (
          <div
            key={idx}
            className="relative flex-shrink-0 w-[150px] h-[150px] rounded-lg overflow-hidden"
          >
            <Image
              src={src}
              alt={`attachment-${idx}`}
              fill
              sizes="150px"
              className="object-cover transition-transform duration-200 cursor-pointer hover:scale-[1.05] hover:opacity-90"
            />
          </div>
        ))}
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className="mb-2 w-[150px] h-[150px] overflow-hidden rounded-lg">
        <div className="relative w-[150px] h-[150px]">
          <Image
            src={imageUrl}
            alt="attachment"
            fill
            sizes="150px"
            className="object-cover transition-transform duration-200 cursor-pointer hover:scale-[1.05] hover:opacity-90"
          />
        </div>
      </div>
    );
  }

  return null;
}
