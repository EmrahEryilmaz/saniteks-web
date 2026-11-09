import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  brandOwners,
  privateLabelCategories,
  privateLabelFacts,
  privateLabelPath,
  privateLabelSteps,
  retailers,
  visiblePlProducts,
} from "@/data/privateLabel";
import { BrandOwnerCard, PlProductGroups, RetailerTile } from "@/components/products/PrivateLabel";
import { pageOpenGraph } from "@/lib/metadata";
import { site } from "@/lib/site";
import { inquiryHref } from "@/components/products/format";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { ArrowLink } from "@/components/ui/ButtonLink";
import { CtaSection } from "@/components/ui/CtaSection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx, focusStyle, headingLgClass } from "@/components/ui/styles";

const DESCRIPTION =
  "Saniteks; A101, BİM, FİLE, ŞOK, Metro, Gratis, CarrefourSA ve Koçtaş için zincirlerin kendi markalarıyla temizlik süngeri, bez ve ovucu ürünler üretir.";

export const metadata: Metadata = {
  title: "Özel Marka Üretimi",
  description: DESCRIPTION,
  alternates: { canonical: privateLabelPath },
  openGraph: pageOpenGraph({
    title: "Özel Marka Üretimi | Saniteks",
    description: DESCRIPTION,
    url: privateLabelPath,
    image: { url: "/images/corporate/group/saniteks.webp", alt: "Üretim hattında ilerleyen bulaşık süngerleri" },
  }),
};

const crumbs: Crumb[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Ürünler", href: "/urunler" },
  { label: "Özel Marka Üretimi" },
];

export default function PrivateLabelPage() {
  const products = visiblePlProducts();
  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="ÖZEL MARKA (PL) ÜRETİMİ"
        title="Özel Marka Üretimi"
        lead="Perakende zincirlerinin kendi markalarıyla raflarda yer alan temizlik süngeri, bez ve ovucu ürünleri üretiyoruz."
        image={{ src: "/images/corporate/group/saniteks.webp", alt: "Üretim hattında ilerleyen sarı gövdeli, yeşil keçeli bulaşık süngerleri", width: 1024, height: 346 }}
      />

      {/* Yaklaşım */}
      <Section labelledBy="pl-intro-title" containerClassName="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start lg:gap-16">
        <div className="min-w-0">
          <Eyebrow>KENDİ MARKANIZLA</Eyebrow>
          <h2 id="pl-intro-title" className={headingLgClass}>
            Aynı üretim, sizin markanız.
          </h2>
          <div className="mt-6 max-w-2xl space-y-4 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            <p>
              Saniteks, kendi markalarının yanı sıra perakende zincirleri için özel marka (private label) üretimi yapar. Ürünler, zincirin
              kendi marka tasarımı ve barkoduyla ambalajlanarak mağaza raflarına ulaşır.
            </p>
            <p>
              Özel marka ürünlerde de kendi markalarımızdaki üretim altyapısı, hammadde ve kalite yaklaşımı kullanılır. Ürün, ölçü, renk
              ve paket seçenekleri zincirin raf ve fiyat hedeflerine göre birlikte belirlenir.
            </p>
          </div>
        </div>
        <dl className="grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-3 lg:grid-cols-1">
          {privateLabelFacts.map((f) => (
            <div key={f.label} className="bg-surface-muted p-6">
              <dt className="sr-only">{f.label}</dt>
              <dd>
                <span className="block text-4xl font-bold tabular-nums text-link">{f.value}</span>
                <span className="mt-1 block text-base font-semibold">{f.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Zincirler */}
      <Section labelledBy="pl-retailers-title" tone="dark">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading id="pl-retailers-title" eyebrow="ÇÖZÜM ORTAKLARIMIZ" title="Üretim yaptığımız perakende zincirleri." onDark />
          <p className="max-w-lg text-base leading-7 text-primary-foreground/75">
            İndirim marketlerinden yapı marketlere, farklı formatlardaki zincirlerin kendi markalı temizlik ürünlerini üretiyoruz.
          </p>
        </div>
        <ul className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-primary-foreground/20 bg-primary-foreground/20 md:grid-cols-4">
          {retailers.map((r) => (
            <RetailerTile key={r.slug} retailer={r} />
          ))}
        </ul>
        <p className="mt-5 text-xs leading-5 text-primary-foreground/60">
          Zincir adları ve logoları ilgili şirketlerin tescilli markalarıdır ve izinleriyle kullanılmaktadır.
        </p>
      </Section>

      {/* Marka sahipleri */}
      {brandOwners.length ? (
        <Section labelledBy="pl-brands-title" tone="strong">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
            <SectionHeading id="pl-brands-title" eyebrow="MARKALAR İÇİN ÜRETİM" title="Marka sahipleri için üretim." />
            <p className="max-w-lg text-base leading-7 text-muted-foreground">
              Perakende zincirlerinin yanı sıra, kendi markalarıyla satış yapan firmalar için de üretim yapıyoruz.
            </p>
          </div>
          <div className="mt-9 grid gap-5 lg:grid-cols-2">
            {brandOwners.map((o) => (
              <BrandOwnerCard key={o.slug} owner={o} />
            ))}
          </div>
        </Section>
      ) : null}

      {/* Raflardaki ürünler */}
      {products.length ? (
        <Section labelledBy="pl-shelf-title">
          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
            <SectionHeading id="pl-shelf-title" eyebrow="RAFLARDA" title="Müşterilerimizin markalarıyla ürettiklerimizden." />
            <p className="max-w-lg text-base leading-7 text-muted-foreground">
              Ürün görselleri ilgili zincir ve markaların izniyle kullanılmaktadır; ürün çeşitleri ve ambalajlar müşterilerimizin
              listelerine göre değişebilir.
            </p>
          </div>
          <PlProductGroups products={products} />
        </Section>
      ) : null}

      {/* Ürün grupları */}
      <Section labelledBy="pl-products-title" tone="muted">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading id="pl-products-title" eyebrow="ÜRÜN GRUPLARI" title="Özel marka olarak üretilebilen ürünler." />
          <p className="max-w-lg text-base leading-7 text-muted-foreground">
            Ürün sayfalarındaki tüm paket seçenekleri özel marka üretimi için de değerlendirilebilir.
          </p>
        </div>
        <ul className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {privateLabelCategories.map((c) => (
            <li key={c.href}>
              <Link
                href={c.href}
                className={cx(
                  "group/pl flex h-full flex-col overflow-hidden rounded-sm border border-border bg-surface shadow-sm transition-colors hover:border-primary motion-reduce:transition-none",
                  focusStyle,
                )}
              >
                <div className="overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.imageAlt}
                    width={1200}
                    height={900}
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="aspect-4/3 h-auto w-full object-cover transition-transform duration-400 group-hover/pl:scale-[1.015] motion-reduce:transform-none motion-reduce:transition-none"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-semibold leading-snug">{c.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{c.description}</p>
                  <div className="mt-auto pt-4">
                    <span className="flex min-h-11 items-center justify-between border-t border-border pt-3 text-sm font-semibold text-link">
                      Ürünleri inceleyin
                      <span aria-hidden="true">↗</span>
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      {/* Süreç */}
      <Section labelledBy="pl-process-title">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading id="pl-process-title" eyebrow="GENEL SÜREÇ" title="Özel marka projesi nasıl ilerler?" />
          <p className="max-w-lg text-base leading-7 text-muted-foreground">
            Aşağıdaki akış genel adımları gösterir; süreç ürüne ve projenin ihtiyaçlarına göre farklılaşabilir.
          </p>
        </div>
        <ol className="mt-9 grid gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-5">
          {privateLabelSteps.map((s, i) => (
            <li key={s.title} className="bg-surface p-6">
              <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-sm bg-primary text-sm font-bold tabular-nums text-primary-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-lg font-semibold leading-snug">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
          <ArrowLink href="/kabiliyetler">Üretim kabiliyetlerimiz</ArrowLink>
          <ArrowLink href="/kalite/kalite-politikamiz">Kalite politikamız</ArrowLink>
        </div>
      </Section>

      <CtaSection
        id="pl-contact-title"
        eyebrow="ÖZEL MARKA PROJESİ"
        title="Kendi markanız için üretimi konuşalım."
        text="Ürün, ambalaj ve adet ihtiyacınızı paylaşın; özel marka üretimi için birlikte değerlendirme yapalım."
        action={{ href: inquiryHref("Özel marka üretimi"), label: "İletişime geçin" }}
      />

      <JsonLd data={breadcrumbJsonLd(crumbs, site.url, privateLabelPath)} />
    </>
  );
}
