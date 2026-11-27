import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { jobPostingJsonLd } from "@/components/careers/jobPostingJsonLd";
import { OpenPositions } from "@/components/careers/OpenPositions";
import { PrefilledApplicationForm } from "@/components/careers/PrefilledApplicationForm";
import { ContactBand } from "@/components/corporate/ContactBand";
import { LineIcon, type LineIconName } from "@/components/corporate/LineIcon";
import { NumberedSteps, type Step } from "@/components/corporate/NumberedSteps";
import { corporateMetadata, type PageImage } from "@/components/corporate/pageMetadata";
import { withElements } from "@/components/corporate/withElements";
import { Reveal } from "@/components/home/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { headingLgClass, textLinkClass } from "@/components/ui/styles";
import { openPositions } from "@/data/careers";
import { localized } from "@/i18n/data";
import { Link } from "@/i18n/Link";
import { getLocale, getT } from "@/i18n/server";
import type { Translate } from "@/i18n/translate";
import { applyMessages, positionOptionsFor } from "@/lib/apply-validation";
import { site } from "@/lib/site";

const PATH = "/insan-kaynaklari";
const APPLICATION_TITLE_ID = "careers-application-title";

/** Contact page with the "İnsan Kaynakları" subject preselected (the ?konu= value is the Turkish subject key). */
const HR_CONTACT_HREF = "/iletisim?konu=İnsan%20Kaynakları";

function heroImage(t: Translate): PageImage {
  return {
    src: "/images/corporate/textile-production-environment.webp",
    alt: t("Tekstil üretim ortamında nonwoven malzeme ruloları ve üretim ekipmanları"),
    width: 1920,
    height: 1080,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return corporateMetadata({
    title: t("İnsan Kaynakları"),
    description: t(
      "Saniteks’in çalışma yaklaşımını ve çalışma kültürünü keşfedin. Açık pozisyonlar ve genel başvuru olanakları hakkında bilgi edinin.",
    ),
    path: PATH,
    image: heroImage(t),
  });
}

const cultureValues = (t: Translate): { icon: LineIconName; title: string; text: string }[] => [
  {
    icon: "people",
    title: t("İş birliği"),
    text: t("Bilgiyi paylaşmak, birbirini dinlemek ve ortak amaçlara birlikte katkıda bulunmak."),
  },
  {
    icon: "shieldCare",
    title: t("Sorumluluk"),
    text: t("Yapılan işin bütün sürece ve çevresine etkisini gözeterek hareket etmek."),
  },
  {
    icon: "growth",
    title: t("Sürekli gelişim"),
    text: t("Yeni bilgiler öğrenmeye, deneyimlerden yararlanmaya ve iyileştirme fikirlerine açık olmak."),
  },
  {
    icon: "shieldCheck",
    title: t("Güven"),
    text: t("Açık ve tutarlı iletişimle karşılıklı anlayışa dayanan çalışma ilişkilerine önem vermek."),
  },
  {
    icon: "star",
    title: t("Kalite bilinci"),
    text: t("Üretimin her aşamasında dikkatli çalışmak ve yapılan işe özen göstermek."),
  },
  {
    icon: "people",
    title: t("Eşitlik ve saygı"),
    text: t("Farklı deneyimlere ve görüşlere saygıyla yaklaşmak, herkesin katkısını önemsemek."),
  },
];

const recruitmentSteps = (t: Translate): Step[] => [
  { title: t("Başvuru"), text: t("Başvuru bilgilerinin ilgili kanal üzerinden paylaşılması.") },
  { title: t("Ön değerlendirme"), text: t("Deneyim ve yetkinliklerin pozisyonun ihtiyaçlarıyla birlikte ele alınması.") },
  { title: t("Görüşme"), text: t("Uygun görülen adaylarla karşılıklı beklentiler üzerine görüşülmesi.") },
  { title: t("Değerlendirme"), text: t("Görüşme ve başvuru bilgilerinin birlikte değerlendirilmesi.") },
  { title: t("Geri bildirim"), text: t("Değerlendirme durumuna ilişkin bilgilendirmenin paylaşılması.") },
];

export default async function InsanKaynaklariPage() {
  const t = await getT();
  const locale = await getLocale();
  const crumbs: Crumb[] = [{ label: t("Ana Sayfa"), href: "/" }, { label: t("İnsan Kaynakları") }];
  const positions = await localized(openPositions);
  const messages = applyMessages(t);
  const positionOptions = positionOptionsFor(positions, t);
  const jobPostings = await Promise.all(openPositions.map((position) => jobPostingJsonLd(position, PATH)));

  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow={t("BİRLİKTE ÜRETMEK")}
        title={t("İnsan Kaynakları")}
        lead={t("Saniteks’te çalışma yaklaşımını, birlikte üretmenin değerini ve kariyer olanaklarına ilişkin bilgileri keşfedin.")}
        image={heroImage(t)}
      />

      <Section
        labelledBy="careers-working-title"
        containerClassName="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
      >
        <div className="overflow-hidden rounded-sm border border-border">
          <Image
            src="/images/careers/textile-teamwork.webp"
            alt={t("Tekstil numunelerini birlikte inceleyen üç çalışanın temsili ekip çalışması sahnesi")}
            width={1600}
            height={1200}
            sizes="(min-width: 1440px) 590px, (min-width: 1024px) 42vw, 100vw"
            className="aspect-4/3 h-auto w-full object-cover object-center"
          />
        </div>
        <Reveal>
          <Eyebrow>{t("ORTAK EMEK")}</Eyebrow>
          <h2 id="careers-working-title" className={headingLgClass}>
            {t("Saniteks’te Çalışmak")}
          </h2>
          <div className="mt-6 max-w-xl space-y-4 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            <p>
              {t(
                "Birlikte üretmek, farklı deneyimlerin ortak bir amaç etrafında buluşmasıyla anlam kazanır. Saniteks’te insan odaklı çalışma yaklaşımını; karşılıklı saygı, iletişim ve yapılan işe gösterilen özen üzerinden ele alıyoruz.",
              )}
            </p>
            <p>
              {t(
                "Üretimin her aşamasında bilgi paylaşımını ve sorumluluk bilincini önemseyen bir bakış açısı, günlük çalışmaya yön verir. Birbirini dinlemek ve deneyimlerden öğrenmek bu yaklaşımın temel parçalarıdır.",
              )}
            </p>
          </div>
        </Reveal>
      </Section>

      <Section labelledBy="careers-culture-title" tone="muted">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <div>
            <Eyebrow>{t("YOL GÖSTEREN DEĞERLER")}</Eyebrow>
            <h2 id="careers-culture-title" className={headingLgClass}>
              {t("Çalışma Kültürümüz")}
            </h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-muted-foreground">
            {t("Birlikte çalışmaya ve üretmeye bakışımızı, birbirini tamamlayan bu değerlerle ifade ediyoruz.")}
          </p>
        </div>
        <ul className="mt-9 grid md:grid-cols-2 lg:grid-cols-3">
          {cultureValues(t).map((value) => (
            <li
              key={value.title}
              className="min-w-0 border-t border-border py-7 md:px-7 md:odd:ps-0 md:even:border-s lg:border-s lg:nth-[3n+1]:border-s-0 lg:nth-[3n+1]:ps-0 lg:nth-[3n+2]:ps-7 lg:nth-[3n+3]:ps-7"
            >
              <Reveal>
                <span className="inline-flex text-link">
                  <LineIcon name={value.icon} />
                </span>
                <h3 className="mt-5 text-xl font-semibold leading-snug lg:text-2xl">{value.title}</h3>
                <p className="mt-3 max-w-sm text-base leading-7 text-muted-foreground">{value.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        labelledBy="careers-development-title"
        containerClassName="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16"
      >
        <div>
          <Reveal>
            <Eyebrow>{t("DENEYİMDEN GELECEĞE")}</Eyebrow>
            <h2 id="careers-development-title" className={headingLgClass}>
              {t("Gelişim Yaklaşımı")}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              {t(
                "Mesleki ve kişisel gelişimi, yeni bilgilere açık olmak ve günlük deneyimleri değerlendirmekle birlikte düşünüyoruz. Soru sormak, gözlemlemek ve farklı bakış açılarını dinlemek bu yaklaşımı besler.",
              )}
            </p>
          </Reveal>
          <div className="mt-8 border-s-2 border-primary bg-foreground p-6 text-primary-foreground md:p-8">
            <h3 className="text-xl font-semibold lg:text-2xl">{t("Birlikte öğrenmek")}</h3>
            <p className="mt-4 max-w-xl text-base leading-7 text-primary-foreground/85">
              {t(
                "Deneyim paylaşımı, yapılan işi daha iyi anlamaya yardımcı olur. Birlikte düşünmek ve öğrenilenleri çalışma sürecine taşımak, gelişime açık bir bakışın parçasıdır.",
              )}
            </p>
          </div>
        </div>
        <div className="overflow-hidden rounded-sm border border-border">
          <Image
            src="/images/careers/employee-knowledge-sharing.webp"
            alt={t("Tekstil numuneleri üzerinden bilgi paylaşan iki çalışanın temsili gelişim sahnesi")}
            width={1600}
            height={1200}
            sizes="(min-width: 1440px) 560px, (min-width: 1024px) 40vw, 100vw"
            className="aspect-4/3 h-auto w-full object-cover object-center"
          />
        </div>
      </Section>

      <Section labelledBy="careers-recruitment-title" className="border-t border-border">
        <Reveal>
          <Eyebrow>{t("GENEL SÜREÇ AKIŞI")}</Eyebrow>
          <h2 id="careers-recruitment-title" className={headingLgClass}>
            {t("İşe Alım Süreci")}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            {t(
              "Aşağıdaki akış, işe alımda karşılaşılabilecek genel aşamaları gösterir. İzlenecek adımlar pozisyona ve değerlendirme ihtiyacına göre değişebilir.",
            )}
          </p>
        </Reveal>
        <NumberedSteps steps={recruitmentSteps(t)} className="mt-10 grid lg:grid-cols-5" />
      </Section>

      <Section labelledBy="careers-positions-title" tone="muted">
        <Reveal>
          <Eyebrow>{t("KARİYER OLANAKLARI")}</Eyebrow>
          <h2 id="careers-positions-title" className={headingLgClass}>
            {t("Açık Pozisyonlar")}
          </h2>
        </Reveal>
        <OpenPositions positions={positions} pagePath={PATH} />
      </Section>

      <Section
        id="basvuru"
        labelledBy={APPLICATION_TITLE_ID}
        containerClassName="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
      >
        <Reveal>
          <Eyebrow>{t("BAŞVURU FORMU")}</Eyebrow>
          <h2 id={APPLICATION_TITLE_ID} className={headingLgClass}>
            {t("Başvurunuzu iletin.")}
          </h2>
          <div className="mt-5 max-w-xl space-y-4 text-base leading-7 text-muted-foreground">
            <p>
              {t(
                "Açık pozisyonlardan birine ya da genel başvuru olarak başvurabilirsiniz. Formu gönderdiğinizde bilgileriniz ve CV dosyanız e-posta ile ilgili ekibimize iletilir; dosyanız web sitesinde saklanmaz.",
              )}
            </p>
            <p>
              {withElements(
                t(
                  "Başvurunuzu CV dosyanızla birlikte {email} adresine e-posta ile de gönderebilirsiniz. Başvuru süreciyle ilgili sorularınızı iletişim formu üzerinden de iletebilirsiniz.",
                ),
                {
                  email: (
                    <a className={`${textLinkClass} wrap-anywhere`} href={`mailto:${site.contact.hrEmail}`}>
                      {site.contact.hrEmail}
                    </a>
                  ),
                },
              )}
            </p>
          </div>
          <Link className={`${textLinkClass} mt-5 inline-flex min-h-12 items-center gap-4 font-semibold`} href={HR_CONTACT_HREF}>
            {t("Başvuru hakkında bilgi alın")}
            <span aria-hidden="true" className="inline-block rtl:-scale-x-100">
              ↗
            </span>
          </Link>
        </Reveal>
        <Suspense
          fallback={<ApplicationForm labelledBy={APPLICATION_TITLE_ID} messages={messages} positionOptions={positionOptions} />}
        >
          <PrefilledApplicationForm labelledBy={APPLICATION_TITLE_ID} messages={messages} positionOptions={positionOptions} />
        </Suspense>
      </Section>

      <ContactBand
        id="careers-contact-title"
        eyebrow={t("BİRLİKTE KONUŞALIM")}
        title={t("İnsan kaynakları hakkında konuşalım.")}
        text={t("Çalışma yaklaşımımız ve kariyer olanakları hakkındaki sorularınız için bize ulaşın.")}
        action={{ href: HR_CONTACT_HREF, label: t("İletişime geçin") }}
      />

      <JsonLd data={breadcrumbJsonLd(crumbs, site.url, PATH, locale)} />
      {jobPostings.length > 0 ? <JsonLd data={jobPostings} /> : null}
    </>
  );
}
