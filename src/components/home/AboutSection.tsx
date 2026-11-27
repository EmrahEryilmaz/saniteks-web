import Image from "next/image";
import { ArrowLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Section } from "@/components/ui/Section";
import { headingHomeClass } from "@/components/ui/styles";
import { getT } from "@/i18n/server";

/** 01 — "Saniteks hakkında" (#kurumsal). */
export async function AboutSection() {
  const t = await getT();
  return (
    <Section
      id="kurumsal"
      labelledBy="about-title"
      className="relative overflow-hidden bg-surface-strong"
      containerClassName="grid items-center gap-9 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14"
    >
      <div className="relative">
        <div className="relative aspect-[6/5] overflow-hidden rounded-sm md:aspect-[4/3] lg:aspect-[6/5]">
          <Image
            src="/images/home/sunger-su.webp"
            alt={t("Suya düşerek sıçratan sarı gövdeli, yeşil keçeli bulaşık süngeri")}
            fill
            sizes="(min-width: 1440px) 620px, (min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="absolute end-4 bottom-4 flex size-12 items-center justify-center rounded-sm bg-primary text-xl font-bold text-primary-foreground"
        >
          01
        </div>
        <p className="absolute top-6 start-6 border-s-2 border-primary bg-surface/95 px-4 py-3 text-[10px] font-bold tracking-[0.16em] text-foreground">
          {t("DOKU. İŞLEV. ÖZEN.")}
        </p>
      </div>
      <div className="lg:py-6">
        <Eyebrow variant="line">{t("SANİTEKS HAKKINDA")}</Eyebrow>
        <h2 id="about-title" className={headingHomeClass}>
          {t("Her dokuda özen. Her adımda çözüm.")}
        </h2>
        <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
          {t(
            "Günlük temizlikten farklı kullanım alanlarına uzanan ürün seçeneklerimizi keşfedin. Saniteks ile ihtiyacınıza uygun ürünler üzerine konuşalım, birlikte çözüm geliştirelim.",
          )}
        </p>
        <ArrowLink href="/#urunler" variant="underline">
          {t("Ürünlerimizi keşfedin")}
        </ArrowLink>
      </div>
    </Section>
  );
}
