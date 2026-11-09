import Image from "next/image";
import Link from "next/link";
import { cx, focusStyle } from "./styles";

type CategoryCardProps = {
  href: string;
  name: string;
  description?: string;
  image: string;
  imageAlt: string;
  /** Two-digit badge, e.g. "01". */
  number: string;
  /** Height classes; live uses taller cards on /urunler than in "Diğer kategoriler". */
  size?: "lg" | "md";
  sizes?: string;
  /** Visible CTA label; also used in the aria-label. */
  ctaLabel?: string;
};

/** Dark image card with number badge — category listings on /urunler and "Diğer kategoriler". */
export function CategoryCard({
  href,
  name,
  description,
  image,
  imageAlt,
  number,
  size = "lg",
  sizes = "(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw",
  ctaLabel = "Kategoriyi inceleyin",
}: CategoryCardProps) {
  return (
    <Link
      aria-label={`${name} — ${ctaLabel}`}
      className={cx(
        "group/category relative flex h-full overflow-hidden rounded-sm border border-border bg-foreground text-primary-foreground transition-colors duration-200 hover:border-primary motion-reduce:transition-none",
        size === "lg" ? "min-h-[390px] md:min-h-[430px] lg:min-h-[460px]" : "min-h-[370px]",
        focusStyle,
      )}
      href={href}
    >
      <Image
        src={image}
        alt={imageAlt}
        fill
        sizes={sizes}
        className="object-cover object-center transition-transform duration-400 ease-out group-hover/category:scale-[1.015] group-focus-visible/category:scale-[1.015] motion-reduce:transform-none motion-reduce:transition-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-overlay/10 transition-colors duration-200 group-hover/category:bg-overlay/20 group-focus-visible/category:bg-overlay/20 motion-reduce:transition-none"
      />
      <span
        aria-hidden="true"
        className="absolute top-4 left-4 flex size-10 items-center justify-center border border-foreground/20 bg-surface/95 text-sm tabular-nums text-foreground"
      >
        {number}
      </span>
      <div className="relative m-3 min-w-0 flex-1 self-end rounded-sm bg-foreground/92 p-5 md:m-4 md:p-6">
        <h3 className="text-xl font-semibold leading-snug tracking-tight lg:text-2xl">{name}</h3>
        {description ? <p className="mt-3 text-base leading-7 text-primary-foreground/80">{description}</p> : null}
        <span className="mt-4 flex min-h-11 items-center justify-between gap-5 border-t border-primary-foreground/25 pt-3 text-sm font-semibold">
          {ctaLabel}
          <span
            aria-hidden="true"
            className="text-xl transition-transform duration-200 group-hover/category:translate-x-0.5 group-hover/category:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
          >
            ↗
          </span>
        </span>
      </div>
    </Link>
  );
}
