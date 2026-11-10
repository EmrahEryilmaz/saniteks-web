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
  altında 30 gün saklanır). `DEPLOY_ENABLED` açıksa paketi sunucuya yükler: önce `<klasör>-next` içine yükler, sonra
  mevcut klasörü `<klasör>-prev` yapıp yenisini yerine koyar ve Passenger'ı `tmp/restart.txt` ile yeniden başlatır.
  Ortam değişkenleri (SMTP vb.) Plesk'teki Node.js ayarlarında kalır, bu işlemden etkilenmez.
- **Aktarım:** `DEPLOY_METHOD` değişkeni:
  - `git` (varsayılan): paket bu deponun `yayin` dalına (değiştirmek için `RELEASE_BRANCH`) commit olarak gönderilir;
    sunucu bu dalı Plesk'in Git özelliğiyle **kendisi çeker**. Sunucuya dışarıdan bağlantı gerekmez.
  - `ftp` / `ssh`: paket sunucuya doğrudan yüklenir (barındırma GitHub'dan gelen FTP/SSH bağlantısına izin vermelidir).
- **Geri dönüş:** GitHub › Actions › **Yayın** › *Run workflow* › `rollback`. `git` yönteminde `yayin` dalına önceki
  yayının içeriği yeniden gönderilir (iki kez çalıştırmak geri dönüşü geri alır); `ftp`/`ssh` yönteminde sunucudaki
  `<klasör>` ile `<klasör>-prev` yer değiştirir.

### Şu anki kurulum (saniteks.com.tr, 1VS.co Plesk)

- Barındırma paketinde SSH kapalı; güvenlik duvarı GitHub'ın (yurtdışı) IP'lerinden FTP'ye (21) de izin vermiyor
  (Kasım 2026'da denendi: TCP bağlantısı kurulamadı). Bu yüzden yayın **`git`** yöntemiyle yapılır: GitHub paketi
  `yayin` dalına koyar, Plesk'in Git özelliği bu dalı `/saniteks-web/app` klasörüne dağıtır.
- Site `/saniteks-web/app` klasöründen çalışır (Node.js uygulama kökü; belge kökü `/saniteks-web/app/public`).
- Eski site `/saniteks.com.tr` klasöründe durur; Plesk'teki eski Git bağlantısı (`ubden/saniteks.com.tr`) **Manuel**
  dağıtıma alınmıştır. Geri dönmek için Node.js ayarlarında uygulama kökünü `/saniteks.com.tr`, belge kökünü
  `/saniteks.com.tr/public` yapıp uygulamayı yeniden başlatmak yeterlidir.
- `saniteks_depoloy` FTP hesabı (ana dizin `/saniteks-web`) FTP yöntemi için açılmıştı; kullanılmıyorsa silinebilir.

### Bir kerelik kurulum — Git (Plesk çeker)

1. **GitHub değişkenleri** (Settings › Secrets and variables › Actions › *Variables*): `DEPLOY_ENABLED` = `true`.
   `DEPLOY_METHOD` boş bırakılabilir (varsayılan `git`). İlk yayın `yayin` dalını oluşturur (Actions › **Yayın** ›
   *Run workflow* › `deploy`).
2. **Plesk'e depo ekleyin:** alan adı › *Git* › *Depo Ekle*:
   - *Uzak Git barındırma*, URL: `git@github.com:EmrahEryilmaz/saniteks-web.git` (depo gizli olduğu için SSH adresi).
   - Plesk bir **SSH ortak anahtarı** gösterir. GitHub › depo › Settings › *Deploy keys* › *Add deploy key*: bu anahtarı
     yapıştırın, **Allow write access işaretlemeyin** (salt okunur). GitHub "Key is already in use" derse anahtar başka
     bir depoda kullanılıyordur; Plesk'te bu depo için yeni anahtar oluşturun.
   - *Şube*: `yayin`. *Dağıtım modu*: **Otomatik**. *Sunucu yolu*: `/saniteks-web/app`.
3. **Otomatik çekme:** Plesk'in depo ayarlarında gösterdiği *Webhook URL*'sini GitHub › Settings › *Webhooks* ›
   *Add webhook* ile ekleyin (Content type `application/json`, yalnızca *push* olayı). GitHub › Webhooks ›
   *Recent Deliveries* hata gösteriyorsa (güvenlik duvarı Plesk'e erişimi engelliyorsa) Plesk › *Zamanlanmış Görevler*
   › *Görev Ekle* › *URL getir* ile aynı adresi 5–10 dakikada bir çağırın. Her iki yol da olmazsa Plesk › Git ›
   **Şimdi çek** düğmesi yeterlidir.
4. **Geçiş:** Plesk › alan adı › *Node.js*: *Uygulama Kökü* `/saniteks-web/app`, *Belge kökü*
   `/saniteks-web/app/public`, başlangıç dosyası `server.js`; *Uygulamayı yeniden başlat*. Ardından aşağıdaki kontrol
   listesini uygulayın. Bundan sonraki yayınlarda uygulama kendiliğinden yeni sürüme geçer: başlangıç dosyası `server.js`,
   `REVISION` dosyasının değiştiğini 5 sn içinde fark edip süreci kapatır, Passenger yeni sürümü bir sonraki istekte
   başlatır (bu sunucuda `tmp/restart.txt` tek başına yetmiyor).

### Bir kerelik kurulum — FTP (barındırma izin verirse)

1. **Klasör:** Plesk › alan adı › *Dosyalar*: en üst düzeyde (`saniteks.com.tr` klasörünün yanında) `saniteks-web`
   klasörünü oluşturun.
2. **FTP hesabı:** Plesk › alan adı › *FTP* › *FTP Hesabı Ekle*: ad ör. `saniteks_deploy`, **ana dizin
   `/saniteks-web`**, güçlü bir parola (*Üret*). Sistem kullanıcısının (`sanifoam`) parolasını değiştirmeyin; o
   abonelikteki tüm alan adlarını etkiler.
3. **GitHub › depo › Settings › Secrets and variables › Actions:**

   | Tür | Ad | Değer |
   |---|---|---|
   | Secret | `PLESK_FTP_HOST` | Sunucu adresi (ör. `saniteks.com.tr` veya IP) |
   | Secret | `PLESK_FTP_USER` | 2. adımdaki FTP kullanıcı adı (Plesk bazen başına/sonuna alan adı ekler; FTP listesindeki tam adı yazın) |
   | Secret | `PLESK_FTP_PASSWORD` | 2. adımdaki parola |
   | Secret | `PLESK_FTP_PORT` | İsteğe bağlı; boşsa 21 |
   | Variable | `PLESK_APP_DIR` | `app` |
   | Variable | `PLESK_FTP_TLS` | Boş bırakın (şifreli bağlantı + sertifika denetimi). İlk yayın sertifika hatası verirse `noverify` (bağlantı yine şifreli, sertifika denetlenmez). `off` şifresiz FTP'dir, kullanmayın |
   | Variable | `SITE_URL` | İsteğe bağlı; yayın sonrası kontrol edilen adres (ör. `https://www.saniteks.com.tr`) |
   | Variable | `DEPLOY_ENABLED` | `true` olunca otomatik yayın başlar; o zamana kadar yalnızca paket hazırlanır |

4. **İlk yayın:** GitHub › Actions › **Yayın** › *Run workflow* › `deploy`. Paket `/saniteks-web/app` klasörüne gelir;
   site henüz eski klasörden çalışmaya devam eder.
5. **Geçiş:** Plesk › alan adı › *Node.js*: *Uygulama Kökü* `/saniteks-web/app`, *Belge kökü*
   `/saniteks-web/app/public` (burada değişmiyorsa *Barındırma ve DNS › Barındırma*), başlangıç dosyası `server.js`;
   *Uygulamayı yeniden başlat*. Ardından aşağıdaki kontrol listesini uygulayın. Bundan sonraki yayınlar bu klasörü
   kendiliğinden günceller.

### Bir kerelik kurulum — SSH (barındırma izin verirse)

1. **Plesk'te SSH erişimi:** *Barındırma ve DNS › Barındırma* › *SSH erişimi*: `/bin/bash` (chroot'lu kabuk da olur;
   `tar` ve `bash` yeterlidir). Seçenek "Yasak" diye düz metin görünüyorsa barındırma firmasının açması gerekir.
2. **SSH anahtarı:** yalnızca bu iş için yeni bir anahtar çifti oluşturun. Bilgisayar gerekmez: Plesk'in tarayıcıdaki
   *SSH Terminal*'inde `ssh-keygen -t ed25519 -N "" -f ~/.ssh/github_deploy` çalıştırıp
   `cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys` ile yetkilendirin; `cat ~/.ssh/github_deploy` çıktısını
   `PLESK_SSH_KEY` olarak GitHub'a girip sunucudaki gizli anahtar dosyasını silin. `PLESK_SSH_KNOWN_HOSTS` için aynı
   terminalde `ssh-keyscan localhost` çıktısındaki `localhost` yerine `PLESK_SSH_HOST` değerini yazın.
3. **GitHub:** `DEPLOY_METHOD` = `ssh` ve aşağıdaki secret'lar. SSH'te `PLESK_APP_DIR`, sistem kullanıcısının ev
   klasörüne göre göreli yazılır (FTP kurulumundan geçiliyorsa `saniteks-web/app`).

   | Tür | Ad | Değer |
   |---|---|---|
   | Secret | `PLESK_SSH_HOST` | Sunucu adresi |
   | Secret | `PLESK_SSH_USER` | Sistem kullanıcısı (Plesk › *Barındırma* › *Sistem kullanıcı bilgileri*) |
   | Secret | `PLESK_SSH_KEY` | Gizli anahtarın tamamı (`-----BEGIN OPENSSH PRIVATE KEY-----` dahil) |
   | Secret | `PLESK_SSH_PORT` | İsteğe bağlı; boşsa 22 |
   | Secret | `PLESK_SSH_KNOWN_HOSTS` | Önerilir: sunucunun `ssh-keyscan` satırları. Boşsa ilk bağlantıdaki anahtar kabul edilir ve parmak izi günlüğe yazılır |

### Önerilen GitHub ayarları

- **Onay adımı:** Settings › *Environments* › `production` › *Required reviewers*: kendinizi ekleyin. Her yayın, Actions
  sayfasında *Approve* deyene kadar bekler. Aynı yerde *Deployment branches* ile yalnızca `main`'e izin verin.
- **`main` dalını koruyun:** Settings › *Branches* › kural ekleyin: pull request zorunlu ve **Kontrol** işinin geçmesi
  zorunlu.

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
