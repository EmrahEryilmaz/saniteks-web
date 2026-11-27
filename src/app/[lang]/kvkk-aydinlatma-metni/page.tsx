import type { Metadata } from "next";
import { kvkkNotice } from "@/components/legal/kvkk";
import { LegalDocument, LegalHeading, LegalList, LegalParagraph, type LegalSectionLink } from "@/components/legal/LegalDocument";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { textLinkClass } from "@/components/ui/styles";
import { site } from "@/lib/site";

const path = kvkkNotice.path;
const title = "KVKK Aydınlatma Metni";
const description = "Saniteks web sitesi ve iletişim formu kapsamındaki kişisel veri işleme süreçlerine ilişkin bilgilendirme.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  robots: kvkkNotice.draft ? { index: false, follow: false } : undefined,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
    url: path,
    title: `${title} | Saniteks`,
    description,
  },
  twitter: {
    card: "summary",
    title: `${title} | Saniteks`,
    description,
  },
};

const crumbs: Crumb[] = [{ label: "Ana Sayfa", href: "/" }, { label: title }];

const sections = {
  controller: { id: "veri-sorumlusu", title: "Veri sorumlusu" },
  data: { id: "islenen-veriler", title: "İşlenen kişisel veriler" },
  purposes: { id: "isleme-amaclari", title: "Kişisel veri işleme amaçları" },
  collection: { id: "toplama-yontemi", title: "Kişisel verilerin toplanma yöntemi" },
  legalBasis: { id: "hukuki-sebepler", title: "İşleme şartları ve hukuki sebepler" },
  transfer: { id: "aktarim", title: "Kişisel verilerin aktarılması" },
  retention: { id: "saklama", title: "Saklama ve silme yaklaşımı" },
  rights: { id: "ilgili-kisi-haklari", title: "İlgili kişinin hakları" },
  application: { id: "basvuru-yontemi", title: "Başvuru yöntemi" },
  changes: { id: "degisiklikler", title: "Metin değişiklikleri" },
} satisfies Record<string, LegalSectionLink>;

function Heading({ section }: { section: LegalSectionLink }) {
  return <LegalHeading id={section.id}>{section.title}</LegalHeading>;
}

export default function KvkkPage() {
  return (
    <>
      <LegalDocument
        title={title}
        crumbs={crumbs}
        version={kvkkNotice.version}
        updated={kvkkNotice.updated}
        sections={Object.values(sections)}
        draftNotice={
          kvkkNotice.draft ? (
            <>
              <strong className="font-semibold">Taslak ön izleme:</strong>{" "}
              Bu metin sayfa görünümünü değerlendirmek için geçici bilgilerle yayımlanmıştır ve henüz hukuk onayı almamıştır.
            </>
          ) : undefined
        }
      >
        <Heading section={sections.controller} />
        <LegalParagraph>
          6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu SANİTEKS SÜNGER SANAYİ TURİZM VE TİCARET
          ANONİM ŞİRKETİ’dir. Şirketimize{" "}
          <a className={textLinkClass} href={`mailto:${site.contact.email}`}>
            {site.contact.email}
          </a>{" "}
          e-posta adresinden,{" "}
          <a className={textLinkClass} href={site.contact.phoneHref}>
            {site.contact.phoneDisplay}
          </a>{" "}
          telefon numarasından veya {site.contact.address} adresinden ulaşabilirsiniz.
        </LegalParagraph>

        <Heading section={sections.data} />
        <LegalParagraph>
          İletişim formunu kullandığınızda ad ve soyadınız, e-posta adresiniz, seçtiğiniz konu ve mesajınız işlenir. Telefon
          numarası paylaşmanız isteğe bağlıdır.
        </LegalParagraph>

        <Heading section={sections.purposes} />
        <LegalList
          items={[
            "İletişim talebinizi almak, değerlendirmek ve yanıtlamak.",
            "Talebinizle ilgili iletişim faaliyetlerini yürütmek.",
            "İletişim formunun güvenliğini sağlamak ve kötüye kullanımı sınırlandırmak.",
          ]}
        />

        <Heading section={sections.collection} />
        <LegalParagraph>
          Kişisel verileriniz, web sitesindeki iletişim formuna bilgileri kendiniz girip formu göndermeniz yoluyla elektronik
          ortamda elde edilir. Form içeriği TLS korumalı SMTP bağlantısı üzerinden şirket e-posta kutusuna iletilir ve web
          sitesi veritabanına kaydedilmez.
        </LegalParagraph>

        <Heading section={sections.legalBasis} />
        <LegalParagraph>
          İletişim talebinin niteliğine göre kişisel veriler, bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması
          ya da veri sorumlusunun meşru menfaatleri için işlemenin zorunlu olması işleme şartlarına dayanılarak işlenebilir.
          Uygulanacak işleme şartı, talebin konusu ve kurulmak istenen ilişkiye göre değerlendirilir.
        </LegalParagraph>

        <Heading section={sections.transfer} />
        <LegalParagraph>
          İletişim bilgileriniz ve mesajınız, talebin yanıtlanması amacıyla şirket içindeki yetkili kişilerle ve e-posta
          iletim hizmetinin sağlanması ölçüsünde e-posta altyapısı hizmet sağlayıcısıyla paylaşılabilir. Kanunen yetkili kamu
          kurum ve kuruluşlarına, hukuki yükümlülük bulunması halinde aktarım yapılabilir.
        </LegalParagraph>

        <Heading section={sections.retention} />
        <LegalParagraph>
          İletişim formuyla gönderilen bilgiler, talebin sonuçlandırılması için gerekli süre boyunca şirket e-posta kutusunda
          tutulur. Saklamayı gerektiren başka bir hukuki yükümlülük bulunmaması halinde saklama ihtiyacı sona erdiğinde
          silinir.
        </LegalParagraph>

        <Heading section={sections.rights} />
        <LegalParagraph>KVKK’nin 11. maddesi kapsamında şirketimize başvurarak:</LegalParagraph>
        <LegalList
          items={[
            "kişisel verilerinizin işlenip işlenmediğini öğrenme,",
            "işlenmişse buna ilişkin bilgi talep etme,",
            "işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,",
            "yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,",
            "eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme,",
            "Kanunda öngörülen şartlarla silinmesini veya yok edilmesini isteme,",
            "düzeltme, silme veya yok etme işlemlerinin aktarım yapılan kişilere bildirilmesini isteme,",
            "otomatik sistemlerle analiz sonucunun aleyhinize olmasına itiraz etme,",
            "kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini isteme",
          ]}
        />

        <Heading section={sections.application} />
        <LegalParagraph>
          Haklarınıza ilişkin taleplerinizi, kimliğinizi ve talebinizi açıklayan bilgilerle birlikte şirketimizin yukarıda
          belirtilen posta adresine yazılı olarak veya mevzuatın izin verdiği diğer yöntemlerle iletebilirsiniz.
        </LegalParagraph>

        <Heading section={sections.changes} />
        <LegalParagraph>
          Bu aydınlatma metni, kişisel veri işleme faaliyetlerinde veya ilgili mevzuatta meydana gelen değişikliklere göre
          güncellenebilir. Yürürlükteki sürüm ve güncelleme tarihi sayfanın başında gösterilir.
        </LegalParagraph>
      </LegalDocument>
      <JsonLd data={breadcrumbJsonLd(crumbs, site.url, path)} />
    </>
  );
}
