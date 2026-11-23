/**
 * Saniteks product catalogue.
 *
 * Hierarchy: Category → ProductType (a page under /urunler/[category]/[product]) → Sku (a packaged variant).
 *
 * Sources:
 *  - "Sanifoam / Sanitex Ürün Kataloğu" (Şubat 2016) — codes, sizes, case quantities, case sizes.
 *  - "Sanifoam & Sanitex Product Catalog" (EN, published on /kataloglar) — 101.0.303-36 and 101.0.304-36.
 *  - Saniteks shipping list "saniteks ürünler.xlsx" (2026-11) — current codes, names, sizes (dimension codes such as
 *    907045 = 90×70×45 mm, 380400140 = 38×40 cm / 140 gr/m²), new items; catalogue items missing from it are
 *    flagged madeToOrder ("talep üzerine üretim").
 *  - Saniteks studio photos (2026-11, branch "urun_gorselleri"): 111 photos of 52 packaged products, named by product
 *    code, converted to /images/urunler/<code>-<n>.webp (see PHOTOS below).
 *  - ERP stock lists (2026-11) — names, dimension codes, and the roll/plate qualities and colours summarised under
 *    "Plaka ve Rulo Ürünler" (customer-specific prints and brands are deliberately left out).
 * Barcodes are intentionally omitted (several are duplicated in the source catalogue).
 * Measurements use Turkish decimal commas.
 */

export type ProductLine = "Süper" | "Standart" | "Ekonomik" | "Endüstriyel" | "Avantaj" | "Konfor";

/** How a case of the SKU is shipped. */
export type Packaging = "koli" | "naylon-torba" | "cuval";

export type SpecRow = { label: string; value: string };

export type Sku = {
  /** URL-safe id; also the file name of the catalogue photo in /images/catalog. */
  slug: string;
  /** Catalogue product code, e.g. "100.0.350-30". Some catalogue items have no code. */
  code?: string;
  name: string;
  nameEn: string;
  line?: ProductLine;
  /** Product dimensions, e.g. "9 × 7 × 4,5 cm". */
  productSize?: string;
  /** Packs per case (koli / naylon torba / çuval). */
  packsPerCase?: string;
  /** Outer case dimensions. */
  caseSize?: string;
  packaging?: Packaging;
  /** Additional rows (weight, composition, grammage …). */
  extra?: SpecRow[];
  /** Main photo (the first of `photos`, or an old catalogue packshot); omitted → a neutral placeholder is shown. */
  image?: string;
  imageAlt?: string;
  /** Every studio photo of the SKU in display order (packaging first). Filled from PHOTOS below. */
  photos?: Photo[];
  /** Fibre colour alternatives offered for this SKU (Süper Tekli packs). */
  colorOptions?: ColorOptionGroup;
  /** Not in the current shipping list (2026-11): offered as "talep üzerine üretim". Set by MADE_TO_ORDER below. */
  madeToOrder?: boolean;
};

export type Photo = { src: string; alt: string };

export type ColorOption = { name: string; hex: string; code?: string };

export type ColorOptionGroup = {
  title: string;
  note: string;
  options: ColorOption[];
};

/** Matrix table for raw materials, e.g. fibre grammage → available colours. */
export type SpecMatrix = {
  title: string;
  note?: string;
  rows: { label: string; colors: ColorOption[] }[];
};

export type ProductType = {
  slug: string;
  categorySlug: string;
  name: string;
  shortDescription: string;
  description: string[];
  highlights: string[];
  image: string;
  imageAlt: string;
  /** "styled" = editorial photo (cover); "catalog" = packshot on white (contain). */
  imageStyle: "styled" | "catalog";
  skus: Sku[];
  matrix?: SpecMatrix;
};

export type Category = {
  slug: string;
  name: string;
  shortDescription: string;
  intro: string[];
  /** 4:3 category image: page hero and cards (home, /urunler, "Diğer kategoriler"). */
  image: string;
  imageAlt: string;
  products: ProductType[];
};

/** Old catalogue cut-outs (2016), still used by items without a studio photo. */
const img = (slug: string) => `/images/catalog/${slug}.webp`;

/** Studio photo n (1-based) of a product code, e.g. photo("101.0.303-36", 3). */
const photo = (code: string, n: number) => `/images/urunler/${code.toLowerCase().replace(/\./g, "-")}-${n}.webp`;

/* ------------------------------------------------------------------ */
/* Shared colour palettes                                              */
/* ------------------------------------------------------------------ */

const FIBER = {
  // Hex values sampled from the catalogue swatches.
  green: { name: "Yeşil", hex: "#009400" },
  purple: { name: "Mor", hex: "#9f00ff" },
  lightGreen: { name: "Fıstık yeşili", hex: "#b4fb36" },
  blue: { name: "Mavi", hex: "#0071ca" },
  white: { name: "Beyaz", hex: "#ffffff" },
  red: { name: "Kırmızı", hex: "#c81517" },
  pink: { name: "Pembe", hex: "#df5887" },
  black: { name: "Siyah", hex: "#111111" },
  orange: { name: "Turuncu", hex: "#f18904" },
  yellow: { name: "Sarı", hex: "#ecef3a" },
  darkGreen: { name: "Koyu yeşil", hex: "#1d4d22" },
  turquoise: { name: "Turkuaz", hex: "#19b4e6" },
  glitterBlack: { name: "Simli siyah", hex: "#3a3a3a" },
  brick: { name: "Kiremit", hex: "#b4452a" },
  // Felt colours from the 2026-11 roll list (approximate).
  fuchsia: { name: "Fuşya", hex: "#d2207c" },
  violet: { name: "Menekşe", hex: "#7d4fb0" },
  burgundy: { name: "Bordo", hex: "#7a1f2e" },
  walnutGreen: { name: "Ceviz yeşili", hex: "#4a5a2a" },
  fluoGreen: { name: "Flor yeşil", hex: "#7cf03c" },
  natural: { name: "Natürel", hex: "#c8a46a" },
  glitterGreen: { name: "Simli yeşil", hex: "#2f6b34" },
} satisfies Record<string, ColorOption>;

/** Non-woven cloth colours (approximate). */
const CLOTH = {
  yellow: { name: "Sarı", hex: "#f6d21e" },
  blue: { name: "Mavi", hex: "#3d8fd8" },
  pink: { name: "Pembe", hex: "#f07aa6" },
  candyPink: { name: "Şeker pembe", hex: "#f9b6cf" },
  green: { name: "Yeşil", hex: "#2e9e4f" },
  appleGreen: { name: "Elma yeşili", hex: "#9acd32" },
  orange: { name: "Turuncu", hex: "#f39020" },
  turquoise: { name: "Turkuaz", hex: "#22b8c8" },
  white: { name: "Beyaz", hex: "#ffffff" },
  black: { name: "Siyah", hex: "#1a1a1a" },
} satisfies Record<string, ColorOption>;

/** Fibre colour alternatives printed next to the "Süper Tekli Paket" items; code = series + colour + case qty. */
function fiberOptions(series: "100.0" | "101.0", caseQty: number): ColorOption[] {
  const colours: [keyof typeof FIBER, string][] = [
    ["green", "001"],
    ["purple", "050"],
    ["lightGreen", "125"],
    ["blue", "150"],
    ["white", "175"],
    ["red", "200"],
    ["pink", "225"],
    ["black", "250"],
    ["orange", "275"],
  ];
  return colours.map(([key, colourCode]) => ({ ...FIBER[key], code: `${series}.${colourCode}-${caseQty}` }));
}

/* ------------------------------------------------------------------ */
/* 1. Temizlik Süngerleri                                              */
/* ------------------------------------------------------------------ */

const klasikTemizlikSungeri: ProductType = {
  slug: "klasik-temizlik-sungeri",
  categorySlug: "temizlik-sungerleri",
  name: "Düz Bulaşık Süngeri",
  shortDescription: "Düz dikdörtgen sünger gövde ve ovucu keçe yüzeyden oluşan temel bulaşık süngeri.",
  description: [
    "Düz bulaşık süngeri, dikdörtgen sünger gövdesi ve ovucu keçe yüzeyiyle günlük bulaşık ve mutfak temizliğinin temel ürünüdür.",
    "Tekli paketten 10'lu pakete, standart yeşil keçeden renkli ekonomik serilere kadar farklı paket ve ölçü seçenekleriyle sunulur. Süper tekli pakette keçe rengi dokuz farklı renk arasından seçilebilir.",
  ],
  highlights: ["Düz dikdörtgen gövde", "Ovucu keçe yüzey", "Süper, standart ve ekonomik seriler", "Süper tekli pakette dokuz keçe rengi"],
  image: "/images/products/temizlik-sungerleri/classic-cleaning-sponge.webp",
  imageAlt: "Yeşil gövdeli düz bulaşık süngerleri",
  imageStyle: "styled",
  skus: [
    {
      slug: "super-tekli-duz",
      code: "101.0.001-50",
      name: "Süper Tekli Paket",
      nameEn: "Super Single Pack",
      line: "Süper",
      productSize: "11 × 7 × 2,5 cm",
      packsPerCase: "50",
      caseSize: "23 × 40 × 16 cm",
      packaging: "koli",
      colorOptions: {
        title: "Keçe renk alternatifleri",
        note: "Keçe rengi aşağıdaki seçeneklerden belirlenebilir. Kod, seri ve koli içi adetle birlikte verilmiştir.",
        options: fiberOptions("101.0", 50),
      },
    },
    {
      slug: "101-0-302-72",
      code: "101.0.302-72",
      name: "Düz İkili Kartonlu Paket",
      nameEn: "Standard Green, 2 pcs/pack",
      line: "Standart",
      productSize: "10,3 × 8,3 × 2,5 cm",
      packsPerCase: "72",
      caseSize: "34 × 40 × 25 cm",
      packaging: "koli",
    },
    {
      slug: "101-0-350-40",
      code: "101.0.350-40",
      name: "Standart Yeşil 3'lü Paket",
      nameEn: "Standard Green, 3 pcs/pack",
      line: "Standart",
      productSize: "11 × 7 × 2,5 cm",
      packsPerCase: "40",
      caseSize: "34 × 40 × 25 cm",
      packaging: "koli",
    },
    {
      slug: "101-0-376-24",
      code: "101.0.376-24",
      name: "Büyük Yeşil 3'lü Paket",
      nameEn: "Big Green, 3 pcs/pack",
      line: "Standart",
      productSize: "12,5 × 9 × 2,5 cm",
      packsPerCase: "24",
      caseSize: "40 × 29 × 22 cm",
      packaging: "koli",
    },
    {
      slug: "101-0-410-30",
      code: "101.0.410-30",
      name: "Standart Yeşil 10'lu Paket",
      nameEn: "Standard Green, 10 pcs/pack",
      line: "Standart",
      productSize: "11 × 7 × 2,5 cm",
      packsPerCase: "30",
      caseSize: "46 × 36 × 47 cm",
      packaging: "koli",
    },
    {
      slug: "101-0-800-66t",
      code: "101.0.800-66T",
      name: "Ekonomik Düz 5'li Renkli Paket",
      nameEn: "Economic Multicolor, 5 pcs/pack",
      line: "Ekonomik",
      productSize: "9 × 6 × 3 cm",
      packsPerCase: "66",
      caseSize: "56 × 67 × 13 cm",
      packaging: "naylon-torba",
    },
    {
      slug: "101-0-750-48",
      code: "101.0.750-48",
      name: "Ekonomik Düz Büyük 5'li Renkli Paket",
      nameEn: "Economic Big Multicolor, 5 pcs/pack",
      line: "Ekonomik",
      productSize: "11 × 7,5 × 3,5 cm",
      packsPerCase: "48",
      caseSize: "46 × 36 × 47 cm",
      packaging: "koli",
    },
    {
      slug: "101-0-850-36t",
      code: "101.0.850-36T",
      name: "Ekonomik Düz 10'lu Renkli Paket",
      nameEn: "Economic Multicolor, 10 pcs/pack",
      line: "Ekonomik",
      productSize: "9 × 6 × 3 cm",
      packsPerCase: "36",
      caseSize: "54 × 58 × 18,5 cm",
      packaging: "naylon-torba",
    },
  ],
};

const olukluTemizlikSungeri: ProductType = {
  slug: "oluklu-temizlik-sungeri",
  categorySlug: "temizlik-sungerleri",
  name: "Oluklu Bulaşık Süngeri",
  shortDescription: "Yan yüzeyindeki oluklarla farklı bir kavrama formu sunan sünger seçeneği.",
  description: [
    "Oluklu bulaşık süngeri, yan yüzeyindeki kavrama oluğu sayesinde elde daha rahat tutulan bir gövde formu sunar; üst yüzeydeki ovucu keçe zorlu kirlerde etkili temas sağlar.",
    "Süper ve ekonomik seriler; tekli, 3'lü, 5'li, 8'li ve 10'lu paket seçenekleriyle hazırlanır. Ekonomik tekli seçenek çuvalda toplu sevkiyata uygundur.",
  ],
  highlights: ["Kavrama oluklu gövde", "Ovucu keçe yüzey", "Tekliden 10'lu pakete", "Süper tekli pakette dokuz keçe rengi"],
  image: "/images/products/temizlik-sungerleri/grooved-cleaning-sponge.webp",
  imageAlt: "Oluklu gövdeye sahip temizlik süngeri",
  imageStyle: "styled",
  skus: [
    {
      slug: "super-tekli-oluklu",
      code: "100.0.125-40",
      name: "Süper Tekli Paket – Fıstık Yeşili Keçe",
      nameEn: "Super Single Pack",
      line: "Süper",
      productSize: "9 × 7 × 4,5 cm",
      packsPerCase: "40",
      caseSize: "23 × 40 × 16 cm",
      packaging: "koli",
      colorOptions: {
        title: "Keçe renk alternatifleri",
        note: "Keçe rengi aşağıdaki seçeneklerden belirlenebilir. Kod, seri ve koli içi adetle birlikte verilmiştir.",
        options: fiberOptions("100.0", 40),
      },
    },
    {
      slug: "100-0-350-30",
      code: "100.0.350-30",
      name: "Süper Yeşil 3'lü Paket",
      nameEn: "Super Green, 3 pcs/pack",
      line: "Süper",
      productSize: "9 × 7 × 4,5 cm",
      packsPerCase: "30",
      caseSize: "40 × 34 × 25 cm",
      packaging: "koli",
    },
    {
      slug: "100-0-400-16",
      code: "100.0.400-16",
      name: "Süper Yeşil 5'li Paket",
      nameEn: "Super Green, 5 pcs/pack",
      line: "Süper",
      productSize: "9 × 7 × 4,5 cm",
      packsPerCase: "16",
      caseSize: "57 × 24 × 19 cm",
      packaging: "koli",
    },
    {
      slug: "100-0-600-c",
      code: "100.0.600-C",
      name: "Ekonomik Oluklu Tekli Paket",
      nameEn: "Economic Single with Grip",
      line: "Ekonomik",
      productSize: "8,5 × 6,5 × 4,2 cm",
      packsPerCase: "35 × 60 (2.100 adet / çuval)",
      caseSize: "120 × 150 × 35 cm",
      packaging: "cuval",
    },
    {
      slug: "100-0-800-120t",
      code: "100.0.800-120T",
      name: "Ekonomik Oluklu 5'li Paket",
      nameEn: "Economic with Grip, 5 pcs/pack",
      line: "Ekonomik",
      productSize: "8 × 5,5 × 4,2 cm",
      packsPerCase: "120",
      caseSize: "82 × 62 × 21 cm",
      packaging: "naylon-torba",
    },
    {
      slug: "100-0-850-60t",
      code: "100.0.850-60T",
      name: "Ekonomik Oluklu 10'lu Paket",
      nameEn: "Economic with Grip, 10 pcs/pack",
      line: "Ekonomik",
      productSize: "8,5 × 6,5 × 4,2 cm",
      packsPerCase: "60",
      caseSize: "100 × 69 × 21 cm",
      packaging: "naylon-torba",
    },
    {
      slug: "100-0-876-60t",
      code: "100.0.876-60T",
      name: "Ekonomik Oluklu 8'li Paket (Blues)",
      nameEn: "Economic with Grip, 8 pcs/pack",
      line: "Ekonomik",
      productSize: "9 × 7 × 4,5 cm",
      packsPerCase: "60",
      caseSize: "73 × 57 × 35 cm",
      packaging: "naylon-torba",
    },
  ],
};

const ozelBulasikSungerleri: ProductType = {
  slug: "ozel-bulasik-sungerleri",
  categorySlug: "temizlik-sungerleri",
  name: "Özel Bulaşık Süngerleri",
  shortDescription: "Ovucu keçe yerine file kaplı yüzeye sahip bulaşık süngeri.",
  description: [
    "Ultra Parlak bulaşık süngeri, ovucu keçe yerine file kaplı yüzeye sahip sünger gövdesiyle hazırlanır.",
    "Bantlı ambalajında tekli olarak sunulur.",
  ],
  highlights: ["File kaplı yüzey", "Sünger gövde", "Bantlı ambalaj"],
  image: photo("101.0.304-36", 1),
  imageAlt: "File kaplı yeşil Ultra Parlak bulaşık süngeri, bantlı ambalajında",
  imageStyle: "catalog",
  skus: [
    {
      slug: "101-0-304-36",
      code: "101.0.304-36",
      name: "Ultra Parlak Bulaşık Süngeri",
      nameEn: "Ultra Shine Scrubber Sponge",
      productSize: "13,7 × 8 × 3 cm",
      packsPerCase: "36",
    },
  ],
};

const endustriyelTemizlikSungeri: ProductType = {
  slug: "endustriyel-temizlik-sungeri",
  categorySlug: "temizlik-sungerleri",
  name: "Endüstriyel Temizlik Süngeri",
  shortDescription: "Büyük gövde ölçüleriyle ve kullanım alanına göre renk koduyla ayrışan sünger seçenekleri.",
  description: [
    "Endüstriyel temizlik süngerleri, standart bulaşık süngerlerine göre daha büyük gövde ölçüleriyle hazırlanır.",
    "4'lü paketler kullanım alanına göre renk koduyla ayrışır: yeşil keçe mutfak, mavi keçe banyo, pembe keçe hassas alanlar içindir. Büyük tekli paket 14 × 11 × 8 cm ölçüsündeki kalın gövdesiyle ayrışır.",
  ],
  highlights: ["Büyük gövde ölçüleri", "Mutfak, banyo ve hassas yüzey ayrımı", "Renk kodlu kullanım"],
  image: photo("102.0.090-16", 1),
  imageAlt: "Süper endüstriyel 4'lü sünger paketi",
  imageStyle: "catalog",
  skus: [
    {
      slug: "102-0-600-60",
      code: "102.0.600-60",
      name: "Süper Endüstriyel Büyük Tekli Paket",
      nameEn: "Super Industrial Single Big Pack",
      line: "Endüstriyel",
      productSize: "14 × 11 × 8 cm",
      packsPerCase: "60",
      caseSize: "46 × 36 × 47 cm",
      packaging: "koli",
    },
    {
      slug: "102-0-090-16",
      code: "102.0.090-16",
      name: "Süper Endüstriyel 4'lü Paket – Mutfak",
      nameEn: "Super Industrial, 4 pcs/pack, Kitchen",
      line: "Endüstriyel",
      productSize: "16 × 11 × 2,5 cm",
      packsPerCase: "16",
      caseSize: "34 × 40 × 25 cm",
      packaging: "koli",
    },
    {
      slug: "102-0-101-16",
      code: "102.0.101-16",
      name: "Süper Endüstriyel Mavi 4'lü Paket – Banyo",
      nameEn: "Super Industrial, Blue, 4 pcs/pack, Bath",
      line: "Endüstriyel",
      productSize: "16 × 11 × 2,5 cm",
      packsPerCase: "16",
      caseSize: "34 × 40 × 25 cm",
      packaging: "koli",
    },
    {
      slug: "102-0-102-16",
      code: "102.0.102-16",
      name: "Süper Endüstriyel Pembe 4'lü Paket – Hassas",
      nameEn: "Super Industrial, Pink, 4 pcs/pack, Sensitive Area",
      line: "Endüstriyel",
      productSize: "16 × 11 × 2,5 cm",
      packsPerCase: "16",
      caseSize: "34 × 40 × 25 cm",
      packaging: "koli",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 2. Temizlik Bezleri                                                 */
/* ------------------------------------------------------------------ */

const cokAmacliTemizlikBezi: ProductType = {
  slug: "cok-amacli-temizlik-bezi",
  categorySlug: "temizlik-bezleri",
  name: "Çok Amaçlı Temizlik Bezi",
  shortDescription: "Farklı günlük temizlik uygulamalarına eşlik eden katlanmış bez biçimi.",
  description: [
    "Çok amaçlı temizlik bezleri; mutfak tezgâhından cam yüzeylere, günlük toz almadan dökülen sıvıları toplamaya kadar farklı temizlik uygulamalarında kullanılır.",
    "Standart, süper baskılı ve avantaj serileri; tek renk ya da üç renkli paketlerle sunulur. Sünger bez seçeneği, emici selülozik yapısıyla ıslak temizliğe yöneliktir.",
  ],
  highlights: ["38 × 40 cm ve 34 × 34 cm ölçüler", "Tek renk ve 3 renk paketler", "Baskılı süper seri", "Sünger bez seçeneği"],
  image: "/images/products/temizlik-bezleri/multi-purpose-cleaning-cloth.webp",
  imageAlt: "Katlanmış çok amaçlı temizlik bezleri",
  imageStyle: "styled",
  skus: [
    {
      slug: "110-0-050-20",
      code: "110.0.050-20",
      name: "Süper Baskılı 3'lü Temizlik Bezi",
      nameEn: "Super Cleaning Cloth, 3 pcs/pack – Printed",
      line: "Süper",
      productSize: "38 × 36 cm",
      packsPerCase: "20",
      caseSize: "40 × 20 × 21 cm",
      packaging: "koli",
      extra: [{ label: "Gramaj", value: "140 gr/m²" }],
    },
    {
      slug: "110-0-001-20",
      code: "110.0.001-20",
      name: "Standart 3'lü Temizlik Bezi",
      nameEn: "Standard Cleaning Cloth, 3 pcs/pack",
      line: "Standart",
      productSize: "38 × 40 cm",
      packsPerCase: "20",
      caseSize: "40 × 20 × 21 cm",
      packaging: "koli",
      extra: [{ label: "Gramaj", value: "140 gr/m²" }],
    },
    {
      slug: "110-0-002-20",
      code: "110.0.002-20",
      name: "Standart 3'lü Temizlik Bezi (3 Renk)",
      nameEn: "Standard Cleaning Cloth, 3 pcs/pack (3 Colors)",
      line: "Standart",
      productSize: "38 × 40 cm",
      packsPerCase: "20",
      caseSize: "40 × 20 × 21 cm",
      packaging: "koli",
    },
    {
      slug: "110-0-201-20",
      code: "110.0.201-20",
      name: "Standart 5'li Temizlik Bezi",
      nameEn: "Standard Cleaning Cloth, 5 pcs/pack",
      line: "Standart",
      productSize: "38 × 40 cm",
      packsPerCase: "20",
      caseSize: "34 × 40 × 25 cm",
      packaging: "koli",
    },
    {
      slug: "110-0-650-c",
      code: "110.0.650-C",
      name: "Avantaj 3'lü Temizlik Bezi",
      nameEn: "Advantage Cleaning Cloth, 3 pcs/pack",
      line: "Avantaj",
      productSize: "34 × 34 cm",
      packsPerCase: "250",
      caseSize: "68 × 21 × 92 cm",
      packaging: "naylon-torba",
      extra: [{ label: "Gramaj", value: "100 gr/m²" }],
    },
    {
      slug: "110-0-663-c",
      code: "110.0.663-C",
      name: "Avantaj 3'lü Temizlik Bezi (3 Renk)",
      nameEn: "Advantage Cleaning Cloth, 3 pcs/pack (3 Colors)",
      line: "Avantaj",
      productSize: "34 × 34 cm",
      packsPerCase: "250",
      caseSize: "68 × 21 × 92 cm",
      packaging: "naylon-torba",
    },
  ],
};

const ruloTemizlikBezi: ProductType = {
  slug: "rulo-temizlik-bezi",
  categorySlug: "temizlik-bezleri",
  name: "Rulo Temizlik Bezi",
  shortDescription: "Rulo formunda sunulan dokulu temizlik bezi seçeneği.",
  description: [
    "Perforeli rulo temizlik bezi, ihtiyaç kadar koparılarak kullanılan yaprak yapısıyla mutfak ve genel yüzey temizliğinde pratik bir kullanım sunar.",
    "26 × 405 cm ölçüsündeki rulo; sarı, mavi ve pembe renk seçenekleriyle, askılı ambalajda hazırlanır.",
  ],
  highlights: ["Perforeli yaprak yapısı", "26 × 405 cm rulo", "Sarı, mavi ve pembe", "Askılı ambalaj"],
  image: "/images/products/temizlik-bezleri/rolled-cleaning-cloth.webp",
  imageAlt: "Kısmen açılmış rulo temizlik bezi",
  imageStyle: "styled",
  skus: [
    {
      slug: "110-0-840-12",
      code: "110.0.840-12",
      name: "Perforeli Rulo Temizlik Bezi – Sarı",
      nameEn: "Perforated Cleaning Cloth in Roll (Yellow)",
      productSize: "26 × 405 cm",
      packsPerCase: "12",
      caseSize: "40 × 30 × 29 cm",
      packaging: "koli",
      extra: [
        { label: "Gramaj", value: "100 gr/m²" },
        { label: "Yaprak sayısı", value: "15 yaprak" },
      ],
    },
    {
      slug: "110-0-841-12",
      code: "110.0.841-12",
      name: "Perforeli Rulo Temizlik Bezi – Mavi",
      nameEn: "Perforated Cleaning Cloth in Roll (Blue)",
      productSize: "26 × 405 cm",
      packsPerCase: "12",
      caseSize: "40 × 30 × 29 cm",
      packaging: "koli",
      extra: [
        { label: "Gramaj", value: "100 gr/m²" },
        { label: "Yaprak sayısı", value: "15 yaprak" },
      ],
    },
    {
      slug: "110-0-842-12",
      code: "110.0.842-12",
      name: "Perforeli Rulo Temizlik Bezi – Pembe",
      nameEn: "Perforated Cleaning Cloth in Roll (Pink)",
      productSize: "26 × 405 cm",
      packsPerCase: "12",
      caseSize: "40 × 30 × 29 cm",
      packaging: "koli",
      extra: [
        { label: "Gramaj", value: "100 gr/m²" },
        { label: "Yaprak sayısı", value: "15 yaprak" },
      ],
    },
  ],
};

const camVeMikrofiberBez: ProductType = {
  slug: "cam-ve-mikrofiber-bez",
  categorySlug: "temizlik-bezleri",
  name: "Sünger Bez, Mikrofiber ve Cam Bezi",
  shortDescription: "Parlak yüzeyler ve iz bırakmadan temizlik için cam ve mikrofiber bez seçenekleri.",
  description: [
    "Cam bezi; cam, ayna ve parlak yüzeylerde kullanım için hazırlanan düz dokulu bir bezdir. Mikrofiber bez ise ince lif yapısıyla tozu ve kiri tutmaya yönelik bir seçenektir.",
    "Her iki ürün de günlük ev temizliğinde farklı yüzeylere eşlik edecek şekilde tekli ve çok renkli paketlerle sunulur.",
  ],
  highlights: ["Cam ve parlak yüzeyler", "İnce lifli mikrofiber yapı", "Tekli ve çok renkli paket"],
  image: photo("116.0.005-50", 2),
  imageAlt: "Mavi, sarı ve pembe mikrofiber bezler ve ambalajı",
  imageStyle: "catalog",
  skus: [
    {
      slug: "113-0-001-48",
      code: "113.0.001-48",
      name: "3'lü Sünger Bez",
      nameEn: "Sponge Cloth, 3 pcs/pack",
      productSize: "16 × 18 cm",
      packsPerCase: "48",
      caseSize: "38 × 25 × 23 cm",
      packaging: "koli",
    },
    {
      slug: "112-0-002-60",
      code: "112.0.002-60",
      name: "Düz Cam Bezi",
      nameEn: "Window Cloth",
      productSize: "35 × 40 cm",
      packsPerCase: "60",
      caseSize: "23 × 40 × 16 cm",
      packaging: "koli",
      image: img("112-0-002-60"),
      imageAlt: "Düz cam bezi ambalajı",
    },
    {
      slug: "116-0-005-50",
      code: "116.0.005-50",
      name: "Mikrofiber Bez",
      nameEn: "Microfiber Cloth",
      packsPerCase: "50",
      caseSize: "23 × 40 × 16 cm",
      packaging: "koli",
    },
  ],
};

const yerBezi: ProductType = {
  slug: "yer-bezi",
  categorySlug: "temizlik-bezleri",
  name: "Yer Bezi",
  shortDescription: "Zemin temizliği için kareli ve desenli dokuma görünümlü yer bezleri.",
  description: [
    "Yer bezleri, zemin temizliğinde suyu tutan ve yüzeyde rahat hareket eden dokulu yapısıyla günlük paspas ve silme işlerine yöneliktir.",
    "Çiçek desenli, yeşil kareli ve mavi kareli seçenekler tekli ambalajda sunulur. Aynı dokular rulo hammadde olarak da üretilmektedir.",
  ],
  highlights: ["38 × 50 cm ve 40 × 50 cm", "Çiçek desenli, yeşil ve mavi kareli", "Tekli ambalaj"],
  image: photo("114.0.003-50", 1),
  imageAlt: "Çiçek desenli yer bezi ambalajı",
  imageStyle: "catalog",
  skus: [
    {
      slug: "114-0-003-50",
      code: "114.0.003-50",
      name: "Çiçek Desenli Yer Bezi",
      nameEn: "Flower Patterned Floor Cloth",
      productSize: "38 × 50 cm",
      packsPerCase: "50",
      caseSize: "34 × 40 × 25 cm",
      packaging: "koli",
    },
    {
      slug: "114-0-001-50",
      code: "114.0.001-50",
      name: "Yeşil Kareli Yer Bezi",
      nameEn: "Green Floor Cloth",
      productSize: "40 × 50 cm",
      packsPerCase: "50",
      caseSize: "34 × 40 × 25 cm",
      packaging: "koli",
    },
    {
      slug: "114-0-100-50",
      code: "114.0.100-50",
      name: "Mavi Kareli Yer Bezi",
      nameEn: "Blue Floor Cloth",
      productSize: "40 × 50 cm",
      packsPerCase: "50",
      caseSize: "34 × 40 × 25 cm",
      packaging: "koli",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 3. Ovucu Materyaller                                                */
/* ------------------------------------------------------------------ */

const ovmaTeli: ProductType = {
  slug: "ovma-teli",
  categorySlug: "ovucu-materyaller",
  name: "Ovma Teli",
  shortDescription: "Spiral tel yapısıyla zorlu kirlerde güçlü ovma sağlayan ovucu ürün.",
  description: [
    "Ovma teli, spiral metal tel yapısıyla tencere, tava ve ızgaralardaki yanmış ve yapışmış kirlerde güçlü ovma sağlar.",
    "Elde tutmayı kolaylaştıran süngerli seçenek, askılı kartta 12'li perakende sunum ve 60 gramlık endüstriyel ovma teli ile farklı kullanım ölçeklerine yanıt verir.",
  ],
  highlights: ["Spiral metal tel", "Süngerli tutma seçeneği", "12'li askılı kart", "60 gr endüstriyel seçenek"],
  image: "/images/products/ovucu-materyaller/scouring-wire.webp",
  imageAlt: "Yan yana dizilmiş spiral metal ovma telleri",
  imageStyle: "styled",
  skus: [
    {
      slug: "120-0-101-60",
      code: "120.0.101-60",
      name: "Süngerli Ovma Teli",
      nameEn: "Scouring Ball with Sponge",
      productSize: "9 × 9 × 4,8 cm",
      packsPerCase: "60",
      caseSize: "40 × 34 × 25 cm",
      packaging: "koli",
      image: img("120-0-101-60"),
      imageAlt: "Süngerli ovma teli ve ambalajı",
    },
    {
      slug: "120-0-401-60",
      code: "120.0.401-60",
      name: "12'li Ovma Teli (Askılı Kart)",
      nameEn: "Scouring Ball, 12 pcs/card",
      packsPerCase: "60",
      caseSize: "64 × 59 × 43 cm",
      packaging: "koli",
      extra: [{ label: "Ağırlık", value: "13 gr / adet" }],
      image: img("120-0-401-60"),
      imageAlt: "Askılı kartta 12'li ovma teli",
    },
    {
      slug: "120-0-910",
      code: "120.0.910",
      name: "Endüstriyel Ovma Teli, 60 gr",
      nameEn: "Industrial Scouring Ball, 60 gr",
      line: "Endüstriyel",
      packsPerCase: "80",
      caseSize: "46 × 36 × 47 cm",
      packaging: "koli",
      extra: [{ label: "Ağırlık", value: "60 gr / adet" }],
      image: img("120-0-910"),
      imageAlt: "Endüstriyel spiral ovma teli",
    },
  ],
};

const ovucuKece: ProductType = {
  slug: "ovucu-kece",
  categorySlug: "ovucu-materyaller",
  name: "Ovucu Keçe",
  shortDescription: "Farklı renk seçenekleriyle sunulan, mutfak ve yüzey temizliğinde etkili ovma sağlayan lifli keçe.",
  description: [
    "Ovucu keçe (ovma fiberi), sünger gövdesi olmadan doğrudan elde kullanılan lifli bir ovma malzemesidir; tezgâh, ocak ve tencere gibi yüzeylerdeki inatçı kirlere yöneliktir.",
    "Yeşil, renkli ve simli siyah seçenekler; 3'lü ve 5'li paketlerle sunulur. Keçenin kendisi rulo hammadde olarak da farklı gramaj ve renklerde üretilmektedir.",
  ],
  highlights: ["Süngersiz lifli ovma yüzeyi", "Yeşil, renkli ve simli siyah", "3'lü ve 5'li paketler"],
  image: "/images/products/ovucu-materyaller/scouring-pad.webp",
  imageAlt: "Üst üste dizilmiş mor, mavi, yeşil, sarı ve kırmızı ovucu keçeler",
  imageStyle: "styled",
  skus: [
    {
      slug: "125-0-105-100",
      code: "125.0.105-100",
      name: "Siyah 3'lü Ovma Fiberi (Simli)",
      nameEn: "Black Scouring Fiber, 3 pcs/pack (Glittering)",
      productSize: "10 × 15 cm",
      packsPerCase: "100",
      caseSize: "50 × 42 × 15 cm",
      packaging: "naylon-torba",
    },
    {
      slug: "125-0-114-120",
      code: "125.0.114-120",
      name: "Ovma Fiberi 3'lü",
      nameEn: "Scouring Fiber, 3 pcs/pack",
      productSize: "14 × 13 cm",
      packsPerCase: "120",
      caseSize: "54 × 64 × 14 cm",
      packaging: "naylon-torba",
    },
    {
      slug: "125-0-502-90",
      code: "125.0.502-90",
      name: "Avantaj 3'lü Ovma Fiberi",
      nameEn: "Advantage Scouring Fiber, 3 pcs/pack",
      line: "Avantaj",
      productSize: "10 × 15 cm",
      packsPerCase: "90",
      caseSize: "34 × 40 × 25 cm",
      packaging: "koli",
    },
    {
      slug: "125-0-115-80",
      code: "125.0.115-80",
      name: "Renkli Ovma Fiberi 5'li",
      nameEn: "Scouring Fiber Multicolor, 5 pcs/pack",
      productSize: "14 × 13 cm",
      packsPerCase: "80",
      caseSize: "54,5 × 67 × 14 cm",
      packaging: "naylon-torba",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* 4. Özel Formlu Süngerler                                            */
/* ------------------------------------------------------------------ */

const banyoVeBakimSungerleri: ProductType = {
  slug: "banyo-ve-bakim-sungerleri",
  categorySlug: "ozel-formlu-sungerler",
  name: "Banyo ve Bakım Süngerleri",
  shortDescription: "Oval ve kelebek formlu masajlı banyo süngerleri ile masajlı banyo eldiveni.",
  description: [
    "Banyo ve bakım süngerleri, kişisel kullanım için şekillendirilmiş formlardan oluşur: oval ve kelebek formlu masajlı banyo süngerleri ile ele geçirilerek kullanılan masajlı banyo eldiveni.",
    "Selülozik banyo süngerleri ve makyaj temizleme süngerleri Doğal Ürünler grubunda yer alır.",
  ],
  highlights: ["Oval ve kelebek formlu masajlı süngerler", "Masajlı banyo eldiveni", "Naylon torba ve koli sevkiyat"],
  image: photo("104.0.102-80T", 3),
  imageAlt: "Masajlı oval banyo süngeri ve ambalajı",
  imageStyle: "catalog",
  skus: [
    {
      slug: "104-0-102-80t",
      code: "104.0.102-80T",
      name: "Masajlı Oval Banyo Süngeri",
      nameEn: "Oval Bath Sponge with Massage",
      productSize: "15 × 10 × 4,5 cm",
      packsPerCase: "80",
      caseSize: "52 × 68 × 14 cm",
      packaging: "naylon-torba",
    },
    {
      slug: "104-0-103-100",
      code: "104.0.103-100",
      name: "Masajlı Kelebek Banyo Süngeri",
      nameEn: "Butterfly Bath Sponge with Massage",
      productSize: "15 × 9,5 × 4,5 cm",
      packsPerCase: "100",
      caseSize: "65 × 60 × 15 cm",
      packaging: "naylon-torba",
    },
    {
      slug: "104-0-104-90",
      code: "104.0.104-90",
      name: "Masajlı Banyo Eldiveni",
      nameEn: "Bath Glove with Massage",
      productSize: "21 × 15 × 2 cm",
      packsPerCase: "90",
      caseSize: "46 × 36 × 47 cm",
      packaging: "koli",
    },
  ],
};

const otoSungerleri: ProductType = {
  slug: "oto-sungerleri",
  categorySlug: "ozel-formlu-sungerler",
  name: "Oto Süngerleri",
  shortDescription: "Araç yıkamaya yönelik, iri gözenekli büyük oval süngerler.",
  description: [
    "Oto süngerleri, köşesiz oval formu ve iri gözenekli yapısıyla araç gövdesi gibi geniş ve kavisli yüzeylerin yıkanmasına yöneliktir.",
    "Oval oto süngeri ve şampuanlı oto süngeri, naylon torbada toplu sevkiyata uygun olarak hazırlanır.",
  ],
  highlights: ["Köşesiz oval form", "İri gözenekli yapı", "Şampuanlı seçenek"],
  image: photo("105.0.105-168T", 1),
  imageAlt: "Ambalajında mavi oval oto süngeri",
  imageStyle: "catalog",
  skus: [
    {
      slug: "105-0-105-168t",
      code: "105.0.105-168T",
      name: "Oval Oto Süngeri",
      nameEn: "Oval Car Sponge",
      productSize: "16 × 10,5 × 6 cm",
      packsPerCase: "168",
      caseSize: "117 × 41 × 36 cm",
      packaging: "naylon-torba",
    },
    {
      slug: "105-0-204-168t",
      code: "105.0.204-168T",
      name: "Şampuanlı Oto Süngeri",
      nameEn: "Car Sponge with Shampoo",
      productSize: "16 × 10,5 × 5,8 cm",
      packsPerCase: "168",
      caseSize: "117 × 41 × 36 cm",
      packaging: "naylon-torba",
    },
  ],
};

const evVeMutfakYardimcilari: ProductType = {
  slug: "ev-ve-mutfak-yardimcilari",
  categorySlug: "ozel-formlu-sungerler",
  name: "Ev ve Mutfak Yardımcıları",
  shortDescription: "Bulaşık kurutma süngeri, lekesil sünger, küf matı ve kapı eşik süngeri gibi evde farklı ihtiyaçlara yönelik ürünler.",
  description: [
    "Bu grupta temizlik rutininin yanında evde farklı ihtiyaçlara eşlik eden ürünler yer alır: bulaşıkların süzülmesi için kurutma süngeri ve bulaşık altlığı, yalnızca su ile ıslatılarak kullanılan melamin lekesil sünger, buzdolabı rafları için küf matı ve kapı altındaki boşluğu kapatan kendinden yapışkanlı eşik süngeri.",
    "Lekesil süngeri hassas ve parlak yüzeylerde kullanmadan önce görünmeyen küçük bir alanda deneme yapılması önerilir.",
  ],
  highlights: ["Bulaşık kurutma süngeri ve altlığı", "Melamin lekesil sünger", "Buzdolabı küf matı", "Kendinden yapışkanlı kapı eşik süngeri"],
  image: photo("106.0.001-36", 2),
  imageAlt: "Turuncu, kırmızı, mavi ve sarı oluklu bulaşık kurutma süngerleri",
  imageStyle: "catalog",
  skus: [
    {
      slug: "106-0-001-36",
      code: "106.0.001-36",
      name: "Bulaşık Kurutma Süngeri",
      nameEn: "Dish Drying Sponge Mat",
      productSize: "40 × 60 × 1,5 cm",
      packsPerCase: "36",
      caseSize: "116 × 41 × 34 cm",
      packaging: "naylon-torba",
    },
    {
      slug: "106-0-020-50",
      code: "106.0.020-50",
      name: "Desenli Bulaşık Altlığı",
      nameEn: "Patterned Non-Woven Dish Drying Mat",
      productSize: "48 × 34 cm",
      packsPerCase: "50",
      caseSize: "34 × 40 × 25 cm",
      packaging: "koli",
    },
    {
      slug: "106-0-202-24",
      code: "106.0.202-24",
      name: "Lekesil Sünger 2'li (Sihirli Sünger)",
      nameEn: "Magic Eraser Sponge, 2 pcs/pack",
      productSize: "11 × 7 × 3 cm",
      packsPerCase: "24",
      caseSize: "23 × 40 × 16 cm",
      packaging: "koli",
      extra: [{ label: "Paket içeriği", value: "2 adet" }],
    },
    {
      slug: "106-0-500-18",
      code: "106.0.500-18",
      name: "Küf Matı",
      nameEn: "Refrigerator Mat",
      productSize: "48 × 30 × 1 cm",
      packsPerCase: "18",
      caseSize: "34 × 40 × 25 cm",
      packaging: "koli",
    },
    {
      slug: "230-0-975",
      code: "230.0.975",
      name: "Kapı Eşik Süngeri (Kendinden Yapışkanlı)",
      nameEn: "Door Threshold Wind Barrier with Self Adhesive",
      productSize: "90 × 9 × 2,7 cm",
      packsPerCase: "30",
      caseSize: "90 × 45 × 20 cm",
      packaging: "naylon-torba",
    },
  ],
};


/* ------------------------------------------------------------------ */
/* 5. Doğal Ürünler                                                    */
/* ------------------------------------------------------------------ */

const dogalBulasikSungerleri: ProductType = {
  slug: "dogal-bulasik-sungerleri",
  categorySlug: "dogal-urunler",
  name: "Natürel ve Selülozik Bulaşık Süngerleri",
  shortDescription: "Doğal lif görünümlü yüzeye sahip natürel bulaşık süngeri ve selülozik konfor süngeri.",
  description: [
    "Natürel bulaşık süngeri, doğal lif görünümlü ovucu yüzeyi sünger gövdeyle birleştirir ve kâğıt bantlı ambalajda 2'li olarak sunulur.",
    "Konfor bulaşık süngeri, dalgalı formlu selülozik sünger gövdesiyle 2'li pakette hazırlanır.",
  ],
  highlights: ["Doğal lif görünümlü yüzey", "Selülozik sünger gövde", "2'li paketler"],
  image: photo("101.0.303-36", 3),
  imageAlt: "Kâğıt bantlı ambalajında natürel bulaşık süngerleri ve yanında iki sünger",
  imageStyle: "catalog",
  skus: [
    {
      slug: "101-0-303-36",
      code: "101.0.303-36",
      name: "Natürel Bulaşık Süngeri 2'li",
      nameEn: "Natural Scrubber Sponge, 2 pcs/pack",
      productSize: "11 × 7 × 2 cm",
      packsPerCase: "36",
      extra: [{ label: "Paket içeriği", value: "2 adet" }],
    },
    {
      slug: "103-0-003-20",
      code: "103.0.003-20",
      name: "Konfor Bulaşık Süngeri 2'li",
      nameEn: "Cellulosic Comfort Sponge, 2 pcs/pack",
      line: "Konfor",
      productSize: "11 × 7 × 3,5 cm",
      packsPerCase: "20",
      caseSize: "40 × 23 × 16 cm",
      packaging: "koli",
    },
  ],
};

const selulozikBanyoVeBakim: ProductType = {
  slug: "selulozik-banyo-ve-bakim",
  categorySlug: "dogal-urunler",
  name: "Selülozik Banyo ve Bakım Süngerleri",
  shortDescription: "Selülozik sünger gövdeli banyo süngerleri ve makyaj temizleme süngerleri.",
  description: [
    "Selülozik sünger, banyo ve yüz bakımında yumuşak bir kullanım sunan gözenekli bir yapıya sahiptir.",
    "Oval banyo süngeri, yıldız ve çiçek kesimli 4'lü makyaj temizleme süngerleri ile doğal selülozik süngerden balık ve ördek şekilli banyo süngerleri bu grupta yer alır.",
  ],
  highlights: ["Selülozik sünger", "Oval, yıldız, çiçek, balık ve ördek formları", "Banyo ve yüz bakımı"],
  image: photo("103.0.200-40", 2),
  imageAlt: "Açık yeşil selülozik oval banyo süngeri",
  imageStyle: "catalog",
  skus: [
    {
      slug: "103-0-200-40",
      code: "103.0.200-40",
      name: "Selülozik Oval Banyo Süngeri",
      nameEn: "Cellulosic Oval Bath Sponge",
      productSize: "11 × 9,2 × 2 cm",
      packsPerCase: "40",
      caseSize: "23 × 40 × 16 cm",
      packaging: "koli",
    },
    {
      slug: "103-0-302-45",
      code: "103.0.302-45",
      name: "Makyaj Temizleme Süngeri (4'lü)",
      nameEn: "Make-up Cleaning Sponge, 4 pcs/pack",
      productSize: "7,5 × 7,5 × 0,9 cm",
      packsPerCase: "45",
      caseSize: "23 × 40 × 16 cm",
      packaging: "koli",
    },
    {
      slug: "103-0-508",
      code: "103.0.508",
      name: "Mavi Balık Şekilli Selülozik Banyo Süngeri",
      nameEn: "Blue Fish-Shaped Natural Cellulose Bath Sponge",
      extra: [{ label: "Malzeme", value: "Doğal selülozik sünger" }],
    },
    {
      slug: "103-0-510",
      code: "103.0.510",
      name: "Sarı Ördek Şekilli Selülozik Banyo Süngeri",
      nameEn: "Yellow Duck-Shaped Natural Cellulose Bath Sponge",
      extra: [{ label: "Malzeme", value: "Doğal selülozik sünger" }],
    },
  ],
};
/* ------------------------------------------------------------------ */
/* 6. Plaka ve Rulo Ürünler (slug "hammadde")                         */
/* ------------------------------------------------------------------ */

/*
 * Summarised from the ERP lists of felt (126.0.xxx) and non-woven cloth (800.4.xxx) rolls (2026-11): grammage, colour
 * and form only. Customer-specific prints and brands, seconds and defective stock are deliberately left out.
 * Felt series codes carry the grammage: ST 25 = 250 gr/m², STA 55 = 550 gr/m² (matches the 2016 catalogue table).
 */
const ruloVePlakaKece: ProductType = {
  slug: "rulo-ve-plaka-kece",
  categorySlug: "hammadde",
  name: "Ovucu Keçe – Rulo ve Plaka",
  shortDescription: "250–1000 gr/m² ovucu keçe; rulo, plaka ve kesilmiş formlarda, geniş renk seçeneğiyle.",
  description: [
    "Ovucu keçeyi (ovma fiberi) kendi tesisimizde üretiyor; bulaşık süngeri, ovma fiberi ve benzeri ürünleri üreten firmalara rulo, plaka veya kesilmiş olarak tedarik ediyoruz.",
    "Keçeler ST ve STA serilerinde, 250 gr/m²'den 1000 gr/m²'ye kadar farklı gramajlarda üretilir. Seri kodundaki sayı gramajı gösterir: STA 55, 550 gr/m² keçedir. Her gramajda üretilebilen renkler aşağıdaki tabloda yer alır.",
    "Standart rulo eni 1,02 m'dir; 2 m geniş en ile 40 cm ve 68 cm dar en seçenekleri de hazırlanabilir. Gramaj, renk ve ölçü ihtiyaca göre birlikte değerlendirilir.",
  ],
  highlights: ["250–1000 gr/m² gramaj", "Yirmiye yakın renk", "1,02 m standart rulo eni", "Plaka ve kesilmiş form"],
  image: "/images/products/hammadde/ovucu-kece-rulolari-4x3.webp",
  imageAlt: "Natürel ve yeşil ovucu keçe ruloları, yanında natürel, beyaz, gri, açık yeşil, yeşil, mavi, kırmızı, fuşya ve mor dar keçe ruloları",
  imageStyle: "styled",
  matrix: {
    title: "Ovucu keçe gramaj ve renk seçenekleri",
    note: "Keçeler aşağıdaki gramaj ve renk kombinasyonlarıyla üretilebilir. Listede olmayan bir kombinasyon için bize ulaşın.",
    rows: [
      { label: "250 gr/m²", colors: [FIBER.green, FIBER.red, FIBER.blue, FIBER.yellow, FIBER.black, FIBER.white] },
      { label: "300 gr/m²", colors: [FIBER.green, FIBER.red, FIBER.blue, FIBER.yellow, FIBER.black, FIBER.orange, FIBER.fuchsia] },
      {
        label: "350–370 gr/m²",
        colors: [FIBER.green, FIBER.darkGreen, FIBER.lightGreen, FIBER.red, FIBER.blue, FIBER.yellow, FIBER.black, FIBER.orange, FIBER.fuchsia, FIBER.white],
      },
      { label: "400–450 gr/m²", colors: [FIBER.green, FIBER.white] },
      {
        label: "550 gr/m²",
        colors: [
          FIBER.green, FIBER.lightGreen, FIBER.walnutGreen, FIBER.fluoGreen, FIBER.red, FIBER.blue, FIBER.yellow,
          FIBER.black, FIBER.orange, FIBER.turquoise, FIBER.fuchsia, FIBER.violet, FIBER.purple, FIBER.natural, FIBER.white,
        ],
      },
      { label: "600 gr/m²", colors: [FIBER.white] },
      {
        label: "650 gr/m²",
        colors: [FIBER.green, FIBER.lightGreen, FIBER.red, FIBER.blue, FIBER.yellow, FIBER.black, FIBER.orange, FIBER.fuchsia, FIBER.violet, FIBER.purple, FIBER.burgundy],
      },
      { label: "700 gr/m²", colors: [FIBER.green, FIBER.black, FIBER.glitterGreen, FIBER.glitterBlack] },
      { label: "750 gr/m²", colors: [FIBER.green, FIBER.walnutGreen, FIBER.red, FIBER.blue, FIBER.black] },
      { label: "800 gr/m²", colors: [FIBER.green, FIBER.walnutGreen, FIBER.red, FIBER.brick, FIBER.black] },
      { label: "950–1000 gr/m²", colors: [FIBER.green, FIBER.red, FIBER.blue, FIBER.yellow] },
    ],
  },
  skus: [
    {
      slug: "rulo-kece",
      name: "Rulo Ovucu Keçe",
      nameEn: "Scouring Fiber in Roll",
      extra: [
        { label: "Gramaj", value: "250 – 1000 gr/m²" },
        { label: "Rulo eni", value: "1,02 m" },
        { label: "Rulo boyu", value: "65 / 75 / 95 m (gramaja göre)" },
        { label: "Renk", value: "Gramaja göre (tabloya bakın)" },
      ],
      image: "/images/products/hammadde/ovucu-kece-rulo.webp",
      imageAlt: "Natürel ve yeşil ovucu keçe ruloları",
    },
    {
      slug: "genis-ve-dar-en-rulo-kece",
      name: "Geniş ve Dar En Rulo Keçe",
      nameEn: "Scouring Fiber in Wide and Narrow Rolls",
      extra: [
        { label: "Geniş en", value: "2 m × 50 – 80 m" },
        { label: "Dar en", value: "40 cm ve 68 cm × 65 – 75 m" },
        { label: "Gramaj", value: "370 – 550 gr/m²" },
      ],
      image: "/images/products/hammadde/ovucu-kece-dar-rulolar.webp",
      imageAlt: "Yan yana dizilmiş dokuz renkte dar en ovucu keçe ruloları",
    },
    {
      slug: "kece-plakasi",
      name: "Ovucu Keçe Plakası",
      nameEn: "Scouring Fiber Sheet",
      extra: [
        { label: "Plaka ölçüsü", value: "100 × 150 cm, 100 × 200 cm, 102 × 102 cm, 100 × 167 cm" },
        { label: "Gramaj", value: "250 – 750 gr/m²" },
        { label: "Renk", value: "Yeşil, kırmızı, mavi, sarı, siyah, beyaz" },
      ],
      image: "/images/products/hammadde/ovucu-kece-plakasi.webp",
      imageAlt: "Zemine serilmiş 1 × 2 m yeşil ovucu keçe plakası",
    },
    {
      slug: "inox-kece",
      name: "Inox Keçe",
      nameEn: "Inox Scouring Fiber",
      extra: [
        { label: "Gramaj", value: "550 ve 600 gr/m²" },
        { label: "Form", value: "Rulo (1,02 × 65 m) ve plaka (100 × 167 cm)" },
        { label: "Renk", value: "Beyaz, tozlu beyaz, fıstık yeşili, fuşya, kırmızı, mavi, menekşe" },
      ],
      image: "/images/products/hammadde/inox-kece-plakasi.webp",
      imageAlt: "Üzerinde tava ve tencere bulunan, zemine serilmiş beyaz Inox keçe plakası",
    },
    {
      slug: "formlu-ve-kesilmis-kece",
      name: "Formlu ve Kesilmiş Keçe",
      nameEn: "Shaped and Cut Scouring Fiber",
      extra: [
        { label: "Papyon form", value: "550 gr/m²; fıstık yeşili, fuşya, menekşe, turuncu" },
        { label: "Kesilmiş", value: "16 × 7,5 cm; 250 ve 370 gr/m² siyah" },
      ],
      image: "/images/products/hammadde/ovucu-kece-kesilmis.webp",
      imageAlt: "Kesilmiş keçe parçası ve keçe lamineli bulaşık süngeri",
    },
  ],
};

const ruloNonWovenBez: ProductType = {
  slug: "rulo-non-woven-bez",
  categorySlug: "hammadde",
  name: "Non-Woven Temizlik Bezi – Rulo",
  shortDescription: "80–320 gr/m² non-woven temizlik, yer ve mop bezi; düz, baskılı ve mikro lifli rulolar.",
  description: [
    "Non-woven (dokusuz) temizlik bezini kendi tesisimizde üretiyor; temizlik bezi, yer bezi ve mop üreten firmalara istenen ende dilimlenmiş rulolar halinde tedarik ediyoruz.",
    "Bezler 80 gr/m²'den 320 gr/m²'ye kadar farklı gramajlarda, %20'den %80'e farklı viskon–polyester oranlarıyla üretilir. Düz renkli, baskılı (çiçek, damla, ekose, gökkuşağı desenleri), gofreli ve %30 mikro lifli seçenekler bulunur.",
    "Rulolar ihtiyaca göre 27 cm'den 210 cm'ye kadar farklı enlerde dilimlenir; rulo boyu genellikle 300 m'dir. Gramaj, renk, desen ve ölçü ihtiyaca göre birlikte değerlendirilir.",
  ],
  highlights: ["80–320 gr/m² gramaj", "%20–80 viskon oranı", "Düz, baskılı ve mikro lifli", "27–210 cm rulo eni"],
  image: "/images/products/hammadde/non-woven-bez-rulolari-4x3.webp",
  imageAlt: "Sarı, beyaz, mavi, pembe ve antrasit non-woven temizlik bezi ruloları, uçları açılmış",
  imageStyle: "styled",
  matrix: {
    title: "Temizlik bezi gramaj ve renk seçenekleri",
    note: "Rulo temizlik bezleri aşağıdaki gramaj ve renk kombinasyonlarıyla üretilebilir. Baskılı ve desenli seçenekler ağırlıklı olarak 100–160 gr/m² aralığındadır.",
    rows: [
      { label: "80–90 gr/m²", colors: [CLOTH.yellow, CLOTH.blue, CLOTH.pink, CLOTH.green, CLOTH.orange] },
      { label: "100–105 gr/m²", colors: [CLOTH.yellow, CLOTH.blue, CLOTH.pink, CLOTH.green, CLOTH.orange, CLOTH.white, CLOTH.black] },
      { label: "110–115 gr/m²", colors: [CLOTH.yellow, CLOTH.blue, CLOTH.pink] },
      {
        label: "120–125 gr/m²",
        colors: [CLOTH.yellow, CLOTH.blue, CLOTH.pink, CLOTH.candyPink, CLOTH.green, CLOTH.appleGreen, CLOTH.orange, CLOTH.turquoise, CLOTH.white, CLOTH.black],
      },
      { label: "130–135 gr/m²", colors: [CLOTH.yellow, CLOTH.blue, CLOTH.pink, CLOTH.green, CLOTH.orange, CLOTH.white] },
      {
        label: "140 gr/m²",
        colors: [CLOTH.yellow, CLOTH.blue, CLOTH.pink, CLOTH.candyPink, CLOTH.green, CLOTH.appleGreen, CLOTH.orange, CLOTH.turquoise, CLOTH.white],
      },
      { label: "160–180 gr/m²", colors: [CLOTH.yellow, CLOTH.orange, CLOTH.white] },
      { label: "200–250 gr/m²", colors: [CLOTH.yellow, CLOTH.blue, CLOTH.green, CLOTH.white] },
      { label: "320 gr/m²", colors: [CLOTH.white] },
    ],
  },
  skus: [
    {
      slug: "rulo-temizlik-bezi-duz",
      name: "Düz Renkli Rulo Temizlik Bezi",
      nameEn: "Plain Coloured Cleaning Cloth in Roll",
      extra: [
        { label: "Gramaj", value: "80 – 240 gr/m²" },
        { label: "Kompozisyon", value: "%20 – %80 viskon, kalanı polyester" },
        { label: "Rulo eni", value: "27 – 210 cm (dilimlenmiş)" },
        { label: "Rulo boyu", value: "Genellikle 300 m" },
      ],
      image: "/images/products/hammadde/non-woven-bez-rulo.webp",
      imageAlt: "Mavi, pembe, beyaz ve antrasit non-woven temizlik bezi ruloları",
    },
    {
      slug: "rulo-temizlik-bezi-baskili",
      name: "Baskılı ve Desenli Rulo Temizlik Bezi",
      nameEn: "Printed Cleaning Cloth in Roll",
      extra: [
        { label: "Desen", value: "Çiçek, damla, ekose, gökkuşağı; gofreli yüzey" },
        { label: "Gramaj", value: "100 – 160 gr/m²" },
        { label: "Zemin rengi", value: "Sarı, beyaz, mavi, pembe, turuncu, yeşil" },
      ],
      image: img("rulo-temizlik-bezi-50-50"),
      imageAlt: "Düz ve çiçek baskılı temizlik bezi ruloları",
    },
    {
      slug: "rulo-temizlik-bezi-mikro",
      name: "Mikro Lifli Rulo Temizlik Bezi",
      nameEn: "Microfibre-Blend Cleaning Cloth in Roll",
      extra: [
        { label: "Kompozisyon", value: "%30 mikro lif içeren karışım" },
        { label: "Gramaj", value: "100 – 230 gr/m²" },
        { label: "Renk", value: "Sarı, elma yeşili; düz veya baskılı" },
      ],
      image: img("rulo-temizlik-bezi-70-30"),
      imageAlt: "Sarı, mavi ve pembe temizlik bezi ruloları",
    },
    {
      slug: "rulo-yer-bezi-70-30",
      name: "Rulo Yer Bezi – Çiçek Desenli",
      nameEn: "Floor Cloth in Roll – Flower Pattern",
      extra: [
        { label: "Kompozisyon", value: "%70 viskon, %30 polyester" },
        { label: "Gramaj", value: "200 gr/m²" },
      ],
      image: img("rulo-yer-bezi-70-30"),
      imageAlt: "Çiçek desenli yer bezi rulosu, bezi ve mop uygulaması",
    },
    {
      slug: "rulo-yer-bezi-60-40",
      name: "Rulo Yer Bezi – Yeşil Kareli",
      nameEn: "Floor Cloth in Roll – Green Check",
      extra: [
        { label: "Kompozisyon", value: "%60 viskon, %40 polyester" },
        { label: "Gramaj", value: "200 gr/m²" },
      ],
      image: img("rulo-yer-bezi-60-40"),
      imageAlt: "Yeşil kareli yer bezi rulosu, bezi ve mop uygulaması",
    },
    {
      slug: "rulo-yer-bezi-30-70",
      name: "Rulo Yer Bezi – Mavi Kareli",
      nameEn: "Floor Cloth in Roll – Blue Check",
      extra: [
        { label: "Kompozisyon", value: "%30 viskon, %70 polyester" },
        { label: "Gramaj", value: "180 gr/m²" },
      ],
      image: img("rulo-yer-bezi-30-70"),
      imageAlt: "Mavi kareli yer bezi rulosu, bezi ve mop uygulaması",
    },
    {
      slug: "mop-ve-paspas-rulo-bezi",
      name: "Mop ve Paspas Rulo Bezi",
      nameEn: "Mop and Floor Mat Cloth in Roll",
      extra: [
        { label: "Mop bezi", value: "180 – 250 gr/m²; beyaz, yeşil baskılı, çiçek desenli" },
        { label: "Paspas bezi", value: "220 gr/m² baskılı; %60 viskon, %15 lowmelt, %25 polyester" },
      ],
      image: img("rulo-yer-bezi-60-40"),
      imageAlt: "Yer bezi rulosu, bezi ve mop uygulaması",
    },
    {
      slug: "bulasik-altligi-rulosu",
      name: "Bulaşık Altlığı Rulosu",
      nameEn: "Dish Drying Mat Material in Roll",
      extra: [
        { label: "Gramaj", value: "320 gr/m²" },
        { label: "Renk", value: "Beyaz" },
        { label: "Rulo eni", value: "200 cm" },
      ],
    },
  ],
};

const tabakaHammadde: ProductType = {
  slug: "tabaka-hammadde",
  categorySlug: "hammadde",
  name: "Sünger Plakaları",
  shortDescription: "Keçe lamineli sünger plakaları ve selülozik sünger plakaları; ölçüye göre kesime uygun.",
  description: [
    "Keçe lamineli sünger plakaları, sünger gövde ile ovucu keçenin lamine edilerek tabaka halinde hazırlandığı yarı mamullerdir.",
    "Plakalar, bulaşık süngeri ve benzeri ürünlerin üretiminde istenen ölçüye göre kesilmek üzere tedarik edilir. Keçe rengi, sünger rengi ve kalınlık ihtiyaca göre birlikte değerlendirilir.",
    "Natürel, mavi ve sarı renkli selülozik sünger plakaları da 10–50 mm kalınlık seçenekleriyle tabaka halinde tedarik edilir.",
  ],
  highlights: ["Sünger + ovucu keçe laminasyon", "Selülozik sünger plakaları", "Ölçüye göre kesime uygun", "Renk ve kalınlık seçenekleri"],
  image: "/images/products/hammadde/sheet-raw-material.webp",
  imageAlt: "Üst üste yerleştirilmiş tabaka hammaddeler",
  imageStyle: "styled",
  skus: [
    {
      slug: "kece-lamineli-plaka",
      name: "Keçe Lamineli Sünger Plakası",
      nameEn: "Foam Backed Fiber Sheet",
      extra: [
        { label: "Yapı", value: "Sünger gövde + ovucu keçe" },
        { label: "Ölçü", value: "İhtiyaca göre" },
      ],
      image: img("kece-lamineli-plaka"),
      imageAlt: "Üst üste dizilmiş sarı sünger ve yeşil keçe lamineli plakalar",
    },
    // Cellulose sponge sheets (PLK) from the 2026-11 shipping list; size read from the code (1020×1020×T mm).
    ...(
      [
        ["103.0.505", "Natürel Selülozik Sünger Plakası", "Natural Cellulose Sponge Sheet", "Natürel", "20 mm"],
        ["103.0.513", "Mavi Selülozik Sünger Plakası – 10 mm", "Blue Cellulose Sponge Sheet – 10 mm", "Mavi", "10 mm"],
        ["103.0.512", "Mavi Selülozik Sünger Plakası – 50 mm", "Blue Cellulose Sponge Sheet – 50 mm", "Mavi", "50 mm"],
        ["103.0.514", "Sarı Selülozik Sünger Plakası", "Yellow Cellulose Sponge Sheet", "Sarı", "20 mm"],
      ] as const
    ).map(([code, name, nameEn, colour, thickness]) => ({
      slug: code.replace(/\./g, "-"),
      code,
      name,
      nameEn,
      extra: [
        { label: "Renk", value: colour },
        { label: "Plaka ölçüsü", value: "102 × 102 cm" },
        { label: "Kalınlık", value: thickness },
      ],
      imageAlt: `${name} görseli`,
    })),
  ],
};

const dokmeUrunler: ProductType = {
  slug: "dokme-urunler",
  categorySlug: "hammadde",
  name: "Dökme Ürünler",
  shortDescription: "Ambalajsız, toplu olarak tedarik edilen temizlik bezi, sünger bez, silgi sünger ve kapı süngeri.",
  description: [
    "Dökme ürünler, perakende ambalajı olmadan toplu olarak tedarik edilen yarı mamul ve mamullerdir; kendi ambalajında satış yapacak firmalar ve endüstriyel kullanıcılar için hazırlanır.",
    "Ölçü, adet ve sevkiyat şekli ihtiyaca göre birlikte değerlendirilir.",
  ],
  highlights: ["Ambalajsız toplu tedarik", "Kendi ambalajınızda satışa uygun", "Temizlik bezi, sünger bez, silgi ve kapı süngeri"],
  image: "/images/products/category-cloths.webp",
  imageAlt: "Katlanmış ve rulo halinde temizlik bezleri",
  imageStyle: "styled",
  skus: [
    {
      slug: "111-0-999",
      code: "111.0.999",
      name: "Dökme Sarı Temizlik Bezi",
      nameEn: "Bulk Yellow Cleaning Cloth",
      productSize: "38 × 40 cm",
      extra: [{ label: "Gramaj", value: "140 gr/m²" }],
      imageAlt: "Dökme sarı temizlik bezi görseli",
    },
    {
      slug: "113-0-904",
      code: "113.0.904",
      name: "Dökme Sarı Sünger Bez",
      nameEn: "Bulk Yellow Sponge Cloth",
      productSize: "60 × 65 cm",
      imageAlt: "Dökme sarı sünger bez görseli",
    },
    {
      slug: "130-0-068",
      code: "130.0.068",
      name: "Silgi Sünger (Dökme)",
      nameEn: "Eraser Sponge (Bulk)",
      productSize: "12 × 7 × 3 cm",
      imageAlt: "Dökme silgi sünger görseli",
    },
    {
      slug: "130-0-804",
      code: "130.0.804",
      name: "Bantsız Kapı Süngeri",
      nameEn: "Door Sponge without Adhesive Tape",
      productSize: "90 × 8,5 × 2,5 cm",
      imageAlt: "Bantsız kapı süngeri görseli",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Categories                                                          */
/* ------------------------------------------------------------------ */

export const categories: Category[] = [
  {
    slug: "temizlik-sungerleri",
    name: "Temizlik Süngerleri",
    shortDescription: "Farklı kullanım alanları için sünger seçenekleri.",
    intro: [
      "Temizlik süngerleri, yüzeyle temas eden katman ve elde kullanımı destekleyen gövde formuyla farklı uygulamalara uyum sağlayan seçenekler sunar.",
      "Düz ve oluklu biçimler, file kaplı Ultra Parlak sünger ve endüstriyel boylar kullanım alışkanlığına göre değerlendirilebilir. Natürel ve selülozik bulaşık süngerleri Doğal Ürünler grubunda yer alır.",
    ],
    image: "/images/products/kategori-temizlik-sungerleri-foto.webp",
    imageAlt: "Taş basamaklar üzerinde renkli düz bulaşık süngerleri, endüstriyel sünger, file kaplı sünger, düz ve oluklu bulaşık süngeri",
    products: [klasikTemizlikSungeri, olukluTemizlikSungeri, ozelBulasikSungerleri, endustriyelTemizlikSungeri],
  },
  {
    slug: "temizlik-bezleri",
    name: "Temizlik Bezleri",
    shortDescription: "Günlük temizlik rutinleri için bez seçenekleri.",
    intro: [
      "Temizlik bezleri, farklı yüzeyler ve kullanım alışkanlıkları için malzeme dokusu ile formun birlikte değerlendirildiği bir ürün grubudur.",
      "Rulo ve katlanmış biçimler, kullanım şekline göre farklı seçenekler sunar. İhtiyacı değerlendirirken ürünün formu ve kullanım alanı birlikte ele alınır.",
    ],
    image: "/images/products/kategori-temizlik-bezleri-foto.webp",
    imageAlt: "Taş basamaklar üzerinde sarı rulo temizlik bezi, mikrofiber bezler, sünger bezler ve renkli temizlik bezleri",
    products: [cokAmacliTemizlikBezi, ruloTemizlikBezi, camVeMikrofiberBez, yerBezi],
  },
  {
    slug: "ovucu-materyaller",
    name: "Ovucu Materyaller",
    shortDescription: "Zorlu kirler için ovucu keçe ve ovma teli seçenekleri.",
    intro: [
      "Ovucu materyaller, yapışmış ve yanmış kalıntılar gibi zorlu kirlerde yüzeyle güçlü temas kurmaya yönelik ovucu keçe (ovma fiberi), ovma teli ve benzeri ovucu ürünleri kapsar.",
      "Lif ve tel yapısı, yoğunluk ve form, kullanılacak yüzey ile kirin türüne göre değerlendirilir. İhtiyaca uygun seçeneği birlikte belirleyebiliriz.",
    ],
    image: "/images/products/kategori-ovucu-materyaller-foto.webp",
    imageAlt: "Taş basamaklar üzerinde mor, pembe, turuncu, açık yeşil ve yeşil ovma fiberleri ile siyah ve yeşil ovma fiberi desteleri",
    products: [ovucuKece, ovmaTeli],
  },
  {
    slug: "ozel-formlu-sungerler",
    name: "Özel Formlu Süngerler",
    shortDescription: "Kullanım ihtiyacına göre şekillenen alternatifler.",
    intro: [
      "Özel formlu süngerler, standart dikdörtgen biçimlerin dışında farklı tutuş ve yüzey temas ihtiyaçlarına yönelik form alternatiflerini kapsar.",
      "Banyo ve bakım, oto ve ev–mutfak kullanımına yönelik oval, kelebek ve özel kesim formlar, ürün formunun kullanım şekliyle birlikte değerlendirilebildiği seçenekler sunar.",
    ],
    image: "/images/products/kategori-ozel-formlu-sungerler-foto.webp",
    imageAlt: "Taş basamaklar üzerinde oto süngeri, masajlı oval banyo süngeri, masajlı kelebek süngerler ve renkli bulaşık kurutma süngerleri",
    products: [banyoVeBakimSungerleri, otoSungerleri, evVeMutfakYardimcilari],
  },
  {
    slug: "dogal-urunler",
    name: "Doğal Ürünler",
    shortDescription: "Natürel bulaşık süngeri ile selülozik bulaşık, banyo ve bakım süngerleri.",
    intro: [
      "Doğal Ürünler grubunda doğal lif görünümlü yüzeye sahip natürel bulaşık süngeri ile selülozik süngerden üretilen bulaşık, banyo ve makyaj temizleme süngerleri yer alır.",
      "Natürel bulaşık süngeri kâğıt bantlı ambalajda; selülozik süngerler oval, dalgalı, yıldız, çiçek, balık ve ördek gibi farklı formlarda sunulur.",
    ],
    image: "/images/products/kategori-dogal-urunler-foto.webp",
    imageAlt: "Taş basamaklar üzerinde natürel bulaşık süngeri, selülozik oval sünger, konfor süngeri ve çiçek kesimli selülozik süngerler",
    products: [dogalBulasikSungerleri, selulozikBanyoVeBakim],
  },
  {
    slug: "hammadde",
    name: "Plaka ve Rulo Ürünler",
    shortDescription: "Kendi tesisimizde ürettiğimiz, rulo halinde non-woven temizlik bezi ve ovucu keçe ile plaka ürünler.",
    intro: [
      "Saniteks, temizlik ürünlerinde kullanılan non-woven temizlik bezi ve ovucu keçeyi kendi tesisinde rulo halinde üretir. Bu ruloları farklı ürünler geliştiren üreticilere de tedarik ediyoruz.",
      "Ürünlerimiz rulo ve plaka formunda hazırlanabilir. Gramaj, kalınlık, renk ve ölçü gibi özellikler ihtiyaca göre birlikte değerlendirilir.",
    ],
    image: "/images/products/kategori-plaka-ve-rulo-urunler-foto.webp",
    imageAlt: "Sarı, mavi, pembe ve antrasit non-woven temizlik bezi ruloları, yeşil, mor ve natürel keçe ruloları ile üst üste keçe plakaları",
    products: [ruloVePlakaKece, ruloNonWovenBez, tabakaHammadde, dokmeUrunler],
  },
];

/**
 * Studio photos per product code (files /images/urunler/<code>-<n>.webp, n = 1…). One letter per photo, in display
 * order: P = packaging, U = product, C = packaging with product, L = in use. Converted from the originals on the
 * "urun_gorselleri" branch; a changed photo gets a new file name (/images is cached for 30 days).
 */
const PHOTOS: Record<string, string> = {
  "100.0.125-40": "PUC", "100.0.350-30": "PU", "100.0.400-16": "PU", "100.0.600-C": "PU", "100.0.800-120T": "PU",
  "100.0.850-60T": "PU", "100.0.876-60T": "PU", "101.0.001-50": "PU", "101.0.302-72": "PU", "101.0.303-36": "PUC",
  "101.0.304-36": "PU", "101.0.350-40": "PU", "101.0.376-24": "PU", "101.0.410-30": "PU", "101.0.750-48": "PU",
  "101.0.800-66T": "PU", "101.0.850-36T": "PU", "102.0.090-16": "PU", "102.0.101-16": "PU", "102.0.102-16": "PU",
  "102.0.600-60": "PU", "103.0.003-20": "PUC", "103.0.200-40": "PU", "103.0.302-45": "PU", "104.0.102-80T": "PUC",
  "104.0.103-100": "PU", "104.0.104-90": "PU", "105.0.105-168T": "PU", "105.0.204-168T": "PU", "106.0.001-36": "PU",
  "106.0.020-50": "PU", "106.0.202-24": "PUC", "106.0.500-18": "PU", "110.0.001-20": "PU", "110.0.002-20": "PU",
  "110.0.050-20": "PU", "110.0.201-20": "PU", "110.0.650-C": "PU", "110.0.663-C": "PU", "110.0.840-12": "PU",
  "110.0.841-12": "PU", "110.0.842-12": "PU", "113.0.001-48": "PU", "114.0.001-50": "PU", "114.0.003-50": "PU",
  "114.0.100-50": "PU", "116.0.005-50": "PU", "125.0.105-100": "PU", "125.0.114-120": "PU", "125.0.115-80": "PUC",
  "125.0.502-90": "PU", "230.0.975": "LUU",
};

const PHOTO_ROLE: Record<string, string> = { P: "ambalaj", U: "ürün", C: "ambalaj ve ürün", L: "kullanımda" };

/**
 * Catalogue SKUs that are not in the 2026-11 shipping list and have no 2026 studio photo (the products photographed
 * in 2026 are treated as current). Kept on the site as "talep üzerine üretim" (company decision); remove a code here
 * once it is back in regular production.
 */
const MADE_TO_ORDER = new Set(["112.0.002-60", "120.0.101-60", "120.0.401-60", "120.0.910"]);

for (const category of categories) {
  for (const product of category.products) {
    for (const sku of product.skus) {
      if (sku.code && MADE_TO_ORDER.has(sku.code)) sku.madeToOrder = true;
      const roles = sku.code ? PHOTOS[sku.code] : undefined;
      if (roles) {
        sku.photos = [...roles].map((role, i) => ({ src: photo(sku.code!, i + 1), alt: `${sku.name}: ${PHOTO_ROLE[role]}` }));
        sku.image = sku.photos[0].src;
        sku.imageAlt = sku.photos[0].alt;
      }
    }
    // Current products first, made-to-order ones after (stable order within each group).
    product.skus.sort((a, b) => Number(Boolean(a.madeToOrder)) - Number(Boolean(b.madeToOrder)));
  }
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export const packagingLabel: Record<Packaging, string> = {
  koli: "Koli",
  "naylon-torba": "Naylon torba",
  cuval: "Çuval",
};

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function categoryHref(category: Pick<Category, "slug">): string {
  return `/urunler/${category.slug}`;
}

/** Product detail page of a SKU: /urunler/<category>/<sku>. Product types have no page of their own. */
export function skuHref(categorySlug: string, skuSlug: string): string {
  return `/urunler/${categorySlug}/${skuSlug}`;
}

export type SkuEntry = { category: Category; product: ProductType; sku: Sku };

/** Every SKU of a category, in catalogue order, with its product type (the filter group on the category page). */
export function categorySkus(category: Category): SkuEntry[] {
  return category.products.flatMap((product) => product.skus.map((sku) => ({ category, product, sku })));
}

export function getSku(categorySlug: string, skuSlug: string): SkuEntry | undefined {
  const category = getCategory(categorySlug);
  return category ? categorySkus(category).find((e) => e.sku.slug === skuSlug) : undefined;
}

export type SkuIndexEntry = Sku & { category: Pick<Category, "slug" | "name">; product: Pick<ProductType, "slug" | "name" | "categorySlug"> };

/** Flat list of every SKU with its parents — for search and the product-code index. */
export function allSkus(): SkuIndexEntry[] {
  return categories.flatMap((category) =>
    category.products.flatMap((product) =>
      product.skus.map((sku) => ({
        ...sku,
        category: { slug: category.slug, name: category.name },
        product: { slug: product.slug, name: product.name, categorySlug: product.categorySlug },
      })),
    ),
  );
}

/**
 * Old product-type pages (/urunler/<category>/<type>) were folded into the category pages; next.config.ts redirects
 * them. A SKU slug must therefore never equal a product-type slug, and SKU slugs must be unique within a category.
 */
export const productTypePaths: { category: string; type: string }[] = categories.flatMap((c) =>
  c.products.map((p) => ({ category: c.slug, type: p.slug })),
);

{
  const typeSlugs = new Set(productTypePaths.map((p) => p.type));
  for (const category of categories) {
    const seen = new Set<string>();
    for (const { product, sku } of categorySkus(category)) {
      if (product.categorySlug !== category.slug) throw new Error(`${product.slug}: categorySlug ${product.categorySlug} ≠ ${category.slug}`);
      if (seen.has(sku.slug)) throw new Error(`Duplicate SKU slug in ${category.slug}: ${sku.slug}`);
      if (typeSlugs.has(sku.slug)) throw new Error(`SKU slug equals a product-type slug: ${sku.slug}`);
      seen.add(sku.slug);
    }
  }
}

export function skuCount(category: Category): number {
  return category.products.reduce((n, p) => n + p.skus.length, 0);
}
