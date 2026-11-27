import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { containerClass, focusStyle } from "@/components/ui/styles";
import { intlLocales } from "@/i18n/config";
import { getLocale, getT } from "@/i18n/server";

export type LegalSectionLink = { id: string; title: string };

type LegalDocumentProps = {
  title: string;
  crumbs: Crumb[];
  /** Already translated version label. */
  version: string;
  /** ISO date of the last update; formatted in the page language. */
  updated: string;
  /** Table of contents — ids must match the <LegalHeading> ids in the body. */
  sections: LegalSectionLink[];
  /** Shown above the header while the text is not final (hidden in print). */
  draftNotice?: ReactNode;
  /** Shown under the title, e.g. which language version is binding (non-Turkish pages). */
  languageNotice?: ReactNode;
  children: ReactNode;
};

const tocLinkClass = `inline-flex min-h-11 items-center text-link underline-offset-4 hover:text-link-hover hover:underline ${focusStyle}`;

/** Printable legal text: breadcrumbs, optional draft notice, title + version, sticky TOC and body. */
export async function LegalDocument({ title, crumbs, version, updated, sections, draftNotice, languageNotice, children }: LegalDocumentProps) {
  const t = await getT();
  const locale = await getLocale();
  const updatedLabel = new Intl.DateTimeFormat(intlLocales[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Istanbul",
  }).format(new Date(`${updated}T12:00:00Z`));
  return (
    <article className="bg-background pb-16 pt-6 md:pb-20 md:pt-10 lg:pb-24 print:py-0">
      <div className={containerClass}>
        <div className="print:hidden">
          <Breadcrumbs items={crumbs} />
        </div>
        {draftNotice ? (
          <aside
            className="mt-6 border-s-4 border-warning bg-surface-muted px-5 py-4 text-sm leading-6 text-foreground print:hidden"
            aria-label={t("Taslak belge bildirimi")}
          >
            {draftNotice}
          </aside>
        ) : null}
        <header className="mt-8 max-w-4xl border-b border-border pb-8 md:mt-10 md:pb-10">
          <h1 className="max-w-[22ch] text-4xl font-semibold leading-[1.12] tracking-[-0.03em] md:text-5xl lg:text-6xl print:text-3xl">
            {title}
          </h1>
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-sm leading-6 text-muted-foreground">
            <div className="flex gap-2">
              <dt className="font-semibold text-foreground">{t("Sürüm:")}</dt>
              <dd>{version}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold text-foreground">{t("Son güncelleme:")}</dt>
              <dd>
                <time dateTime={updated}>{updatedLabel}</time>
              </dd>
            </div>
          </dl>
          {languageNotice ? <p className="mt-4 max-w-[75ch] text-sm leading-6 text-foreground">{languageNotice}</p> : null}
        </header>
        <div className="mt-10 grid min-w-0 gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label={t("İçindekiler")} className="border-t border-border pt-5 lg:sticky lg:top-32 lg:self-start print:hidden">
            <h2 className="text-sm font-semibold tracking-widest">{t("İçindekiler").toLocaleUpperCase(intlLocales[locale])}</h2>
            <ol className="mt-3 space-y-1 text-sm leading-6">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className={tocLinkClass}>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="min-w-0 max-w-[75ch] text-base leading-8 text-muted-foreground md:text-lg md:leading-8 print:max-w-none print:text-[11pt] print:leading-normal">
            {children}
          </div>
        </div>
      </div>
    </article>
  );
}

/** Section title inside the legal body (anchor target of the TOC). */
export function LegalHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-32 font-semibold tracking-[-0.02em] text-foreground mt-12 text-2xl leading-tight first:mt-0 md:text-3xl"
    >
      {children}
    </h2>
  );
}

export function LegalParagraph({ children }: { children: ReactNode }) {
  return <p className="mt-4">{children}</p>;
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="my-5 space-y-3 ps-6 list-disc">
      {items.map((item, i) => (
        <li key={i} className="ps-1">
          {item}
        </li>
      ))}
    </ul>
  );
}
