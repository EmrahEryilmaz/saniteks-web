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
import { intlLocales, localizePath } from "@/i18n/config";
import { pageMetadata } from "@/i18n/metadata";
import { getLocale, getT } from "@/i18n/server";
import type { Translate } from "@/i18n/translate";
import { contactMessages } from "@/lib/contact-validation";
import { site } from "@/lib/site";

const path = "/iletisim";

function pageText(t: Translate) {
  return {
    title: t("İletişim"),
    description: t(
      "Saniteks iletişim bilgilerine ulaşın. Ürünler, satış ve iş birliği sorularınız için telefon veya e-posta üzerinden bizimle iletişime geçin.",
    ),
  };
}

function heroImage(t: Translate): HeroImage {
  return {
    src: "/images/corporate/textile-production-environment.webp",
    alt: t("Tekstil üretim ortamında malzeme ruloları ve üretim ekipmanları"),
    width: 1920,
    height: 1080,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  const { title, description } = pageText(t);
  const image = heroImage(t);
  return pageMetadata({
    title,
    description,
    path,
    image: { url: image.src, alt: image.alt, width: image.width, height: image.height },
  });
}

const contactLinkClass = `${textLinkClass} mt-2 inline-flex min-h-11 max-w-full items-center`;

export default async function ContactPage() {
  const t = await getT();
  const locale = await getLocale();
  const { title, description } = pageText(t);
  const crumbs: Crumb[] = [{ label: t("Ana Sayfa"), href: "/" }, { label: title }];
  const pageUrl = `${site.url}${localizePath(path, locale)}`;
  const contactPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: `${title} | Saniteks`,
    description,
    inLanguage: intlLocales[locale],
    isPartOf: { "@id": `${site.url}/#website` },
    about: { "@id": `${site.url}/#organization` },
    mainEntity: { "@id": `${site.url}/#organization` },
  };
  const privacy = contactPrivacyNotice(t);
  const messages = contactMessages(t);

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow={t("BİRLİKTE KONUŞALIM")}
        title={title}
        lead={t("Ürünlerimiz, iş birliği olanakları ve genel sorularınız için bizimle iletişime geçin.")}
        image={heroImage(t)}
      />
      <section className={sectionClass} aria-label={t("İletişim bilgileri ve form")}>
        <div className={cx(containerClass, "grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16")}>
          <div className="min-w-0 py-2">
            <Eyebrow>{t("İLETİŞİMDE KALALIM")}</Eyebrow>
            <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">{site.name}</h2>
            <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
              {t("Genel bilgi, satış ve insan kaynakları sorularınız için bize ulaşabilirsiniz.")}
            </p>
            <address className="mt-8 not-italic">
              <div className="border-t border-border py-6">
                <p className="text-sm text-muted-foreground">{t("Telefon")}</p>
                <a
                  className={`${contactLinkClass} text-2xl font-semibold tracking-tight wrap-anywhere`}
                  href={site.contact.phoneHref}
                  dir="ltr"
                >
                  {site.contact.phoneDisplay}
                </a>
              </div>
              <div className="border-t border-border py-6">
                <p className="text-sm text-muted-foreground">{t("E-posta")}</p>
                <a className={`${contactLinkClass} text-xl font-semibold wrap-anywhere`} href={`mailto:${site.contact.email}`}>
                  {site.contact.email}
                </a>
              </div>
              <div className="border-y border-border py-6">
                <h3 className="text-lg font-semibold">{t("Adresimiz")}</h3>
                <p className="mt-3 max-w-md text-base leading-8 text-muted-foreground wrap-anywhere">{site.contact.address}</p>
              </div>
            </address>
          </div>
          <Suspense fallback={<ContactForm messages={messages} privacy={privacy} />}>
            <PrefilledContactForm messages={messages} privacy={privacy} />
          </Suspense>
        </div>
      </section>
      <JsonLd data={[breadcrumbJsonLd(crumbs, site.url, path, locale), contactPageJsonLd]} />
    </>
  );
}
