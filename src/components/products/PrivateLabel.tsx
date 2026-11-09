import Image from "next/image";
import type { BrandOwner, PlProduct, Retailer } from "@/data/privateLabel";
import { getRetailer } from "@/data/privateLabel";

/** SVG logos are served as-is (Next's optimizer does not process SVG). */
function LogoImage({ retailer, className, sizes }: { retailer: Retailer; className: string; sizes: string }) {
  if (!retailer.logo) return null;
  return (
    <Image
      src={retailer.logo.src}
      alt={`${retailer.name} logosu`}
      width={retailer.logo.width}
      height={retailer.logo.height}
      sizes={sizes}
      unoptimized={retailer.logo.src.endsWith(".svg")}
      className={className}
    />
  );
}

/** Retailer tile: official logo on a white panel, store format underneath. */
export function RetailerTile({ retailer }: { retailer: Retailer }) {
  return (
    <li className="flex min-h-44 flex-col bg-surface text-foreground">
      <div className="flex flex-1 items-center justify-center px-6 py-7">
        {retailer.logo ? (
          <LogoImage retailer={retailer} sizes="200px" className="h-12 w-auto max-w-[80%] object-contain md:h-14" />
        ) : (
          <span className="text-2xl font-semibold tracking-[-0.02em] md:text-3xl">{retailer.name}</span>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3 text-sm">
        <span className="font-semibold">{retailer.name}</span>
        <span className="text-right text-muted-foreground">{retailer.segment}</span>
      </div>
    </li>
  );
}

/** Brand owner we produce for: logo panel + short description and brand names. */
export function BrandOwnerCard({ owner }: { owner: BrandOwner }) {
  return (
    <article className="grid overflow-hidden rounded-sm border border-border bg-surface shadow-sm sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <div className="flex min-h-36 items-center justify-center border-b border-border bg-white px-8 py-8 sm:border-r sm:border-b-0">
        {owner.logo ? (
          <LogoImage retailer={owner} sizes="220px" className="h-14 w-auto max-w-[80%] object-contain" />
        ) : (
          <span className="text-3xl font-semibold tracking-[-0.02em]">{owner.name}</span>
        )}
      </div>
      <div className="p-6 md:p-8">
        <h3 className="text-xl font-semibold">{owner.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{owner.segment}</p>
        <p className="mt-4 text-base leading-7 text-muted-foreground">{owner.description}</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${owner.name} markaları`}>
          {owner.brands.map((b) => (
            <li key={b} className="rounded-sm border border-border border-l-2 border-l-primary bg-surface-muted px-3 py-1.5 text-sm font-semibold">
              {b}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/** Compact logo row (e.g. on /urunler). */
export function RetailerLogoStrip({ retailers }: { retailers: Retailer[] }) {
  return (
    <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-primary-foreground/20 sm:grid-cols-4 lg:grid-cols-8" aria-label="Özel marka üretimi yaptığımız zincirler">
      {retailers.map((r) => (
        <li key={r.slug} className="flex h-20 items-center justify-center bg-surface px-4">
          {r.logo ? (
            <LogoImage retailer={r} sizes="140px" className="h-8 w-auto max-w-full object-contain" />
          ) : (
            <span className="text-lg font-semibold text-foreground">{r.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Private-label product as sold by the retailer / brand owner. */
export function PlProductCard({ product }: { product: PlProduct }) {
  return (
    <li className="flex flex-col overflow-hidden rounded-sm border border-border bg-surface">
      <div className="relative aspect-square w-full border-b border-border bg-white">
        <Image src={product.image} alt={product.imageAlt} fill sizes="(min-width: 1280px) 200px, (min-width: 768px) 30vw, 45vw" className="object-contain p-3" />
      </div>
      <div className="flex flex-1 flex-col p-4">
        {product.ownBrand ? <p className="text-xs font-semibold tracking-widest text-link">{product.ownBrand.toLocaleUpperCase("tr")}</p> : null}
        <h4 className="mt-1 text-sm font-semibold leading-snug">{product.name}</h4>
      </div>
    </li>
  );
}

/** Gallery grouped by retailer / brand owner, each group headed by the partner's logo. */
export function PlProductGroups({ products }: { products: PlProduct[] }) {
  const groups = new Map<string, PlProduct[]>();
  for (const p of products) groups.set(p.retailer, [...(groups.get(p.retailer) ?? []), p]);
  return (
    <div className="mt-9 space-y-10">
      {[...groups].map(([slug, items]) => {
        const partner = getRetailer(slug);
        const brands = [...new Set(items.map((i) => i.ownBrand).filter(Boolean))].join(", ");
        const headingId = `pl-group-${slug}`;
        return (
          <section key={slug} aria-labelledby={headingId}>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-border pb-4">
              <span className="flex h-14 w-32 items-center justify-center rounded-sm border border-border bg-white px-3">
                {partner?.logo ? (
                  <LogoImage retailer={partner} sizes="120px" className="h-8 w-auto max-w-full object-contain" />
                ) : (
                  <span className="text-lg font-semibold">{partner?.name ?? slug}</span>
                )}
              </span>
              <div>
                <h3 id={headingId} className="text-lg font-semibold">
                  {partner?.name ?? slug}
                </h3>
                {brands ? <p className="text-sm text-muted-foreground">Marka: {brands}</p> : null}
              </div>
              <p className="ml-auto text-sm tabular-nums text-subtle-foreground">{items.length} ürün</p>
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {items.map((p) => (
                <PlProductCard key={p.image} product={p} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
