"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/data/products";
import { cx, focusStyle } from "@/components/ui/styles";

const mainSizes = "(min-width: 1280px) 400px, (min-width: 768px) 45vw, 90vw";

/** Photo area of a SKU card: the current photo on a white tile and, for several photos, a row of thumbnails. */
export function SkuPhotos({ photos, label }: { photos: Photo[]; label: string }) {
  const [current, setCurrent] = useState(0);
  const shown = photos[current] ?? photos[0];

  return (
    <div className="border-b border-border bg-white">
      <div className="relative aspect-4/3 w-full">
        <Image src={shown.src} alt={shown.alt} fill sizes={mainSizes} className="object-contain p-6" />
      </div>
      {photos.length > 1 ? (
        <ul aria-label={`${label} görselleri`} className="flex flex-wrap justify-center gap-2 px-4 pb-4">
          {photos.map((photo, i) => (
            <li key={photo.src}>
              <button
                type="button"
                onClick={() => setCurrent(i)}
                aria-pressed={i === current}
                aria-label={`Görsel ${i + 1} / ${photos.length}: ${photo.alt}`}
                className={cx(
                  "relative block size-12 overflow-hidden rounded-sm border bg-white transition-colors motion-reduce:transition-none",
                  i === current ? "border-primary ring-1 ring-primary" : "border-border hover:border-border-strong",
                  focusStyle,
                )}
              >
                <Image src={photo.src} alt="" fill sizes="48px" className="object-contain p-0.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
