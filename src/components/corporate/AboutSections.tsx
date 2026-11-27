// Sections from the earlier Kurumsal page (live saniteks.com.tr copy), kept on /kurumsal/hakkinda.
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { headingHomeClass, headingLgClass } from "@/components/ui/styles";
import { Reveal } from "@/components/home/Reveal";
import { getT } from "@/i18n/server";
import { LineIcon, type LineIconName } from "./LineIcon";

/** "Üretim anlayışımız" — four numbered principles. */
export async function ProductionApproachSection() {
  const t = await getT();
  const productionPrinciples = [
    { title: t("Kalite odaklı üretim"), text: t("Ürünün kullanım amacına uygunluğunu süreç boyunca dikkatle değerlendirmek.") },
    { title: t("Teknoloji ve süreç yönetimi"), text: t("Malzeme ile üretim adımlarını birbiriyle uyumlu ve düzenli biçimde yönetmek.") },
    {
      title: t("İhtiyaçlara duyarlılık"),
      text: t("Beklentileri dinlemek, kullanım koşullarını anlamak ve doğru çözümü birlikte şekillendirmek."),
    },
    { title: t("Sürekli gelişim"), text: t("Deneyimlerden öğrenerek ürün ve süreçlerde iyileştirme alanları aramak.") },
  ];
  return (
    <Section labelledBy="production-approach-title" tone="muted">
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
        <div>
          <Eyebrow>{t("ÜRETİM ANLAYIŞIMIZ")}</Eyebrow>
          <h2 id="production-approach-title" className={headingLgClass}>
            {t("Süreci bir bütün olarak değerlendiriyoruz.")}
          </h2>
        </div>
        <p className="max-w-xl text-base leading-7 text-muted-foreground">
          {t("Ürün kararlarını kullanım amacı, malzeme yapısı ve üretim adımları arasındaki ilişkiyi gözeterek ele alıyoruz.")}
        </p>
      </div>
      <ol className="mt-9 grid md:grid-cols-2">
        {productionPrinciples.map((item, index) => (
          <li
            key={item.title}
            className="group border-t border-border py-7 transition-colors duration-200 hover:border-primary md:px-8 md:odd:ps-0 md:even:border-s md:last:border-b motion-reduce:transition-none"
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
export async function CorporateValuesSection() {
  const t = await getT();
  const values: { icon: LineIconName; title: string; text: string }[] = [
    { icon: "shieldCheck", title: t("Güven"), text: t("Açık, tutarlı ve sözünün arkasında duran ilişkiler kurmak.") },
    { icon: "star", title: t("Kalite"), text: t("Her aşamada amaca uygunluğu ve özeni birlikte gözetmek.") },
    { icon: "shieldCare", title: t("Sorumluluk"), text: t("İnsana, kaynaklara ve yapılan işe karşı dikkatli davranmak.") },
    { icon: "bulb", title: t("Yenilikçilik"), text: t("Yeni ihtiyaçları anlamaya ve farklı çözümleri değerlendirmeye açık olmak.") },
    { icon: "people", title: t("İş birliği"), text: t("Bilgiyi paylaşmak ve çözümü ortak anlayışla geliştirmek.") },
    { icon: "growth", title: t("Sürekli gelişim"), text: t("Öğrenilenleri daha iyi ürün ve süreçlere dönüştürmek.") },
  ];
  return (
    <Section labelledBy="corporate-values-title">
      <Reveal>
        <Eyebrow>{t("KURUMSAL DEĞERLER")}</Eyebrow>
        <h2 id="corporate-values-title" className={headingLgClass}>
          {t("Çalışma kültürümüze yön veren ilkeler.")}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
          {t("Kararlarımızda ve ilişkilerimizde ortak bir dil oluşturan altı temel değer.")}
        </p>
      </Reveal>
      <div className="mt-9 grid md:grid-cols-2 lg:grid-cols-3">
        {values.map((value) => (
          <div
            key={value.title}
            className="group border-t border-border py-7 transition-colors duration-200 hover:border-primary md:px-7 md:odd:ps-0 lg:border-s lg:first:border-s-0 lg:nth-[3n+1]:border-s-0 lg:nth-[3n+1]:ps-0 lg:nth-[3n+2]:ps-7 lg:nth-[3n+3]:ps-7 motion-reduce:transition-none"
          >
            <span className="inline-flex text-link transition-transform duration-200 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none">
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
export async function ResponsibleApproachSection() {
  const t = await getT();
  return (
    <Section labelledBy="corporate-sustainability-title" tone="dark" containerClassName="grid items-end gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
      <Reveal>
        <Eyebrow variant="dark">{t("SORUMLU YAKLAŞIM")}</Eyebrow>
        <h2 id="corporate-sustainability-title" className={headingHomeClass}>
          {t("Üretimi gelecekle birlikte düşünmek.")}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-7 text-primary-foreground/85">
          {t("Malzeme ve süreç kararlarını kaynaklara, insana ve çevreye karşı sorumlulukla değerlendiren yaklaşımımızı inceleyin.")}
        </p>
      </Reveal>
      <ButtonLink href="/surdurulebilirlik" variant="inverse">
        {t("Sürdürülebilirlik yaklaşımımız")}
      </ButtonLink>
    </Section>
  );
}
