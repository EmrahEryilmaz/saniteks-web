// Site-wide constants shared by layout, metadata, JSON-LD and contact surfaces.

export const site = {
  name: "Saniteks",
  url: "https://saniteks.com.tr",
  tagline: "Günlük yaşam için temizlik çözümleri",
  footerTagline: "Temizlik ihtiyaçlarına odaklanan ürünler. Birlikte şekillenen çözümler.",
  defaultTitle: "Saniteks | Temizlik Ürünleri ve Çözümleri",
  defaultDescription:
    "Saniteks temizlik bezleri, süngerleri ve malzeme seçeneklerini keşfedin. Ürünler ve iş birliği için bizimle iletişime geçin.",
  locale: "tr_TR",
  logo: "/images/logo/saniteks-logo.png",
  ogImage: "/images/products/hero-materials.webp",
  contact: {
    email: "info@saniteks.com.tr",
    /** Group HR inbox: job applications and "İnsan Kaynakları" contact messages (HR_TO overrides it). */
    hrEmail: "ik@sanifoam.com.tr",
    phoneDisplay: "0 850 304 01 10",
    phoneHref: "tel:+908503040110",
    phoneE164: "+908503040110",
    address: "15 Temmuz Mah. Bahar Cad. Polat İş Merkezi C Blok 6/2 Zemin No:1 Güneşli - Bağcılar / İSTANBUL",
    addressParts: {
      street: "15 Temmuz Mah. Bahar Cad. Polat İş Merkezi C Blok 6/2 Zemin No:1",
      district: "Güneşli - Bağcılar",
      city: "İstanbul",
      country: "TR",
    },
  },
} as const;

export type NavItem = { href: string; label: string };

/** Primary navigation, in the order it appears in the header and mobile menu. */
export const mainNav: NavItem[] = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/kurumsal/hakkinda", label: "Kurumsal" },
  { href: "/kabiliyetler", label: "Kabiliyetler" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/kalite/kalite-politikamiz", label: "Kalite" },
  { href: "/surdurulebilirlik", label: "Sürdürülebilirlik" },
  { href: "/insan-kaynaklari", label: "İnsan Kaynakları" },
  { href: "/iletisim", label: "İletişim" },
];

/** Footer "Site bağlantıları" list. */
export const footerNav: NavItem[] = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/kurumsal/hakkinda", label: "Kurumsal" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/kataloglar", label: "Kataloglar" },
  { href: "/kalite/kalite-politikamiz", label: "Kalite" },
  { href: "/surdurulebilirlik", label: "Sürdürülebilirlik" },
  { href: "/insan-kaynaklari", label: "İnsan Kaynakları" },
  { href: "/iletisim", label: "İletişim" },
];

export const legalNav: NavItem[] = [{ href: "/kvkk-aydinlatma-metni", label: "KVKK Aydınlatma Metni" }];

/** Contact form subjects — shared by the client form and the /api/contact validator. */
export const contactSubjects = ["Genel Bilgi", "Satış", "İnsan Kaynakları", "Diğer"] as const;
export type ContactSubject = (typeof contactSubjects)[number];
