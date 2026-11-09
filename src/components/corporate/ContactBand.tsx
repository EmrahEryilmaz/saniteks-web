import type { ReactNode } from "react";
import { Reveal } from "@/components/home/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { headingLgClass } from "@/components/ui/styles";

type ContactBandProps = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  text: ReactNode;
  action: { href: string; label: string };
};

/**
 * Closing contact band of /kurumsal and /insan-kaynaklari — live markup (the shared CtaSection
 * adds `justify-self-start`/`min-w-0`, which the live pages do not have).
 */
export function ContactBand({ id, eyebrow, title, text, action }: ContactBandProps) {
  return (
    <Section
      labelledBy={id}
      className="border-b-4 border-primary bg-surface-muted"
      containerClassName="grid items-center gap-8 lg:grid-cols-[1.25fr_auto] lg:gap-16"
    >
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={id} className={headingLgClass}>
          {title}
        </h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">{text}</p>
      </Reveal>
      <ButtonLink href={action.href}>{action.label}</ButtonLink>
    </Section>
  );
}
