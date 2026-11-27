import { ButtonLink } from "@/components/ui/ButtonLink";
import { openPositions, type JobPosition } from "@/data/careers";
import { intlLocales, type Locale } from "@/i18n/config";
import { getLocale, getT } from "@/i18n/server";

/** "2026-11-06" → "6 Kasım 2026" (in the page language). */
function formatPublished(isoDate: string, locale: Locale): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  const format = new Intl.DateTimeFormat(intlLocales[locale], { dateStyle: "long", timeZone: "UTC" });
  return Number.isNaN(date.getTime()) ? isoDate : format.format(date);
}

type OpenPositionsProps = {
  /** Positions in the page language (i18n/data › localized). */
  positions: JobPosition[];
  /** Path of the careers page; "Başvur" links to <path>?pozisyon=<id>#basvuru. */
  pagePath: string;
};

/** Body of the "Açık Pozisyonlar" band: position cards, or the live empty-state text when there are none. */
export async function OpenPositions({ positions, pagePath }: OpenPositionsProps) {
  const t = await getT();
  const locale = await getLocale();
  if (positions.length === 0) {
    return (
      <div className="mt-9 border-t border-border py-7">
        <h3 className="text-xl font-semibold leading-snug md:text-2xl">{t("Şu anda açık pozisyon bulunmuyor.")}</h3>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          {t("Başvuru olanakları hakkında bilgi almak için aşağıdaki genel başvuru bölümünü inceleyebilirsiniz.")}
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
        {t(
          "Yayındaki pozisyonları aşağıda bulabilirsiniz. Size uygun bir pozisyon yoksa başvuru formundan genel başvuru yapabilirsiniz.",
        )}
      </p>
      <ul className="mt-9 grid gap-5 lg:grid-cols-2">
        {positions.map((position) => {
          const titleId = `pozisyon-${position.id}-title`;
          // The date as stored in careers.ts (localized data may pass it through the dictionary).
          const published = openPositions.find((raw) => raw.id === position.id)?.published ?? position.published;
          return (
            <li key={position.id} className="min-w-0">
              <article
                id={`pozisyon-${position.id}`}
                aria-labelledby={titleId}
                className="flex h-full scroll-mt-28 flex-col rounded-sm border border-border bg-surface p-5 shadow-sm md:p-6"
              >
                <h3 id={titleId} className="text-xl font-semibold leading-snug wrap-break-word lg:text-2xl">
                  {position.title}
                </h3>
                <dl className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-3">
                  <div className="min-w-0">
                    <dt className="text-muted-foreground">{t("Departman")}</dt>
                    <dd className="mt-1 font-semibold">{position.department}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-muted-foreground">{t("Lokasyon")}</dt>
                    <dd className="mt-1 font-semibold">{position.location.label}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-muted-foreground">{t("Çalışma şekli")}</dt>
                    <dd className="mt-1 font-semibold">{position.type}</dd>
                  </div>
                </dl>
                <p className="mt-5 text-base leading-7 text-muted-foreground">{position.summary}</p>
                {position.requirements?.length ? (
                  <>
                    <h4 className="mt-5 text-base font-semibold">{t("Aranan nitelikler")}</h4>
                    <ul className="mt-2 list-disc space-y-1 ps-5 text-base leading-7 text-muted-foreground marker:text-primary">
                      {position.requirements.map((requirement) => (
                        <li key={requirement}>{requirement}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
                <div className="mt-auto pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
                    <p className="text-sm text-muted-foreground">
                      {t("Yayın tarihi:")} <time dateTime={published}>{formatPublished(published, locale)}</time>
                    </p>
                    <ButtonLink
                      href={`${pagePath}?pozisyon=${encodeURIComponent(position.id)}#basvuru`}
                      aria-label={t("Başvur: {title}", { title: position.title })}
                    >
                      {t("Başvur")}
                    </ButtonLink>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </>
  );
}
