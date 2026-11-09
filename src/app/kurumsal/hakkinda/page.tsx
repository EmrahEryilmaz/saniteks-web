import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { corporateHeroImage, groupFoundedYear, locations, mission, tradeName, vision } from "@/data/corporate";
import { site } from "@/lib/site";
import { CorporateValuesSection, ProductionApproachSection, ResponsibleApproachSection } from "@/components/corporate/AboutSections";
import { CorporateHero } from "@/components/corporate/CorporateHero";
import { CorporateIcon } from "@/components/corporate/CorporateIcon";
import { corporateMetadata } from "@/components/corporate/pageMetadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { CtaSection } from "@/components/ui/CtaSection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cx, focusStyle, headingLgClass } from "@/components/ui/styles";

const PATH = "/kurumsal/hakkinda";
const DESCRIPTION =
  "Sanifoam grup şirketi Saniteks'i tanıyın: temizlik süngerleri, bezleri ve ovucu ürünlerde üretim, Hendek tesisimiz, misyonumuz ve vizyonumuz.";

export const metadata: Metadata = corporateMetadata({
  title: "Hakkında",
  description: DESCRIPTION,
  path: PATH,
  image: corporateHeroImage,
});

const crumbs: Crumb[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Kurumsal", href: PATH },
  { label: "Hakkında" },
];

/** Years of group experience, rounded down to the nearest five ("35+"). */
function experienceLabel() {
  const years = new Date().getFullYear() - groupFoundedYear;
  return `${Math.floor(years / 5) * 5}+`;
}

const strong = "font-semibold text-foreground";

export default function AboutPage() {
  return (
    <>
      <CorporateHero
        crumbs={crumbs}
        current={PATH}
        title={"Hayatı kolaylaştıran\nküçük detaylar."}
        subtitle={`Sanifoam grubunun ${groupFoundedYear}'dan bu yana süren deneyimiyle; temizlik süngerleri, bezleri ve ovucu ürünlerde günlük yaşama eşlik eden çözümler üretiyoruz.`}
        image={corporateHeroImage}
      />

      {/* Tarihçe & gelişim */}
      <Section labelledBy="history-title" containerClassName="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-2 h-[420px] overflow-hidden rounded-sm border border-border md:h-[500px] lg:order-1">
          <Image
            src="/images/corporate/nonwoven-production-process.webp"
            alt="Nonwoven tekstil malzemesinin üretim sürecinden yakın görünüm"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-linear-to-t from-overlay/60 via-overlay/10 to-transparent" />
          <div className="absolute inset-x-5 bottom-5 rounded-sm border-l-4 border-primary bg-surface/95 p-5 md:inset-x-8 md:bottom-8 md:p-6">
            <p className="text-4xl font-bold tabular-nums text-link">{experienceLabel()}</p>
            <p className="mt-1 text-lg font-semibold text-foreground">yıllık grup deneyimi</p>
            <p className="mt-1 text-sm text-muted-foreground">Sanifoam grubu, {groupFoundedYear}&apos;dan bu yana</p>
          </div>
        </div>

        <div className="order-1 min-w-0 lg:order-2">
          <Eyebrow>TARİHÇEMİZ &amp; GELİŞİMİMİZ</Eyebrow>
          <h2 id="history-title" className={cx(headingLgClass, "whitespace-pre-line")}>
            {"Grup deneyimi,\ntemizliğe odaklı uzmanlık."}
          </h2>
          <div className="mt-6 space-y-5 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            <p>
              {tradeName}, {groupFoundedYear} yılında İstanbul&apos;da kurulan Sanifoam grubunun şirketlerinden biridir. Sanifoam;
              otomotiv, beyaz eşya, endüstriyel yalıtım ve temizlik sektörlerindeki müşterileri için sünger, non-woven ve türevi
              ürünler üretir.
            </p>
            <p>
              Saniteks, kendi adını taşıyan markanın yanı sıra STAR ve Blues markalarıyla bulaşık, banyo ve oto süngerleri üretir;
              mikrofiber temizlik bezleri, ovucu keçeler ve çelik ovma telleriyle evsel ve endüstriyel kullanıma yönelik geniş bir
              temizlik ürün gamı sunar.
            </p>
            <p>
              Hendek&apos;teki üretim tesisimizde{" "}
              <strong className={strong}>temizlik süngerleri, temizlik bezleri, ovucu materyaller ve özel formlu süngerler</strong> ile
              bu ürünlerde kullanılan <strong className={strong}>rulo ve tabaka hammaddeleri</strong> üretiyoruz. Ürün ve paket
              seçeneklerini ihtiyaca göre birlikte değerlendiriyoruz.
            </p>
          </div>
        </div>
      </Section>

      <ProductionApproachSection />

      {/* Üretim ağı */}
      <Section labelledBy="network-title" tone="dark" className="relative overflow-hidden">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <SectionHeading id="network-title" eyebrow="ÜRETİM AĞI" title="Yönetimden üretime, iki noktada." onDark />
          <p className="max-w-lg text-base leading-7 text-primary-foreground/75">
            Yönetim merkezimiz İstanbul&apos;da; üretimimiz Sakarya Hendek&apos;teki tesisimizde. Sanifoam grubunun Türkiye ve
            Avrupa&apos;daki altyapısının bir parçasıyız.
          </p>
        </div>
        <ul className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => (
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
            <h3 className="mt-5 text-xl font-semibold leading-snug">Sanifoam Grubu</h3>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-accent">
              <CorporateIcon name="pin" className="size-4" />
              Türkiye ve Avrupa
            </p>
            <p className="mt-3 text-sm leading-6 text-primary-foreground/70">Grup şirketleri ve üretim altyapısı</p>
          </li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
          {[
            { href: "/kurumsal/uretim-tesisleri", label: "Üretim tesislerini inceleyin" },
            { href: "/kurumsal/grup-sirketleri", label: "Grup şirketlerini tanıyın" },
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
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Misyon & vizyon */}
      <Section labelledBy="mission-vision-title" tone="muted">
        <SectionHeading id="mission-vision-title" eyebrow="MİSYON VE VİZYON" title="Misyonumuz ve vizyonumuz." />
        <div className="mt-9 grid gap-6 lg:grid-cols-2">
          {[
            { data: mission, icon: "mission" as const, dark: false },
            { data: vision, icon: "vision" as const, dark: true },
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
                className={cx("absolute -top-8 -right-8 size-32 rounded-bl-full", dark ? "bg-primary-foreground/5" : "bg-surface-strong")}
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
        eyebrow="BİRLİKTE ÇALIŞALIM"
        title="İhtiyacınıza uygun çözümü konuşalım."
        text="Ürün ihtiyaçlarınız ve kurumsal iş birliği olanakları için ekibimizle iletişime geçin."
        action={{ href: "/iletisim", label: "İletişime geçin" }}
      />

      <JsonLd data={breadcrumbJsonLd(crumbs, site.url, PATH)} />
    </>
  );
}
