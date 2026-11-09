// Sections from the earlier Kurumsal page (live saniteks.com.tr copy), kept on /kurumsal/hakkinda.
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { headingHomeClass, headingLgClass } from "@/components/ui/styles";
import { Reveal } from "@/components/home/Reveal";
import { LineIcon, type LineIconName } from "./LineIcon";

const productionPrinciples = [
  { title: "Kalite odaklı üretim", text: "Ürünün kullanım amacına uygunluğunu süreç boyunca dikkatle değerlendirmek." },
  { title: "Teknoloji ve süreç yönetimi", text: "Malzeme ile üretim adımlarını birbiriyle uyumlu ve düzenli biçimde yönetmek." },
  { title: "İhtiyaçlara duyarlılık", text: "Beklentileri dinlemek, kullanım koşullarını anlamak ve doğru çözümü birlikte şekillendirmek." },
  { title: "Sürekli gelişim", text: "Deneyimlerden öğrenerek ürün ve süreçlerde iyileştirme alanları aramak." },
];

const values: { icon: LineIconName; title: string; text: string }[] = [
  { icon: "shieldCheck", title: "Güven", text: "Açık, tutarlı ve sözünün arkasında duran ilişkiler kurmak." },
  { icon: "star", title: "Kalite", text: "Her aşamada amaca uygunluğu ve özeni birlikte gözetmek." },
  { icon: "shieldCare", title: "Sorumluluk", text: "İnsana, kaynaklara ve yapılan işe karşı dikkatli davranmak." },
  { icon: "bulb", title: "Yenilikçilik", text: "Yeni ihtiyaçları anlamaya ve farklı çözümleri değerlendirmeye açık olmak." },
  { icon: "people", title: "İş birliği", text: "Bilgiyi paylaşmak ve çözümü ortak anlayışla geliştirmek." },
  { icon: "growth", title: "Sürekli gelişim", text: "Öğrenilenleri daha iyi ürün ve süreçlere dönüştürmek." },
];

/** "Üretim anlayışımız" — four numbered principles. */
export function ProductionApproachSection() {
  return (
    <Section labelledBy="production-approach-title" tone="muted">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
        <div>
          <Eyebrow>ÜRETİM ANLAYIŞIMIZ</Eyebrow>
          <h2 id="production-approach-title" className={headingLgClass}>
            Süreci bir bütün olarak değerlendiriyoruz.
          </h2>
        </div>
        <p className="max-w-xl text-base leading-7 text-muted-foreground">
          Ürün kararlarını kullanım amacı, malzeme yapısı ve üretim adımları arasındaki ilişkiyi gözeterek ele alıyoruz.
        </p>
      </div>
      <ol className="mt-9 grid md:grid-cols-2">
        {productionPrinciples.map((item, index) => (
          <li
            key={item.title}
            className="group border-t border-border py-7 transition-colors duration-200 hover:border-primary md:px-8 md:odd:pl-0 md:even:border-l md:last:border-b motion-reduce:transition-none"
          >
            <span aria-hidden="true" className="text-xs font-semibold tabular-nums text-link">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 text-xl font-semibold leading-snug lg:text-2xl">{item.title}</h3>
            <p className="mt-3 max-w-lg text-base leading-7 text-muted-foreground">{item.text}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/** "Kurumsal değerler" — six values with line icons. */
export function CorporateValuesSection() {
  return (
    <Section labelledBy="corporate-values-title">
      <Reveal>
        <Eyebrow>KURUMSAL DEĞERLER</Eyebrow>
        <h2 id="corporate-values-title" className={headingLgClass}>
          Çalışma kültürümüze yön veren ilkeler.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
          Kararlarımızda ve ilişkilerimizde ortak bir dil oluşturan altı temel değer.
        </p>
      </Reveal>
      <div className="mt-9 grid md:grid-cols-2 lg:grid-cols-3">
        {values.map((value) => (
          <div
            key={value.title}
            className="group border-t border-border py-7 transition-colors duration-200 hover:border-primary md:px-7 md:odd:pl-0 lg:border-l lg:first:border-l-0 lg:nth-[3n+1]:border-l-0 lg:nth-[3n+1]:pl-0 lg:nth-[3n+2]:pl-7 lg:nth-[3n+3]:pl-7 motion-reduce:transition-none"
          >
            <span className="inline-flex text-link transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none">
              <LineIcon name={value.icon} />
            </span>
            <h3 className="mt-5 text-xl font-semibold leading-snug lg:text-2xl">{value.title}</h3>
            <p className="mt-3 max-w-sm text-base leading-7 text-muted-foreground">{value.text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/** "Sorumlu yaklaşım" — dark band linking to the sustainability page. */
export function ResponsibleApproachSection() {
  return (
    <Section labelledBy="corporate-sustainability-title" tone="dark" containerClassName="grid items-end gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
      <Reveal>
        <Eyebrow variant="dark">SORUMLU YAKLAŞIM</Eyebrow>
        <h2 id="corporate-sustainability-title" className={headingHomeClass}>
          Üretimi gelecekle birlikte düşünmek.
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-primary-foreground/85">
          Malzeme ve süreç kararlarını kaynaklara, insana ve çevreye karşı sorumlulukla değerlendiren yaklaşımımızı inceleyin.
        </p>
      </Reveal>
      <ButtonLink href="/surdurulebilirlik" variant="inverse">
        Sürdürülebilirlik yaklaşımımız
      </ButtonLink>
    </Section>
  );
}
