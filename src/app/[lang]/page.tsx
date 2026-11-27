import type { Metadata } from "next";
import { AboutSection } from "@/components/home/AboutSection";
import { ApproachSection } from "@/components/home/ApproachSection";
import { ContactSection } from "@/components/home/ContactSection";
import { HeroSlider } from "@/components/home/HeroSlider";
import { heroSlides } from "@/components/home/heroSlides";
import { ProductGroupsSection } from "@/components/home/ProductGroupsSection";
import { SustainabilitySection } from "@/components/home/SustainabilitySection";
import { localized } from "@/i18n/data";
import { pageMetadata } from "@/i18n/metadata";
import { getT } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  const title = t("Saniteks | Temizlik Ürünleri ve Çözümleri");
  const base = await pageMetadata({
    title,
    description: t(
      "Saniteks temizlik bezleri, süngerleri ve malzeme seçeneklerini keşfedin. Ürünler ve iş birliği için bizimle iletişime geçin.",
    ),
    path: "/",
  });
  // The home title already names the site, so it is used as is (no " | Saniteks" template).
  return { ...base, title: { absolute: title }, openGraph: { ...base.openGraph, title }, twitter: { ...base.twitter, title } };
}

export default async function HomePage() {
  const t = await getT();
  const slides = await localized(heroSlides);
  return (
    <>
      <HeroSlider title={t("Saniteks temizlik çözümleri")} slides={slides} />
      <AboutSection />
      <ProductGroupsSection />
      <ApproachSection />
      <SustainabilitySection />
      <ContactSection />
    </>
  );
}
