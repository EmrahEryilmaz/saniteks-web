import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatTrDate, getQualityPage, qualityHref, qualityPages, validCertificates, type QualityBlock } from "@/data/quality";
import { site } from "@/lib/site";
import { CorporateHero } from "@/components/corporate/CorporateHero";
import { CorporateIcon } from "@/components/corporate/CorporateIcon";
import { corporateMetadata } from "@/components/corporate/pageMetadata";
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
  alt: "Eldivenli ellerle nonwoven tekstil numunesinin incelenmesi",
  width: 1600,
  height: 1200,
};

const tabs = qualityPages.map((p) => ({ href: qualityHref(p.slug), label: p.label }));

export function generateStaticParams() {
  return qualityPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getQualityPage((await params).slug);
  if (!page) return {};
  return corporateMetadata({ title: page.title, description: page.description, path: qualityHref(page.slug), image: heroImage });
}

export default async function QualityPage({ params }: Props) {
  const page = getQualityPage((await params).slug);
  if (!page) notFound();

  const path = qualityHref(page.slug);
  const crumbs: Crumb[] = [
    { label: "Ana Sayfa", href: "/" },
    { label: "Kalite", href: qualityHref(qualityPages[0].slug) },
    { label: page.title },
  ];

  return (
    <>
      <CorporateHero
        crumbs={crumbs}
        current={path}
        align="center"
        eyebrow="KALİTE"
        tabs={tabs}
        tabsLabel="Kalite sayfaları"
        title={page.title}
        subtitle={page.subtitle}
        image={heroImage}
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
      {page.slug === "kalite-belgelerimiz" ? <CertificatesSection /> : null}

      <CtaSection
        id="quality-contact-title"
        eyebrow="BİLGİ ALIN"
        title="Kalite ve belgeler hakkında konuşalım."
        text="Kalite süreçlerimiz, belgelerimiz veya ürünlerimizle ilgili sorularınız için ekibimizle iletişime geçin."
        action={{ href: "/iletisim", label: "İletişime geçin" }}
      />

      <JsonLd data={breadcrumbJsonLd(crumbs, site.url, path)} />
    </>
  );
}

/** In-page links to the policies of a merged page ("Kalite · Çevre · İSG"). */
function BlockNav({ blocks }: { blocks: QualityBlock[] }) {
  return (
    <nav aria-label="Bu sayfadaki politikalar" className="border-b border-border bg-surface">
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
      <aside aria-labelledby={`${block.id}-principles`} className="self-start rounded-sm border border-border border-l-4 border-l-primary bg-surface-muted p-6 md:p-8">
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
function QualityApproachSection() {
  return (
    <Section labelledBy="quality-approach-title" tone="strong" containerClassName="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
      <div>
        <Eyebrow>KALİTE YAKLAŞIMI</Eyebrow>
        <h2 id="quality-approach-title" className={headingLgClass}>
          Dikkat, disiplin ve tutarlılık.
        </h2>
        <div className="mt-6 max-w-xl space-y-4 text-base leading-7 text-muted-foreground">
          <p>Kalite yaklaşımımız, beklentiyi doğru anlamakla başlar; malzeme ve süreç kararlarının kullanım amacıyla uyumunu gözetir.</p>
          <p>Kontrol adımlarını düzenli yürütmek ve gelişim alanlarını değerlendirmek, tutarlı sonuçlar için çalışma biçimimizin parçasıdır.</p>
        </div>
      </div>
      <div className="overflow-hidden rounded-sm border border-border">
        <Image
          src="/images/corporate/nonwoven-production-process.webp"
          alt="Nonwoven tekstil malzemesinin üretim sürecinden yakın görünüm"
          width={1600}
          height={1200}
          sizes="(min-width: 1440px) 590px, (min-width: 1024px) 42vw, 100vw"
          className="aspect-4/3 h-auto w-full object-cover"
        />
      </div>
    </Section>
  );
}

function SustainabilityLinkSection() {
  return (
    <Section labelledBy="environment-link-title" tone="dark" containerClassName="grid items-end gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
      <div>
        <Eyebrow variant="dark">SÜRDÜRÜLEBİLİRLİK</Eyebrow>
        <h2 id="environment-link-title" className="max-w-[24ch] text-3xl font-semibold leading-[1.2] tracking-[-0.02em] lg:text-4xl">
          Yarına, bugünden bir özen.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-primary-foreground/85">
          Enerji, su, atık ve sorumlu üretim alanlarındaki yaklaşımımızı sürdürülebilirlik sayfamızda inceleyebilirsiniz.
        </p>
      </div>
      <ButtonLink href="/surdurulebilirlik" variant="inverse">
        Sürdürülebilirlik yaklaşımımız
      </ButtonLink>
    </Section>
  );
}

function ComplaintHowToSection() {
  const channels = [
    { label: "İletişim formu", value: "Konu olarak “Diğer”i seçin", href: `/iletisim?konu=${encodeURIComponent("Diğer")}` },
    { label: "E-posta", value: site.contact.email, href: `mailto:${site.contact.email}` },
    { label: "Telefon", value: site.contact.phoneDisplay, href: site.contact.phoneHref },
  ];
  const tips = [
    "Ürün adı ve varsa ürün kodu (ambalaj üzerinde yer alır)",
    "Satın alma yeri ve tarihi",
    "Yaşanan sorunun kısa açıklaması",
    "Varsa ürün ve ambalaja ait fotoğraflar",
  ];
  return (
    <Section labelledBy="complaint-howto-title" className="border-t border-border">
      <SectionHeading
        id="complaint-howto-title"
        eyebrow="BİLDİRİM"
        title="Şikâyetinizi nasıl iletebilirsiniz?"
        lead="Aşağıdaki kanallardan bize ulaşabilirsiniz. Bildiriminizde şu bilgileri paylaşmanız değerlendirmeyi kolaylaştırır."
      />
      <div className="mt-9 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ul className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {channels.map((c) => (
            <li key={c.label} className="rounded-sm border border-border bg-surface p-5">
              <p className="text-sm text-muted-foreground">{c.label}</p>
              <ArrowLink href={c.href} className="mt-1 break-words">
                {c.value}
              </ArrowLink>
            </li>
          ))}
        </ul>
        <div className="rounded-sm border border-border bg-surface p-6 md:p-8">
          <h3 className="text-xl font-semibold">Bildiriminizde yer alması faydalı bilgiler</h3>
          <ol className="mt-5 space-y-3">
            {tips.map((t, i) => (
              <li key={t} className="flex items-start gap-4">
                <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary text-sm font-semibold text-primary-foreground tabular-nums">
                  {i + 1}
                </span>
                <span className="pt-1 text-base leading-7 text-muted-foreground">{t}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

function CertificatesSection() {
  const certs = validCertificates();
  return (
    <Section labelledBy="certificates-title" className="border-t border-border">
      <SectionHeading id="certificates-title" eyebrow="BELGELER" title="Geçerli belgelerimiz." />
      {certs.length ? (
        <ul className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certs.map((c) => (
            <li key={c.number} className="flex flex-col rounded-sm border border-border border-t-4 border-t-primary bg-surface p-6 shadow-sm">
              <p className="text-2xl font-semibold tracking-[-0.02em]">{c.standard}</p>
              <p className="mt-1 font-semibold text-link">{c.title}</p>
              <dl className="mt-5 space-y-2 text-sm">
                {[
                  ["Belge no", c.number],
                  ["Kapsam", c.scope],
                  ["Geçerlilik", `${formatTrDate(c.validFrom)} – ${formatTrDate(c.validUntil)}`],
                  ["Belgelendiren", c.issuer],
                ].map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[7rem_minmax(0,1fr)] gap-3">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="font-semibold break-words">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-auto pt-5">
                <ArrowLink href={c.file} external>
                  Belgeyi görüntüle (PDF)
                </ArrowLink>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className={cx("mt-9 max-w-3xl rounded-sm border border-border border-l-4 border-l-primary bg-surface p-6 md:p-8")}>
          <p className="text-lg font-semibold">Güncel belgelerimiz bu sayfada yayımlanacaktır.</p>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Yönetim sistemi belgelerimizle ilgili talepleriniz için bizimle iletişime geçebilirsiniz.
          </p>
          <ArrowLink href={`/iletisim?konu=${encodeURIComponent("Genel Bilgi")}`} className="mt-4">
            Belge talep edin
          </ArrowLink>
        </div>
      )}
    </Section>
  );
}
