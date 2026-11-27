import type { Metadata } from "next";
import Image from "next/image";
import { corporateHeroImage, groupFoundedYear, locations, mission, tradeName, vision } from "@/data/corporate";
import { localized } from "@/i18n/data";
import { Link } from "@/i18n/Link";
import { getLocale, getT } from "@/i18n/server";
import { site } from "@/lib/site";
import { CorporateValuesSection, ProductionApproachSection, ResponsibleApproachSection } from "@/components/corporate/AboutSections";
import { CorporateHero } from "@/components/corporate/CorporateHero";
import { CorporateIcon } from "@/components/corporate/CorporateIcon";
import { corporateMetadata } from "@/components/corporate/pageMetadata";
import { withElements } from "@/components/corporate/withElements";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { CtaSection } from "@/components/ui/CtaSection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx, focusStyle, headingLgClass } from "@/components/ui/styles";

const PATH = "/kurumsal/hakkinda";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return corporateMetadata({
    title: t("Hakkında"),
    description: t(
      "Sanifoam grup şirketi Saniteks'i tanıyın: temizlik süngerleri, bezleri ve ovucu ürünlerde üretim, Hendek tesisimiz, misyonumuz ve vizyonumuz.",
    ),
    path: PATH,
    image: await localized(corporateHeroImage),
  });
}

/** Years of group experience, rounded down to the nearest five ("35+"). */
function experienceLabel() {
  const years = new Date().getFullYear() - groupFoundedYear;
  return `${Math.floor(years / 5) * 5}+`;
}

const strong = "font-semibold text-foreground";

export default async function AboutPage() {
  const t = await getT();
  const locale = await getLocale();
  const [heroImage, localeLocations, localeMission, localeVision] = await Promise.all([
    localized(corporateHeroImage),
    localized(locations),
    localized(mission),
    localized(vision),
  ]);
  const crumbs: Crumb[] = [
    { label: t("Ana Sayfa"), href: "/" },
    { label: t("Kurumsal"), href: PATH },
    { label: t("Hakkında") },
  ];
  const year = groupFoundedYear;

  return (
    <>
      <CorporateHero
        crumbs={crumbs}
        current={PATH}
        title={t("Hayatı kolaylaştıran\nküçük detaylar.")}
        subtitle={t(
          "Sanifoam grubunun {year}'dan bu yana süren deneyimiyle; temizlik süngerleri, bezleri ve ovucu ürünlerde günlük yaşama eşlik eden çözümler üretiyoruz.",
          { year },
        )}
        image={heroImage}
      />

      {/* Tarihçe & gelişim */}
      <Section labelledBy="history-title" containerClassName="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-2 h-[420px] overflow-hidden rounded-sm border border-border md:h-[500px] lg:order-1">
          <Image
            src="/images/corporate/kece-uretim-hatti.webp"
            alt={t("Yeşil ovucu keçenin silindirler arasından geçtiği üretim hattı, arkada keçe ruloları")}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-overlay/60 via-overlay/10 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 rounded-sm border-s-4 border-primary bg-surface/95 p-5 md:inset-x-8 md:bottom-8 md:p-6">
            <p className="text-4xl font-bold tabular-nums text-link">{experienceLabel()}</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{t("yıllık grup deneyimi")}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t("Sanifoam grubu, {year}'dan bu yana", { year })}</p>
          </div>
        </div>

        <div className="order-1 min-w-0 lg:order-2">
          <Eyebrow>{t("TARİHÇEMİZ & GELİŞİMİMİZ")}</Eyebrow>
          <h2 id="history-title" className={cx(headingLgClass, "whitespace-pre-line")}>
            {t("Grup deneyimi,\ntemizliğe odaklı uzmanlık.")}
          </h2>
          <div className="mt-6 space-y-5 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            <p>
              {t(
                "{tradeName}, {year} yılında İstanbul'da kurulan Sanifoam grubunun şirketlerinden biridir. Sanifoam; otomotiv, beyaz eşya, endüstriyel yalıtım ve temizlik sektörlerindeki müşterileri için sünger, non-woven ve türevi ürünler üretir.",
                { tradeName, year },
              )}
            </p>
            <p>
              {t(
                "Saniteks, kendi adını taşıyan markanın yanı sıra STAR ve Blues markalarıyla bulaşık, banyo ve oto süngerleri üretir; mikrofiber temizlik bezleri, ovucu keçeler ve çelik ovma telleriyle evsel ve endüstriyel kullanıma yönelik geniş bir temizlik ürün gamı sunar.",
              )}
            </p>
            <p>
              {withElements(
                t(
                  "Hendek'teki üretim tesisimizde {products} ile bu ürünlerde kullanılan {materials} üretiyoruz. Ürün ve paket seçeneklerini ihtiyaca göre birlikte değerlendiriyoruz.",
                ),
                {
                  products: (
                    <strong className={strong}>
                      {t("temizlik süngerleri, temizlik bezleri, ovucu materyaller ve özel formlu süngerler")}
                    </strong>
                  ),
                  materials: <strong className={strong}>{t("rulo ve tabaka hammaddeleri")}</strong>,
                },
              )}
            </p>
          </div>
        </div>
      </Section>

      <ProductionApproachSection />

      {/* Üretim ağı */}
      <Section labelledBy="network-title" tone="dark" className="relative overflow-hidden">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading id="network-title" eyebrow={t("ÜRETİM AĞI")} title={t("Yönetimden üretime, iki noktada.")} onDark />
          <p className="max-w-lg text-base leading-7 text-primary-foreground/75">
            {t(
              "Yönetim merkezimiz İstanbul'da; üretimimiz Sakarya Hendek'teki tesisimizde. Sanifoam grubunun Türkiye ve Avrupa'daki altyapısının bir parçasıyız.",
            )}
          </p>
        </div>
        <ul className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {localeLocations.map((loc) => (
            <li
              key={loc.id}
              className="flex flex-col rounded-sm border border-primary-foreground/20 bg-primary-foreground/5 p-6 transition-colors hover:border-primary motion-reduce:transition-none"
            >
              <span className="flex size-12 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                <CorporateIcon name={loc.icon} />
              </span>
              <h3 className="mt-5 text-xl font-semibold leading-snug">{loc.name}</h3>
              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-accent">
                <CorporateIcon name="pin" className="size-4" />
                {loc.district} / {loc.city}
              </p>
              <p className="mt-3 text-sm leading-6 text-primary-foreground/70">{loc.role}</p>
            </li>
          ))}
          <li className="flex flex-col rounded-sm border border-primary-foreground/20 bg-primary-foreground/5 p-6">
            <span className="flex size-12 items-center justify-center rounded-sm border border-primary-foreground/30 text-primary-foreground">
              <CorporateIcon name="group" />
            </span>
            <h3 className="mt-5 text-xl font-semibold leading-snug">{t("Sanifoam Grubu")}</h3>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-accent">
              <CorporateIcon name="pin" className="size-4" />
              {t("Türkiye ve Avrupa")}
            </p>
            <p className="mt-3 text-sm leading-6 text-primary-foreground/70">{t("Grup şirketleri ve üretim altyapısı")}</p>
          </li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
          {[
            { href: "/kurumsal/uretim-tesisleri", label: t("Üretim tesislerini inceleyin") },
            { href: "/kurumsal/grup-sirketleri", label: t("Grup şirketlerini tanıyın") },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cx(
                "inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-primary-foreground underline-offset-4 hover:underline",
                focusStyle,
              )}
            >
              {l.label}
              <span aria-hidden="true" className="inline-block rtl:-scale-x-100">
                ↗
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Misyon & vizyon */}
      <Section labelledBy="mission-vision-title" tone="muted">
        <SectionHeading id="mission-vision-title" eyebrow={t("MİSYON VE VİZYON")} title={t("Misyonumuz ve vizyonumuz.")} />
        <div className="mt-9 grid gap-6 lg:grid-cols-2">
          {[
            { data: localeMission, icon: "mission" as const, dark: false },
            { data: localeVision, icon: "vision" as const, dark: true },
          ].map(({ data, icon, dark }) => (
            <article
              key={data.title}
              className={cx(
                "relative overflow-hidden rounded-sm border p-8 shadow-sm md:p-10",
                dark ? "border-foreground bg-foreground text-primary-foreground" : "border-border bg-surface",
              )}
            >
              <span
                aria-hidden="true"
                className={cx("absolute -top-8 -end-8 size-32 rounded-es-full", dark ? "bg-primary-foreground/5" : "bg-surface-strong")}
              />
              <div className="relative">
                <span
                  className={cx(
                    "flex size-14 items-center justify-center rounded-sm",
                    dark ? "border border-primary-foreground/25 text-accent" : "bg-primary text-primary-foreground",
                  )}
                >
                  <CorporateIcon name={icon} className="size-7" />
                </span>
                <h3 className="mt-8 text-3xl font-semibold tracking-[-0.02em]">{data.title}</h3>
                <p className="mt-4 text-xl font-semibold leading-snug">{data.statement}</p>
                <ul className={cx("mt-6 space-y-4 text-base leading-7 md:text-lg md:leading-8", dark ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  {data.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CorporateIcon name="check" className={cx("mt-1 size-6 shrink-0", dark ? "text-accent" : "text-primary")} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <CorporateValuesSection />

      <ResponsibleApproachSection />

      <CtaSection
        id="corporate-contact-title"
        eyebrow={t("BİRLİKTE ÇALIŞALIM")}
        title={t("İhtiyacınıza uygun çözümü konuşalım.")}
        text={t("Ürün ihtiyaçlarınız ve kurumsal iş birliği olanakları için ekibimizle iletişime geçin.")}
        action={{ href: "/iletisim", label: t("İletişime geçin") }}
      />

      <JsonLd data={breadcrumbJsonLd(crumbs, site.url, PATH, locale)} />
    </>
  );
}
