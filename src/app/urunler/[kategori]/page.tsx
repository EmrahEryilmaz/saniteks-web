import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { categories, categoryHref, getCategory, productHref } from "@/data/products";
import { pageOpenGraph } from "@/lib/metadata";
import { site } from "@/lib/site";
import { inquiryHref, productMeta } from "@/components/products/format";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { CtaSection } from "@/components/ui/CtaSection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/ui/PageHero";
import { ProductCard } from "@/components/ui/ProductCard";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx, headingLgClass } from "@/components/ui/styles";

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
      image: { url: category.image, alt: category.imageAlt },
    }),
  };
}

export default async function CategoryPage({ params }: Props) {
  const category = getCategory((await params).kategori);
  if (!category) notFound();

  const path = categoryHref(category);
  const crumbs: Crumb[] = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Ürünler", href: "/urunler" },
    { label: category.name },
  ];
  const others = categories.filter((c) => c.slug !== category.slug);
  const many = category.products.length > 2;

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="ÜRÜN KATEGORİSİ"
        title={category.name}
        lead={category.shortDescription}
        image={{ src: category.image, alt: category.imageAlt, width: 1200, height: 900 }}
      />

      <Section labelledBy="category-introduction-title" containerClassName="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div className="overflow-hidden rounded-sm border border-border">
          <Image
            src={category.image}
            alt={category.imageAlt}
            width={1200}
            height={900}
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="aspect-4/3 h-auto w-full object-cover object-center"
          />
        </div>
        <div>
          <Eyebrow>KATEGORİYE YAKINDAN BAKIŞ</Eyebrow>
          <h2 id="category-introduction-title" className={headingLgClass}>
            {category.name} seçeneklerine yakından bakın.
          </h2>
          <div className="mt-6 max-w-xl space-y-4 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            {category.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </Section>

      <Section labelledBy="category-products-title" tone="muted">
        <SectionHeading id="category-products-title" eyebrow="ÜRÜN SEÇENEKLERİ" title={`${category.name} ürünleri.`} />
        <div className={cx("mt-9 grid gap-6 md:grid-cols-2", many && "xl:grid-cols-3")}>
          {category.products.map((p) => (
            <div key={p.slug}>
              <ProductCard
                href={productHref(p)}
                name={p.name}
                description={p.shortDescription}
                image={p.image}
                imageAlt={p.imageAlt}
                imageStyle={p.imageStyle}
                meta={productMeta(p)}
                sizes={many ? "(min-width: 1280px) 420px, (min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section labelledBy="other-categories-title">
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

      <JsonLd data={breadcrumbJsonLd(crumbs, site.url, path)} />
    </>
  );
}
