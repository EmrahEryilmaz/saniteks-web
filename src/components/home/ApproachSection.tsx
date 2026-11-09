import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { cx, headingHomeClass } from "@/components/ui/styles";
import { Reveal } from "./Reveal";

const principles = [
  {
    title: "İhtiyacı anlamak",
    text: "Her çözümün başlangıcında kullanım alanını ve beklentileri birlikte ele almak var.",
  },
  {
    title: "Detaylara özen",
    text: "Ürün seçiminde işlevi, kullanım deneyimini ve detayları bir arada düşünmek.",
  },
  {
    title: "Açık iletişim",
    text: "Soruları dinleyen, bilgi paylaşımını önemseyen bir iş birliği yaklaşımı.",
  },
];

/** 03 — "Yaklaşımımız" (dark band). */
export function ApproachSection() {
  return (
    <Section labelledBy="values-title" className="relative overflow-hidden bg-foreground text-primary-foreground">
      <div className="grid gap-5 lg:grid-cols-[0.7fr_1.3fr] lg:gap-12">
        <div>
          <Eyebrow variant="line" index="03" tinted={false}>
            YAKLAŞIMIMIZ
          </Eyebrow>
          <div aria-hidden="true" className="mt-6 hidden size-12 border border-primary lg:block">
            <div className="ml-3 mt-3 size-12 border border-primary-foreground/25" />
          </div>
        </div>
        <h2 id="values-title" className={cx(headingHomeClass, "max-w-3xl")}>
          Ürünün ötesinde, ortak bir anlayış.
        </h2>
      </div>
      <div className="mt-8 lg:mt-10">
        {principles.map((item, index) => (
          <Reveal key={item.title}>
            <article className="grid gap-3 border-t border-primary-foreground/20 py-6 md:grid-cols-[40px_1fr_1fr] md:gap-6 lg:grid-cols-[56px_1fr_1fr]">
              <span aria-hidden="true" className="text-lg font-medium tabular-nums text-primary-foreground/65">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl font-medium leading-snug tracking-tight lg:text-2xl">{item.title}</h3>
              <p className="max-w-md text-base leading-7 text-primary-foreground/75">{item.text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
