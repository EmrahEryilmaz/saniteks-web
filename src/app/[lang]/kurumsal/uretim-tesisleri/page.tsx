import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { corporateHeroImage, locations, mapsHref } from "@/data/corporate";
import { localized } from "@/i18n/data";
import { getLocale, getT } from "@/i18n/server";
import { site } from "@/lib/site";
import { CorporateHero } from "@/components/corporate/CorporateHero";
import { CorporateIcon, type CorporateIconName } from "@/components/corporate/CorporateIcon";
import { corporateMetadata } from "@/components/corporate/pageMetadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { CtaSection } from "@/components/ui/CtaSection";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx, focusStyle } from "@/components/ui/styles";

const PATH = "/kurumsal/uretim-tesisleri";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return corporateMetadata({
    title: t("Üretim Tesisleri"),
    description: t("Saniteks'in İstanbul'daki merkez ofisi ve Sakarya Hendek'teki üretim tesisi: adres, iletişim ve üretim bilgileri."),
    path: PATH,
    image: await localized(corporateHeroImage),
  });
}

const linkClass = cx("text-link underline-offset-4 hover:text-link-hover hover:underline", focusStyle);

function InfoBlock({ icon, title, children }: { icon: CorporateIconName; title: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-2 text-sm font-semibold tracking-wide text-link">
        <CorporateIcon name={icon} className="size-5" />
        {title}
      </p>
      <div className="text-base leading-7 text-muted-foreground">{children}</div>
    </div>
  );
}

export default async function PlantsPage() {
  const t = await getT();
  const locale = await getLocale();
  const [heroImage, localeLocations] = await Promise.all([localized(corporateHeroImage), localized(locations)]);
  const crumbs: Crumb[] = [
    { label: t("Ana Sayfa"), href: "/" },
    { label: t("Kurumsal"), href: "/kurumsal/hakkinda" },
    { label: t("Üretim Tesisleri") },
  ];

  return (
    <>
      <CorporateHero
        crumbs={crumbs}
        current={PATH}
        align="center"
        title={t("Üretim Tesislerimiz")}
        subtitle={t("Yönetim merkezimiz İstanbul'da; üretimimiz Sakarya Hendek'teki tesisimizde yapılır.")}
        image={heroImage}
      />

      <Section labelledBy="plants-title" tone="muted">
        <SectionHeading id="plants-title" eyebrow={t("TESİSLERİMİZ")} title={t("Üretim ve yönetim noktalarımız.")} />
        <div className="mt-9 flex flex-col gap-10 lg:gap-12">
          {localeLocations.map((loc, index) => (
            <article
              key={loc.id}
              aria-labelledby={`${loc.id}-title`}
              className={cx("flex flex-col items-stretch gap-6 md:flex-row lg:gap-10", index % 2 === 1 && "md:flex-row-reverse")}
            >
              {/* Görsel */}
              <div className="relative min-h-[280px] overflow-hidden rounded-sm border border-border bg-foreground md:min-h-[400px] md:w-1/2">
                {loc.image ? (
                  <Image src={loc.image.src} alt={loc.image.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                ) : (
                  <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_right,var(--primary-foreground)_1px,transparent_1px),linear-gradient(to_bottom,var(--primary-foreground)_1px,transparent_1px)] bg-size-[48px_48px] opacity-[0.06]" />
                )}
                <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-overlay/80 via-overlay/20 to-transparent" />
                {!loc.image ? (
                  <span aria-hidden="true" className="absolute top-6 start-6 flex size-14 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                    <CorporateIcon name={loc.icon} className="size-7" />
                  </span>
                ) : null}
                <div className="absolute inset-x-6 bottom-6 text-primary-foreground">
                  <p className="mb-2 flex items-center gap-2 text-sm font-semibold">
                    <CorporateIcon name="pin" className="size-5 text-accent" />
                    {loc.district} / {loc.city}
                  </p>
                  <h2 id={`${loc.id}-title`} className="text-3xl font-semibold tracking-[-0.02em]">
                    {loc.name}
                  </h2>
                </div>
              </div>

              {/* Bilgiler */}
              <div className="flex flex-col justify-center rounded-sm border border-border bg-surface p-6 shadow-sm md:w-1/2 md:p-8">
                <dl className="mb-8 grid grid-cols-2 gap-6">
                  <div>
                    <dt className="mb-1 text-sm text-muted-foreground">{t("Görev")}</dt>
                    <dd className="text-xl font-semibold">{loc.role}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="mb-1 text-sm text-muted-foreground">{t("E-posta")}</dt>
                    <dd className="text-base font-semibold break-words">
                      <a className={linkClass} href={`mailto:${loc.email}`}>
                        {loc.email}
                      </a>
                    </dd>
                  </div>
                </dl>
                <div className="space-y-6">
                  {loc.products ? (
                    <InfoBlock icon="products" title={t("Ürünler")}>
                      <p>{loc.products}</p>
                    </InfoBlock>
                  ) : null}
                  {loc.production ? (
                    <InfoBlock icon="production" title={t("Üretim")}>
                      <p>{loc.production}</p>
                    </InfoBlock>
                  ) : null}
                  <InfoBlock icon="pin" title={t("İletişim bilgileri")}>
                    <address className="not-italic">
                      <p className="font-semibold text-foreground">{loc.address}</p>
                      <p className="mt-1">
                        <a className={cx(linkClass, "inline-flex min-h-11 items-center gap-2 text-sm font-semibold")} href={mapsHref(locations[index].address)} target="_blank" rel="noopener noreferrer">
                          {t("Haritada göster")}{" "}
                          <span aria-hidden="true" className="inline-block rtl:-scale-x-100">
                            ↗
                          </span>
                          <span className="sr-only">{t("(yeni sekmede açılır)")}</span>
                        </a>
                      </p>
                      <p>
                        {t("Tel:")}{" "}
                        <a className={linkClass} href={loc.phoneHref}>
                          {loc.phoneDisplay}
                        </a>
                      </p>
                    </address>
                  </InfoBlock>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <CtaSection
        id="plants-contact-title"
        eyebrow={t("BİLGİ ALIN")}
        title={t("Üretim ve tedarik hakkında konuşalım.")}
        text={t("Ürünler, hammadde tedariki ve iş birliği olanakları için ekibimizle iletişime geçin.")}
        action={{ href: "/iletisim", label: t("İletişime geçin") }}
      />

      <JsonLd data={breadcrumbJsonLd(crumbs, site.url, PATH, locale)} />
    </>
  );
}
