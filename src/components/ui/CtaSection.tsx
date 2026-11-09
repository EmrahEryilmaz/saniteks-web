import type { ReactNode } from "react";
import { ButtonLink } from "./ButtonLink";
import { Eyebrow } from "./Eyebrow";
import { containerClass, cx, headingLgClass, headingMdClass, sectionClass } from "./styles";

type CtaSectionProps = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  text: ReactNode;
  action: { href: string; label: string };
  /** muted = light closing band (most pages); dark = product detail closing band. */
  tone?: "muted" | "dark";
};

/** Closing call-to-action band with a green bottom rule. */
export function CtaSection({ id, eyebrow, title, text, action, tone = "muted" }: CtaSectionProps) {
  const dark = tone === "dark";
  return (
    <section
      className={cx(sectionClass, "border-b-4 border-primary", dark ? "bg-foreground text-primary-foreground" : "bg-surface-muted")}
      aria-labelledby={id}
    >
      <div className={cx(containerClass, "grid items-center gap-8 lg:grid-cols-[1.25fr_auto] lg:gap-16")}>
        <div className="min-w-0">
          <Eyebrow variant={dark ? "dark" : "bar"}>{eyebrow}</Eyebrow>
          <h2 id={id} className={dark ? headingMdClass : headingLgClass}>
            {title}
          </h2>
          <p className={cx("mt-5 max-w-xl text-base leading-7", dark ? "text-primary-foreground/85" : "text-muted-foreground")}>{text}</p>
        </div>
        <ButtonLink href={action.href} variant={dark ? "inverse" : "primary"}>
          {action.label}
        </ButtonLink>
      </div>
    </section>
  );
}
