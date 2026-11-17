import Image from "next/image";
import Link from "next/link";
import type { Category, ProductType } from "@/data/products";
import { categoryHref } from "@/data/products";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { containerClass, cx, textLinkClass } from "@/components/ui/styles";
import { inquiryHref, skuCountLabel } from "./format";

/** Product detail top band: image left, category link + title + lead + "Bilgi alın" right. */
export function ProductHero({ category, product, crumbs }: { category: Category; product: ProductType; crumbs: Crumb[] }) {
  return (
    <section aria-labelledby="product-title" className="border-b border-border bg-surface-strong">
      <div className={cx(containerClass, "py-7 md:py-9")}>
        <Breadcrumbs items={crumbs} />
        <div className="grid items-center gap-8 py-5 md:py-7 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-sm border border-border bg-surface">
              {product.imageStyle === "catalog" ? (
                <div className="relative aspect-4/3 w-full bg-white">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    preload
                    sizes="(min-width: 1024px) 480px, 90vw"
                    className="object-contain p-8 md:p-12"
                  />
                </div>
              ) : (
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  width={1600}
                  height={1200}
                  preload
                  sizes="(min-width: 1440px) 680px, (min-width: 1024px) 50vw, 100vw"
                  className="aspect-4/3 h-auto w-full object-cover object-center"
                />
              )}
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground">Ürün kategorisi</p>
            <Link className={cx(textLinkClass, "mt-2 inline-flex min-h-11 items-center font-semibold")} href={categoryHref(category)}>
              {category.name}
            </Link>
            <h1 id="product-title" className="mt-4 max-w-[18ch] text-4xl font-semibold leading-tight tracking-[-0.025em] break-words md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">{product.shortDescription}</p>
            <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
              <ButtonLink href={inquiryHref(product.name)}>Bilgi alın</ButtonLink>
              <a className={cx(textLinkClass, "inline-flex min-h-11 items-center gap-3 font-semibold")} href="#paket-secenekleri">
                {skuCountLabel(product)}
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
