/**
 * Quality section (/kalite/*), structured after sanifoam.com.tr's "Kalite" menu.
 *
 * Policy texts are the Sanifoam group policies (sanifoam.com.tr), adopted for Saniteks with the
 * company's approval (2026-11). Certificates are URS certificates whose scope is "Perakende sektörü için
 * bulaşık süngeri ve yer bezi üretimi": the 2022–2025 cycle was held by Sanifoam Endüstri ve Tüketim Ürünleri
 * San. Tic. A.Ş. (expired, hidden); the ISO 9001 certificate of 2024 is held by Saniteks itself (supplied 2026-11-23).
 */

/** One policy / text block: heading, paragraphs and a principles card. */
export type QualityBlock = {
  /** Anchor id on the page (also the target of the old single-policy URLs). */
  id: string;
  /** Label of the in-page link on merged pages. */
  navLabel?: string;
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  principlesTitle: string;
  principles: string[];
};

export type QualityPage = {
  slug: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  blocks: QualityBlock[];
};

export const qualityPages: QualityPage[] = [
  {
    // Owner decision 2026-11-23: the quality, environment and OHS policies share one page.
    slug: "politikalarimiz",
    label: "Politikalarımız",
    title: "Politikalarımız",
    subtitle: "Kalite, çevre ve iş sağlığı ve güvenliği politikalarımız bir arada.",
    description:
      "Saniteks kalite, çevre ve iş sağlığı ve güvenliği politikaları: sürekli iyileştirme, sıfır hata, çevreye duyarlı üretim ve güvenli çalışma ortamı.",
    blocks: [
      {
        id: "kalite-politikamiz",
        navLabel: "Kalite Politikamız",
        eyebrow: "KALİTE POLİTİKAMIZ",
        heading: "Sıfır hata, toplam kalite sorumluluğu.",
        paragraphs: [
          "Saniteks, Sanifoam grubunun kalite politikasını benimser. Tüm çalışanlarımız, doğruyu bulmak için “Sürekli İyileştirme” prensibiyle hareket eder.",
          "Müşteri memnuniyetini ve beklentilerini tümüyle karşılayan ürünler; en ekonomik şartlarda, “Sıfır Hata” ilkesiyle, sürekli ve güvenilir kalitede üretilir.",
          "Tüm faaliyetlerimiz “Toplam Kalite Sorumluluğu” bilinciyle sürdürülür ve geliştirilir.",
        ],
        principlesTitle: "Temel ilkeler",
        principles: ["Sürekli iyileştirme prensibi", "Sıfır hata ilkesi", "Toplam kalite sorumluluğu", "Müşteri beklentisine uygun üretim"],
      },
      {
        id: "cevre-politikamiz",
        navLabel: "Çevre Politikamız",
        eyebrow: "ÇEVRE POLİTİKAMIZ",
        heading: "Çevreye duyarlı, sürdürülebilir üretim.",
        paragraphs: [
          "Saniteks, Sanifoam grubunun Çevre Politikası doğrultusunda çevre üzerinde oluşabilecek olumsuz etkileri azaltmayı ve önlemeyi hedefler. Ulusal ve uluslararası yasal düzenlemelere, çevreyle ilgili kanun, mevzuat ve diğer yükümlülüklere eksiksiz uyarız.",
          "Endüstriyel kirliliği kaynağında en aza indirir, atıkları kontrol altında tutup azaltarak geri kazanımı özendirir; doğal kaynak ve enerji tüketimini kontrol altında tutarak kullanımını en aza indiririz.",
          "Düzenlediğimiz eğitimlerle çalışanlarımızın ve tedarikçilerimizin çevre bilincini bir yaşam felsefesi olarak benimsemesini sağlar; çevre amaç ve hedeflerimizi oluşturarak sürekli gelişmeye katkıda bulunuruz.",
        ],
        principlesTitle: "Odak alanları",
        principles: [
          "Yasal düzenlemelere tam uyum",
          "Atıkların azaltılması ve geri kazanım",
          "Doğal kaynak ve enerji verimliliği",
          "Çalışan ve tedarikçi çevre eğitimleri",
        ],
      },
      {
        id: "isg-politikamiz",
        navLabel: "İSG Politikamız",
        eyebrow: "İSG POLİTİKAMIZ",
        heading: "Önce insan, önce güvenlik.",
        paragraphs: [
          "Saniteks olarak en değerli varlığımız çalışanlarımızdır. İş Sağlığı ve Güvenliği (İSG) standartlarını yasal mevzuatın ötesinde bir kurum kültürü olarak benimsiyoruz.",
          "Güvenli ve sağlıklı bir çalışma ortamı yaratmak, iş kazalarını sıfıra indirmek ve meslek hastalıklarını önlemek için sürekli eğitimler düzenliyor ve önleyici tedbirler alıyoruz.",
        ],
        principlesTitle: "Önceliklerimiz",
        principles: ["Sıfır iş kazası hedefi", "Düzenli personel eğitimleri", "Risk değerlendirme yönetimi", "Ergonomik ve güvenli çalışma alanları"],
      },
    ],
  },
  {
    slug: "sikayet-prosedurleri",
    label: "Şikâyet Prosedürleri",
    title: "Şikâyet Prosedürleri",
    subtitle: "Geri bildirimleriniz gelişim fırsatımızdır.",
    description: "Saniteks ürünleriyle ilgili şikâyet ve geri bildirimlerinizi nasıl iletebileceğinizi ve nasıl değerlendirildiğini öğrenin.",
    blocks: [
      {
        id: "yaklasimimiz",
        eyebrow: "ŞİKÂYET PROSEDÜRLERİ",
        heading: "Geri bildirimleriniz gelişim fırsatımızdır.",
        paragraphs: [
          "Müşteri memnuniyetini en üst düzeyde tutmak amacıyla tüm geri bildirim ve şikâyetleri şeffaf, adil ve hızlı bir şekilde değerlendiriyoruz.",
          "Her şikâyeti süreçlerimizi iyileştirmek için değerli bir fırsat olarak görüyor, çözüm odaklı yaklaşımımızla müşteri güvenini güçlendiriyoruz.",
        ],
        principlesTitle: "Yaklaşımımız",
        principles: ["Hızlı geri dönüş", "Kök neden analizi", "Şeffaf süreç yönetimi", "Müşteri memnuniyeti odaklı çözümler"],
      },
    ],
  },
  {
    slug: "kalite-belgelerimiz",
    label: "Kalite Belgelerimiz",
    title: "Kalite Belgelerimiz",
    subtitle: "Uluslararası standarda göre kalite yönetimi.",
    description: "Saniteks ürünlerinin üretimine ilişkin ISO 9001 kalite yönetim sistemi belgesi.",
    blocks: [
      {
        id: "yonetim-sistemleri",
        eyebrow: "KALİTE BELGELERİMİZ",
        heading: "Uluslararası standarda göre kalite yönetimi.",
        paragraphs: [
          "Ürünlerimizin üretimi, ISO 9001 kalite yönetim sistemi standardı çerçevesinde yürütülür.",
          "Belgelerimiz, belgelendirme kuruluşunun belirttiği geçerlilik tarihleriyle birlikte bu sayfada yayımlanır.",
        ],
        principlesTitle: "Yönetim sistemi",
        principles: ["ISO 9001:2015 Kalite Yönetim Sistemi", "Bulaşık süngeri ve yer bezi üretimi kapsamında", "URS tarafından belgelendirilmiştir"],
      },
    ],
  },
];

/** Old single-policy pages (until 2026-11-23) → anchor on the merged page; used by next.config.ts redirects. */
export const mergedPolicyPaths = [
  { from: "kalite-politikamiz", to: "politikalarimiz#kalite-politikamiz" },
  { from: "cevre-politikamiz", to: "politikalarimiz#cevre-politikamiz" },
  { from: "isg-politikasi", to: "politikalarimiz#isg-politikamiz" },
];

export function getQualityPage(slug: string) {
  return qualityPages.find((p) => p.slug === slug);
}

export const qualityHref = (slug: string) => `/kalite/${slug}`;

/* ------------------------------------------------------------------ */
/* Certificates                                                        */
/* ------------------------------------------------------------------ */

export type Certificate = {
  standard: string;
  title: string;
  number: string;
  issuer: string;
  holder: string;
  scope: string;
  /** ISO date — first day of validity of the current cycle. */
  validFrom: string;
  /** ISO date — last day of validity. Expired certificates are never listed. */
  validUntil: string;
  /** PDF under /public/documents/certificates. Add the file before publishing a renewed certificate. */
  file: string;
};

const holder = "Sanifoam Endüstri ve Tüketim Ürünleri San. Tic. A.Ş. — Veliköy OSB, Çerkezköy / Tekirdağ";
const scope = "Perakende sektörü için bulaşık süngeri ve yer bezi üretimi";

/**
 * Known certificates. Expired ones stay here for reference but are never listed (validCertificates).
 * When a certificate is renewed, add it with a new PDF file name (/documents is cached for 30 days).
 */
export const certificates: Certificate[] = [
  {
    standard: "ISO 9001:2015",
    title: "Kalite Yönetim Sistemi",
    number: "212801/A/0001/UK/Tr",
    issuer: "URS (United Registrar of Systems)",
    holder: "Saniteks Sünger Sanayi Turizm ve Ticaret A.Ş. — Veliköy Mah. 17 (Sanayi) Cad. No: 13 A, Çerkezköy / Tekirdağ",
    scope,
    validFrom: "2024-04-06",
    validUntil: "2027-04-05",
    file: "/documents/certificates/iso-9001-2015-urs-212801.pdf",
  },
  {
    standard: "ISO 9001:2015",
    title: "Kalite Yönetim Sistemi",
    number: "203406/C/0001/UK/Tr",
    issuer: "URS (United Registrar of Systems)",
    holder,
    scope,
    validFrom: "2022-09-23",
    validUntil: "2025-09-22",
    file: "/documents/certificates/iso-9001-2015.pdf",
  },
  {
    standard: "ISO 14001:2015",
    title: "Çevre Yönetim Sistemi",
    number: "203406/B/0001/UK/Tr",
    issuer: "URS (United Registrar of Systems)",
    holder,
    scope,
    validFrom: "2022-09-19",
    validUntil: "2025-09-18",
    file: "/documents/certificates/iso-14001-2015.pdf",
  },
  {
    standard: "ISO 45001:2018",
    title: "İş Sağlığı ve Güvenliği Yönetim Sistemi",
    number: "203406/A/0001/UK/Tr",
    issuer: "URS (United Registrar of Systems)",
    holder,
    scope,
    validFrom: "2022-09-17",
    validUntil: "2025-09-16",
    file: "/documents/certificates/iso-45001-2018.pdf",
  },
];

/** Certificates valid on `date` (end of day, Europe/Istanbul is close enough for day granularity). */
export function validCertificates(date: Date = new Date()): Certificate[] {
  const today = date.toISOString().slice(0, 10);
  return certificates.filter((c) => c.validUntil >= today);
}

export function formatTrDate(iso: string) {
  return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Istanbul" }).format(
    new Date(`${iso}T12:00:00Z`),
  );
}
