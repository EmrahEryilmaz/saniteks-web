import { ButtonLink } from "@/components/ui/ButtonLink";
import type { JobPosition } from "@/data/careers";

const dateFormat = new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeZone: "UTC" });

/** "2026-11-06" → "6 Kasım 2026". */
function formatPublished(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? isoDate : dateFormat.format(date);
}

type OpenPositionsProps = {
  positions: JobPosition[];
  /** Path of the careers page; "Başvur" links to <path>?pozisyon=<id>#basvuru. */
  pagePath: string;
};

/** Body of the "Açık Pozisyonlar" band: position cards, or the live empty-state text when there are none. */
export function OpenPositions({ positions, pagePath }: OpenPositionsProps) {
  if (positions.length === 0) {
    return (
      <div className="mt-9 border-t border-border py-7">
        <h3 className="text-xl font-semibold leading-snug md:text-2xl">Şu anda açık pozisyon bulunmuyor.</h3>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
          Başvuru olanakları hakkında bilgi almak için aşağıdaki genel başvuru bölümünü inceleyebilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <>
      <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
        Yayındaki pozisyonları aşağıda bulabilirsiniz. Size uygun bir pozisyon yoksa başvuru formundan genel başvuru
        yapabilirsiniz.
      </p>
      <ul className="mt-9 grid gap-5 lg:grid-cols-2">
        {positions.map((position) => {
          const titleId = `pozisyon-${position.id}-title`;
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
                    <dt className="text-muted-foreground">Departman</dt>
                    <dd className="mt-1 font-semibold">{position.department}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-muted-foreground">Lokasyon</dt>
                    <dd className="mt-1 font-semibold">{position.location.label}</dd>
                  </div>
                  <div className="min-w-0">
                    <dt className="text-muted-foreground">Çalışma şekli</dt>
                    <dd className="mt-1 font-semibold">{position.type}</dd>
                  </div>
                </dl>
                <p className="mt-5 text-base leading-7 text-muted-foreground">{position.summary}</p>
                {position.requirements?.length ? (
                  <>
                    <h4 className="mt-5 text-base font-semibold">Aranan nitelikler</h4>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-base leading-7 text-muted-foreground marker:text-primary">
                      {position.requirements.map((requirement) => (
                        <li key={requirement}>{requirement}</li>
                      ))}
                    </ul>
                  </>
                ) : null}
                <div className="mt-auto pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
                    <p className="text-sm text-muted-foreground">
                      Yayın tarihi: <time dateTime={position.published}>{formatPublished(position.published)}</time>
                    </p>
                    <ButtonLink
                      href={`${pagePath}?pozisyon=${encodeURIComponent(position.id)}#basvuru`}
                      aria-label={`Başvur: ${position.title}`}
                    >
                      Başvur
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
