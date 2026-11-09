import type { ReactNode } from "react";
import { cx } from "./styles";

type EyebrowProps = {
  children: ReactNode;
  /**
   * bar   — inner pages: left border + green text ("ÜRÜN KATEGORİSİ").
   * line  — home page: short rule before the text, optional "02 /" index.
   * dark  — bar variant on dark bands (accent border, light text).
   */
  variant?: "bar" | "line" | "dark";
  /** "02" → renders "02 /" before the label (line variant). */
  index?: string;
  /** Line variant only: colour the label with text-link (default true). */
  tinted?: boolean;
  className?: string;
};

export function Eyebrow({ children, variant = "bar", index, tinted = true, className }: EyebrowProps) {
  if (variant === "line") {
    return (
      <p
        className={cx(
          "mb-4 flex items-center gap-4 text-xs font-bold tracking-[0.18em] before:h-px before:w-10 before:bg-primary",
          tinted && "text-link",
          className,
        )}
      >
        {index ? <span aria-hidden="true">{index} /</span> : null}
        {children}
      </p>
    );
  }
  if (variant === "dark") {
    return (
      <p className={cx("mb-4 border-l-2 border-accent pl-4 text-xs font-semibold tracking-widest text-primary-foreground/75", className)}>
        {children}
      </p>
    );
  }
  return <p className={cx("mb-4 border-l-2 border-primary pl-4 text-xs font-semibold tracking-widest text-link", className)}>{children}</p>;
}
