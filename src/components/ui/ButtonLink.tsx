import Link from "next/link";
import type { ReactNode } from "react";
import { buttonArrowClass, buttonInverseClass, buttonPrimaryClass, cx, textLinkClass } from "./styles";

type BaseProps = {
  href: string;
  children: ReactNode;
  className?: string;
  /** Glyph after the label; defaults to ↗. Pass null to hide. */
  icon?: ReactNode;
  /** Open in a new tab (adds rel). */
  external?: boolean;
  download?: boolean;
  "aria-label"?: string;
  tabIndex?: number;
};

function isPlainAnchor(href: string, external?: boolean, download?: boolean) {
  return external || download || /^(mailto:|tel:|https?:)/.test(href) || href.endsWith(".pdf");
}

function Anchor({ href, external, download, className, children, ...rest }: BaseProps) {
  if (isPlainAnchor(href, external, download)) {
    return (
      <a
        href={href}
        className={className}
        download={download || undefined}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}

/**
 * Filled action button ("Bilgi alın ↗").
 * primary = green; inverse = white button used on dark bands.
 */
export function ButtonLink({ variant = "primary", icon = "↗", children, className, ...rest }: BaseProps & { variant?: "primary" | "inverse" }) {
  return (
    <Anchor className={cx(variant === "inverse" ? buttonInverseClass : buttonPrimaryClass, className)} {...rest}>
      {children}
      {icon !== null ? (
        <span aria-hidden="true" className={buttonArrowClass}>
          {icon}
        </span>
      ) : null}
    </Anchor>
  );
}

/**
 * Text link with trailing glyph.
 * underline — home page style with green bottom border ("Ürünlerimizi keşfedin ↗").
 * plain     — inline link ("PDF katalogları inceleyin ↗").
 */
export function ArrowLink({
  variant = "plain",
  icon = "↗",
  children,
  className,
  ...rest
}: BaseProps & { variant?: "plain" | "underline" }) {
  const base =
    variant === "underline"
      ? "group mt-5 inline-flex min-h-12 items-center gap-6 border-b border-primary pb-2 font-semibold"
      : "inline-flex min-h-11 items-center gap-3 font-semibold";
  return (
    <Anchor className={cx(textLinkClass, base, className)} {...rest}>
      {children}
      {icon !== null ? (
        <span
          aria-hidden="true"
          className={variant === "underline" ? "transition-transform group-hover:translate-x-1 motion-reduce:transform-none" : undefined}
        >
          {icon}
        </span>
      ) : null}
    </Anchor>
  );
}
