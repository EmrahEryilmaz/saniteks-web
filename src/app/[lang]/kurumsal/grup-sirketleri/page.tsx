import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { corporateHeroImage, groupCompanies } from "@/data/corporate";
import { site } from "@/lib/site";
import { CorporateHero } from "@/components/corporate/CorporateHero";
import { corporateMetadata } from "@/components/corporate/pageMetadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { CtaSection } from "@/components/ui/CtaSection";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx, focusStyle } from "@/components/ui/styles";

const PATH = "/kurumsal/grup-sirketleri";
const DESCRIPTION =
  "Saniteks, Sanifoam çatısı altında faaliyet gösteren grup şirketlerinden biridir: Sanifoam, Saniteks, Sanifoam GmbH, Ultech, Corefix ve Sanicar.";

export const metadata: Metadata = corporateMetadata({
  title: "Grup Şirketleri",
  description: DESCRIPTION,
  path: PATH,
  image: corporateHeroImage,
});

const crumbs: Crumb[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Kurumsal", href: "/kurumsal/hakkinda" },
  { label: "Grup Şirketleri" },
];

const actionClass = cx(
  "inline-flex min-h-11 items-center gap-3 text-sm font-semibold tracking-wide text-link underline-offset-4 hover:text-link-hover hover:underline",
  focusStyle,
);

export default function GroupCompaniesPage() {
  return (
    <>
      <CorporateHero
        crumbs={crumbs}
        current={PATH}
        align="center"
        title="Grup Şirketlerimiz"
        subtitle="Sanifoam çatısı altında farklı sektörlerde uzmanlaşan grup şirketlerini tanıyın. Saniteks, temizlik ürünleri alanında faaliyet gösteren bir grup şirketidir."
        image={corporateHeroImage}
      />

      <Section labelledBy="group-companies-title" tone="muted">
        <SectionHeading id="group-companies-title" eyebrow="SANİFOAM GRUBU" title="Farklı uzmanlıklar, tek bir çatı." />
        <ul className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {groupCompanies.map((company) => {
            const self = company.badge === "Bu site";
            return (
              <li
                key={company.id}
                className={cx(
                  "group/company flex flex-col overflow-hidden rounded-sm border bg-surface shadow-sm transition-colors motion-reduce:transition-none",
                  self ? "border-primary ring-1 ring-primary" : "border-border hover:border-primary",
                )}
              >
                <div className="relative h-44 overflow-hidden bg-foreground">
                  <Image
                    src={company.image.src}
                    alt={company.image.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover opacity-90 transition-transform duration-500 group-hover/company:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
                  />
                  <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-overlay/55 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex min-h-12 items-center rounded-sm border-l-2 border-primary bg-surface/95 px-4 py-2">
                    {company.logo ? (
                      <Image
                        src={company.logo.src}
                        alt={company.name}
                        width={company.logo.width}
                        height={company.logo.height}
                        sizes="128px"
                        className="h-6 w-auto max-w-32 object-contain object-left"
                      />
                    ) : (
                      <span className="text-lg font-bold tracking-tight text-foreground">{company.name}</span>
                    )}
                  </div>
                  {company.badge ? (
                    <span className="absolute top-4 right-4 rounded-sm bg-primary px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-primary-foreground">
                      {company.badge.toLocaleUpperCase("tr")}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-7">
                  <h2 className="text-xl font-semibold leading-snug">{company.name}</h2>
                  <p className="mt-3 flex-1 text-base leading-7 text-muted-foreground">{company.description}</p>
                  <div className="mt-6 border-t border-border pt-3">
                    {self ? (
                      <Link href="/urunler" className={actionClass}>
                        Ürünlerimizi inceleyin <span aria-hidden="true">↗</span>
                      </Link>
                    ) : company.url ? (
                      <a href={company.url} target="_blank" rel="noopener noreferrer" className={actionClass}>
                        Web sitesini ziyaret edin <span aria-hidden="true">↗</span>
                        <span className="sr-only">(yeni sekmede açılır)</span>
                      </a>
                    ) : (
                      <span className="inline-flex min-h-11 items-center text-sm font-semibold tracking-wide text-subtle-foreground">
                        Sanifoam grup şirketi
                      </span>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      <CtaSection
        id="group-contact-title"
        eyebrow="BİRLİKTE ÇALIŞALIM"
        title="İhtiyacınıza uygun çözümü konuşalım."
        text="Ürün ihtiyaçlarınız ve kurumsal iş birliği olanakları için ekibimizle iletişime geçin."
        action={{ href: "/iletisim", label: "İletişime geçin" }}
      />

      <JsonLd data={breadcrumbJsonLd(crumbs, site.url, PATH)} />
    </>
  );
}
