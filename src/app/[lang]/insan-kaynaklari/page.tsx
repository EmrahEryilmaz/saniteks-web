import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { ApplicationForm } from "@/components/careers/ApplicationForm";
import { jobPostingJsonLd } from "@/components/careers/jobPostingJsonLd";
import { OpenPositions } from "@/components/careers/OpenPositions";
import { PrefilledApplicationForm } from "@/components/careers/PrefilledApplicationForm";
import { ContactBand } from "@/components/corporate/ContactBand";
import { LineIcon, type LineIconName } from "@/components/corporate/LineIcon";
import { NumberedSteps, type Step } from "@/components/corporate/NumberedSteps";
import { corporateMetadata, type PageImage } from "@/components/corporate/pageMetadata";
import { Reveal } from "@/components/home/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PageHero } from "@/components/ui/PageHero";
import { Section } from "@/components/ui/Section";
import { headingLgClass, textLinkClass } from "@/components/ui/styles";
import { openPositions } from "@/data/careers";
import { site } from "@/lib/site";

const PATH = "/insan-kaynaklari";
const APPLICATION_TITLE_ID = "careers-application-title";

/** Contact page with the "İnsan Kaynakları" subject preselected. */
const HR_CONTACT_HREF = "/iletisim?konu=İnsan%20Kaynakları";

const crumbs: Crumb[] = [{ label: "Ana Sayfa", href: "/" }, { label: "İnsan Kaynakları" }];

const heroImage: PageImage = {
  src: "/images/corporate/textile-production-environment.webp",
  alt: "Tekstil üretim ortamında nonwoven malzeme ruloları ve üretim ekipmanları",
  width: 1920,
  height: 1080,
};

export const metadata: Metadata = corporateMetadata({
  title: "İnsan Kaynakları",
  description:
    "Saniteks’in çalışma yaklaşımını ve çalışma kültürünü keşfedin. Açık pozisyonlar ve genel başvuru olanakları hakkında bilgi edinin.",
  path: PATH,
  image: heroImage,
});

const cultureValues: { icon: LineIconName; title: string; text: string }[] = [
  {
    icon: "people",
    title: "İş birliği",
    text: "Bilgiyi paylaşmak, birbirini dinlemek ve ortak amaçlara birlikte katkıda bulunmak.",
  },
  {
    icon: "shieldCare",
    title: "Sorumluluk",
    text: "Yapılan işin bütün sürece ve çevresine etkisini gözeterek hareket etmek.",
  },
  {
    icon: "growth",
    title: "Sürekli gelişim",
    text: "Yeni bilgiler öğrenmeye, deneyimlerden yararlanmaya ve iyileştirme fikirlerine açık olmak.",
  },
  {
    icon: "shieldCheck",
    title: "Güven",
    text: "Açık ve tutarlı iletişimle karşılıklı anlayışa dayanan çalışma ilişkilerine önem vermek.",
  },
  {
    icon: "star",
    title: "Kalite bilinci",
    text: "Üretimin her aşamasında dikkatli çalışmak ve yapılan işe özen göstermek.",
  },
  {
    icon: "people",
    title: "Eşitlik ve saygı",
    text: "Farklı deneyimlere ve görüşlere saygıyla yaklaşmak, herkesin katkısını önemsemek.",
  },
];

const recruitmentSteps: Step[] = [
  { title: "Başvuru", text: "Başvuru bilgilerinin ilgili kanal üzerinden paylaşılması." },
  { title: "Ön değerlendirme", text: "Deneyim ve yetkinliklerin pozisyonun ihtiyaçlarıyla birlikte ele alınması." },
  { title: "Görüşme", text: "Uygun görülen adaylarla karşılıklı beklentiler üzerine görüşülmesi." },
  { title: "Değerlendirme", text: "Görüşme ve başvuru bilgilerinin birlikte değerlendirilmesi." },
  { title: "Geri bildirim", text: "Değerlendirme durumuna ilişkin bilgilendirmenin paylaşılması." },
];

export default function InsanKaynaklariPage() {
  return (
    <>
      <PageHero
        crumbs={crumbs}
        eyebrow="BİRLİKTE ÜRETMEK"
        title="İnsan Kaynakları"
        lead="Saniteks’te çalışma yaklaşımını, birlikte üretmenin değerini ve kariyer olanaklarına ilişkin bilgileri keşfedin."
        image={heroImage}
      />

      <Section
        labelledBy="careers-working-title"
        containerClassName="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
      >
        <div className="overflow-hidden rounded-sm border border-border">
          <Image
            src="/images/careers/textile-teamwork.webp"
            alt="Tekstil numunelerini birlikte inceleyen üç çalışanın temsili ekip çalışması sahnesi"
            width={1600}
            height={1200}
            sizes="(min-width: 1440px) 590px, (min-width: 1024px) 42vw, 100vw"
            className="aspect-4/3 h-auto w-full object-cover object-center"
          />
        </div>
        <Reveal>
          <Eyebrow>ORTAK EMEK</Eyebrow>
          <h2 id="careers-working-title" className={headingLgClass}>
            Saniteks’te Çalışmak
          </h2>
          <div className="mt-6 max-w-xl space-y-4 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            <p>
              Birlikte üretmek, farklı deneyimlerin ortak bir amaç etrafında buluşmasıyla anlam kazanır. Saniteks’te insan odaklı
              çalışma yaklaşımını; karşılıklı saygı, iletişim ve yapılan işe gösterilen özen üzerinden ele alıyoruz.
            </p>
            <p>
              Üretimin her aşamasında bilgi paylaşımını ve sorumluluk bilincini önemseyen bir bakış açısı, günlük çalışmaya yön verir.
              Birbirini dinlemek ve deneyimlerden öğrenmek bu yaklaşımın temel parçalarıdır.
            </p>
          </div>
        </Reveal>
      </Section>

      <Section labelledBy="careers-culture-title" tone="muted">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <div>
            <Eyebrow>YOL GÖSTEREN DEĞERLER</Eyebrow>
            <h2 id="careers-culture-title" className={headingLgClass}>
              Çalışma Kültürümüz
            </h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-muted-foreground">
            Birlikte çalışmaya ve üretmeye bakışımızı, birbirini tamamlayan bu değerlerle ifade ediyoruz.
          </p>
        </div>
        <ul className="mt-9 grid md:grid-cols-2 lg:grid-cols-3">
          {cultureValues.map((value) => (
            <li
              key={value.title}
              className="min-w-0 border-t border-border py-7 md:px-7 md:odd:pl-0 md:even:border-l lg:border-l lg:nth-[3n+1]:border-l-0 lg:nth-[3n+1]:pl-0 lg:nth-[3n+2]:pl-7 lg:nth-[3n+3]:pl-7"
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
            <Eyebrow>DENEYİMDEN GELECEĞE</Eyebrow>
            <h2 id="careers-development-title" className={headingLgClass}>
              Gelişim Yaklaşımı
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              Mesleki ve kişisel gelişimi, yeni bilgilere açık olmak ve günlük deneyimleri değerlendirmekle birlikte düşünüyoruz. Soru
              sormak, gözlemlemek ve farklı bakış açılarını dinlemek bu yaklaşımı besler.
            </p>
          </Reveal>
          <div className="mt-8 border-l-2 border-primary bg-foreground p-6 text-primary-foreground md:p-8">
            <h3 className="text-xl font-semibold lg:text-2xl">Birlikte öğrenmek</h3>
            <p className="mt-4 max-w-xl text-base leading-7 text-primary-foreground/85">
              Deneyim paylaşımı, yapılan işi daha iyi anlamaya yardımcı olur. Birlikte düşünmek ve öğrenilenleri çalışma sürecine
              taşımak, gelişime açık bir bakışın parçasıdır.
            </p>
          </div>
        </div>
        <div className="overflow-hidden rounded-sm border border-border">
          <Image
            src="/images/careers/employee-knowledge-sharing.webp"
            alt="Tekstil numuneleri üzerinden bilgi paylaşan iki çalışanın temsili gelişim sahnesi"
            width={1600}
            height={1200}
            sizes="(min-width: 1440px) 560px, (min-width: 1024px) 40vw, 100vw"
            className="aspect-4/3 h-auto w-full object-cover object-center"
          />
        </div>
      </Section>

      <Section labelledBy="careers-recruitment-title" className="border-t border-border">
        <Reveal>
          <Eyebrow>GENEL SÜREÇ AKIŞI</Eyebrow>
          <h2 id="careers-recruitment-title" className={headingLgClass}>
            İşe Alım Süreci
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Aşağıdaki akış, işe alımda karşılaşılabilecek genel aşamaları gösterir. İzlenecek adımlar pozisyona ve değerlendirme
            ihtiyacına göre değişebilir.
          </p>
        </Reveal>
        <NumberedSteps steps={recruitmentSteps} className="mt-10 grid lg:grid-cols-5" />
      </Section>

      <Section labelledBy="careers-positions-title" tone="muted">
        <Reveal>
          <Eyebrow>KARİYER OLANAKLARI</Eyebrow>
          <h2 id="careers-positions-title" className={headingLgClass}>
            Açık Pozisyonlar
          </h2>
        </Reveal>
        <OpenPositions positions={openPositions} pagePath={PATH} />
      </Section>

      <Section
        id="basvuru"
        labelledBy={APPLICATION_TITLE_ID}
        containerClassName="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16"
      >
        <Reveal>
          <Eyebrow>BAŞVURU FORMU</Eyebrow>
          <h2 id={APPLICATION_TITLE_ID} className={headingLgClass}>
            Başvurunuzu iletin.
          </h2>
          <div className="mt-5 max-w-xl space-y-4 text-base leading-7 text-muted-foreground">
            <p>
              Açık pozisyonlardan birine ya da genel başvuru olarak başvurabilirsiniz. Formu gönderdiğinizde bilgileriniz ve CV
              dosyanız e-posta ile ilgili ekibimize iletilir; dosyanız web sitesinde saklanmaz.
            </p>
            <p>
              Başvurunuzu CV dosyanızla birlikte{" "}
              <a className={`${textLinkClass} wrap-anywhere`} href={`mailto:${site.contact.hrEmail}`}>
                {site.contact.hrEmail}
              </a>{" "}
              adresine e-posta ile de gönderebilirsiniz. Başvuru süreciyle ilgili sorularınızı iletişim formu üzerinden de
              iletebilirsiniz.
            </p>
          </div>
          <Link className={`${textLinkClass} mt-5 inline-flex min-h-12 items-center gap-4 font-semibold`} href={HR_CONTACT_HREF}>
            Başvuru hakkında bilgi alın
            <span aria-hidden="true">↗</span>
          </Link>
        </Reveal>
        <Suspense fallback={<ApplicationForm labelledBy={APPLICATION_TITLE_ID} />}>
          <PrefilledApplicationForm labelledBy={APPLICATION_TITLE_ID} />
        </Suspense>
      </Section>

      <ContactBand
        id="careers-contact-title"
        eyebrow="BİRLİKTE KONUŞALIM"
        title="İnsan kaynakları hakkında konuşalım."
        text="Çalışma yaklaşımımız ve kariyer olanakları hakkındaki sorularınız için bize ulaşın."
        action={{ href: HR_CONTACT_HREF, label: "İletişime geçin" }}
      />

      <JsonLd data={breadcrumbJsonLd(crumbs, site.url, PATH)} />
      {openPositions.length > 0 ? <JsonLd data={openPositions.map((position) => jobPostingJsonLd(position, PATH))} /> : null}
    </>
  );
}
