import type { Metadata } from "next";
import Image from "next/image";
import { LineIcon, type LineIconName } from "@/components/corporate/LineIcon";
import { NumberedSteps, type Step } from "@/components/corporate/NumberedSteps";
import { corporateMetadata, type PageImage } from "@/components/corporate/pageMetadata";
import { Reveal } from "@/components/home/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { Breadcrumbs, breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { containerClass, cx, headingLgClass } from "@/components/ui/styles";
import { site } from "@/lib/site";

const PATH = "/surdurulebilirlik";

const crumbs: Crumb[] = [{ label: "Ana Sayfa", href: "/" }, { label: "Sürdürülebilirlik" }];

/**
 * Banner of sanifoam.com.tr › Kalite › Çevre Politikamız (supplied by the owner 2026-11-23): its baked-in title was
 * inpainted and the image brightened on the owner's request.
 */
const heroImage: PageImage = {
  src: "/images/sustainability/sanifoam-pet-donusum-acik.webp",
  alt: "Doğaya atılmış PET şişelerden çıkan liflerin beyaz polyester yalıtım rulosuna dönüşümünü gösteren görsel",
  width: 2000,
  height: 460,
};

export const metadata: Metadata = corporateMetadata({
  title: "Sürdürülebilirlik",
  description:
    "Saniteks’in sürdürülebilirlik yaklaşımını; kaynak verimliliği, sorumlu üretim, çevresel ve sosyal sorumluluk öncelikleriyle keşfedin.",
  path: PATH,
  image: heroImage,
});

const priorities: { icon: LineIconName; title: string; text: string }[] = [
  {
    icon: "bolt",
    title: "Enerji Verimliliği",
    text: "Enerji ihtiyacını doğru planlamak ve gereksiz tüketimi azaltabilecek uygulamaları değerlendirmek.",
  },
  {
    icon: "drop",
    title: "Su Yönetimi",
    text: "Suyun değerini gözetmek, kullanım ihtiyacını anlamak ve verimlilik olanaklarını gözden geçirmek.",
  },
  {
    icon: "recycle",
    title: "Atıkların Azaltılması",
    text: "Malzemeleri amacına uygun kullanmak; atık oluşumunu önleme, ayırma ve değerlendirme seçeneklerini düşünmek.",
  },
  {
    icon: "factory",
    title: "Sorumlu Üretim",
    text: "Ürün, malzeme ve süreç kararlarında kaliteyi, insanı ve çevresel etkileri birlikte değerlendirmek.",
  },
];

const processSteps: Step[] = [
  { title: "Kaynakların planlanması", text: "Malzeme, enerji ve su ihtiyacını kullanım amacıyla birlikte değerlendirmek." },
  { title: "Verimli üretim", text: "Kaynak kayıplarını azaltabilecek yöntemleri ve süreç iyileştirmelerini ele almak." },
  { title: "Kalite kontrol", text: "Ürünün kullanım amacına uygunluğunu ve süreçteki iyileştirme alanlarını değerlendirmek." },
  { title: "Atıkların yönetimi", text: "Oluşan atıkları tanımlamak, ayırma ve uygun değerlendirme yollarını gözden geçirmek." },
];

const goals = [
  { title: "Kaynakları daha iyi anlamak", text: "Kullanım ihtiyaçlarını ve verimlilik olanaklarını daha bütüncül değerlendirmek." },
  { title: "İyileştirme alanlarını belirlemek", text: "Malzeme ve süreç seçimlerini çevresel ve sosyal etkileriyle birlikte ele almak." },
  { title: "Birlikte öğrenmek", text: "İş ortaklarıyla bilgi paylaşımına ve sürdürülebilirlik üzerine diyaloğa açık olmak." },
];

export default function SurdurulebilirlikPage() {
  return (
    <>
      {/* Sanifoam group statement (sanifoam.com.tr › Kalite › Çevre Politikamız), owner decision 2026-11-23. */}
      <section aria-labelledby="page-title" className="border-b border-border bg-surface-strong">
        <div className={cx(containerClass, "py-7 md:py-9")}>
          <Breadcrumbs items={crumbs} />
          <div className="py-5 md:py-7">
            <p className="mb-5 border-l-2 border-primary pl-4 text-xs font-semibold tracking-widest text-link">SANİFOAM GRUBU</p>
            <h1 id="page-title" className="text-4xl leading-tight font-semibold tracking-[-0.025em] whitespace-pre-line md:text-5xl lg:text-6xl">
              {"Doğadan İlham Alıyoruz,\nGeleceğe Dönüştürüyoruz"}
            </h1>
            <div className="mt-6 max-w-3xl space-y-4 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
              <p>
                Çevreye olan duyarlılığımız üretimimizin merkezinde yer alır. Sanifoam olarak, yüksek performanslı polyester yalıtım
                ürünlerimizi, doğaya atılmış PET şişe atıklarını geri dönüştürerek üretiyoruz.
              </p>
              <p>
                Hem mükemmel yalıtım değerleri elde ediyor hem de sıfır atık vizyonumuzla karbon ayak izimizi her geçen gün
                küçültüyoruz. Sürdürülebilir bir gelecek için teknoloji üretiyoruz.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-sm border border-border">
            <Image
              src={heroImage.src}
              alt={heroImage.alt}
              width={heroImage.width}
              height={heroImage.height}
              preload
              sizes="(min-width: 1440px) 1312px, 100vw"
              className="aspect-[2.6/1] h-auto w-full object-cover object-[88%_center] md:aspect-auto"
            />
          </div>
        </div>
      </section>

      <Section labelledBy="approach-title" containerClassName="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="overflow-hidden rounded-sm">
          <Image
            src="/images/products/ovucu-materyaller/natural-scouring-pad.webp"
            alt="Yeşil yapraklar arasında ambalajlı natürel keçeli sünger"
            width={1236}
            height={848}
            sizes="(min-width: 1440px) 590px, (min-width: 1024px) 42vw, 100vw"
            className="h-auto w-full"
          />
        </div>
        <Reveal>
          <Eyebrow>YAKLAŞIMIMIZ</Eyebrow>
          <h2 id="approach-title" className={headingLgClass}>
            Her seçimde kaynaklara özen.
          </h2>
          <div className="mt-6 max-w-xl space-y-4 text-base leading-7 text-muted-foreground">
            <p>
              Sürdürülebilir üretim; malzeme seçiminden kullanım ömrüne kadar her aşamayı çevresel sorumlulukla birlikte
              değerlendirmeyi gerektirir.
            </p>
            <p>
              Saniteks için bu yaklaşımın odağında, ihtiyaca uygun ürünleri düşünmek, kaynakları bilinçli kullanmak ve gelişime açık
              alanları belirlemek yer alır.
            </p>
          </div>
        </Reveal>
      </Section>

      <Section labelledBy="priorities-title" tone="muted">
        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-14">
          <div>
            <Eyebrow>ÖNCELİKLİ ÇALIŞMA ALANLARI</Eyebrow>
            <h2 id="priorities-title" className={headingLgClass}>
              Dört alanda ortak sorumluluk.
            </h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-muted-foreground">
            Üretimin çevresel etkilerini değerlendirirken birbirini tamamlayan bu alanları birlikte ele almak önemlidir.
          </p>
        </div>
        <div className="mt-9 grid gap-x-10 md:grid-cols-2 lg:gap-x-16">
          {priorities.map((item) => (
            <Reveal key={item.title}>
              <article className="group grid grid-cols-[28px_1fr] gap-5 border-t border-border py-7 transition-colors duration-200 hover:border-primary motion-reduce:transition-none">
                <span className="text-link">
                  <LineIcon name={item.icon} />
                </span>
                <div>
                  <h3 className="text-xl font-semibold leading-snug lg:text-2xl">{item.title}</h3>
                  <p className="mt-3 max-w-lg text-base leading-7 text-muted-foreground">{item.text}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section labelledBy="process-title">
        <Reveal>
          <Eyebrow>ÜRETİM SÜRECİNDE SÜRDÜRÜLEBİLİRLİK</Eyebrow>
          <h2 id="process-title" className={headingLgClass}>
            Birbirini tamamlayan adımlar.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Sürdürülebilirlik, tek bir aşamayla sınırlı değildir. Süreci bütün olarak ele alan bir yaklaşım için dört temel
            değerlendirme noktası.
          </p>
        </Reveal>
        <NumberedSteps steps={processSteps} className="mt-10 grid lg:grid-cols-4" />
      </Section>

      <Section labelledBy="responsibility-title" tone="strong">
        <div className="mb-8">
          <Eyebrow>ÇEVRESEL VE SOSYAL SORUMLULUK</Eyebrow>
          <h2 id="responsibility-title" className={headingLgClass}>
            Çevre ve insan, aynı bütünün parçası.
          </h2>
        </div>
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <Image
              src="/images/sustainability/environment-and-people.webp"
              alt="Bir fidanın çevresinde bir araya gelen insanlar, güneş panelli üretim tesisi ve doğayı bir arada gösteren illüstrasyon"
              width={1200}
              height={900}
              sizes="(min-width: 1440px) 630px, (min-width: 1024px) 45vw, 100vw"
              className="h-auto w-full rounded-sm"
            />
          </div>
          <div>
            <div className="border-t-2 border-primary py-6">
              <h3 className="text-xl font-semibold lg:text-2xl">Çevresel Sorumluluk</h3>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Malzemelerin kullanımını, ürünün işlevini ve kullanım sonrasını birlikte düşünmek; çevresel etkileri anlamaya yönelik
                yaklaşımın temelidir.
              </p>
            </div>
            <div className="mt-3 bg-foreground p-6 text-primary-foreground md:p-8">
              <h3 className="text-xl font-semibold lg:text-2xl">Sosyal Sorumluluk</h3>
              <p className="mt-4 text-base leading-7 text-primary-foreground/85">
                İnsana saygı, güvenli çalışma koşulları, eşitlik ve açık iletişim; sorumlu bir üretim kültürü için yol gösteren
                ilkelerdir.
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section labelledBy="goals-title" containerClassName="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal>
          <Eyebrow>SÜRDÜRÜLEBİLİRLİK HEDEFLERİ</Eyebrow>
          <h2 id="goals-title" className={headingLgClass}>
            Gelişime açık bir gelecek anlayışı.
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground">
            Geleceğe yönelik yaklaşımı, ihtiyaçlar ve öğrenilenlerle birlikte geliştirmek önemlidir. Yol gösteren önceliklerimiz:
          </p>
        </Reveal>
        <ul>
          {goals.map((goal) => (
            <li key={goal.title} className="border-t border-border py-6 first:pt-5">
              <h3 className="text-xl font-semibold">{goal.title}</h3>
              <p className="mt-3 text-base leading-7 text-muted-foreground">{goal.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        labelledBy="sustainability-contact-title"
        tone="muted"
        containerClassName="grid items-center gap-8 lg:grid-cols-[1.4fr_0.6fr]"
      >
        <Reveal>
          <Eyebrow>BİRLİKTE KONUŞALIM</Eyebrow>
          <h2 id="sustainability-contact-title" className={headingLgClass}>
            Sürdürülebilirlik üzerine iletişimde kalalım.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            Yaklaşımımız hakkında sorularınız ve iş birliği önerileriniz için bize ulaşın.
          </p>
        </Reveal>
        <div className="lg:justify-self-end">
          <ButtonLink href="/iletisim">İletişime geçin</ButtonLink>
        </div>
      </Section>

      <JsonLd data={breadcrumbJsonLd(crumbs, site.url, PATH)} />
    </>
  );
}
