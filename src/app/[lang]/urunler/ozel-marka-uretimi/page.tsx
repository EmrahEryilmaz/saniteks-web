import type { Metadata } from "next";
import { privateLabelPath, retailers as baseRetailers } from "@/data/privateLabel";
import { getLocale, localized } from "@/i18n/data";
import { pageMetadata } from "@/i18n/metadata";
import { getT } from "@/i18n/server";
import { RetailerTile } from "@/components/products/PrivateLabel";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return pageMetadata({
    title: t("Özel Marka Üretimi"),
    description: t(
      "Saniteks; A101, BİM, FİLE, ŞOK, Metro, Gratis, CarrefourSA ve Koçtaş için zincirlerin kendi markalarıyla temizlik süngeri, bez ve ovucu ürünler üretir.",
    ),
    path: privateLabelPath,
    image: { url: "/images/corporate/group/saniteks.webp", alt: t("Üretim hattında ilerleyen bulaşık süngerleri") },
  });
}

export default async function PrivateLabelPage() {
  const t = await getT();
  const locale = await getLocale();
  const retailers = await localized(baseRetailers);
  const crumbs: Crumb[] = [
    { label: t("Ana Sayfa"), href: "/" },
    { label: t("Ürünler"), href: "/urunler" },
    { label: t("Özel Marka Üretimi") },
  ];

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow={t("ÖZEL MARKA (PL) ÜRETİMİ")}
        title={t("Özel Marka Üretimi")}
        lead={t("Perakende zincirlerinin kendi markalarıyla raflarda yer alan temizlik süngeri, bez ve ovucu ürünleri üretiyoruz.")}
        image={{
          src: "/images/corporate/group/saniteks.webp",
          alt: t("Üretim hattında ilerleyen sarı gövdeli, yeşil keçeli bulaşık süngerleri"),
          width: 1024,
          height: 346,
        }}
      />

      {/* Zincirler */}
      <Section labelledBy="pl-retailers-title" tone="dark">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading id="pl-retailers-title" eyebrow={t("ÇÖZÜM ORTAKLARIMIZ")} title={t("Üretim yaptığımız perakende zincirleri.")} onDark />
          <p className="max-w-lg text-base leading-7 text-primary-foreground/75">
            {t("İndirim marketlerinden yapı marketlere, farklı formatlardaki zincirlerin kendi markalı temizlik ürünlerini üretiyoruz.")}
          </p>
        </div>
        <ul className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-primary-foreground/20 bg-primary-foreground/20 md:grid-cols-4">
          {retailers.map((r) => (
            <RetailerTile key={r.slug} retailer={r} />
          ))}
        </ul>
        <p className="mt-5 text-xs leading-5 text-primary-foreground/60">
          {t("Zincir adları ve logoları ilgili şirketlerin tescilli markalarıdır ve izinleriyle kullanılmaktadır.")}
        </p>
      </Section>

      <JsonLd data={breadcrumbJsonLd(crumbs, site.url, privateLabelPath, locale)} />
    </>
  );
}
