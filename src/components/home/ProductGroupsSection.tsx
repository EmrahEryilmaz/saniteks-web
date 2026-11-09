import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { cx, focusStyle, headingHomeClass } from "@/components/ui/styles";
import { categories, categoryHref, type Category } from "@/data/products";

/** Live 7/5/5/7/12 mosaic; `sizes` follows the column each card occupies. */
const layout = [
  { span: "lg:col-span-7", sizes: "(min-width: 1440px) 760px, (min-width: 1024px) 56vw, (min-width: 768px) 50vw, 100vw" },
  { span: "lg:col-span-5", sizes: "(min-width: 1440px) 540px, (min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw" },
  { span: "lg:col-span-5", sizes: "(min-width: 1440px) 540px, (min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw" },
  { span: "lg:col-span-7", sizes: "(min-width: 1440px) 760px, (min-width: 1024px) 56vw, (min-width: 768px) 50vw, 100vw" },
  { span: "md:col-span-2 lg:col-span-12", sizes: "(min-width: 1440px) 1312px, 100vw", wide: true },
] as const;

function ProductGroupCard({ category, number, sizes, wide }: { category: Category; number: string; sizes: string; wide?: boolean }) {
  return (
    <article className="group/product relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-md border border-border bg-foreground text-primary-foreground shadow-sm md:min-h-[380px] lg:min-h-[420px]">
      <Image
        src={(wide && category.bannerImage) || category.image}
        alt={category.imageAlt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-400 ease-out group-hover/product:scale-[1.015] group-focus-within/product:scale-[1.015] motion-reduce:transform-none motion-reduce:transition-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-overlay/10 transition-colors duration-250 group-hover/product:bg-overlay/20 motion-reduce:transition-none"
      />
      <span
        aria-hidden="true"
        className="absolute top-4 left-4 flex size-10 items-center justify-center border border-foreground/20 bg-surface/95 text-sm tabular-nums text-foreground"
      >
        {number}
      </span>
      <div className="relative m-3 rounded-sm bg-foreground/90 p-5 md:m-4 md:p-6">
        <h3 className="text-xl font-medium leading-snug tracking-tight lg:text-2xl">{category.name}</h3>
        <Link
          aria-label={`${category.name} — Bilgi alın`}
          className={`mt-3 flex min-h-11 items-center justify-between gap-6 border-t border-primary-foreground/25 pt-3 text-sm font-semibold ${focusStyle} hover:text-primary-foreground/80`}
          href={categoryHref(category)}
        >
          Bilgi alın
          <span
            aria-hidden="true"
            className="text-2xl transition-transform duration-300 group-hover/product:translate-x-0.5 group-hover/product:-translate-y-0.5 motion-reduce:transform-none"
          >
            ↗
          </span>
        </Link>
      </div>
    </article>
  );
}

/** 02 — "Ürün gruplarımız" (#urunler): one card per category from products.ts. */
export function ProductGroupsSection() {
  return (
    <Section id="urunler" labelledBy="products-title" tone="muted">
      <div className="mb-8 grid items-end gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
        <div>
          <Eyebrow variant="line" index="02">
            ÜRÜN GRUPLARIMIZ
          </Eyebrow>
          <h2 id="products-title" className={cx(headingHomeClass, "max-w-2xl")}>
            İhtiyaca göre şekillenen ürünler.
          </h2>
        </div>
        <p className="max-w-sm text-base leading-7 text-muted-foreground lg:pb-2">
          Temizlik rutinlerine eşlik eden ürünlerden kendi tesisimizde ürettiğimiz hammaddeye uzanan seçenekler.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
        {categories.map((category, index) => {
          const cell = layout[index % layout.length];
          return (
            <div key={category.slug} className={cell.span}>
              <ProductGroupCard
                category={category}
                number={String(index + 1).padStart(2, "0")}
                sizes={cell.sizes}
                wide={"wide" in cell && cell.wide}
              />
            </div>
          );
        })}
      </div>
    </Section>
  );
}
