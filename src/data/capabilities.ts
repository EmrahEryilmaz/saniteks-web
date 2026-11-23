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
    id: "non-woven-kece",
    label: "Non-woven keçe",
    title: "Non-Woven Keçe Üretimi",
    paragraphs: [
      "Bulaşık süngerlerinin ve ovma fiberlerinin ovucu yüzeyini oluşturan non-woven ovucu keçeyi kendi tesisimizde üretiyoruz.",
      "Keçeler 250–1000 gr/m² aralığında, yirmiye yakın renkte üretilir; 1,02 m standart en ile 2 m geniş ve 40–68 cm dar enlerde rulo, plaka ya da kesilmiş form olarak hazırlanır. Kendi ürünlerimizde kullanıldığı gibi, farklı ürünler geliştiren üreticilere de tedarik edilir.",
    ],
    facts: ["250–1000 gr/m²", "Yirmiye yakın renk", "1,02 m standart rulo eni", "Rulo, plaka ve kesilmiş form"],
    image: {
      src: "/images/corporate/kece-uretim-hatti.webp",
      alt: "Yeşil ovucu keçenin silindirler arasından geçtiği üretim hattı, arkada keçe ruloları",
      width: 1024,
      height: 768,
    },
    related: [
      { href: "/urunler/hammadde/rulo-kece", label: "Rulo ovucu keçe" },
      { href: "/urunler/hammadde/kece-plakasi", label: "Ovucu keçe plakası" },
      { href: "/urunler/ovucu-materyaller", label: "Ovucu materyaller" },
    ],
  },
  {
    id: "non-woven-temizlik-bezi",
    label: "Non-woven temizlik bezi",
    title: "Non-Woven Temizlik Bezi Üretimi",
    paragraphs: [
      "Temizlik bezi, yer bezi ve mop bezinde kullanılan non-woven (dokusuz) bezi kendi tesisimizde rulo halinde üretiyoruz.",
      "Bezler 80–320 gr/m² aralığında, %20'den %80'e farklı viskon–polyester oranlarıyla hazırlanır; düz renkli, baskılı (çiçek, damla, ekose desen), gofreli ve %30 mikro lifli seçenekler bulunur. Rulolar ihtiyaca göre 27 cm'den 210 cm'ye kadar farklı enlerde dilimlenir.",
    ],
    facts: ["80–320 gr/m²", "%20–80 viskon oranı", "Düz, baskılı ve mikro lifli", "27–210 cm rulo eni"],
    image: {
      src: "/images/corporate/temizlik-bezi-uretim-hatti.webp",
      alt: "Sarı non-woven temizlik bezinin silindirlerden geçerek büyük bir ruloya sarıldığı üretim hattı",
      width: 873,
      height: 672,
    },
    related: [
      { href: "/urunler/hammadde/rulo-temizlik-bezi-duz", label: "Rulo non-woven temizlik bezi" },
      { href: "/urunler/hammadde/rulo-temizlik-bezi-baskili", label: "Baskılı rulo temizlik bezi" },
      { href: "/urunler/temizlik-bezleri", label: "Temizlik bezleri" },
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
      src: "/images/corporate/laminasyon-hatti.webp",
      alt: "Silindirleri, yapıştırıcı ünitesi ve rulolarıyla laminasyon makinesi",
      width: 941,
      height: 706,
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
      src: "/images/products/kategori-ozel-formlu-sungerler-foto.webp",
      alt: "Oval oto süngeri, masajlı banyo süngerleri ve oluklu kurutma süngerleri gibi farklı formlarda kesilmiş süngerler",
      width: 1024,
      height: 768,
    },
    related: [
      { href: "/urunler/temizlik-sungerleri/super-tekli-oluklu", label: "Oluklu bulaşık süngeri" },
      { href: "/urunler/ozel-formlu-sungerler/104-0-102-80t", label: "Masajlı oval banyo süngeri" },
      { href: "/urunler/ozel-formlu-sungerler/105-0-105-168t", label: "Oval oto süngeri" },
    ],
  },
  {
    id: "konverting",
    label: "Konverting",
    title: "Konverting",
    paragraphs: [
      "Sünger ve rulo hammaddeleri ihtiyaç duyulan ölçü ve formlara dönüştürüyoruz: sünger blokları dilimleniyor, rulo bezler perforeli rulo, katlanmış bez ve kesilmiş yaprak formlarına getiriliyor.",
      "Ölçü, form ve kesim şekli kullanılacak ürüne göre birlikte belirlenir.",
    ],
    facts: ["Sünger dilimleme", "Perforeli rulo ve katlanmış bez", "Kesilmiş yaprak"],
    image: {
      src: "/images/corporate/konverting-kesim-hatti.webp",
      alt: "Sünger bloğunu dikey bıçakla dilimleyen otomatik kesim makinesi",
      width: 384,
      height: 278,
    },
    related: [
      { href: "/urunler/temizlik-bezleri/110-0-840-12", label: "Perforeli rulo temizlik bezi" },
      { href: "/urunler/hammadde/kece-lamineli-plaka", label: "Keçe lamineli sünger plakası" },
    ],
  },
  {
    id: "paketleme",
    label: "Paketleme",
    title: "Paketleme",
    paragraphs: [
      "Ürünleri tekli paketten 12'li askılı karta kadar farklı ambalajlarda hazırlıyoruz.",
      "Sevkiyat ürüne göre koli, naylon torba veya çuval ile yapılır. Kendi markalarımızın yanı sıra özel markalı üretim taleplerini de birlikte değerlendirebiliriz.",
    ],
    facts: ["Tekliden 12'li karta paket", "Koli, naylon torba, çuval", "Özel marka üretimi"],
    image: {
      src: "/images/corporate/group/saniteks.webp",
      alt: "Üretim hattında paketlemeye ilerleyen sarı gövdeli, yeşil keçeli bulaşık süngerleri",
      width: 1024,
      height: 346,
    },
    related: [
      { href: "/urunler/ozel-marka-uretimi", label: "Özel marka üretimi" },
      { href: "/urunler/temizlik-sungerleri", label: "Temizlik süngerleri" },
    ],
  },
];
