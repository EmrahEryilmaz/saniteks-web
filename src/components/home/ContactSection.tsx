import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { headingHomeClass, textLinkClass } from "@/components/ui/styles";
import { site } from "@/lib/site";
import { Reveal } from "./Reveal";

/** 05 — "İletişime geçin" (#iletisim). */
export function ContactSection() {
  return (
    <Section
      id="iletisim"
      labelledBy="contact-title"
      className="relative overflow-hidden bg-surface-muted"
      containerClassName="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12"
    >
      <Reveal>
        <Eyebrow variant="line" index="05">
          İLETİŞİME GEÇİN
        </Eyebrow>
        <h2 id="contact-title" className={headingHomeClass}>
          İhtiyacınızı birlikte değerlendirelim.
        </h2>
      </Reveal>
      <Reveal>
        <p className="max-w-md text-base leading-7 text-muted-foreground">
          Ürünlerimiz hakkında bilgi almak ve iş birliği olanaklarını konuşmak için ekibimize ulaşın.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-6">
          <ButtonLink href={`mailto:${site.contact.email}`}>Bize yazın</ButtonLink>
          <a className={`${textLinkClass} inline-flex min-h-12 items-center gap-4 font-semibold`} href={site.contact.phoneHref}>
            Bizi arayın
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </Reveal>
    </Section>
  );
}
