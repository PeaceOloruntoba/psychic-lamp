"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";

export default function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-navy-700 bg-navy-800">
        {active ? (
          <Image
            src={active}
            alt={`${title} — image ${activeIndex + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-navy-700">
            <ImageOff size={48} />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                i === activeIndex ? "border-solar-500" : "border-navy-700 opacity-70 hover:opacity-100"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
