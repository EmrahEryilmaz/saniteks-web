import Image from "next/image";
import Link from "next/link";
import type { ProductType, Sku } from "@/data/products";
import { cx, focusStyle } from "@/components/ui/styles";
import { SkuPhotos } from "./SkuPhotos";
import { inquiryHref, madeToOrderLabel, skuInquirySubject, skuSpecRows } from "./format";

/** Neutral tile for items without a catalogue photo yet. */
export function SkuImagePlaceholder({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cx("flex h-full w-full items-center justify-center bg-surface-muted", className)}>
      <Image src="/images/icons/saniteks-icon-192.png" alt="" width={192} height={192} className="size-14 opacity-25 grayscale" />
    </div>
  );
}

/** One packaged variant: packshot, names, spec list and an inquiry link. Anchor target = sku.slug. */
export function SkuCard({ sku, product }: { sku: Sku; product: Pick<ProductType, "colorOptions"> }) {
  const rows = skuSpecRows(sku, product);
  const titleId = `${sku.slug}-title`;
  return (
    <article id={sku.slug} aria-labelledby={titleId} className="flex h-full scroll-mt-28 flex-col overflow-hidden rounded-sm border border-border bg-surface shadow-sm target:border-primary target:ring-2 target:ring-primary">
      {sku.photos?.length ? (
        <SkuPhotos photos={sku.photos} label={sku.name} />
      ) : (
        <div className="relative aspect-4/3 w-full border-b border-border bg-white">
          {sku.image ? (
            <Image
              src={sku.image}
              alt={sku.imageAlt ?? sku.name}
              fill
              sizes="(min-width: 1280px) 400px, (min-width: 768px) 45vw, 90vw"
              className="object-contain p-6"
            />
          ) : (
            <SkuImagePlaceholder />
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        {sku.line || sku.madeToOrder ? (
          <div className="mb-3 flex flex-wrap gap-2">
            {sku.line ? (
              <p className="w-fit border-l-2 border-primary bg-surface-muted px-3 py-1 text-xs font-semibold tracking-widest text-link">
                {sku.line.toLocaleUpperCase("tr")}
              </p>
            ) : null}
            {sku.madeToOrder ? (
              <p className="w-fit border-l-2 border-border-strong bg-surface-strong px-3 py-1 text-xs font-semibold tracking-widest text-muted-foreground">
                {madeToOrderLabel.toLocaleUpperCase("tr")}
              </p>
            ) : null}
          </div>
        ) : null}
        <h3 id={titleId} className="text-xl font-semibold leading-snug break-words">
          {sku.name}
        </h3>
        <p lang="en" className="mt-1 text-sm text-subtle-foreground">
          {sku.nameEn}
        </p>
        {rows.length ? (
          <dl className="mt-5 divide-y divide-border border-y border-border text-sm">
            {rows.map((row) => (
              <div key={row.label} className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-4 py-2.5">
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="min-w-0 font-semibold tabular-nums break-words">{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <div className="mt-auto pt-5">
          <Link
            href={inquiryHref(skuInquirySubject(sku))}
            aria-label={`${sku.name} için bilgi alın`}
            className={cx(
              "flex min-h-11 items-center justify-between text-sm font-semibold text-link underline-offset-4 hover:text-link-hover hover:underline active:text-primary-active",
              focusStyle,
            )}
          >
            Bilgi alın
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
