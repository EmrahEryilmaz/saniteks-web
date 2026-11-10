import Image from "next/image";
import type { Retailer } from "@/data/privateLabel";

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
