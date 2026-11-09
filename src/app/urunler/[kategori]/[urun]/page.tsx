import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, categoryHref, getProduct, productHref } from "@/data/products";
import { pageOpenGraph } from "@/lib/metadata";
import { site } from "@/lib/site";
import { inquiryHref, productMeta } from "@/components/products/format";
import { ProductHero } from "@/components/products/ProductHero";
import { SkuCard } from "@/components/products/SkuCard";
import { SkuTable } from "@/components/products/SkuTable";
import { ColorOptionList, SpecMatrixTable } from "@/components/products/Swatch";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { CtaSection } from "@/components/ui/CtaSection";
import { ProductCard } from "@/components/ui/ProductCard";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx } from "@/components/ui/styles";

type Props = { params: Promise<{ kategori: string; urun: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.flatMap((c) => c.products.map((p) => ({ kategori: c.slug, urun: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategori, urun } = await params;
  const found = getProduct(kategori, urun);
  if (!found) return {};
  const { product } = found;
  const path = productHref(product);
  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: path },
    openGraph: pageOpenGraph({
      title: `${product.name} | Saniteks`,
      description: product.shortDescription,
      url: path,
      image: { url: product.image, alt: product.imageAlt },
    }),
  };
}

export default async function ProductPage({ params }: Props) {
  const { kategori, urun } = await params;
  const found = getProduct(kategori, urun);
  if (!found) notFound();
  const { category, product } = found;

  const path = productHref(product);
  const crumbs: Crumb[] = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Ürünler", href: "/urunler" },
    { label: category.name, href: categoryHref(category) },
    { label: product.name },
  ];
  const related = category.products.filter((p) => p.slug !== product.slug);
  const skuCount = product.skus.length;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: product.name,
    numberOfItems: skuCount,
    itemListElement: product.skus.map((sku, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: sku.name,
        ...(sku.code ? { sku: sku.code, mpn: sku.code } : {}),
        ...(sku.image ? { image: new URL(sku.image, site.url).toString() } : {}),
        url: new URL(`${path}#${sku.slug}`, site.url).toString(),
        brand: { "@type": "Brand", name: site.name },
        category: `${category.name} > ${product.name}`,
        ...(sku.productSize ? { size: sku.productSize } : {}),
      },
    })),
  };

  return (
    <>
      <ProductHero category={category} product={product} crumbs={crumbs} />

      <Section labelledBy="product-overview-title" containerClassName="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <SectionHeading id="product-overview-title" eyebrow="ÜRÜNE YAKINDAN BAKIŞ" title={`${product.name} hakkında.`} />
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

      <Section labelledBy="product-skus-title" id="paket-secenekleri" tone="muted">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-14">
          <SectionHeading
            id="product-skus-title"
            eyebrow="PAKET SEÇENEKLERİ"
            title={skuCount === 1 ? "Ürün bilgileri." : `${skuCount} paket seçeneği.`}
          />
          <p className="max-w-lg text-base leading-7 text-muted-foreground">
            Ürün kodu, ölçü ve koli bilgileri aşağıda yer alır. Sipariş, numune veya özel üretim talepleriniz için ilgili seçenekten bize ulaşın.
          </p>
        </div>
        <div className={cx("mt-9 grid gap-6", skuCount > 1 && "md:grid-cols-2 xl:grid-cols-3", skuCount === 1 && "max-w-md")}>
          {product.skus.map((sku) => (
            <SkuCard key={sku.slug} sku={sku} product={product} />
          ))}
        </div>
      </Section>

      {product.colorOptions ? (
        <Section labelledBy="product-colors-title">
          <SectionHeading id="product-colors-title" eyebrow="KEÇE RENKLERİ" title={`${product.colorOptions.title}.`} lead={product.colorOptions.note} />
          <ColorOptionList group={product.colorOptions} />
        </Section>
      ) : null}

      {product.matrix ? (
        <Section labelledBy="product-matrix-title">
          <SectionHeading id="product-matrix-title" eyebrow="RENK VE GRAMAJ" title={`${product.matrix.title}.`} lead={product.matrix.note} />
          <SpecMatrixTable matrix={product.matrix} />
        </Section>
      ) : null}

      {skuCount > 1 ? (
        <Section labelledBy="product-table-title" className={product.colorOptions || product.matrix ? "border-t border-border" : undefined}>
          <SectionHeading
            id="product-table-title"
            eyebrow="TEKNİK BİLGİLER"
            title="Seçenekleri karşılaştırın."
            lead="Tablo dar ekranlarda yatay kaydırılabilir."
          />
          <SkuTable product={product} />
        </Section>
      ) : null}

      {related.length ? (
        <Section labelledBy="related-products-title" tone="muted">
          <SectionHeading id="related-products-title" eyebrow="İLGİLİ ÜRÜNLER" title="Aynı kategoriden diğer seçenekler." size="md" />
          <div className={cx("mt-8 grid gap-6 md:grid-cols-2", related.length === 1 ? "lg:max-w-2xl" : "xl:grid-cols-3")}>
            {related.map((p) => (
              <div key={p.slug}>
                <ProductCard
                  href={productHref(p)}
                  name={p.name}
                  description={p.shortDescription}
                  image={p.image}
                  imageAlt={p.imageAlt}
                  imageStyle={p.imageStyle}
                  meta={productMeta(p)}
                />
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      <CtaSection
        id="product-contact-title"
        tone="dark"
        eyebrow="ÜRÜN HAKKINDA"
        title={`${product.name} hakkında bilgi alın.`}
        text="Ürün hakkında ayrıntılı bilgi almak ve ihtiyacınızı paylaşmak için ekibimizle iletişime geçin."
        action={{ href: inquiryHref(product.name), label: "Bilgi alın" }}
      />

      <JsonLd data={[breadcrumbJsonLd(crumbs, site.url, path), itemListJsonLd]} />
    </>
  );
}
