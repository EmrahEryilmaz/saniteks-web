"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/data/products";
import { cx, focusStyle } from "@/components/ui/styles";
import { SkuImagePlaceholder } from "./SkuImagePlaceholder";

/** Product page gallery: the current photo on a large white tile and a row of thumbnails when there are several. */
export function ProductGallery({ photos, label }: { photos: Photo[]; label: string }) {
  const [current, setCurrent] = useState(0);
  const shown = photos[current] ?? photos[0];

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-sm border border-border bg-white">
        {shown ? (
          <Image
            key={shown.src}
            src={shown.src}
            alt={shown.alt}
            fill
            preload={current === 0}
            sizes="(min-width: 1440px) 640px, (min-width: 1024px) 45vw, 100vw"
            className="object-contain p-6 md:p-10"
          />
        ) : (
          <SkuImagePlaceholder />
        )}
      </div>
      {photos.length > 1 ? (
        <ul aria-label={`${label} görselleri`} className="mt-3 flex flex-wrap gap-2 md:gap-3">
          {photos.map((photo, i) => (
            <li key={photo.src}>
              <button
                type="button"
                onClick={() => setCurrent(i)}
                aria-pressed={i === current}
                aria-label={`Görsel ${i + 1} / ${photos.length}: ${photo.alt}`}
                className={cx(
                  "relative block size-16 overflow-hidden rounded-sm border bg-white transition-colors motion-reduce:transition-none md:size-20",
                  i === current ? "border-primary ring-2 ring-primary" : "border-border hover:border-border-strong",
                  focusStyle,
                )}
              >
                <Image src={photo.src} alt="" fill sizes="80px" className="object-contain p-1" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
