import type { Metadata } from "next";
import { kvkkNotice } from "@/components/legal/kvkk";
import { LegalDocument, LegalHeading, LegalList, LegalParagraph, type LegalSectionLink } from "@/components/legal/LegalDocument";
import { rich } from "@/components/legal/rich";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, type Crumb } from "@/components/ui/Breadcrumbs";
import { textLinkClass } from "@/components/ui/styles";
import { pageMetadata } from "@/i18n/metadata";
import { getLocale, getT } from "@/i18n/server";
import { site } from "@/lib/site";

const path = kvkkNotice.path;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  const metadata = await pageMetadata({
    title: t("KVKK Aydınlatma Metni"),
    description: t("Saniteks web sitesi ve iletişim formu kapsamındaki kişisel veri işleme süreçlerine ilişkin bilgilendirme."),
    path,
  });
  return { ...metadata, robots: kvkkNotice.draft ? { index: false, follow: false } : undefined };
}

function Heading({ section }: { section: LegalSectionLink }) {
  return <LegalHeading id={section.id}>{section.title}</LegalHeading>;
}

export default async function KvkkPage() {
  const t = await getT();
  const locale = await getLocale();
  const title = t("KVKK Aydınlatma Metni");
  const crumbs: Crumb[] = [{ label: t("Ana Sayfa"), href: "/" }, { label: title }];

  const sections = {
    controller: { id: "veri-sorumlusu", title: t("Veri sorumlusu") },
    data: { id: "islenen-veriler", title: t("İşlenen kişisel veriler") },
    purposes: { id: "isleme-amaclari", title: t("Kişisel veri işleme amaçları") },
    collection: { id: "toplama-yontemi", title: t("Kişisel verilerin toplanma yöntemi") },
    legalBasis: { id: "hukuki-sebepler", title: t("İşleme şartları ve hukuki sebepler") },
    transfer: { id: "aktarim", title: t("Kişisel verilerin aktarılması") },
    retention: { id: "saklama", title: t("Saklama ve silme yaklaşımı") },
    rights: { id: "ilgili-kisi-haklari", title: t("İlgili kişinin hakları") },
    application: { id: "basvuru-yontemi", title: t("Başvuru yöntemi") },
    changes: { id: "degisiklikler", title: t("Metin değişiklikleri") },
  } satisfies Record<string, LegalSectionLink>;

  return (
    <>
      <LegalDocument
        title={title}
        crumbs={crumbs}
        version={kvkkNotice.draft ? t("Ön İzleme {version}", { version: kvkkNotice.version }) : kvkkNotice.version}
        updated={kvkkNotice.updated}
        sections={Object.values(sections)}
        languageNotice={locale !== "tr" ? t("Bu aydınlatma metninin bağlayıcı sürümü Türkçe olanıdır.") : undefined}
        draftNotice={
          kvkkNotice.draft ? (
            <>
              <strong className="font-semibold">{t("Taslak ön izleme:")}</strong>{" "}
              {t("Bu metin sayfa görünümünü değerlendirmek için geçici bilgilerle yayımlanmıştır ve henüz hukuk onayı almamıştır.")}
            </>
          ) : undefined
        }
      >
        <Heading section={sections.controller} />
        <LegalParagraph>
          {t("6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu SANİTEKS SÜNGER SANAYİ TURİZM VE TİCARET ANONİM ŞİRKETİ’dir.")}{" "}
          {rich(t("Şirketimize {email} e-posta adresinden, {phone} telefon numarasından veya {address} adresinden ulaşabilirsiniz."), {
            email: (
              <a className={textLinkClass} href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            ),
            phone: (
              <a className={textLinkClass} href={site.contact.phoneHref}>
                {site.contact.phoneDisplay}
              </a>
            ),
            address: site.contact.address,
          })}
        </LegalParagraph>

        <Heading section={sections.data} />
        <LegalParagraph>
          {t(
            "İletişim formunu kullandığınızda ad ve soyadınız, e-posta adresiniz, seçtiğiniz konu ve mesajınız işlenir. Telefon numarası paylaşmanız isteğe bağlıdır.",
          )}
        </LegalParagraph>

        <Heading section={sections.purposes} />
        <LegalList
          items={[
            t("İletişim talebinizi almak, değerlendirmek ve yanıtlamak."),
            t("Talebinizle ilgili iletişim faaliyetlerini yürütmek."),
            t("İletişim formunun güvenliğini sağlamak ve kötüye kullanımı sınırlandırmak."),
          ]}
        />

        <Heading section={sections.collection} />
        <LegalParagraph>
          {t(
            "Kişisel verileriniz, web sitesindeki iletişim formuna bilgileri kendiniz girip formu göndermeniz yoluyla elektronik ortamda elde edilir. Form içeriği TLS korumalı SMTP bağlantısı üzerinden şirket e-posta kutusuna iletilir ve web sitesi veritabanına kaydedilmez.",
          )}
        </LegalParagraph>

        <Heading section={sections.legalBasis} />
        <LegalParagraph>
          {t(
            "İletişim talebinin niteliğine göre kişisel veriler, bir sözleşmenin kurulması veya ifasıyla doğrudan ilgili olması ya da veri sorumlusunun meşru menfaatleri için işlemenin zorunlu olması işleme şartlarına dayanılarak işlenebilir. Uygulanacak işleme şartı, talebin konusu ve kurulmak istenen ilişkiye göre değerlendirilir.",
          )}
        </LegalParagraph>

        <Heading section={sections.transfer} />
        <LegalParagraph>
          {t(
            "İletişim bilgileriniz ve mesajınız, talebin yanıtlanması amacıyla şirket içindeki yetkili kişilerle ve e-posta iletim hizmetinin sağlanması ölçüsünde e-posta altyapısı hizmet sağlayıcısıyla paylaşılabilir. Kanunen yetkili kamu kurum ve kuruluşlarına, hukuki yükümlülük bulunması halinde aktarım yapılabilir.",
          )}
        </LegalParagraph>

        <Heading section={sections.retention} />
        <LegalParagraph>
          {t(
            "İletişim formuyla gönderilen bilgiler, talebin sonuçlandırılması için gerekli süre boyunca şirket e-posta kutusunda tutulur. Saklamayı gerektiren başka bir hukuki yükümlülük bulunmaması halinde saklama ihtiyacı sona erdiğinde silinir.",
          )}
        </LegalParagraph>

        <Heading section={sections.rights} />
        <LegalParagraph>{t("KVKK’nin 11. maddesi kapsamında şirketimize başvurarak:")}</LegalParagraph>
        <LegalList
          items={[
            t("kişisel verilerinizin işlenip işlenmediğini öğrenme,"),
            t("işlenmişse buna ilişkin bilgi talep etme,"),
            t("işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,"),
            t("yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,"),
            t("eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme,"),
            t("Kanunda öngörülen şartlarla silinmesini veya yok edilmesini isteme,"),
            t("düzeltme, silme veya yok etme işlemlerinin aktarım yapılan kişilere bildirilmesini isteme,"),
            t("otomatik sistemlerle analiz sonucunun aleyhinize olmasına itiraz etme,"),
            t("kanuna aykırı işleme nedeniyle zarara uğramanız hâlinde zararın giderilmesini isteme"),
          ]}
        />

        <Heading section={sections.application} />
        <LegalParagraph>
          {t(
            "Haklarınıza ilişkin taleplerinizi, kimliğinizi ve talebinizi açıklayan bilgilerle birlikte şirketimizin yukarıda belirtilen posta adresine yazılı olarak veya mevzuatın izin verdiği diğer yöntemlerle iletebilirsiniz.",
          )}
        </LegalParagraph>

        <Heading section={sections.changes} />
        <LegalParagraph>
          {t(
            "Bu aydınlatma metni, kişisel veri işleme faaliyetlerinde veya ilgili mevzuatta meydana gelen değişikliklere göre güncellenebilir. Yürürlükteki sürüm ve güncelleme tarihi sayfanın başında gösterilir.",
          )}
        </LegalParagraph>
      </LegalDocument>
      <JsonLd data={breadcrumbJsonLd(crumbs, site.url, path, locale)} />
    </>
  );
}
