import Image from "next/image";
import Link from "next/link";
import { cx, focusStyle } from "./styles";

type ProductCardProps = {
  href: string;
  name: string;
  description: string;
  image: string;
  imageAlt: string;
  /** styled = editorial photo (cover); catalog = low-res packshot on white (contain). */
  imageStyle?: "styled" | "catalog";
  /** Small line above the footer, e.g. "7 paket seçeneği". */
  meta?: string;
  ctaLabel?: string;
  sizes?: string;
};

const zoom =
  "transition-transform duration-400 group-hover/product:scale-[1.015] group-focus-within/product:scale-[1.015] motion-reduce:transform-none motion-reduce:transition-none";

/** White product card — category product grids and "İlgili ürünler". */
export function ProductCard({
  href,
  name,
  description,
  image,
  imageAlt,
  imageStyle = "styled",
  meta,
  ctaLabel = "Ürünü inceleyin",
  sizes = "(min-width: 1280px) 420px, (min-width: 768px) 50vw, 100vw",
}: ProductCardProps) {
  return (
    <Link
      aria-label={`${name} ürününü inceleyin`}
      className={cx(
        "group/product flex h-full flex-col overflow-hidden rounded-sm border border-border bg-surface shadow-sm transition-colors duration-200 hover:border-primary focus-within:border-primary motion-reduce:transition-none",
        focusStyle,
      )}
      href={href}
    >
      <div className="overflow-hidden">
        {imageStyle === "catalog" ? (
          <div className="relative aspect-4/3 w-full border-b border-border bg-white">
            <Image src={image} alt={imageAlt} fill sizes="(min-width: 768px) 420px, 90vw" className={cx("object-contain p-6", zoom)} />
          </div>
        ) : (
          <Image
            src={image}
            alt={imageAlt}
            width={1600}
            height={1200}
            sizes={sizes}
            className={cx("aspect-4/3 h-auto w-full object-cover object-center", zoom)}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="text-xl font-semibold leading-snug lg:text-2xl">{name}</h3>
        <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>
        {meta ? <p className="mt-3 text-sm font-semibold tabular-nums text-subtle-foreground">{meta}</p> : null}
        <div className="mt-auto pt-5">
          <span className="flex min-h-11 items-center justify-between border-t border-border pt-3 text-sm font-semibold text-link">
            {ctaLabel}
            <span aria-hidden="true">↗</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
