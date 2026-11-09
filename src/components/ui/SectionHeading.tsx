import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";
import { cx, headingLgClass, headingMdClass } from "./styles";

type SectionHeadingProps = {
  id: string;
  eyebrow: ReactNode;
  title: ReactNode;
  /** lg = default inner-page title, md = product detail bands. */
  size?: "lg" | "md";
  /** Optional paragraph under the title. */
  lead?: ReactNode;
  /** Use the dark-band eyebrow (accent border). */
  onDark?: boolean;
  className?: string;
  titleClassName?: string;
};

/** Eyebrow + h2 (+ optional lead) — the heading block that opens most sections. */
export function SectionHeading({ id, eyebrow, title, size = "lg", lead, onDark, className, titleClassName }: SectionHeadingProps) {
  return (
    <div className={className}>
      <Eyebrow variant={onDark ? "dark" : "bar"}>{eyebrow}</Eyebrow>
      <h2 id={id} className={cx(size === "md" ? headingMdClass : headingLgClass, titleClassName)}>
        {title}
      </h2>
      {lead ? (
        <p className={cx("mt-5 max-w-xl text-base leading-7", onDark ? "text-primary-foreground/85" : "text-muted-foreground")}>{lead}</p>
      ) : null}
    </div>
  );
}
