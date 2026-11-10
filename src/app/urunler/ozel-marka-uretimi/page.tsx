import type { Metadata } from "next";
import { privateLabelPath, retailers } from "@/data/privateLabel";
import { RetailerTile } from "@/components/products/PrivateLabel";
import { pageOpenGraph } from "@/lib/metadata";
import { site } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";

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
  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="ÖZEL MARKA (PL) ÜRETİMİ"
        title="Özel Marka Üretimi"
        lead="Perakende zincirlerinin kendi markalarıyla raflarda yer alan temizlik süngeri, bez ve ovucu ürünleri üretiyoruz."
        image={{ src: "/images/corporate/group/saniteks.webp", alt: "Üretim hattında ilerleyen sarı gövdeli, yeşil keçeli bulaşık süngerleri", width: 1024, height: 346 }}
      />

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

      <JsonLd data={breadcrumbJsonLd(crumbs, site.url, privateLabelPath)} />
    </>
  );
}
