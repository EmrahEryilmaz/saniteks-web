"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/data/products";
import { cx, focusStyle } from "@/components/ui/styles";
import { useT } from "@/i18n/client";
import { SkuImagePlaceholder } from "./SkuImagePlaceholder";

/** Product page gallery (photos and label already localized): the current photo on a large white tile and a row of thumbnails when there are several. */
export function ProductGallery({ photos, label }: { photos: Photo[]; label: string }) {
  const t = useT();
  const [current, setCurrent] = useState(0);
  const shown = photos[current] ?? photos[0];
  // Old 2016 catalogue cut-outs are low resolution: keep them at most 480px wide (AGENTS.md).
  const lowRes = shown?.src.startsWith("/images/catalog/");

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
            sizes={lowRes ? "(min-width: 768px) 480px, 100vw" : "(min-width: 1440px) 640px, (min-width: 1024px) 45vw, 100vw"}
            className={lowRes ? "object-contain p-10 md:p-20" : "object-contain p-6 md:p-10"}
          />
        ) : (
          <SkuImagePlaceholder />
        )}
      </div>
      {photos.length > 1 ? (
        <ul aria-label={t("{label} görselleri", { label })} className="mt-3 flex flex-wrap gap-2 md:gap-3">
          {photos.map((photo, i) => (
            <li key={photo.src}>
              <button
                type="button"
                onClick={() => setCurrent(i)}
                aria-pressed={i === current}
                aria-label={t("Görsel {number} / {total}: {alt}", { number: i + 1, total: photos.length, alt: photo.alt })}
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
