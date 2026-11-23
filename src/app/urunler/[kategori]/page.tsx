import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allSkus, categories, categoryHref, categorySkus, getCategory, skuHref } from "@/data/products";
import { pageOpenGraph } from "@/lib/metadata";
import { site } from "@/lib/site";
import { CategoryShop } from "@/components/products/CategoryShop";
import { inquiryHref } from "@/components/products/format";
import { ShopProductCard } from "@/components/products/ShopProductCard";
import { SpecMatrixTable } from "@/components/products/Swatch";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { CtaSection } from "@/components/ui/CtaSection";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

type Props = { params: Promise<{ kategori: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ kategori: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategory((await params).kategori);
  if (!category) return {};
  const path = categoryHref(category);
  return {
    title: category.name,
    description: category.intro[0],
    alternates: { canonical: path },
    openGraph: pageOpenGraph({
      title: `${category.name} | Saniteks`,
      description: category.intro[0],
      url: path,
      image: { url: category.heroImage ?? category.image, alt: category.imageAlt },
    }),
  };
}

/** Category page, shop-style: description, then every product of the category as a filterable grid of tiles. */
export default async function CategoryPage({ params }: Props) {
  const category = getCategory((await params).kategori);
  if (!category) notFound();

  const path = categoryHref(category);
  const crumbs: Crumb[] = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Ürünler", href: "/urunler" },
    { label: category.name },
  ];
  const entries = categorySkus(category);
  const groups = category.products.map((p) => ({ slug: p.slug, name: p.name, count: p.skus.length }));
  const matrices = category.products.flatMap((p) => (p.matrix ? [{ product: p, matrix: p.matrix }] : []));
  const others = categories.filter((c) => c.slug !== category.slug);
  const [lead, ...moreIntro] = category.intro;

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: category.name,
    numberOfItems: entries.length,
    itemListElement: entries.map(({ sku }, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: new URL(skuHref(category.slug, sku.slug), site.url).toString(),
      name: sku.name,
    })),
  };

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="ÜRÜN KATEGORİSİ"
        title={category.name}
        lead={lead}
        image={{ src: category.heroImage ?? category.image, alt: category.imageAlt, width: 1200, height: 900, className: "aspect-4/3 h-auto w-full object-cover" }}
        imageWrapperClassName="hidden lg:block"
      >
        {moreIntro.map((p) => (
          <p key={p} className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
            {p}
          </p>
        ))}
      </PageHero>

      <Section labelledBy="category-products-title" id="urunler" tone="muted">
        <h2 id="category-products-title" className="sr-only">
          Ürün listesi
        </h2>
        <CategoryShop
          label={category.name}
          groups={groups}
          elsewhere={Object.fromEntries(
            allSkus()
              .filter((s) => s.category.slug !== category.slug)
              .map((s) => [s.slug, skuHref(s.category.slug, s.slug)]),
          )}
          items={entries.map((entry) => ({
            key: entry.sku.slug,
            group: entry.product.slug,
            node: <ShopProductCard entry={entry} />,
          }))}
        />
      </Section>

      {matrices.map(({ product, matrix }) => (
        <Section key={product.slug} labelledBy={`${product.slug}-matrix-title`}>
          <SectionHeading id={`${product.slug}-matrix-title`} eyebrow={product.name.toLocaleUpperCase("tr")} title={`${matrix.title}.`} lead={matrix.note} />
          <SpecMatrixTable matrix={matrix} />
        </Section>
      ))}

      <Section labelledBy="other-categories-title" tone={matrices.length ? "muted" : undefined}>
        <SectionHeading id="other-categories-title" eyebrow="DİĞER KATEGORİLER" title="Diğer ürün gruplarını inceleyin." />
        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {others.map((c, i) => (
            <div key={c.slug}>
              <CategoryCard
                href={categoryHref(c)}
                name={c.name}
                description={c.shortDescription}
                image={c.image}
                imageAlt={c.imageAlt}
                number={String(i + 1).padStart(2, "0")}
                size="md"
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              />
            </div>
          ))}
        </div>
      </Section>

      <CtaSection
        id="category-contact-title"
        eyebrow="BİLGİ ALIN"
        title={`${category.name} hakkında konuşalım.`}
        text="Kullanım ihtiyacınızı paylaşın; ürün grubu hakkında birlikte değerlendirme yapalım."
        action={{ href: inquiryHref(category.name), label: "İletişime geçin" }}
      />

      <JsonLd data={[breadcrumbJsonLd(crumbs, site.url, path), itemListJsonLd]} />
    </>
  );
}
