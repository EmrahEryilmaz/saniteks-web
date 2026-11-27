import Image from "next/image";
import { Link } from "@/i18n/Link";
import { intlLocales } from "@/i18n/config";
import { getLocale, getT } from "@/i18n/server";
import { skuHref, type SkuEntry } from "@/data/products";
import { cx, focusStyle } from "@/components/ui/styles";
import { inquiryHref, madeToOrderLabel, skuCardRows, skuInquirySubject } from "./format";
import { SkuImagePlaceholder } from "./SkuImagePlaceholder";

const badgeClass = "w-fit rounded-sm px-2 py-1 text-xs font-semibold tracking-wider whitespace-nowrap";

/**
 * Product tile of the category grid (shop-style): photo on a white square, product group, name, code, key specs.
 * `entry` must be localized (getCategory / getSku from "@/i18n/data"). The whole tile links to the product page (stretched link); "Bilgi alın" sits above it. Anchor id = sku.slug, so
 * old "#<sku>" links still land on the tile.
 */
export async function ShopProductCard({ entry, sizes, headingLevel = "h3" }: { entry: SkuEntry; sizes?: string; headingLevel?: "h2" | "h3" }) {
  const { category, product, sku } = entry;
  const href = skuHref(category.slug, sku.slug);
  const t = await getT();
  const intlLocale = intlLocales[await getLocale()];
  const rows = skuCardRows(sku, t);
  const Heading = headingLevel;
  const photoCount = sku.photos?.length ?? 0;

  return (
    <article
      id={sku.slug}
      className="group/tile relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-sm border border-border bg-surface shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-primary hover:shadow-md target:border-primary target:ring-2 target:ring-primary motion-reduce:transition-none"
    >
      <div className="relative aspect-square w-full border-b border-border bg-white">
        {sku.image ? (
          <Image
            src={sku.image}
            alt={sku.imageAlt ?? sku.name}
            fill
            sizes={sizes ?? "(min-width: 1280px) 320px, (min-width: 768px) 33vw, 50vw"}
            className="object-contain p-4 transition-transform duration-300 group-hover/tile:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none md:p-6"
          />
        ) : (
          <SkuImagePlaceholder />
        )}
        <div className="absolute start-2 top-2 flex flex-col gap-1.5">
          {sku.line ? <span className={cx(badgeClass, "bg-link text-primary-foreground")}>{sku.line.toLocaleUpperCase(intlLocale)}</span> : null}
          {sku.madeToOrder ? (
            <span className={cx(badgeClass, "hidden border border-border-strong bg-surface-strong text-muted-foreground sm:inline-block")}>
              {madeToOrderLabel(t).toLocaleUpperCase(intlLocale)}
            </span>
          ) : null}
        </div>
        {photoCount > 1 ? (
          <span className="absolute end-2 bottom-2 rounded-sm bg-surface/90 px-2 py-1 text-[11px] font-semibold tabular-nums text-muted-foreground">
            {t("{count} görsel", { count: photoCount })}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4 md:p-5">
        <p className="hidden text-xs font-semibold tracking-widest text-subtle-foreground uppercase sm:block">{product.name}</p>
        <Heading className="text-base sm:mt-1.5 leading-snug font-semibold break-words sm:text-lg">
          <Link
            href={href}
            className={cx(
              "after:absolute after:inset-0 after:content-[''] hover:text-link group-hover/tile:text-link",
              focusStyle,
            )}
          >
            {sku.name}
          </Link>
        </Heading>
        {sku.code ? <p className="mt-1 text-sm font-semibold tabular-nums text-link">{sku.code}</p> : null}
        {sku.madeToOrder ? <p className="mt-1 text-xs font-semibold text-muted-foreground sm:hidden">{madeToOrderLabel(t)}</p> : null}
        {rows.length ? (
          <dl className="mt-3 space-y-1 text-xs leading-5 sm:text-sm">
            {rows.map((row) => (
              <div key={row.label} className="flex flex-wrap gap-x-1.5">
                <dt className="text-muted-foreground">{row.label}:</dt>
                <dd className="min-w-0 font-semibold tabular-nums break-words">{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
        <div aria-hidden="true" className="min-h-3 flex-1" />
        <div className="flex items-center justify-between gap-3 border-t border-border pt-1">
          <span aria-hidden="true" className="text-sm font-semibold text-link">
            {t("İncele")} <span className="inline-block rtl:-scale-x-100">→</span>
          </span>
          <Link
            href={inquiryHref(skuInquirySubject(sku))}
            aria-label={t("{name} için bilgi alın", { name: sku.name })}
            className={cx(
              "relative z-10 inline-flex min-h-11 items-center px-1 text-sm font-semibold text-muted-foreground underline-offset-4 hover:text-link hover:underline",
              focusStyle,
            )}
          >
            {t("Bilgi alın")}
          </Link>
        </div>
      </div>
    </article>
  );
}
