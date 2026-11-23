/**
 * Production capabilities (/kabiliyetler), structured after sanifoam.com.tr/kabiliyetler.
 *
 * Content is derived only from verifiable sources: the product data in src/data/products.ts
 * (grammages, compositions, forms, sizes, packaging) and the live Saniteks statement that the textured
 * raw materials are produced in the company's own plant. No machine names, capacities or lab claims.
 */
export type Capability = {
  id: string;
  /** Short label for the in-page tab strip. */
  label: string;
  title: string;
  paragraphs: string[];
  facts: string[];
  image: { src: string; alt: string; width: number; height: number };
  /** Related product pages. */
  related: { href: string; label: string }[];
};

export const capabilities: Capability[] = [
  {
    id: "non-woven",
    label: "Non-woven ve keçe",
    title: "Non-Woven ve Keçe Üretimi",
    paragraphs: [
      "Sünger ve temizlik ürünlerinde kullanılan dokulu yüzey hammaddelerini kendi tesisimizde üretiyoruz.",
      "Ovucu keçe farklı gramaj ve renk kombinasyonlarıyla; temizlik ve yer bezi ruloları ise farklı viskon–polyester oranlarıyla hazırlanır. Bu hammaddeler kendi ürünlerimizde kullanıldığı gibi, farklı ürünler geliştiren üreticilere de tedarik edilir.",
    ],
    facts: ["Ovucu keçe: 250–1000 gr/m²", "Temizlik bezi: 80–240 gr/m²", "Yer ve mop bezi: 180–250 gr/m²", "%20–80 viskon oranları"],
    image: {
      src: "/images/corporate/nonwoven-production-process.webp",
      alt: "Nonwoven tekstil malzemesinin üretim sürecinden yakın görünüm",
      width: 1600,
      height: 1200,
    },
    related: [
      { href: "/urunler/hammadde/rulo-kece", label: "Rulo ovucu keçe" },
      { href: "/urunler/hammadde/rulo-temizlik-bezi-duz", label: "Rulo non-woven temizlik bezi" },
    ],
  },
  {
    id: "laminasyon",
    label: "Laminasyon",
    title: "Laminasyon",
    paragraphs: [
      "Ovucu keçeyi sünger gövdeyle lamine ederek bulaşık süngerlerinin temelini oluşturan keçe lamineli sünger plakalarını hazırlıyoruz.",
      "Plakalar kendi ürünlerimizde kullanılmanın yanı sıra, istenen ölçüye göre kesilmek üzere tabaka hammadde olarak da tedarik edilebilir. Keçe rengi, sünger rengi ve kalınlık ihtiyaca göre birlikte değerlendirilir.",
    ],
    facts: ["Sünger + ovucu keçe", "Tabaka (plaka) formu", "Ölçüye göre kesime uygun"],
    image: {
      src: "/images/products/hammadde/sheet-raw-material.webp",
      alt: "Üst üste yerleştirilmiş tabaka hammaddeler",
      width: 1600,
      height: 1200,
    },
    related: [
      { href: "/urunler/hammadde/kece-lamineli-plaka", label: "Keçe lamineli sünger plakası" },
      { href: "/urunler/temizlik-sungerleri", label: "Temizlik süngerleri" },
    ],
  },
  {
    id: "kesim",
    label: "Kesim ve şekillendirme",
    title: "Kesim ve Şekillendirme",
    paragraphs: [
      "Süngerleri kullanım amacına göre düz, oluklu (kavrama profilli), oval ve kelebek gibi farklı formlarda kesip şekillendiriyoruz.",
      "Ürün yelpazemiz 7,5 cm'lik makyaj temizleme süngerinden 90 cm'lik kapı eşik süngerine uzanır; ölçü ve form ihtiyaca göre birlikte belirlenebilir.",
    ],
    facts: ["Düz ve oluklu formlar", "Oval ve kelebek formlar", "7,5 – 90 cm ürün ölçüleri"],
    image: {
      src: "/images/products/category-specialty.webp",
      alt: "Çeşitli formlarda kesilmiş süngerler",
      width: 1200,
      height: 900,
    },
    related: [
      { href: "/urunler/temizlik-sungerleri/super-tekli-oluklu", label: "Oluklu bulaşık süngeri" },
      { href: "/urunler/ozel-formlu-sungerler/104-0-102-80t", label: "Masajlı oval banyo süngeri" },
      { href: "/urunler/ozel-formlu-sungerler/105-0-105-168t", label: "Oval oto süngeri" },
    ],
  },
  {
    id: "konverting",
    label: "Konverting ve paketleme",
    title: "Konverting ve Paketleme",
    paragraphs: [
      "Rulo hammaddeleri perforeli rulo, katlanmış bez ve kesilmiş yaprak formlarına dönüştürüyor; ürünleri tekli paketten 12'li askılı karta kadar farklı ambalajlarda hazırlıyoruz.",
      "Sevkiyat ürüne göre koli, naylon torba veya çuval ile yapılır. Kendi markalarımızın yanı sıra özel markalı üretim taleplerini de birlikte değerlendirebiliriz.",
    ],
    facts: ["Perforeli rulo ve katlanmış bez", "Tekliden 12'li karta paket", "Koli, naylon torba, çuval"],
    image: {
      src: "/images/products/temizlik-bezleri/rolled-cleaning-cloth.webp",
      alt: "Kısmen açılmış rulo temizlik bezi",
      width: 1600,
      height: 1200,
    },
    related: [
      { href: "/urunler/temizlik-bezleri/110-0-840-12", label: "Perforeli rulo temizlik bezi" },
      { href: "/urunler/temizlik-bezleri", label: "Temizlik bezleri" },
    ],
  },
];
