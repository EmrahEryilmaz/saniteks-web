import type { HeroSlide } from "./HeroSlider";

/**
 * Home hero slides — copy and targets as on the live site.
 * Slides 1 and 3 use the catalogue's lifestyle photos, placed on the right of a wide canvas so the people
 * stay clear of the dark text panel; on narrow screens the image is anchored right to keep them in frame.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: "dokunus",
    eyebrow: "TEMİZLİĞE ÖZEN KATIYORUZ",
    title: "Her gün için\ndoğru bir dokunuş.",
    description: "Yaşamın içinden gelen ihtiyaçlara, özenle düşünülen temizlik çözümleri.",
    image: {
      src: "/images/home/hero-anne-kiz.webp",
      alt: "Mutfakta bulaşık yıkarken kızının burnuna süngerle dokunan anne",
      position: "object-[88%_center] lg:object-center",
    },
    action: { href: "/#urunler", label: "Ürünlerimizi keşfedin" },
  },
  {
    id: "malzeme",
    eyebrow: "İHTİYACA ODAKLANAN SEÇENEKLER",
    title: "Çözüm, doğru\nmalzemeyle başlar.",
    description: "Kendi tesisimizde ürettiğimiz hammaddeleri ihtiyacınıza göre birlikte değerlendirelim.",
    image: {
      src: "/images/products/hammadde/rulo-nonwoven-kece.webp",
      alt: "Sarı, mavi, pembe ve gri non-woven temizlik bezi ruloları ile yeşil, mor, fuşya ve kenevir renginde ovucu keçe ruloları",
      position: "object-[58%_center] lg:object-center",
    },
    action: { href: "/iletisim", label: "Bize ulaşın" },
  },
  {
    id: "yaninizda",
    eyebrow: "GÜNLÜK YAŞAMIN İÇİNDE",
    title: "Temizliğin her\nadımında yanınızda.",
    description: "Temizlik rutinlerine eşlik eden bez ve sünger seçeneklerini tanıyın.",
    image: {
      src: "/images/home/hero-anne-cocuklar.webp",
      alt: "Mutfakta birlikte bulaşık yıkayıp kurulayan anne ve iki çocuğu",
      position: "object-[84%_center] lg:object-[70%_center]",
    },
    action: { href: "/#kurumsal", label: "Saniteks’i tanıyın" },
  },
];
