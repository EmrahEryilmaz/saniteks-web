import type { ReactNode } from "react";
import { containerClass, cx, sectionClass } from "./styles";

const tones = {
  default: "",
  muted: "bg-surface-muted",
  strong: "bg-surface-strong",
  dark: "bg-foreground text-primary-foreground",
} as const;

type SectionProps = {
  children: ReactNode;
  /** id of the heading that labels this section. */
  labelledBy: string;
  id?: string;
  tone?: keyof typeof tones;
  /** Extra classes on the <section>. */
  className?: string;
  /** Extra classes on the inner container (grid layouts etc.). */
  containerClassName?: string;
};

/** Content band: section padding + page container, as used on every live page. */
export function Section({ children, labelledBy, id, tone = "default", className, containerClassName }: SectionProps) {
  return (
    <section id={id} className={cx(sectionClass, tones[tone], className)} aria-labelledby={labelledBy}>
      <div className={cx(containerClass, containerClassName)}>{children}</div>
    </section>
  );
}
