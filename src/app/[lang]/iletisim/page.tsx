import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import { PrefilledContactForm } from "@/components/contact/PrefilledContactForm";
import { contactPrivacyNotice } from "@/components/contact/privacy";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero, type HeroImage } from "@/components/ui/PageHero";
import { containerClass, cx, sectionClass, textLinkClass } from "@/components/ui/styles";
import { site } from "@/lib/site";

const path = "/iletisim";
const title = "İletişim";
const description =
  "Saniteks iletişim bilgilerine ulaşın. Ürünler, satış ve iş birliği sorularınız için telefon veya e-posta üzerinden bizimle iletişime geçin.";

const heroImage: HeroImage = {
  src: "/images/corporate/textile-production-environment.webp",
  alt: "Tekstil üretim ortamında malzeme ruloları ve üretim ekipmanları",
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

const crumbs: Crumb[] = [{ label: "Ana Sayfa", href: "/" }, { label: title }];

const contactPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${site.url}${path}#webpage`,
  url: `${site.url}${path}`,
  name: `${title} | Saniteks`,
  description,
  inLanguage: "tr-TR",
  isPartOf: { "@id": `${site.url}/#website` },
  about: { "@id": `${site.url}/#organization` },
  mainEntity: { "@id": `${site.url}/#organization` },
};

const contactLinkClass = `${textLinkClass} mt-2 inline-flex min-h-11 max-w-full items-center`;

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="BİRLİKTE KONUŞALIM"
        title={title}
        lead="Ürünlerimiz, iş birliği olanakları ve genel sorularınız için bizimle iletişime geçin."
        image={heroImage}
      />
      <section className={sectionClass} aria-label="İletişim bilgileri ve form">
        <div className={cx(containerClass, "grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16")}>
          <div className="min-w-0 py-2">
            <Eyebrow>İLETİŞİMDE KALALIM</Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">{site.name}</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              Genel bilgi, satış ve insan kaynakları sorularınız için bize ulaşabilirsiniz.
            </p>
            <address className="mt-8 not-italic">
              <div className="border-t border-border py-6">
                <p className="text-sm text-muted-foreground">Telefon</p>
                <a className={`${contactLinkClass} text-2xl font-semibold tracking-tight wrap-anywhere`} href={site.contact.phoneHref}>
                  {site.contact.phoneDisplay}
                </a>
              </div>
              <div className="border-t border-border py-6">
                <p className="text-sm text-muted-foreground">E-posta</p>
                <a className={`${contactLinkClass} text-xl font-semibold wrap-anywhere`} href={`mailto:${site.contact.email}`}>
                  {site.contact.email}
                </a>
              </div>
              <div className="border-y border-border py-6">
                <h3 className="text-lg font-semibold">Adresimiz</h3>
                <p className="mt-3 max-w-md text-base leading-8 text-muted-foreground wrap-anywhere">{site.contact.address}</p>
              </div>
            </address>
          </div>
          <Suspense fallback={<ContactForm privacy={contactPrivacyNotice} />}>
            <PrefilledContactForm privacy={contactPrivacyNotice} />
          </Suspense>
        </div>
      </section>
      <JsonLd data={[breadcrumbJsonLd(crumbs, site.url, path), contactPageJsonLd]} />
    </>
  );
}
