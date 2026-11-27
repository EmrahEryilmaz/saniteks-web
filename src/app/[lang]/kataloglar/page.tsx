import type { Metadata } from "next";
import Image from "next/image";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { PageHero, type HeroImage } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { focusStyle } from "@/components/ui/styles";
import { intlLocales } from "@/i18n/config";
import { pageMetadata } from "@/i18n/metadata";
import { getLocale, getT } from "@/i18n/server";
import { site } from "@/lib/site";

const path = "/kataloglar";

async function getHeroImage(): Promise<HeroImage> {
  const t = await getT();
  return {
    src: "/images/products/hero-materials.webp",
    alt: t("Farklı doku ve formlardaki temizlik ürünleri"),
    width: 1920,
    height: 1080,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  const heroImage = await getHeroImage();
  return pageMetadata({
    title: t("Kataloglar"),
    description: t("Saniteks ürün kataloglarını yayımlandıklarında görüntüleyin veya PDF olarak indirin."),
    path,
    image: { url: heroImage.src, alt: heroImage.alt, width: heroImage.width, height: heroImage.height },
  });
}

type Catalog = {
  title: string;
  description: string;
  /** Short facts shown above the title (type, language, format, size, pages). */
  facts: string[];
  file: string;
  cover: { src: string; alt: string; width: number; height: number };
};

/** Published catalogues in the page language (the PDF title is the document's own English title). */
async function getCatalogs(): Promise<Catalog[]> {
  const t = await getT();
  const locale = await getLocale();
  const megabytes = (value: number) => t("{size} MB", { size: new Intl.NumberFormat(intlLocales[locale]).format(value) });
  return [
    {
      title: "Sanifoam & Sanitex Product Catalog",
      description: t("Sekiz temizlik ürünü için görsel, ürün ölçüsü, ürün kodu ve HS kodu bilgilerini içeren İngilizce katalog."),
      facts: [t("Ürün kataloğu"), t("İngilizce"), "PDF", megabytes(2.2), t("{count} sayfa", { count: 9 })],
      file: "/documents/catalogs/sanifoam-sanitex-product-catalog-en.pdf",
      cover: {
        src: "/images/catalogs/sanifoam-sanitex-product-catalog-en.webp",
        alt: t("Sanifoam ve Sanitex logoları ile temizlik süngeri bulunan katalog kapağı"),
        width: 1165,
        height: 1350,
      },
    },
  ];
}

const catalogButtonClass = `inline-flex min-h-11 items-center justify-center rounded-sm px-5 py-2.5 text-base font-semibold transition-colors motion-reduce:transition-none ${focusStyle}`;

function fileName(file: string) {
  return file.slice(file.lastIndexOf("/") + 1);
}

async function CatalogCard({ catalog }: { catalog: Catalog }) {
  const t = await getT();
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
        <ul className="flex flex-wrap gap-x-3 gap-y-2 text-xs font-semibold tracking-wide text-muted-foreground" aria-label={t("Katalog bilgileri")}>
          {catalog.facts.map((fact) => (
            <li key={fact} className="border-e border-border pe-3 last:border-0 last:pe-0">
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
            aria-label={t("{title} — Görüntüle, yeni sekmede açılır", { title: catalog.title })}
            className={`${catalogButtonClass} bg-primary text-[19px] font-bold text-primary-foreground hover:bg-primary-hover active:bg-primary-active`}
          >
            {t("Görüntüle")}
            <span
              aria-hidden="true"
              className="ms-3 inline-block transition-transform rtl:-scale-x-100 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5 rtl:group-hover/card:-translate-x-0.5 motion-reduce:transform-none"
            >
              ↗
            </span>
          </a>
          <a
            href={catalog.file}
            download={fileName(catalog.file)}
            aria-label={t("{title} — PDF indir", { title: catalog.title })}
            className={`${catalogButtonClass} border border-primary text-link hover:border-primary-hover hover:bg-surface-muted hover:text-link-hover active:border-primary-active active:text-primary-active`}
          >
            {t("PDF indir")}
            <span aria-hidden="true" className="ms-3">
              ↓
            </span>
          </a>
        </div>
      </div>
    </article>
  );
}

export default async function CatalogsPage() {
  const t = await getT();
  const locale = await getLocale();
  const [heroImage, catalogs] = await Promise.all([getHeroImage(), getCatalogs()]);
  const title = t("Kataloglar");
  const crumbs: Crumb[] = [{ label: t("Ana Sayfa"), href: "/" }, { label: title }];
  const catalogListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("Yayımlanan kataloglar."),
    numberOfItems: catalogs.length,
    itemListElement: catalogs.map((catalog, i) => ({ "@type": "ListItem", position: i + 1, name: catalog.title })),
  };

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow={t("KURUMSAL YAYINLAR")}
        title={title}
        lead={t("Ürün gruplarımıza ilişkin yayımlanan katalog ve dokümanlara bu sayfadan ulaşabilirsiniz.")}
        image={heroImage}
      />
      <Section labelledBy="catalogs-introduction-title" containerClassName="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
        <SectionHeading id="catalogs-introduction-title" eyebrow={t("DOKÜMANLAR")} title={t("Ürün bilgilerine düzenli ve kolay erişim.")} />
        <p className="max-w-xl text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
          {t("Yayımlanan katalogları tarayıcınızda görüntüleyebilir veya cihazınıza PDF olarak indirebilirsiniz.")}
        </p>
      </Section>
      <Section labelledBy="catalogs-list-title" tone="muted">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading id="catalogs-list-title" eyebrow={t("KATALOGLAR")} title={t("Yayımlanan kataloglar.")} />
          <p className="max-w-xl text-base leading-7 text-muted-foreground">
            {t("Güncel ve erişime açık kataloglar yayımlandıkça bu alanda listelenecektir.")}
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
          eyebrow={t("DOKÜMAN TALEBİ")}
          title={t("Aradığınız katalog için bizimle iletişime geçin.")}
          lead={t("Ürün grupları ve mevcut dokümanlar hakkında bilgi almak için ekibimize ulaşın.")}
        />
        <ButtonLink href="/iletisim">{t("İletişime geçin")}</ButtonLink>
      </Section>
      <JsonLd data={[breadcrumbJsonLd(crumbs, site.url, path, locale), catalogListJsonLd]} />
    </>
  );
}
