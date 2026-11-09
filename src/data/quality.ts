/**
 * Quality section (/kalite/*), structured after sanifoam.com.tr's "Kalite" menu.
 *
 * Policy texts are the Sanifoam group policies (sanifoam.com.tr), adopted for Saniteks with the
 * company's approval (2026-11). Certificates are the URS certificates of the Veliköy plant whose
 * scope is "Perakende sektörü için bulaşık süngeri ve yer bezi üretimi"; the holder on the
 * certificates is Sanifoam Endüstri ve Tüketim Ürünleri San. Tic. A.Ş.
 */

export type QualityPage = {
  slug: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  paragraphs: string[];
  principlesTitle: string;
  principles: string[];
};

export const qualityPages: QualityPage[] = [
  {
    slug: "kalite-politikamiz",
    label: "Kalite Politikamız",
    title: "Kalite Politikamız",
    subtitle: "Sıfır hata, toplam kalite sorumluluğu.",
    description: "Saniteks kalite politikası: sürekli iyileştirme, sıfır hata ilkesi ve toplam kalite sorumluluğu.",
    paragraphs: [
      "Saniteks, Sanifoam grubunun kalite politikasını benimser. Tüm çalışanlarımız, doğruyu bulmak için “Sürekli İyileştirme” prensibiyle hareket eder.",
      "Müşteri memnuniyetini ve beklentilerini tümüyle karşılayan ürünler; en ekonomik şartlarda, “Sıfır Hata” ilkesiyle, sürekli ve güvenilir kalitede üretilir.",
      "Tüm faaliyetlerimiz “Toplam Kalite Sorumluluğu” bilinciyle sürdürülür ve geliştirilir.",
    ],
    principlesTitle: "Temel ilkeler",
    principles: ["Sürekli iyileştirme prensibi", "Sıfır hata ilkesi", "Toplam kalite sorumluluğu", "Müşteri beklentisine uygun üretim"],
  },
  {
    slug: "cevre-politikamiz",
    label: "Çevre Politikamız",
    title: "Çevre Politikamız",
    subtitle: "Çevreye duyarlı, sürdürülebilir üretim.",
    description: "Saniteks çevre politikası: yasal uyum, atıkların azaltılması, geri kazanım ve kaynak verimliliği.",
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
    slug: "isg-politikasi",
    label: "İSG Politikamız",
    title: "İSG Politikamız",
    subtitle: "Önce insan, önce güvenlik.",
    description: "Saniteks iş sağlığı ve güvenliği politikası: güvenli çalışma ortamı, eğitim ve risk değerlendirmesi.",
    paragraphs: [
      "Saniteks olarak en değerli varlığımız çalışanlarımızdır. İş Sağlığı ve Güvenliği (İSG) standartlarını yasal mevzuatın ötesinde bir kurum kültürü olarak benimsiyoruz.",
      "Güvenli ve sağlıklı bir çalışma ortamı yaratmak, iş kazalarını sıfıra indirmek ve meslek hastalıklarını önlemek için sürekli eğitimler düzenliyor ve önleyici tedbirler alıyoruz.",
    ],
    principlesTitle: "Önceliklerimiz",
    principles: ["Sıfır iş kazası hedefi", "Düzenli personel eğitimleri", "Risk değerlendirme yönetimi", "Ergonomik ve güvenli çalışma alanları"],
  },
  {
    slug: "sikayet-prosedurleri",
    label: "Şikâyet Prosedürleri",
    title: "Şikâyet Prosedürleri",
    subtitle: "Geri bildirimleriniz gelişim fırsatımızdır.",
    description: "Saniteks ürünleriyle ilgili şikâyet ve geri bildirimlerinizi nasıl iletebileceğinizi ve nasıl değerlendirildiğini öğrenin.",
    paragraphs: [
      "Müşteri memnuniyetini en üst düzeyde tutmak amacıyla tüm geri bildirim ve şikâyetleri şeffaf, adil ve hızlı bir şekilde değerlendiriyoruz.",
      "Her şikâyeti süreçlerimizi iyileştirmek için değerli bir fırsat olarak görüyor, çözüm odaklı yaklaşımımızla müşteri güvenini güçlendiriyoruz.",
    ],
    principlesTitle: "Yaklaşımımız",
    principles: ["Hızlı geri dönüş", "Kök neden analizi", "Şeffaf süreç yönetimi", "Müşteri memnuniyeti odaklı çözümler"],
  },
  {
    slug: "kalite-belgelerimiz",
    label: "Kalite Belgelerimiz",
    title: "Kalite Belgelerimiz",
    subtitle: "Uluslararası standartlara göre yönetim sistemleri.",
    description: "Saniteks ürünlerinin üretimine ilişkin kalite, çevre ve iş sağlığı ve güvenliği yönetim sistemi belgeleri.",
    paragraphs: [
      "Ürünlerimizin üretimi; kalite (ISO 9001), çevre (ISO 14001) ve iş sağlığı ve güvenliği (ISO 45001) yönetim sistemi standartları çerçevesinde yürütülür.",
      "Belgelerimiz, belgelendirme kuruluşunun belirttiği geçerlilik tarihleriyle birlikte bu sayfada yayımlanır.",
    ],
    principlesTitle: "Yönetim sistemleri",
    principles: ["ISO 9001 Kalite Yönetim Sistemi", "ISO 14001 Çevre Yönetim Sistemi", "ISO 45001 İSG Yönetim Sistemi"],
  },
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
 * Known certificates. The 2022–2025 cycle ended in September 2025; when the renewed certificates
 * are received, update the dates/numbers and put the PDFs into public/documents/certificates.
 */
export const certificates: Certificate[] = [
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
