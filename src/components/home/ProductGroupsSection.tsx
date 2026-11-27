import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { cx, focusStyle, headingHomeClass } from "@/components/ui/styles";
import { privateLabelPath } from "@/data/privateLabel";
import { categoryHref } from "@/data/products";
import { getCategories } from "@/i18n/data";
import { Link } from "@/i18n/Link";
import { getT } from "@/i18n/server";

/** 7/5 · 5/7 · 4/4/4 mosaic for six categories and the private-label card; `sizes` follows the column width. */
const wide = "(min-width: 1440px) 760px, (min-width: 1024px) 56vw, (min-width: 768px) 50vw, 100vw";
const narrow = "(min-width: 1440px) 540px, (min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw";
const third = "(min-width: 1440px) 430px, (min-width: 1024px) 32vw, (min-width: 768px) 50vw, 100vw";
const layout = [
  { span: "lg:col-span-7", sizes: wide },
  { span: "lg:col-span-5", sizes: narrow },
  { span: "lg:col-span-5", sizes: narrow },
  { span: "lg:col-span-7", sizes: wide },
  { span: "lg:col-span-4", sizes: third },
  { span: "lg:col-span-4", sizes: third },
  { span: "md:col-span-2 lg:col-span-4", sizes: third },
] as const;

type Group = { key: string; name: string; href: string; image: string; imageAlt: string };

async function ProductGroupCard({ group, number, sizes }: { group: Group; number: string; sizes: string }) {
  const t = await getT();
  return (
    <article className="group/product relative flex min-h-[360px] flex-col justify-end overflow-hidden rounded-md border border-border bg-foreground text-primary-foreground shadow-sm md:min-h-[380px] lg:min-h-[420px]">
      <Image
        src={group.image}
        alt={group.imageAlt}
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
        className="absolute top-4 start-4 flex size-10 items-center justify-center border border-foreground/20 bg-surface/95 text-sm tabular-nums text-foreground"
      >
        {number}
      </span>
      <div className="relative m-3 rounded-sm bg-foreground/90 p-5 md:m-4 md:p-6">
        <h3 className="text-xl font-medium leading-snug tracking-tight lg:text-2xl">{group.name}</h3>
        <Link
          aria-label={t("{name} — İnceleyin", { name: group.name })}
          className={`mt-3 flex min-h-11 items-center justify-between gap-6 border-t border-primary-foreground/25 pt-3 text-sm font-semibold ${focusStyle} hover:text-primary-foreground/80`}
          href={group.href}
        >
          {t("İnceleyin")}
          <span
            aria-hidden="true"
            className="inline-block text-2xl transition-transform duration-300 group-hover/product:translate-x-0.5 group-hover/product:-translate-y-0.5 rtl:-scale-x-100 rtl:group-hover/product:-translate-x-0.5 motion-reduce:transform-none"
          >
            ↗
          </span>
        </Link>
      </div>
    </article>
  );
}

/** 02 — "Ürün gruplarımız" (#urunler): one card per category from products.ts, then "Özel Marka Üretimi". */
export async function ProductGroupsSection() {
  const t = await getT();
  const categories = await getCategories();
  const privateLabelGroup: Group = {
    key: "ozel-marka-uretimi",
    name: t("Özel Marka Üretimi"),
    href: privateLabelPath,
    image: "/images/corporate/group/saniteks.webp",
    imageAlt: t("Üretim hattında ilerleyen sarı gövdeli, yeşil keçeli bulaşık süngerleri"),
  };
  const groups: Group[] = [
    ...categories.map((c) => ({ key: c.slug, name: c.name, href: categoryHref(c), image: c.image, imageAlt: c.imageAlt })),
    privateLabelGroup,
  ];
  return (
    <Section id="urunler" labelledBy="products-title" tone="muted">
      <div className="mb-8 grid items-end gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
        <div>
          <Eyebrow variant="line" index="02">
            {t("ÜRÜN GRUPLARIMIZ")}
          </Eyebrow>
          <h2 id="products-title" className={cx(headingHomeClass, "max-w-2xl")}>
            {t("İhtiyaca göre şekillenen ürünler.")}
          </h2>
        </div>
        <p className="max-w-sm text-base leading-7 text-muted-foreground lg:pb-2">
          {t(
            "Temizlik rutinlerine eşlik eden ürünlerden doğal ürünlere, kendi tesisimizde ürettiğimiz rulo ve plaka ürünlerden perakende zincirleri için özel marka üretimine uzanan seçenekler.",
          )}
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
        {groups.map((group, index) => {
          const cell = layout[index % layout.length];
          return (
            <div key={group.key} className={cell.span}>
              <ProductGroupCard group={group} number={String(index + 1).padStart(2, "0")} sizes={cell.sizes} />
            </div>
          );
        })}
      </div>
    </Section>
  );
}
