import type { Metadata } from "next";
import Image from "next/image";
import { allSkus, categories, categoryHref, productHref } from "@/data/products";
import { pageOpenGraph } from "@/lib/metadata";
import { site } from "@/lib/site";
import { SkuSearch, type SkuSearchEntry } from "@/components/products/SkuSearch";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowLink, ButtonLink } from "@/components/ui/ButtonLink";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { CtaSection } from "@/components/ui/CtaSection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx, headingHomeClass, headingLgClass, textLinkClass } from "@/components/ui/styles";
import { privateLabelPath, retailers } from "@/data/privateLabel";
import { RetailerLogoStrip } from "@/components/products/PrivateLabel";

const description =
  "Saniteks temizlik süngerleri, temizlik bezleri, ovucu materyaller, özel formlu süngerler ile rulo non-woven temizlik bezi ve ovucu keçe ürün gruplarını keşfedin.";

export const metadata: Metadata = {
  title: "Ürünler",
  description,
  alternates: { canonical: "/urunler" },
  openGraph: pageOpenGraph({ title: "Ürünler | Saniteks", description, url: "/urunler" }),
};

/** Live grid rhythm: 7/5 · 5/7 · full width. */
const cardSpans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7", "md:col-span-2 lg:col-span-12"];
const cardSizes = [
  "(min-width: 1024px) 58vw, (min-width: 768px) 50vw, 100vw",
  "(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw",
  "(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw",
  "(min-width: 1024px) 58vw, (min-width: 768px) 50vw, 100vw",
  "100vw",
];

const crumbs: Crumb[] = [{ label: "Ana Sayfa", href: "/" }, { label: "Ürünler" }];

export default function ProductsPage() {
  const entries: SkuSearchEntry[] = allSkus().map((s) => ({
    slug: s.slug,
    code: s.code,
    name: s.name,
    nameEn: s.nameEn,
    productSize: s.productSize,
    image: s.image,
    imageAlt: s.imageAlt ?? s.name,
    madeToOrder: s.madeToOrder,
    categorySlug: s.category.slug,
    categoryName: s.category.name,
    productName: s.product.name,
    href: `${productHref(s.product)}#${s.slug}`,
  }));

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="ÜRÜN GRUPLARIMIZ"
        title="Ürünler"
        lead="Farklı kullanım ihtiyaçlarına yönelik temizlik ürünlerimizi ve kendi ürettiğimiz hammaddeleri inceleyin."
        image={{ src: "/images/products/hero-materials.webp", alt: "Farklı doku ve formlardaki temizlik ürünleri", width: 1920, height: 1080 }}
      />

      <Section labelledBy="catalog-introduction-title" containerClassName="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
        <SectionHeading id="catalog-introduction-title" eyebrow="ÜRÜN KATALOĞU" title="Kullanım ihtiyacına göre şekillenen ürün grupları." />
        <div>
          <p className="max-w-xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            Malzeme yapısını, dokuyu ve kullanım amacını birlikte değerlendirerek ihtiyaca uygun seçenekleri ele alıyoruz.
          </p>
          <ArrowLink href="/kataloglar" className="mt-5">
            PDF katalogları inceleyin
          </ArrowLink>
        </div>
      </Section>

      <Section labelledBy="product-catalog-title" tone="muted">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-14">
          <SectionHeading id="product-catalog-title" eyebrow="KATEGORİLER" title="Ürün gruplarımızı keşfedin." />
          <p className="max-w-lg text-base leading-7 text-muted-foreground">
            Temizlik rutinlerinden farklı uygulama alanlarına uzanan temel ürün gruplarımız.
          </p>
        </div>
        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          {categories.map((c, i) => (
            <div key={c.slug} className={cardSpans[i] ?? "lg:col-span-6"}>
              <CategoryCard
                href={categoryHref(c)}
                name={c.name}
                description={c.shortDescription}
                image={(cardSpans[i]?.includes("lg:col-span-12") && c.bannerImage) || c.image}
                imageAlt={c.imageAlt}
                number={String(i + 1).padStart(2, "0")}
                sizes={cardSizes[i]}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section
        labelledBy="pl-teaser-title"
        tone="dark"
        containerClassName="grid items-end gap-8 lg:grid-cols-[1fr_auto] lg:gap-16"
      >
        <div>
          <Eyebrow variant="dark">ÖZEL MARKA ÜRETİMİ</Eyebrow>
          <h2 id="pl-teaser-title" className={headingHomeClass}>
            Perakende zincirlerinin kendi markalarıyla.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-primary-foreground/85">
            {retailers.map((r) => r.name).join(", ").replace(/, ([^,]*)$/, " ve $1")} için özel marka (private label) temizlik ürünleri
            üretiyoruz.
          </p>
        </div>
        <ButtonLink href={privateLabelPath} variant="inverse">
          Özel marka üretimi
        </ButtonLink>
        <div className="lg:col-span-2">
          <RetailerLogoStrip retailers={retailers} />
        </div>
      </Section>

      <Section labelledBy="sku-search-title" id="urun-kodu">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-14">
          <SectionHeading id="sku-search-title" eyebrow="ÜRÜN KODU İLE ARAYIN" title="Tüm paket seçenekleri." />
          <p className="max-w-lg text-base leading-7 text-muted-foreground">
            Ürün adı, ürün kodu veya kategoriye göre arayın; her seçenek ölçü ve koli bilgileriyle ürün sayfasında yer alır.
          </p>
        </div>
        <SkuSearch entries={entries} categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
      </Section>

      <Section
        labelledBy="product-quality-title"
        tone="strong"
        containerClassName="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
      >
        <div className="overflow-hidden rounded-sm border border-border">
          <Image
            src="/images/corporate/textile-quality-inspection.webp"
            alt="Eldivenli ellerle nonwoven tekstil numunesinin incelenmesi"
            width={1600}
            height={1200}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-4/3 h-auto w-full object-cover object-center"
          />
        </div>
        <div>
          <Eyebrow>ÜRETİM VE KALİTE</Eyebrow>
          <h2 id="product-quality-title" className={headingLgClass}>
            Ürün seçiminde dikkatli bir değerlendirme.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            Malzeme yapısını, kullanım amacını ve kontrol adımlarını birlikte ele alan yaklaşımımız ürün gruplarına yön verir.
          </p>
          <a
            className={cx(textLinkClass, "mt-5 inline-flex min-h-12 items-center gap-5 border-b border-primary pb-2 font-semibold")}
            href="/kurumsal/hakkinda"
          >
            Kurumsal yaklaşımımız
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </Section>

      <CtaSection
        id="products-contact-title"
        eyebrow="ÜRÜNLER HAKKINDA"
        title="İhtiyacınıza uygun seçenekleri birlikte değerlendirelim."
        text="Ürün gruplarımız hakkında bilgi almak ve kullanım ihtiyacınızı paylaşmak için ekibimize ulaşın."
        action={{ href: "/iletisim", label: "İletişime geçin" }}
      />

      <JsonLd data={breadcrumbJsonLd(crumbs, site.url, "/urunler")} />
    </>
  );
}
