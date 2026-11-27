import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { headingHomeClass, textLinkClass } from "@/components/ui/styles";
import { Link } from "@/i18n/Link";
import { getT } from "@/i18n/server";

/** "Bugünden yarına" image band + 04 — Sürdürülebilirlik card (#surdurulebilirlik). */
export async function SustainabilitySection() {
  const t = await getT();
  return (
    <section
      id="surdurulebilirlik"
      aria-labelledby="sustainability-title"
      className="relative isolate scroll-mt-20 overflow-hidden bg-surface-strong pb-14 lg:pb-20"
    >
      <div className="relative h-[280px] md:h-[360px] lg:h-[440px]">
        <Image
          src="/images/products/hammadde/rulo-nonwoven-kece.webp"
          alt={t(
            "Sarı, mavi, pembe ve gri non-woven temizlik bezi ruloları ile yeşil, mor, fuşya ve kenevir renginde ovucu keçe ruloları",
          )}
          fill
          sizes="100vw"
          className="object-cover object-[center_42%]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-overlay/25" />
        <Container className="relative pt-6 md:pt-8">
          <p className="inline-block border-s-2 border-primary bg-foreground/85 px-5 py-3 text-xs font-semibold tracking-[0.18em] text-primary-foreground">
            {t("BUGÜNDEN YARINA")}
          </p>
        </Container>
      </div>
      <Container className="relative -mt-12 md:-mt-16 lg:-mt-20">
        <div className="relative ms-auto max-w-2xl rounded-sm border-t-2 border-primary bg-surface p-6 md:p-8 lg:p-10">
          <Eyebrow variant="line" index="04">
            {t("SÜRDÜRÜLEBİLİRLİK")}
          </Eyebrow>
          <h2 id="sustainability-title" className={headingHomeClass}>
            {t("Yarına, bugünden bir özen.")}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            {t(
              "İhtiyaca uygun ürün seçimi ve bilinçli kullanım üzerine birlikte düşünelim. Sürdürülebilirlik konusundaki sorularınız ve iş birliği önerileriniz için bize ulaşın.",
            )}
          </p>
          <Link
            className={`${textLinkClass} mt-5 inline-flex min-h-12 items-center gap-6 border-b border-primary font-semibold`}
            href="/surdurulebilirlik"
          >
            {t("Yaklaşımımızı keşfedin")}
            <span aria-hidden="true" className="inline-block rtl:-scale-x-100">
              ↗
            </span>
          </Link>
        </div>
      </Container>
    </section>
  );
}
