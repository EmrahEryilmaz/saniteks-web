import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, categoryHref, categorySkus, getSku, skuHref } from "@/data/products";
import { pageOpenGraph } from "@/lib/metadata";
import { site } from "@/lib/site";
import { inquiryHref, madeToOrderLabel, skuInquirySubject, skuSpecRows } from "@/components/products/format";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ShopProductCard } from "@/components/products/ShopProductCard";
import { ColorOptionList, SpecMatrixTable } from "@/components/products/Swatch";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { ArrowLink, ButtonLink } from "@/components/ui/ButtonLink";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { containerClass, cx, textLinkClass } from "@/components/ui/styles";

type Props = { params: Promise<{ kategori: string; urun: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.flatMap((c) => categorySkus(c).map(({ sku }) => ({ kategori: c.slug, urun: sku.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategori, urun } = await params;
  const found = getSku(kategori, urun);
  if (!found) return {};
  const { category, product, sku } = found;
  const path = skuHref(category.slug, sku.slug);
  const title = sku.code ? `${sku.name} (${sku.code})` : sku.name;
  const description = [sku.productSize && `Ölçü ${sku.productSize}`, sku.packsPerCase && `koli içi ${sku.packsPerCase}`, product.shortDescription]
    .filter(Boolean)
    .join(" · ");
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: pageOpenGraph({
      title: `${title} | Saniteks`,
      description,
      url: path,
      image: sku.image ? { url: sku.image, alt: sku.imageAlt ?? sku.name } : { url: category.image, alt: category.imageAlt },
    }),
  };
}

/** Product detail page of one SKU (shop-style): gallery, specs and inquiry, then group description and similar items. */
export default async function SkuPage({ params }: Props) {
  const { kategori, urun } = await params;
  const found = getSku(kategori, urun);
  if (!found) notFound();
  const { category, product, sku } = found;

  const path = skuHref(category.slug, sku.slug);
  const crumbs: Crumb[] = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Ürünler", href: "/urunler" },
    { label: category.name, href: categoryHref(category) },
    { label: sku.name },
  ];
  const rows = skuSpecRows(sku);
  const photos = sku.photos ?? (sku.image ? [{ src: sku.image, alt: sku.imageAlt ?? sku.name }] : []);
  // Same product group first, then the rest of the category.
  const siblings = categorySkus(category).filter((e) => e.sku.slug !== sku.slug);
  const similar = [...siblings.filter((e) => e.product.slug === product.slug), ...siblings.filter((e) => e.product.slug !== product.slug)].slice(0, 4);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: sku.name,
    ...(sku.code ? { sku: sku.code, mpn: sku.code } : {}),
    ...(photos.length ? { image: photos.map((p) => new URL(p.src, site.url).toString()) } : {}),
    url: new URL(path, site.url).toString(),
    description: product.description[0],
    brand: { "@type": "Brand", name: site.name },
    category: `${category.name} > ${product.name}`,
    ...(sku.productSize ? { size: sku.productSize } : {}),
  };

  return (
    <>
      <section aria-labelledby="product-title" className="border-b border-border bg-surface">
        <div className={cx(containerClass, "py-7 md:py-9")}>
          <Breadcrumbs items={crumbs} />
          <div className="grid gap-8 py-5 md:py-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="min-w-0">
              <ProductGallery photos={photos} label={sku.name} />
            </div>
            <div className="min-w-0 lg:pt-2">
              <Link className={cx(textLinkClass, "inline-flex min-h-11 items-center text-sm font-semibold")} href={categoryHref(category)}>
                {category.name}
              </Link>
              <p className="text-xs font-semibold tracking-widest text-subtle-foreground uppercase">{product.name}</p>
              <h1 id="product-title" className="mt-3 text-3xl leading-tight font-semibold tracking-[-0.02em] break-words md:text-4xl">
                {sku.name}
              </h1>
              <p lang="en" className="mt-2 text-base text-subtle-foreground">
                {sku.nameEn}
              </p>
              {sku.line || sku.madeToOrder ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {sku.line ? (
                    <span className="rounded-sm bg-primary px-2.5 py-1 text-xs font-semibold tracking-widest text-primary-foreground">
                      {sku.line.toLocaleUpperCase("tr")}
                    </span>
                  ) : null}
                  {sku.madeToOrder ? (
                    <span className="rounded-sm border border-border-strong bg-surface-strong px-2.5 py-1 text-xs font-semibold tracking-widest text-muted-foreground">
                      {madeToOrderLabel.toLocaleUpperCase("tr")}
                    </span>
                  ) : null}
                </div>
              ) : null}
              {rows.length ? (
                <dl className="mt-7 divide-y divide-border border-y border-border text-sm md:text-base">
                  {rows.map((row) => (
                    <div key={row.label} className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-4 py-3">
                      <dt className="text-muted-foreground">{row.label}</dt>
                      <dd className="min-w-0 font-semibold tabular-nums break-words">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
              <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">{product.shortDescription}</p>
              <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
                <ButtonLink href={inquiryHref(skuInquirySubject(sku))}>Bilgi alın</ButtonLink>
                <ArrowLink href={`${categoryHref(category)}#${sku.slug}`}>Tüm {category.name.toLocaleLowerCase("tr")}</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section labelledBy="product-about-title" containerClassName="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <SectionHeading id="product-about-title" eyebrow="ÜRÜN HAKKINDA" title={`${product.name}.`} size="md" />
        <div className="min-w-0">
          <div className="max-w-xl space-y-4 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            {product.description.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <ul className="mt-8 grid max-w-xl gap-x-6 sm:grid-cols-2">
            {product.highlights.map((h) => (
              <li key={h} className="flex min-h-12 items-center gap-3 border-t border-border py-3 font-semibold">
                <span aria-hidden="true" className="size-2 shrink-0 bg-primary" />
                {h}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {sku.colorOptions ? (
        <Section labelledBy="product-colors-title" className="border-t border-border">
          <SectionHeading id="product-colors-title" eyebrow="KEÇE RENKLERİ" title={`${sku.colorOptions.title}.`} lead={sku.colorOptions.note} size="md" />
          <ColorOptionList group={sku.colorOptions} />
        </Section>
      ) : null}

      {product.matrix ? (
        <Section labelledBy="product-matrix-title" className="border-t border-border">
          <SectionHeading id="product-matrix-title" eyebrow="RENK VE GRAMAJ" title={`${product.matrix.title}.`} lead={product.matrix.note} size="md" />
          <SpecMatrixTable matrix={product.matrix} />
        </Section>
      ) : null}

      {similar.length ? (
        <Section labelledBy="similar-products-title" tone="muted">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <SectionHeading id="similar-products-title" eyebrow="BENZER ÜRÜNLER" title={`${category.name} kategorisinden.`} size="md" />
            <ArrowLink href={categoryHref(category)}>Tümünü görün</ArrowLink>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-5 xl:grid-cols-4">
            {similar.map((entry) => (
              <li key={entry.sku.slug} className="min-w-0">
                <ShopProductCard entry={entry} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <JsonLd data={[breadcrumbJsonLd(crumbs, site.url, path), productJsonLd]} />
    </>
  );
}
