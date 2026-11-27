import type { Metadata } from "next";
import Image from "next/image";
import { capabilities } from "@/data/capabilities";
import { intlLocales } from "@/i18n/config";
import { localized } from "@/i18n/data";
import { getLocale, getT } from "@/i18n/server";
import { site } from "@/lib/site";
import { CorporateHero } from "@/components/corporate/CorporateHero";
import { corporateMetadata } from "@/components/corporate/pageMetadata";
import { inquiryHref } from "@/components/products/format";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { ArrowLink, ButtonLink } from "@/components/ui/ButtonLink";
import { CtaSection } from "@/components/ui/CtaSection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { cx, headingHomeClass, headingLgClass } from "@/components/ui/styles";

const PATH = "/kabiliyetler";

async function getHeroImage() {
  const t = await getT();
  return {
    src: "/images/products/hammadde/rulo-nonwoven-kece.webp",
    alt: t("Sarı, mavi, pembe ve gri non-woven temizlik bezi ruloları ile yeşil, mor, fuşya ve kenevir renginde ovucu keçe ruloları"),
    width: 1672,
    height: 941,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return corporateMetadata({
    title: t("Kabiliyetler"),
    description: t(
      "Saniteks üretim kabiliyetleri: non-woven keçe üretimi, non-woven temizlik bezi üretimi, laminasyon, sünger kesim ve şekillendirme, konverting ve paketleme.",
    ),
    path: PATH,
    image: await getHeroImage(),
  });
}

export default async function CapabilitiesPage() {
  const t = await getT();
  const locale = await getLocale();
  const [heroImage, items] = await Promise.all([getHeroImage(), localized(capabilities)]);
  const crumbs: Crumb[] = [{ label: t("Ana Sayfa"), href: "/" }, { label: t("Kabiliyetler") }];

  return (
    <>
      <CorporateHero
        crumbs={crumbs}
        current={PATH}
        align="center"
        eyebrow={t("KABİLİYETLER")}
        title={t("Üretim Kabiliyetlerimiz")}
        subtitle={t(
          "Hammaddeden ambalajlı ürüne: non-woven keçe ve temizlik bezi üretimi, laminasyon, kesim, konverting ve paketleme adımlarını kendi üretimimizde bir araya getiriyoruz.",
        )}
        image={heroImage}
        tabs={items.map((c) => ({ href: `#${c.id}`, label: c.label }))}
        tabsLabel={t("Kabiliyetler")}
      />

      <Section labelledBy="capabilities-title">
        <h2 id="capabilities-title" className="sr-only">
          {t("Üretim kabiliyetleri")}
        </h2>
        <div className="flex flex-col">
          {items.map((item, index) => (
            <article
              key={item.id}
              id={item.id}
              aria-labelledby={`${item.id}-title`}
              className={cx(
                "grid scroll-mt-28 items-center gap-8 py-12 first:pt-0 last:pb-0 md:grid-cols-2 lg:gap-16 md:py-16",
                index > 0 && "border-t border-border",
              )}
            >
              <div className={cx("min-w-0", index % 2 === 1 && "md:order-2")}>
                <Eyebrow variant="line" index={String(index + 1).padStart(2, "0")}>
                  {item.label.toLocaleUpperCase(intlLocales[locale])}
                </Eyebrow>
                <h3 id={`${item.id}-title`} className={headingLgClass}>
                  {item.title}
                </h3>
                <div className="mt-5 max-w-xl space-y-4 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                  {item.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label={t("{title} — öne çıkanlar", { title: item.title })}>
                  {item.facts.map((f) => (
                    <li key={f} className="rounded-sm border border-border border-s-2 border-s-primary bg-surface-muted px-3 py-1.5 text-sm font-semibold tabular-nums">
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <p className="text-xs font-semibold tracking-widest text-subtle-foreground">{t("İLGİLİ ÜRÜNLER")}</p>
                  <ul className="mt-1 flex flex-wrap gap-x-6">
                    {item.related.map((r) => (
                      <li key={r.href}>
                        <ArrowLink href={r.href}>{r.label}</ArrowLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className={cx("relative overflow-hidden rounded-sm border border-border", index % 2 === 1 && "md:order-1")}>
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.width}
                  height={item.image.height}
                  sizes="(min-width: 1440px) 620px, (min-width: 768px) 45vw, 100vw"
                  className="aspect-4/3 h-auto w-full object-cover"
                />
                <span
                  aria-hidden="true"
                  className="absolute end-4 bottom-4 flex size-12 items-center justify-center rounded-sm bg-primary text-xl font-bold tabular-nums text-primary-foreground"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section labelledBy="capabilities-quality-title" tone="dark" containerClassName="grid items-end gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
        <div>
          <Eyebrow variant="dark">{t("KALİTE")}</Eyebrow>
          <h2 id="capabilities-quality-title" className={headingHomeClass}>
            {t("Her adımda aynı özen.")}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-primary-foreground/85">
            {t(
              "Üretimin her aşamasını sürekli iyileştirme ve sıfır hata ilkeleriyle yürütüyoruz. Kalite, çevre ve iş sağlığı ve güvenliği politikalarımızı inceleyin.",
            )}
          </p>
        </div>
        <ButtonLink href="/kalite/politikalarimiz" variant="inverse">
          {t("Politikalarımız")}
        </ButtonLink>
      </Section>

      <CtaSection
        id="capabilities-contact-title"
        eyebrow={t("BİRLİKTE ÇALIŞALIM")}
        title={t("Ürün veya hammadde ihtiyacınızı konuşalım.")}
        text={t("Özel ölçü, form, ambalaj ya da hammadde talepleriniz için ekibimizle iletişime geçin.")}
        action={{ href: inquiryHref(t("Üretim kabiliyetleri")), label: t("İletişime geçin") }}
      />

      <JsonLd data={breadcrumbJsonLd(crumbs, site.url, PATH, locale)} />
    </>
  );
}
