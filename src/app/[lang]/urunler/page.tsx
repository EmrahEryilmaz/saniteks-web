import type { Metadata } from "next";
import Image from "next/image";
import { categoryHref, skuHref } from "@/data/products";
import { intlLocales } from "@/i18n/config";
import { getAllSkus, getCategories, getLocale, localized } from "@/i18n/data";
import { Link } from "@/i18n/Link";
import { pageMetadata } from "@/i18n/metadata";
import { getT } from "@/i18n/server";
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
import { privateLabelPath, retailers as baseRetailers } from "@/data/privateLabel";
import { RetailerLogoStrip } from "@/components/products/PrivateLabel";

const PATH = "/urunler";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return pageMetadata({
    title: t("Ürünler"),
    description: t(
      "Saniteks temizlik süngerleri, temizlik bezleri, ovucu materyaller, özel formlu süngerler, doğal ürünler ile rulo non-woven temizlik bezi ve ovucu keçe ürün gruplarını keşfedin.",
    ),
    path: PATH,
  });
}

/** Grid rhythm for six categories: 7/5 · 5/7 · 6/6. */
const cardSpans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7", "lg:col-span-6", "lg:col-span-6"];
const wide = "(min-width: 1024px) 58vw, (min-width: 768px) 50vw, 100vw";
const narrow = "(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw";
const half = "(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw";
const cardSizes = [wide, narrow, narrow, wide, half, half];

export default async function ProductsPage() {
  const t = await getT();
  const locale = await getLocale();
  const categories = await getCategories();
  const retailers = await localized(baseRetailers);
  const crumbs: Crumb[] = [{ label: t("Ana Sayfa"), href: "/" }, { label: t("Ürünler") }];
  const retailerList = new Intl.ListFormat(intlLocales[locale], { style: "long", type: "conjunction" }).format(retailers.map((r) => r.name));
  const entries: SkuSearchEntry[] = (await getAllSkus()).map((s) => ({
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
    href: skuHref(s.category.slug, s.slug),
  }));

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow={t("ÜRÜN GRUPLARIMIZ")}
        title={t("Ürünler")}
        lead={t("Farklı kullanım ihtiyaçlarına yönelik temizlik ürünlerimizi ve kendi ürettiğimiz hammaddeleri inceleyin.")}
        image={{ src: "/images/products/hero-materials.webp", alt: t("Farklı doku ve formlardaki temizlik ürünleri"), width: 1920, height: 1080 }}
      />

      <Section labelledBy="catalog-introduction-title" containerClassName="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
        <SectionHeading id="catalog-introduction-title" eyebrow={t("ÜRÜN KATALOĞU")} title={t("Kullanım ihtiyacına göre şekillenen ürün grupları.")} />
        <div>
          <p className="max-w-xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            {t("Malzeme yapısını, dokuyu ve kullanım amacını birlikte değerlendirerek ihtiyaca uygun seçenekleri ele alıyoruz.")}
          </p>
          <ArrowLink href="/kataloglar" className="mt-5">
            {t("PDF katalogları inceleyin")}
          </ArrowLink>
        </div>
      </Section>

      <Section labelledBy="product-catalog-title" tone="muted">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-14">
          <SectionHeading id="product-catalog-title" eyebrow={t("KATEGORİLER")} title={t("Ürün gruplarımızı keşfedin.")} />
          <p className="max-w-lg text-base leading-7 text-muted-foreground">
            {t("Temizlik rutinlerinden farklı uygulama alanlarına uzanan temel ürün gruplarımız.")}
          </p>
        </div>
        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-12 lg:gap-6">
          {categories.map((c, i) => (
            <div key={c.slug} className={cardSpans[i] ?? "lg:col-span-6"}>
              <CategoryCard
                href={categoryHref(c)}
                name={c.name}
                description={c.shortDescription}
                image={c.image}
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
          <Eyebrow variant="dark">{t("ÖZEL MARKA ÜRETİMİ")}</Eyebrow>
          <h2 id="pl-teaser-title" className={headingHomeClass}>
            {t("Perakende zincirlerinin kendi markalarıyla.")}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-primary-foreground/85">
            {t("{retailers} için özel marka (private label) temizlik ürünleri üretiyoruz.", { retailers: retailerList })}
          </p>
        </div>
        <ButtonLink href={privateLabelPath} variant="inverse">
          {t("Özel marka üretimi")}
        </ButtonLink>
        <div className="lg:col-span-2">
          <RetailerLogoStrip retailers={retailers} />
        </div>
      </Section>

      <Section labelledBy="sku-search-title" id="urun-kodu">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-14">
          <SectionHeading id="sku-search-title" eyebrow={t("ÜRÜN KODU İLE ARAYIN")} title={t("Tüm ürünler.")} />
          <p className="max-w-lg text-base leading-7 text-muted-foreground">
            {t("Ürün adı, ürün kodu veya kategoriye göre arayın; her ürün ölçü ve koli bilgileriyle kendi sayfasında yer alır.")}
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
            alt={t("Eldivenli ellerle nonwoven tekstil numunesinin incelenmesi")}
            width={1600}
            height={1200}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="aspect-4/3 h-auto w-full object-cover object-center"
          />
        </div>
        <div>
          <Eyebrow>{t("ÜRETİM VE KALİTE")}</Eyebrow>
          <h2 id="product-quality-title" className={headingLgClass}>
            {t("Ürün seçiminde dikkatli bir değerlendirme.")}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            {t("Malzeme yapısını, kullanım amacını ve kontrol adımlarını birlikte ele alan yaklaşımımız ürün gruplarına yön verir.")}
          </p>
          <Link
            className={cx(textLinkClass, "mt-5 inline-flex min-h-12 items-center gap-5 border-b border-primary pb-2 font-semibold")}
            href="/kurumsal/hakkinda"
          >
            {t("Kurumsal yaklaşımımız")}
            <span aria-hidden="true" className="inline-block rtl:-scale-x-100">
              ↗
            </span>
          </Link>
        </div>
      </Section>

      <CtaSection
        id="products-contact-title"
        eyebrow={t("ÜRÜNLER HAKKINDA")}
        title={t("İhtiyacınıza uygun seçenekleri birlikte değerlendirelim.")}
        text={t("Ürün gruplarımız hakkında bilgi almak ve kullanım ihtiyacınızı paylaşmak için ekibimize ulaşın.")}
        action={{ href: "/iletisim", label: t("İletişime geçin") }}
      />

      <JsonLd data={breadcrumbJsonLd(crumbs, site.url, PATH, locale)} />
    </>
  );
}
