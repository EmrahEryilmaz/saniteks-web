import Image from "next/image";
import { cx } from "@/components/ui/styles";

/** Neutral tile for items without a photo yet. */
export function SkuImagePlaceholder({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cx("flex h-full w-full items-center justify-center bg-surface-muted", className)}>
      <Image src="/images/icons/saniteks-icon-192.png" alt="" width={192} height={192} className="size-14 opacity-25 grayscale" />
    </div>
  );
}
