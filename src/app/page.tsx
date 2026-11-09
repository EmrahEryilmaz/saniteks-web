import type { Metadata } from "next";
import { AboutSection } from "@/components/home/AboutSection";
import { ApproachSection } from "@/components/home/ApproachSection";
import { ContactSection } from "@/components/home/ContactSection";
import { HeroSlider } from "@/components/home/HeroSlider";
import { heroSlides } from "@/components/home/heroSlides";
import { ProductGroupsSection } from "@/components/home/ProductGroupsSection";
import { SustainabilitySection } from "@/components/home/SustainabilitySection";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: site.defaultTitle },
  description: site.defaultDescription,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroSlider title="Saniteks temizlik çözümleri" slides={heroSlides} />
      <AboutSection />
      <ProductGroupsSection />
      <ApproachSection />
      <SustainabilitySection />
      <ContactSection />
    </>
  );
}
