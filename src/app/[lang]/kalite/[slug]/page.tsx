import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatDate, qualityHref, qualityPages, validCertificates, type QualityBlock, type QualityPage as QualityPageData } from "@/data/quality";
import { intlLocales, type Locale } from "@/i18n/config";
import { getLocale, localized } from "@/i18n/data";
import { pageMetadata } from "@/i18n/metadata";
import { getT } from "@/i18n/server";
import { site } from "@/lib/site";
import { CorporateHero } from "@/components/corporate/CorporateHero";
import { CorporateIcon } from "@/components/corporate/CorporateIcon";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { ArrowLink, ButtonLink } from "@/components/ui/ButtonLink";
import { CtaSection } from "@/components/ui/CtaSection";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { containerClass, cx, focusStyle, headingLgClass } from "@/components/ui/styles";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
/** Re-evaluate certificate validity daily without a redeploy. */
export const revalidate = 86400;

const heroImage = {
  src: "/images/corporate/textile-quality-inspection.webp",
  width: 1600,
  height: 1200,
};

export function generateStaticParams() {
  return qualityPages.map((p) => ({ slug: p.slug }));
}

/** Quality pages in the current language. */
async function getPages(): Promise<QualityPageData[]> {
  return localized(qualityPages);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = (await getPages()).find((p) => p.slug === slug);
  if (!page) return {};
  const t = await getT();
  return pageMetadata({
    title: page.title,
    description: page.description,
    path: qualityHref(page.slug),
    image: { url: heroImage.src, alt: t("Eldivenli ellerle nonwoven tekstil numunesinin incelenmesi"), width: heroImage.width, height: heroImage.height },
  });
}

export default async function QualityPage({ params }: Props) {
  const { slug } = await params;
  const pages = await getPages();
  const page = pages.find((p) => p.slug === slug);
  if (!page) notFound();

  const t = await getT();
  const locale = await getLocale();
  const path = qualityHref(page.slug);
  const crumbs: Crumb[] = [
    { label: t("Ana Sayfa"), href: "/" },
    { label: t("Kalite"), href: qualityHref(pages[0].slug) },
    { label: page.title },
  ];
  const tabs = pages.map((p) => ({ href: qualityHref(p.slug), label: p.label }));

  return (
    <>
      <CorporateHero
        crumbs={crumbs}
        current={path}
        align="center"
        eyebrow={t("KALİTE")}
        tabs={tabs}
        tabsLabel={t("Kalite sayfaları")}
        title={page.title}
        subtitle={page.subtitle}
        image={{ src: heroImage.src, alt: t("Eldivenli ellerle nonwoven tekstil numunesinin incelenmesi") }}
      />

      {page.blocks.length > 1 ? <BlockNav blocks={page.blocks} /> : null}
      {page.blocks.map((block, i) => (
        <div key={block.id}>
          <PolicySection block={block} divided={i > 0} />
          {block.id === "kalite-politikamiz" ? <QualityApproachSection /> : null}
          {block.id === "cevre-politikamiz" ? <SustainabilityLinkSection /> : null}
        </div>
      ))}
      {page.slug === "sikayet-prosedurleri" ? <ComplaintHowToSection /> : null}
      {page.slug === "kalite-belgelerimiz" ? <CertificatesSection locale={locale} /> : null}

      <CtaSection
        id="quality-contact-title"
        eyebrow={t("BİLGİ ALIN")}
        title={t("Kalite ve belgeler hakkında konuşalım.")}
        text={t("Kalite süreçlerimiz, belgelerimiz veya ürünlerimizle ilgili sorularınız için ekibimizle iletişime geçin.")}
        action={{ href: "/iletisim", label: t("İletişime geçin") }}
      />

      <JsonLd data={breadcrumbJsonLd(crumbs, site.url, path, locale)} />
    </>
  );
}

/** In-page links to the policies of a merged page ("Kalite · Çevre · İSG"). */
async function BlockNav({ blocks }: { blocks: QualityBlock[] }) {
  const t = await getT();
  return (
    <nav aria-label={t("Bu sayfadaki politikalar")} className="border-b border-border bg-surface">
      <ul className={cx(containerClass, "flex flex-wrap gap-2 py-4")}>
        {blocks.map((b) => (
          <li key={b.id}>
            <a
              href={`#${b.id}`}
              className={cx(
                "inline-flex min-h-11 items-center rounded-full border border-border bg-surface px-4 text-sm font-semibold text-foreground hover:border-primary hover:text-link",
                focusStyle,
              )}
            >
              {b.navLabel ?? b.heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Policy text + principles card — sanifoam.com.tr ContentPage structure in Saniteks styling. */
function PolicySection({ block, divided }: { block: QualityBlock; divided?: boolean }) {
  const titleId = `${block.id}-title`;
  return (
    <Section
      id={block.id}
      labelledBy={titleId}
      className={divided ? "border-t border-border" : undefined}
      containerClassName="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16"
    >
      <div className="min-w-0">
        <Eyebrow>{block.eyebrow}</Eyebrow>
        <h2 id={titleId} className={headingLgClass}>
          {block.heading}
        </h2>
        <div className="mt-6 max-w-2xl space-y-5 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
          {block.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
      <aside aria-labelledby={`${block.id}-principles`} className="self-start rounded-sm border border-border border-s-4 border-s-primary bg-surface-muted p-6 md:p-8">
        <h3 id={`${block.id}-principles`} className="text-xl font-semibold">
          {block.principlesTitle}
        </h3>
        <ul className="mt-5 divide-y divide-border">
          {block.principles.map((item) => (
            <li key={item} className="flex min-h-12 items-center gap-3 py-3 text-base font-semibold">
              <CorporateIcon name="check" className="size-5 shrink-0 text-primary" />
              {item}
            </li>
          ))}
        </ul>
      </aside>
    </Section>
  );
}

/** "Kalite yaklaşımı" from the earlier Kurumsal page (live Saniteks copy). */
async function QualityApproachSection() {
  const t = await getT();
  return (
    <Section labelledBy="quality-approach-title" tone="strong" containerClassName="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
      <div>
        <Eyebrow>{t("KALİTE YAKLAŞIMI")}</Eyebrow>
        <h2 id="quality-approach-title" className={headingLgClass}>
          {t("Dikkat, disiplin ve tutarlılık.")}
        </h2>
        <div className="mt-6 max-w-xl space-y-4 text-base leading-7 text-muted-foreground">
          <p>{t("Kalite yaklaşımımız, beklentiyi doğru anlamakla başlar; malzeme ve süreç kararlarının kullanım amacıyla uyumunu gözetir.")}</p>
          <p>{t("Kontrol adımlarını düzenli yürütmek ve gelişim alanlarını değerlendirmek, tutarlı sonuçlar için çalışma biçimimizin parçasıdır.")}</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-sm border border-border">
        <Image
          src="/images/corporate/nonwoven-production-process.webp"
          alt={t("Nonwoven tekstil malzemesinin üretim sürecinden yakın görünüm")}
          width={1600}
          height={1200}
          sizes="(min-width: 1440px) 590px, (min-width: 1024px) 42vw, 100vw"
          className="aspect-4/3 h-auto w-full object-cover"
        />
      </div>
    </Section>
  );
}

async function SustainabilityLinkSection() {
  const t = await getT();
  return (
    <Section labelledBy="environment-link-title" tone="dark" containerClassName="grid items-end gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
      <div>
        <Eyebrow variant="dark">{t("SÜRDÜRÜLEBİLİRLİK")}</Eyebrow>
        <h2 id="environment-link-title" className="max-w-[24ch] text-3xl font-semibold leading-[1.2] tracking-[-0.02em] lg:text-4xl">
          {t("Yarına, bugünden bir özen.")}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-primary-foreground/85">
          {t("Enerji, su, atık ve sorumlu üretim alanlarındaki yaklaşımımızı sürdürülebilirlik sayfamızda inceleyebilirsiniz.")}
        </p>
      </div>
      <ButtonLink href="/surdurulebilirlik" variant="inverse">
        {t("Sürdürülebilirlik yaklaşımımız")}
      </ButtonLink>
    </Section>
  );
}

async function ComplaintHowToSection() {
  const t = await getT();
  const channels = [
    // The ?konu= value is the contact form's topic key and stays Turkish.
    { label: t("İletişim formu"), value: t("Konu olarak “Diğer”i seçin"), href: `/iletisim?konu=${encodeURIComponent("Diğer")}` },
    { label: t("E-posta"), value: site.contact.email, href: `mailto:${site.contact.email}` },
    { label: t("Telefon"), value: site.contact.phoneDisplay, href: site.contact.phoneHref },
  ];
  const tips = [
    t("Ürün adı ve varsa ürün kodu (ambalaj üzerinde yer alır)"),
    t("Satın alma yeri ve tarihi"),
    t("Yaşanan sorunun kısa açıklaması"),
    t("Varsa ürün ve ambalaja ait fotoğraflar"),
  ];
  return (
    <Section labelledBy="complaint-howto-title" className="border-t border-border">
      <SectionHeading
        id="complaint-howto-title"
        eyebrow={t("BİLDİRİM")}
        title={t("Şikâyetinizi nasıl iletebilirsiniz?")}
        lead={t("Aşağıdaki kanallardan bize ulaşabilirsiniz. Bildiriminizde şu bilgileri paylaşmanız değerlendirmeyi kolaylaştırır.")}
      />
      <div className="mt-9 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {channels.map((c) => (
            <li key={c.href} className="rounded-sm border border-border bg-surface p-5">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <ArrowLink href={c.href} className="mt-1 break-words">
                {c.value}
              </ArrowLink>
            </li>
          ))}
        </ul>
        <div className="rounded-sm border border-border bg-surface p-6 md:p-8">
          <h3 className="text-xl font-semibold">{t("Bildiriminizde yer alması faydalı bilgiler")}</h3>
          <ol className="mt-5 space-y-3">
            {tips.map((tip, i) => (
              <li key={tip} className="flex items-start gap-4">
                <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary text-sm font-semibold text-primary-foreground tabular-nums">
                  {i + 1}
                </span>
                <span className="pt-1 text-base leading-7 text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

async function CertificatesSection({ locale }: { locale: Locale }) {
  const t = await getT();
  const certs = await localized(validCertificates());
  const date = (iso: string) => formatDate(iso, intlLocales[locale]);
  return (
    <Section labelledBy="certificates-title" className="border-t border-border">
      <SectionHeading id="certificates-title" eyebrow={t("BELGELER")} title={t("Geçerli belgelerimiz.")} />
      {certs.length ? (
        <ul className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certs.map((c) => (
            <li key={c.number} className="flex flex-col rounded-sm border border-border border-t-4 border-t-primary bg-surface p-6 shadow-sm">
              <p className="text-2xl font-semibold tracking-[-0.02em]">{c.standard}</p>
              <p className="mt-1 font-semibold text-link">{c.title}</p>
              <dl className="mt-5 space-y-2 text-sm">
                {[
                  [t("Belge no"), c.number],
                  [t("Kapsam"), c.scope],
                  [t("Geçerlilik"), `${date(c.validFrom)} – ${date(c.validUntil)}`],
                  [t("Belgelendiren"), c.issuer],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-semibold break-words">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-auto pt-5">
                <ArrowLink href={c.file} external>
                  {t("Belgeyi görüntüle (PDF)")}
                </ArrowLink>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className={cx("mt-9 max-w-3xl rounded-sm border border-border border-s-4 border-s-primary bg-surface p-6 md:p-8")}>
          <p className="text-lg font-semibold">{t("Güncel belgelerimiz bu sayfada yayımlanacaktır.")}</p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {t("Yönetim sistemi belgelerimizle ilgili talepleriniz için bizimle iletişime geçebilirsiniz.")}
          </p>
          <ArrowLink href={`/iletisim?konu=${encodeURIComponent("Genel Bilgi")}`} className="mt-4">
            {t("Belge talep edin")}
          </ArrowLink>
        </div>
      )}
    </Section>
  );
}
