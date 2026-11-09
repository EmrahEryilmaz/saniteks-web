# Saniteks web — Plesk'e yayınlama rehberi

Canlı saniteks.com.tr, sanifoam.com.tr ile aynı Plesk sunucusunda **Node.js (Phusion Passenger)** üzerinde çalışıyor.
Bu proje aynı yöntemle yayınlanır. Next.js, `output: "standalone"` ayarıyla kendi kendine yeten bir sunucu
paketi üretir; Plesk'te başlangıç dosyası olarak bu paketteki `server.js` kullanılır.

> **Önce test alanında deneyin.** Yeni siteyi önce bir alt alan adına (ör. `yeni.saniteks.com.tr`) kurup kontrol edin,
> sorun yoksa ana alan adına geçin. Geçişten önce canlı sitenin klasörünü yedekleyin; geri dönmek için Node.js
> ayarlarında uygulama klasörünü eskisine çevirmeniz yeterli olur.

## Gereksinimler

- Plesk'te **Node.js** eklentisi ve **Node.js 20.9 veya üzeri** (22 LTS önerilir).
- Yalnızca Yöntem A ve B için: bilgisayarınızda Node.js 20+ ve internet bağlantısı (paket hazırlarken Linux görsel
  kütüphanesi indirilir). Yöntem C bilgisayar gerektirmez.
- İletişim ve başvuru formlarının e-posta gönderebilmesi için bir SMTP hesabı (ör. Plesk'te `saniteks.com.tr`
  için açılmış bir e-posta kutusu).

## Yöntem A — Hazır paketi yükleyerek

Sunucuda derleme yapılmaz; paket çalışmaya hazır gelir.

> **Bilgisayarsız paket:** `main` dalına gelen her değişiklikten sonra GitHub › **Actions** › **Yayın** › son çalışma ›
> *Artifacts* bölümünden `saniteks-web` paketini indirebilirsiniz. Bu zip, 1. adımdaki paketle aynıdır (Linux için
> derlenmiştir); doğrudan 2. adıma geçin.

1. **Paketi hazırlayın** (proje klasöründe):
   ```
   npm install
   npm run package:plesk
   ```
   Sonuç: `deploy/saniteks-web.zip`. Paket; `server.js`, gerekli `node_modules`, `.next` ve `public` klasörlerini içerir.
   Windows'ta derlenen pakete sunucu için Linux görsel kütüphanesi (sharp) otomatik eklenir. `.env` dosyaları
   pakete konmaz.
2. **Yükleyin:** Plesk › Web Siteleri ve Alan Adları › alan adı › **Dosya Yöneticisi**. `httpdocs` dışında yeni bir klasör
   oluşturun (ör. `/saniteks-web`), zip'i bu klasöre yükleyip **Arşivi aç** deyin.
3. **Node.js ayarları** (alan adı › **Node.js**):
   | Alan | Değer |
   |---|---|
   | Node.js sürümü | 22.x (en az 20.9) |
   | Paket yöneticisi | npm |
   | Belge kökü (Document Root) | `/saniteks-web/public` |
   | Uygulama modu | production |
   | Uygulama kökü (Application Root) | `/saniteks-web` |
   | Uygulama başlangıç dosyası | `server.js` |
   **NPM install** çalıştırmayın; bağımlılıklar pakette hazır.
4. **Ortam değişkenleri** (aynı sayfada *Özel ortam değişkenleri*): aşağıdaki tabloya bakın.
5. **Etkinleştirin / yeniden başlatın:** *Node.js'yi Etkinleştir* veya *Uygulamayı Yeniden Başlat*.
6. Aşağıdaki **kontrol listesini** uygulayın.

**Güncelleme:** yeni zip'i yeni bir klasöre açın (ör. `/saniteks-web-2026-11-10`), Node.js ayarlarında uygulama kökünü
ve belge kökünü yeni klasöre çevirip yeniden başlatın. Eski klasör geri dönüş için kalır.

## Yöntem B — Sunucuda derleyerek

SSH erişimi varsa kaynak kodu yükleyip sunucuda derleyebilirsiniz.

1. Proje klasörünü `node_modules`, `.next` ve `deploy` hariç sunucuya yükleyin (ör. `/saniteks-web-src`).
2. SSH ile proje klasöründe:
   ```
   npm ci
   npm run build
   ```
   (`npm ci` geliştirme bağımlılıklarını da kurmalıdır; `NODE_ENV=production` iken çalıştırmayın — Tailwind ve
   TypeScript derleme için gereklidir.)
3. Node.js ayarları Yöntem A ile aynıdır; yalnızca **uygulama kökü** `/saniteks-web-src`,
   **başlangıç dosyası** `.next/standalone/server.js`, **belge kökü** `/saniteks-web-src/public` olur.

## Yöntem C — GitHub ile otomatik yayın (önerilen)

Kod GitHub'da değiştirilir; derleme ve yükleme GitHub Actions'ta yapılır. Bilgisayarda hiçbir şey kurulu olması gerekmez.

- **Kontrol** (`.github/workflows/ci.yml`): her pull request'te ve `main`'e her gönderimde `typecheck`, `lint`, `build`.
- **Yayın** (`.github/workflows/deploy.yml`): `main`'e her gönderimde paketi hazırlar (Yöntem A'daki zip, *Artifacts*
  altında 30 gün saklanır). `DEPLOY_ENABLED` açıksa paketi SSH ile sunucuya yükler: önce `<klasör>-next` içine açar,
  sonra mevcut klasörü `<klasör>-prev` yapıp yenisini yerine koyar ve Passenger'ı `tmp/restart.txt` ile yeniden
  başlatır. Ortam değişkenleri (SMTP vb.) Plesk'te kalır, bu işlemden etkilenmez.
- **Geri dönüş:** GitHub › Actions › **Yayın** › *Run workflow* › `rollback`. Sunucudaki `<klasör>` ile `<klasör>-prev`
  yer değiştirir.

### Bir kerelik kurulum

1. **Plesk'te SSH erişimi:** alan adı › *Web Hosting Erişimi* › *SSH ile sunucuya erişim*: `/bin/bash` (chroot'lu kabuk
   da olur; `tar` ve `bash` yeterlidir).
2. **SSH anahtarı:** yalnızca bu iş için yeni bir anahtar çifti oluşturun. Bilgisayar gerekmez: Plesk'in tarayıcıdaki
   *SSH Terminal*'inde `ssh-keygen -t ed25519 -N "" -f ~/.ssh/github_deploy` çalıştırıp
   `cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys` ile yetkilendirin; `cat ~/.ssh/github_deploy` çıktısını
   `PLESK_SSH_KEY` olarak GitHub'a girip sunucudaki gizli anahtar dosyasını silin. `PLESK_SSH_KNOWN_HOSTS` için aynı
   terminalde `ssh-keyscan localhost` çıktısındaki `localhost` yerine `PLESK_SSH_HOST` değerini yazın.
3. **Uygulama klasörü:** Plesk Node.js ayarlarını Yöntem A'daki gibi yapın. *Uygulama kökü* SSH kullanıcısının ev
   klasörüne göre göreli olarak `PLESK_APP_DIR` değişkenine yazılır (ör. uygulama kökü `/saniteks-web` ise
   `saniteks-web`). İlk otomatik yayında o klasördeki mevcut dosyalar `<klasör>-prev` olarak saklanır.
4. **GitHub › depo › Settings › Secrets and variables › Actions:**

   | Tür | Ad | Değer |
   |---|---|---|
   | Secret | `PLESK_SSH_HOST` | Sunucu adresi (ör. `saniteks.com.tr` veya IP) |
   | Secret | `PLESK_SSH_USER` | Alan adının sistem kullanıcısı (Plesk › *Web Hosting Erişimi*) |
   | Secret | `PLESK_SSH_KEY` | Gizli anahtarın tamamı (`-----BEGIN OPENSSH PRIVATE KEY-----` dahil) |
   | Secret | `PLESK_SSH_PORT` | İsteğe bağlı; boşsa 22 |
   | Secret | `PLESK_SSH_KNOWN_HOSTS` | Önerilir: sunucunun `ssh-keyscan` satırları. Boşsa ilk bağlantıdaki anahtar kabul edilir ve parmak izi günlüğe yazılır |
   | Variable | `PLESK_APP_DIR` | Ör. `saniteks-web` |
   | Variable | `SITE_URL` | İsteğe bağlı; yayın sonrası kontrol edilen adres (ör. `https://yeni.saniteks.com.tr`) |
   | Variable | `DEPLOY_ENABLED` | `true` olunca otomatik yayın başlar; o zamana kadar yalnızca paket hazırlanır |

5. **Onay adımı (önerilir):** Settings › *Environments* › `production` › *Required reviewers*: kendinizi ekleyin. Her
   yayın, Actions sayfasında *Approve* deyene kadar bekler. Aynı yerde *Deployment branches* ile yalnızca `main`'e izin
   verin.
6. **`main` dalını koruyun (önerilir):** Settings › *Branches* › kural ekleyin: pull request zorunlu ve **Kontrol**
   işinin geçmesi zorunlu.

İlk denemeyi sayfa başındaki uyarıdaki gibi bir test alt alan adına yapın; sorun yoksa `PLESK_APP_DIR` ve `SITE_URL`'i ana
alan adına çevirin.

## Ortam değişkenleri

| Değişken | Açıklama | Örnek |
|---|---|---|
| `NODE_ENV` | Her zaman `production` | `production` |
| `SMTP_HOST` | SMTP sunucusu | `mail.saniteks.com.tr` |
| `SMTP_PORT` | 465 (SSL) veya 587 (STARTTLS) | `587` |
| `SMTP_SECURE` | 465 için `true`, 587 için `false` | `false` |
| `SMTP_USER` | SMTP kullanıcı adı | `web@saniteks.com.tr` |
| `SMTP_PASS` | SMTP parolası | — |
| `CONTACT_TO` | İletişim formunun gideceği adres | `info@saniteks.com.tr` |
| `CONTACT_FROM` | Gönderen adresi (SMTP hesabıyla aynı alan adından) | `Saniteks Web <web@saniteks.com.tr>` |
| `HR_TO` | Başvurular ve "İnsan Kaynakları" konulu mesajlar (boşsa `ik@sanifoam.com.tr`) | `ik@sanifoam.com.tr` |

SMTP tanımlı değilse formlar canlıda "şu an gönderilemiyor" mesajı verir ve ziyaretçiyi e-posta/telefona yönlendirir.
Ayrıntılar: `.env.example`.

## Yayın sonrası kontrol listesi

- [ ] Ana sayfa açılıyor; slayt görselleri ve ürün görselleri yükleniyor (görsel adresleri `/_next/image?...` ile başlar).
- [ ] `/urunler`, bir kategori ve bir ürün sayfası; ürün kodu araması çalışıyor.
- [ ] `/kurumsal` → `/kurumsal/hakkinda`, `/kalite` → `/kalite/kalite-politikamiz` yönleniyor.
- [ ] İletişim formundan test mesajı gönderin; e-posta `CONTACT_TO` adresine ulaşıyor.
- [ ] İnsan Kaynakları sayfasından küçük bir PDF ile test başvurusu yapın; e-posta ve ek `HR_TO` adresine ulaşıyor.
- [ ] `/kataloglar` sayfasındaki PDF açılıyor ve iniyor.
- [ ] `/sitemap.xml` ve `/robots.txt` açılıyor; olmayan bir adres 404 sayfası gösteriyor.
- [ ] Mobilde menü açılıp kapanıyor.
- [ ] Google Search Console'da site haritasını (`https://saniteks.com.tr/sitemap.xml`) yeniden gönderin.

## Yayından önce karar verilmesi gerekenler

- **KVKK Aydınlatma Metni** canlı sitedeki gibi taslak (arama motorlarına kapalı). Hukuki onaydan sonra
  `src/components/legal/kvkk.ts` içindeki `draft` değerini `false` yapıp paketi yeniden hazırlayın.
- **Kalite belgeleri:** elimizdeki ISO 9001 / 14001 / 45001 belgelerinin geçerliliği Eylül 2025'te sona ermiş; site süresi
  geçmiş belge göstermez. Yenilenen belgeleri `public/documents/certificates/` klasörüne koyup `src/data/quality.ts`
  içindeki tarih ve numaraları güncelleyin.
- **Görsel lisansları:** ana sayfadaki aile fotoğrafları 2016 kataloğundan alınmış stok görseller olabilir; web
  kullanım lisansını kontrol edin.

## Sık karşılaşılan sorunlar

- **Görseller kırık / `/_next/image` 500 veriyor:** paket Linux görsel kütüphanesi olmadan hazırlanmış. Yöntem A'da
  `npm run package:plesk` ile yeniden hazırlayın (internet bağlantısı gerekir) ya da Yöntem B'yi kullanın.
- **Uygulama açılmıyor:** Node.js sürümünü (≥ 20.9) ve başlangıç dosyası yolunu kontrol edin; Plesk'te
  *Uygulama günlüğü* (logs) bölümüne bakın.
- **Formlar "gönderilemiyor" diyor:** SMTP değişkenlerini kontrol edin; 587 portunda `SMTP_SECURE=false` olmalıdır.
