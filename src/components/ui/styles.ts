// Class strings shared across components — copied from the live saniteks.com.tr markup.

export const focusStyle = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus-ring";

export const containerClass = "mx-auto w-full max-w-[1440px] px-5 md:px-10 lg:px-16";

/** Section paddings used by every content band. */
export const sectionClass = "scroll-mt-24 py-14 md:py-16 lg:py-20";

/** Inline text link (breadcrumbs, "PDF katalogları inceleyin", …). */
export const textLinkClass = `text-link hover:text-link-hover active:text-primary-active underline-offset-4 hover:underline ${focusStyle}`;

/** Filled green action button. */
export const buttonPrimaryClass = `group/action inline-flex min-h-12 max-w-full items-center justify-between gap-5 rounded-sm bg-primary px-6 py-3 text-[19px] font-bold text-primary-foreground transition-colors hover:bg-primary-hover active:bg-primary-active motion-reduce:transition-none ${focusStyle}`;

/** White action button used on dark bands. */
export const buttonInverseClass = `group/action inline-flex min-h-12 max-w-full items-center justify-between gap-5 rounded-sm bg-surface px-6 py-3 text-[19px] font-bold text-link transition-colors hover:bg-surface-muted active:bg-surface-strong motion-reduce:transition-none ${focusStyle}`;

export const buttonArrowClass =
  "inline-block transition-transform duration-200 rtl:-scale-x-100 group-hover/action:translate-x-0.5 group-hover/action:-translate-y-0.5 rtl:group-hover/action:-translate-x-0.5 motion-reduce:transform-none motion-reduce:transition-none";

/** Footer / dark-surface link. */
export const footerLinkClass = `inline-flex min-h-11 items-center text-primary-foreground/85 underline-offset-4 transition-colors hover:text-primary-foreground hover:underline active:text-primary-foreground/70 motion-reduce:transition-none ${focusStyle}`;

/** Large section title (h2) — the default heading size. */
export const headingLgClass = "max-w-[26ch] text-3xl font-semibold leading-[1.2] tracking-[-0.02em] lg:text-4xl";

/** Medium section title (h2) — product detail bands. */
export const headingMdClass = "max-w-[28ch] text-2xl font-semibold leading-[1.25] tracking-[-0.02em] md:text-3xl";

/** Home page title variant. */
export const headingHomeClass = "max-w-[24ch] text-3xl font-semibold leading-[1.2] tracking-[-0.02em] lg:text-4xl";

export function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
