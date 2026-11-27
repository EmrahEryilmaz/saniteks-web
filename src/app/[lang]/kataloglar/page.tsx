import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageHero, type HeroImage } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { focusStyle } from "@/components/ui/styles";
import { site } from "@/lib/site";

const path = "/kataloglar";
const title = "Kataloglar";
const description = "Saniteks ürün kataloglarını yayımlandıklarında görüntüleyin veya PDF olarak indirin.";

const heroImage: HeroImage = {
  src: "/images/products/hero-materials.webp",
  alt: "Farklı doku ve formlardaki temizlik ürünleri",
  width: 1920,
  height: 1080,
};

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: path,
    title: `${title} | Saniteks`,
    description,
    images: [{ url: heroImage.src, width: heroImage.width, height: heroImage.height, alt: heroImage.alt }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} | Saniteks`,
    description,
    images: [{ url: heroImage.src, width: heroImage.width, height: heroImage.height, alt: heroImage.alt }],
  },
};

type Catalog = {
  title: string;
  description: string;
  /** Short facts shown above the title (type, language, format, size, pages). */
  facts: string[];
  file: string;
  cover: { src: string; alt: string; width: number; height: number };
};

const catalogs: Catalog[] = [
  {
    title: "Sanifoam & Sanitex Product Catalog",
    description:
      "Sekiz temizlik ürünü için görsel, ürün ölçüsü, ürün kodu ve HS kodu bilgilerini içeren İngilizce katalog.",
    facts: ["Ürün kataloğu", "İngilizce", "PDF", "2,2 MB", "9 sayfa"],
    file: "/documents/catalogs/sanifoam-sanitex-product-catalog-en.pdf",
    cover: {
      src: "/images/catalogs/sanifoam-sanitex-product-catalog-en.webp",
      alt: "Sanifoam ve Sanitex logoları ile temizlik süngeri bulunan katalog kapağı",
      width: 1165,
      height: 1350,
    },
  },
];

const crumbs: Crumb[] = [{ label: "Ana Sayfa", href: "/" }, { label: title }];

const catalogListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Yayımlanan kataloglar.",
  numberOfItems: catalogs.length,
  itemListElement: catalogs.map((catalog, i) => ({ "@type": "ListItem", position: i + 1, name: catalog.title })),
};

const catalogButtonClass = `inline-flex min-h-11 items-center justify-center rounded-sm px-5 py-2.5 text-base font-semibold transition-colors motion-reduce:transition-none ${focusStyle}`;

function fileName(file: string) {
  return file.slice(file.lastIndexOf("/") + 1);
}

function CatalogCard({ catalog }: { catalog: Catalog }) {
  return (
    <article className="group/card grid min-w-0 overflow-hidden rounded-sm border border-border bg-surface shadow-sm transition-colors hover:border-primary focus-within:border-primary motion-reduce:transition-none md:grid-cols-[minmax(12rem,0.72fr)_1.28fr]">
      <div className="flex min-h-72 items-center justify-center overflow-hidden bg-surface-strong p-6 md:min-h-full">
        <Image
          src={catalog.cover.src}
          alt={catalog.cover.alt}
          width={catalog.cover.width}
          height={catalog.cover.height}
          sizes="336px"
          className="h-auto max-h-96 w-auto max-w-full object-contain"
        />
      </div>
      <div className="flex min-w-0 flex-col p-6 md:p-8">
        <ul className="flex flex-wrap gap-x-3 gap-y-2 text-xs font-semibold tracking-wide text-muted-foreground" aria-label="Katalog bilgileri">
          {catalog.facts.map((fact) => (
            <li key={fact} className="border-r border-border pr-3 last:border-0 last:pr-0">
              {fact}
            </li>
          ))}
        </ul>
        <h3 className="mt-5 text-2xl font-semibold leading-snug tracking-[-0.02em]">{catalog.title}</h3>
        <p className="mt-3 text-base leading-7 text-muted-foreground">{catalog.description}</p>
        <div className="mt-auto flex flex-wrap gap-3 pt-7">
          <a
            href={catalog.file}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${catalog.title} — Görüntüle, yeni sekmede açılır`}
            className={`${catalogButtonClass} bg-primary text-[19px] font-bold text-primary-foreground hover:bg-primary-hover active:bg-primary-active`}
          >
            Görüntüle
            <span
              aria-hidden="true"
              className="ml-3 transition-transform group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 motion-reduce:transform-none"
            >
              ↗
            </span>
          </a>
          <a
            href={catalog.file}
            download={fileName(catalog.file)}
            aria-label={`${catalog.title} — PDF indir`}
            className={`${catalogButtonClass} border border-primary text-link hover:border-primary-hover hover:bg-surface-muted hover:text-link-hover active:border-primary-active active:text-primary-active`}
          >
            PDF indir
            <span aria-hidden="true" className="ml-3">
              ↓
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}

export default function CatalogsPage() {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="KURUMSAL YAYINLAR"
        title={title}
        lead="Ürün gruplarımıza ilişkin yayımlanan katalog ve dokümanlara bu sayfadan ulaşabilirsiniz."
        image={heroImage}
      />
      <Section labelledBy="catalogs-introduction-title" containerClassName="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
        <SectionHeading id="catalogs-introduction-title" eyebrow="DOKÜMANLAR" title="Ürün bilgilerine düzenli ve kolay erişim." />
        <p className="max-w-xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
          Yayımlanan katalogları tarayıcınızda görüntüleyebilir veya cihazınıza PDF olarak indirebilirsiniz.
        </p>
      </Section>
      <Section labelledBy="catalogs-list-title" tone="muted">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading id="catalogs-list-title" eyebrow="KATALOGLAR" title="Yayımlanan kataloglar." />
          <p className="max-w-xl text-base leading-7 text-muted-foreground">
            Güncel ve erişime açık kataloglar yayımlandıkça bu alanda listelenecektir.
          </p>
        </div>
        <div className="mt-9 grid gap-6 xl:grid-cols-2">
          {catalogs.map((catalog) => (
            <CatalogCard key={catalog.file} catalog={catalog} />
          ))}
        </div>
      </Section>
      <Section
        labelledBy="catalogs-contact-title"
        className="border-b-4 border-primary"
        containerClassName="grid items-center gap-8 lg:grid-cols-[1.25fr_auto] lg:gap-16"
      >
        <SectionHeading
          id="catalogs-contact-title"
          eyebrow="DOKÜMAN TALEBİ"
          title="Aradığınız katalog için bizimle iletişime geçin."
          lead="Ürün grupları ve mevcut dokümanlar hakkında bilgi almak için ekibimize ulaşın."
        />
        <ButtonLink href="/iletisim">İletişime geçin</ButtonLink>
      </Section>
      <JsonLd data={[breadcrumbJsonLd(crumbs, site.url, path), catalogListJsonLd]} />
    </>
  );
}
