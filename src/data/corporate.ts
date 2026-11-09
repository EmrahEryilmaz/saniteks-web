/**
 * Corporate section content (/kurumsal/*), structured after sanifoam.com.tr's "Kurumsal" pages.
 *
 * Sources — nothing here is invented:
 *  - Saniteks live site: vision / mission wording, "kendi tesisimizde ürettiğimiz rulo ve tabaka hammadde".
 *  - sanifoam.com.tr: group founded 1990 in İstanbul, group sectors, group company descriptions, Hendek plant address.
 *  - Saniteks logo on sanifoam.com.tr: trade name "Saniteks Sünger Sanayi Turizm ve Ticaret A.Ş.".
 *  - Company decision (2026-11): head office İstanbul, production in Hendek / Sakarya.
 */
import { site } from "@/lib/site";

export type CorporatePage = { href: string; label: string };

/** Sub-pages shown in the header submenu, footer and the corporate page tabs. */
export const corporatePages: CorporatePage[] = [
  { href: "/kurumsal/hakkinda", label: "Hakkında" },
  { href: "/kurumsal/grup-sirketleri", label: "Grup Şirketleri" },
  { href: "/kurumsal/uretim-tesisleri", label: "Üretim Tesisleri" },
];

export const tradeName = "Saniteks Sünger Sanayi Turizm ve Ticaret A.Ş.";

/** First year of the Sanifoam group (sanifoam.com.tr: "1990 yılında İstanbul'da kuruldu"). */
export const groupFoundedYear = 1990;

export const corporateHeroImage = {
  src: "/images/corporate/hendek-fabrika.webp",
  alt: "Saniteks üretiminin yapıldığı Hendek (Sakarya) fabrikasının dış cephesi ve yükleme rampaları",
  width: 1600,
  height: 1200,
};

/* ------------------------------------------------------------------ */
/* Locations                                                           */
/* ------------------------------------------------------------------ */

export type Location = {
  id: string;
  name: string;
  city: string;
  district: string;
  role: string;
  products?: string;
  production?: string;
  address: string;
  phoneDisplay: string;
  phoneHref: string;
  email: string;
  image?: { src: string; alt: string; width: number; height: number };
  icon: "factory" | "office";
};

export const locations: Location[] = [
  {
    id: "hendek",
    name: "Hendek Fabrikası",
    city: "Sakarya",
    district: "Hendek",
    role: "Üretim",
    products: "Temizlik süngerleri, temizlik bezleri, ovucu materyaller ve özel formlu süngerler.",
    production: "Ürünlerimizde kullanılan rulo ve tabaka hammaddeler de bu tesiste üretilir.",
    address: "Kargalıhanbaba OSB Mah. Organize Sanayi 18. Sk. No:3/1 Hendek / SAKARYA",
    phoneDisplay: site.contact.phoneDisplay,
    phoneHref: site.contact.phoneHref,
    email: site.contact.email,
    image: {
      src: "/images/corporate/hendek-fabrika-yukleme.webp",
      alt: "Hendek fabrikasının yükleme alanı ve bina cephesi",
      width: 1024,
      height: 576,
    },
    icon: "factory",
  },
  {
    id: "merkez",
    name: "Merkez Ofis",
    city: "İstanbul",
    district: "Güneşli - Bağcılar",
    role: "Yönetim",
    address: site.contact.address,
    phoneDisplay: site.contact.phoneDisplay,
    phoneHref: site.contact.phoneHref,
    email: site.contact.email,
    icon: "office",
  },
];

export function mapsHref(address: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

/* ------------------------------------------------------------------ */
/* Mission & vision (live Saniteks wording)                            */
/* ------------------------------------------------------------------ */

export const mission = {
  title: "Misyonumuz",
  statement: "Kaliteyi, güveni ve ihtiyacı birlikte gözetmek.",
  items: ["Ürün, üretim süreci ve iletişimin her aşamasında tutarlı, özenli ve gelişime açık bir çalışma anlayışı sunmak."],
};

export const vision = {
  title: "Vizyonumuz",
  statement: "Değişen ihtiyaçlara açık bir bakış.",
  items: ["İşlevsel ve sorumlu çözümler geliştiren; malzeme, süreç ve kullanım deneyimini birlikte düşünen bir yaklaşımı ileri taşımak."],
};

/* ------------------------------------------------------------------ */
/* Group companies (descriptions from sanifoam.com.tr)                 */
/* ------------------------------------------------------------------ */

export type GroupCompany = {
  id: string;
  name: string;
  description: string;
  image: { src: string; alt: string };
  logo?: { src: string; width: number; height: number };
  url?: string;
  /** Marks the parent company or this site. */
  badge?: "Grup çatısı" | "Bu site";
};

export const groupCompanies: GroupCompany[] = [
  {
    id: "sanifoam",
    name: "Sanifoam",
    description:
      "1990 yılında İstanbul'da kurulan Sanifoam Endüstri ve Tüketim Ürünleri Sanayi Ticaret A.Ş.; otomotiv, beyaz eşya, endüstriyel yalıtım ve temizlik sektörlerindeki müşterileri için sünger, non-woven ve türevi ürünler üretir.",
    image: { src: "/images/corporate/hendek-fabrika.webp", alt: "Sanifoam grubuna ait fabrika binası" },
    logo: { src: "/images/corporate/group/sanifoam-logo.png", width: 940, height: 226 },
    url: "https://www.sanifoam.com.tr",
    badge: "Grup çatısı",
  },
  {
    id: "saniteks",
    name: "Saniteks",
    description:
      "Kendi adını taşıyan markanın yanı sıra STAR ve Blues markalarıyla bulaşık, banyo ve oto süngerleri üretir. Mikrofiber temizlik bezleri, ovucu keçeler ve çelik ovma telleri ile geniş bir evsel ve endüstriyel temizlik ürün gamı sunar.",
    image: { src: "/images/corporate/group/saniteks.webp", alt: "Üretim hattında ilerleyen sarı-yeşil bulaşık süngerleri" },
    logo: { src: "/images/logo/saniteks-logo.png", width: 955, height: 250 },
    badge: "Bu site",
  },
  {
    id: "sanifoam-gmbh",
    name: "Sanifoam GmbH",
    description:
      "Sanifoam'un Avrupa'ya açılan kapısı. Başta Münih olmak üzere Avrupa genelindeki otomotiv ve endüstriyel müşterilere depo, lojistik ve satış sonrası servis hizmetleri sunar.",
    image: { src: "/images/corporate/group/sanifoam-gmbh.webp", alt: "Raflı depo ve lojistik alanı" },
    logo: { src: "/images/corporate/group/sanifoam-gmbh-logo.png", width: 209, height: 60 },
  },
  {
    id: "ultech",
    name: "Ultech Ulaşım Araçları",
    description:
      "Otomotiv sektörü, kaynaklı imalat, kalıp ve fikstür tasarımı ve metal işleme gibi alanlarda üretim yapar; mühendislik birikimini modern teknolojiyle birleştirerek müşterilerine çözümler sunar.",
    image: { src: "/images/corporate/group/ultech.webp", alt: "Metal parça üzerinde kaynak işlemi" },
    logo: { src: "/images/corporate/group/ultech-logo.png", width: 507, height: 142 },
    url: "https://www.ultech.com.tr/",
  },
  {
    id: "corefix",
    name: "Corefix",
    description:
      "Endüstriyel yapışkan çözümleri: çift taraflı, tek taraflı ve transfer özellikli profesyonel yapışkanlı ürünler üretir.",
    image: { src: "/images/corporate/group/corefix.webp", alt: "Farklı genişliklerde yapışkan bant ruloları" },
    logo: { src: "/images/corporate/group/corefix-logo.png", width: 1022, height: 213 },
    url: "https://corefix.com.tr/",
  },
  {
    id: "sanicar",
    name: "Sanicar",
    description: "Fabrika inşaatı, endüstriyel tesis kurulumu ile ticari araç ve forklift kiralama alanlarında hizmet verir.",
    image: { src: "/images/corporate/group/sanicar.webp", alt: "Ticari araç filosu ve tesis binası" },
  },
];
