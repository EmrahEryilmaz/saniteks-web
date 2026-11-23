# Saniteks web sitesi

Saniteks'in kurumsal ve ürün sitesi (temizlik süngerleri, temizlik bezleri, ovucu materyaller, özel formlu süngerler ve
hammadde). Site, yayındaki https://www.saniteks.com.tr tasarımı birebir korunarak Next.js ile yeniden oluşturulmuştur.
İçerik yalnızca Türkçedir.

- **Teknoloji:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Swiper (ana sayfa slaytı), nodemailer
  (iletişim ve iş başvuru formları).
- **Tasarım değişkenleri** `src/app/globals.css` içindedir; bileşenlerde renk kodu yerine `bg-surface`, `text-link`,
  `bg-primary` gibi anlamsal sınıflar kullanılır.
- **Site geneli bilgiler** (telefon, e-posta, adres, menüler, iletişim konuları) `src/lib/site.ts` içindedir.
- **Ürün verisi** yalnızca `src/data/products.ts` içindedir; ürün sayfaları, menüler ve site haritası buradan üretilir.

## Gereksinimler

- Node.js 20 veya üzeri
- npm

## Kurulum ve çalıştırma

```bash
npm install          # bağımlılıkları kurar
npm run dev          # geliştirme sunucusu: http://localhost:3000
npm run build        # üretim derlemesi
npm run start        # derlenmiş siteyi çalıştırır (önce build)
npm run lint         # ESLint
npm run typecheck    # TypeScript denetimi
```

## İletişim formu ve ortam değişkenleri

Form `/iletisim` sayfasındadır ve `/api/contact` adresine JSON olarak gönderilir. Aynı doğrulama kuralları
(`src/lib/contact-validation.ts`) hem tarayıcıda hem sunucuda çalışır. Sunucu ayrıca 16 KB'tan büyük istekleri reddeder,
gizli "website" alanını dolduran botlara gönderim yapmadan başarılı yanıt döner ve IP başına 10 dakikada en fazla 5
gönderime izin verir.

`.env.example` dosyasını `.env.local` olarak kopyalayıp doldurun:

| Değişken       | Açıklama                                                                                          |
| -------------- | ------------------------------------------------------------------------------------------------- |
| `SMTP_HOST`    | SMTP sunucusu. Boşsa geliştirmede mesaj konsola yazılır; üretimde form 503 döner.                  |
| `SMTP_PORT`    | SMTP portu. Boşsa `SMTP_SECURE=true` için 465, aksi halde 587.                                     |
| `SMTP_SECURE`  | `true`: doğrudan TLS (465). `false`: STARTTLS zorunlu (587).                                       |
| `SMTP_USER`    | SMTP kullanıcı adı (isteğe bağlı).                                                                 |
| `SMTP_PASS`    | SMTP parolası (isteğe bağlı).                                                                      |
| `CONTACT_TO`   | Mesajların iletileceği adres. Boşsa `info@saniteks.com.tr`.                                        |
| `CONTACT_FROM` | Gönderen adresi, ör. `"Saniteks Web Sitesi <web@saniteks.com.tr>"`. Boşsa `SMTP_USER`.             |
| `HR_TO`        | İş başvurularının (CV ekiyle) iletileceği adres. Boşsa `CONTACT_TO`, o da boşsa `info@saniteks.com.tr`. |

E-posta konusu `[Saniteks iletişim] <konu> – <ad soyad>` biçimindedir; ziyaretçinin adresi "Yanıtla" (Reply-To) olarak
eklenir.

**Ön doldurma:** `/iletisim?konu=Satış&urun=Klasik%20Temizlik%20Süngeri` bağlantısı konuyu seçer ve mesaj alanına
"Klasik Temizlik Süngeri hakkında bilgi almak istiyorum." yazar. `konu` yalnızca `src/lib/site.ts` içindeki
`contactSubjects` değerlerinden biri olabilir; diğer değerler yok sayılır. Ürün sayfaları `konu=Satış`, İnsan Kaynakları
sayfası `konu=İnsan Kaynakları` ile bağlantı verir.

## İş başvuru formu

`/insan-kaynaklari` sayfasındaki başvuru formu (`#basvuru`) `/api/apply` adresine `multipart/form-data` olarak gönderilir.
Alanlar: ad soyad, e-posta, telefon, başvurulan pozisyon, ön yazı (isteğe bağlı, en fazla 3000 karakter), CV dosyası (PDF,
DOC veya DOCX; en fazla 5 MB) ve KVKK onay kutusu. Kurallar `src/lib/apply-validation.ts` içindedir ve tarayıcıda da
sunucuda da aynen çalışır. Sunucu ayrıca dosyanın ilk baytlarını uzantısıyla karşılaştırır (PDF için `%PDF`, DOC için
`D0 CF 11 E0`, DOCX için `PK`), 6 MB'tan büyük istekleri reddeder, IP başına 10 dakikada en fazla 3 başvuru kabul eder ve
gizli "website" alanını dolduran botlara gönderim yapmadan başarılı yanıt döner. CV diske yazılmaz; yalnızca e-posta eki
olarak iletilir.

- **Alıcı:** `HR_TO`; boşsa `CONTACT_TO`, o da boşsa `info@saniteks.com.tr`. SMTP ayarları ve gönderen adresi iletişim
  formuyla aynıdır; SMTP tanımlı değilse davranış da aynıdır (geliştirmede konsola yazılır, üretimde 503).
- **E-posta:** konu `[Saniteks başvuru] <pozisyon> – <ad soyad>` biçimindedir, CV ektedir ve adayın adresi "Yanıtla"
  (Reply-To) olarak eklenir. 5 MB'lık bir ek e-postada yaklaşık 7 MB yer tutar; SMTP sunucusunun ileti boyutu sınırı buna
  uygun olmalıdır.
- **Vercel:** Vercel Functions istek gövdesini 4,5 MB ile sınırlar; bu sınırı aşan başvurular sunucuya ulaşmadan reddedilir
  ve form "içerik çok büyük" mesajı gösterir. Vercel'de yayınlanacaksa `src/lib/apply-validation.ts` içindeki `CV_MAX_MB`
  değerini 4 yapın.

**Açık pozisyon ekleme:** Pozisyonlar yalnızca `src/data/careers.ts` içindeki `openPositions` dizisindedir. Dizi boşken
sayfada "Şu anda açık pozisyon bulunmuyor." metni görünür ve formda yalnızca "Genel başvuru" seçeneği vardır. Pozisyon
eklemek için diziye bir kayıt ekleyin:

```ts
{
  id: "uretim-operatoru-hendek",      // benzersiz; küçük harf, rakam ve tire ("genel" kullanılamaz)
  title: "Üretim Operatörü",
  department: "Üretim",
  location: jobLocations.hendek,      // veya jobLocations.merkez
  type: "Tam zamanlı",                // "Tam zamanlı" | "Yarı zamanlı" | "Sözleşmeli" | "Geçici" | "Staj"
  summary: "Pozisyonu bir iki cümleyle anlatan metin.",
  requirements: ["İsteğe bağlı nitelik listesi."],
  published: "2026-11-06",            // yayın tarihi, YYYY-AA-GG
},
```

Kayıt eklendiğinde pozisyon kartı, formdaki seçenek, "Başvur" bağlantısı (`/insan-kaynaklari?pozisyon=<id>#basvuru`,
pozisyonu formda seçili getirir) ve sayfadaki JobPosting yapılandırılmış verisi kendiliğinden oluşur. Pozisyon kapandığında
kaydı silin; eski `?pozisyon=` bağlantıları "Genel başvuru" seçili olarak açılır.

## Ürün veya SKU ekleme / düzenleme

Tüm ürün bilgisi `src/data/products.ts` dosyasındadır. Yapı: **Kategori → Ürün tipi (sayfa) → SKU (paket çeşidi)**.

- Bir **SKU** eklemek için ilgili ürün tipinin `skus` dizisine yeni bir kayıt ekleyin:

  ```ts
  {
    slug: "101-0-350-40",                 // URL'de ve fotoğraf dosya adında kullanılır
    code: "101.0.350-40",                 // katalog ürün kodu (yoksa yazmayın)
    name: "Standart Yeşil 3'lü Paket",
    nameEn: "Standard Green, 3 pcs/pack",
    line: "Standart",
    productSize: "11 × 7 × 2,5 cm",       // ondalıklarda virgül kullanın
    packsPerCase: "40",
    caseSize: "34 × 40 × 25 cm",
    packaging: "koli",                    // "koli" | "naylon-torba" | "cuval"
    image: img("101-0-350-40"),           // → /images/catalog/101-0-350-40.webp
    imageAlt: "Standart yeşil 3'lü düz sünger paketi",
  },
  ```

- Her **ürünün (SKU)** kendi sayfası vardır: `/urunler/<kategori>/<sku-slug>`; site haritası kaydı otomatik oluşur.
  Kategori sayfası (`/urunler/<kategori>`) açıklamanın altında kategorideki tüm ürünleri mağaza düzeninde listeler.
- Bir **ürün tipi** (`ProductType`) yalnızca kategori sayfasındaki süzgeç düğmesidir; kendi sayfası yoktur, eski adresi
  kategoriye yönlendirilir (`next.config.ts`, `productTypePaths`). SKU `slug` değerleri kategori içinde benzersiz olmalı
  ve hiçbir ürün tipi `slug` değeriyle aynı olmamalıdır; `products.ts` derlemede bunu denetler.
- Ürün verisini başka bir dosyaya kopyalamayın; sayfalar her zaman bu dosyadan okur.

**Ürün fotoğrafları:** SKU paket fotoğrafları `public/images/catalog/<sku-slug>.webp` yoluna konur (dosya adı SKU'nun
`slug` değeriyle aynı olmalıdır). Mevcut fotoğraflar düşük çözünürlüklü olduğundan beyaz zemin üzerinde
`object-contain` ile ve en fazla 480 px genişlikte gösterilir.

## Yayına alma

- **Plesk (asıl sunucu) ve GitHub otomasyonu:** her pull request'te GitHub Actions `typecheck`, `lint` ve `build`
  çalıştırır (`.github/workflows/ci.yml`). `main` dalına gelen her değişiklik Plesk'e hazır paketi üretir ve
  etkinleştirildiyse yayın dalı üzerinden (Plesk Git çeker) ya da FTP/SSH ile sunucuya yayınlar (`.github/workflows/deploy.yml`). Kurulum: `DEPLOY.md` › Yöntem C.
- **Vercel:** Depoyu bağlayın, ortam değişkenlerini proje ayarlarına girin; ek yapılandırma gerekmez.
- **Herhangi bir Node.js sunucusu:** `npm ci && npm run build && npm run start` (varsayılan port 3000, `PORT` ile
  değiştirilebilir). Önüne bir ters vekil sunucu (nginx vb.) koyuyorsanız istemci IP'sini `X-Forwarded-For` veya
  `X-Real-IP` başlığıyla iletin; hız sınırı bu başlıkları kullanır.
- Gönderim hız sınırı **bellekte** tutulur: her sunucu örneği (instance) kendi sayacını tutar ve yeniden başlatmada
  sıfırlanır. Birden fazla örnek veya sunucusuz (serverless) ortamda sınır örnek başına uygulanır; daha sıkı bir sınır
  gerekiyorsa paylaşılan bir depo (ör. Redis) kullanılmalıdır.
- `public/images` ve `public/documents` altındaki dosyalar 30 gün önbelleğe alınır (`next.config.ts`). Bir dosyayı
  değiştirirken adını da değiştirmeniz, ziyaretçilerin eski sürümü görmesini önler.
- KVKK Aydınlatma Metni şu an **taslaktır**: sayfada taslak uyarısı vardır, arama motorlarına kapalıdır (`noindex`) ve site
  haritasında yer almaz. Hukuk onayından sonra `src/components/legal/kvkk.ts` içindeki `draft` değerini `false` yapıp
  sürüm ve tarih bilgisini güncelleyin.

## Bilinen eksikler

- Katalogdan alınan ürün fotoğrafları (`public/images/catalog/*.webp`) düşük çözünürlüklüdür; yeni ürün çekimleriyle
  değiştirilmelidir.
- İngilizce ürün kataloğunda (`public/documents/catalogs/sanifoam-sanitex-product-catalog-en.pdf`) bilinen veri hataları
  vardır: sihirli süngerin (magic sponge) kodu 104.0.102-80T olarak, standart temizlik bezinin ölçüsü 9x6x3 cm olarak
  gösterilmektedir. PDF'in düzeltilmiş sürümüyle değiştirilmesi gerekir.
- KVKK Aydınlatma Metni canlı sitedeki gibi taslak olarak işaretlidir (`noindex`, site haritasında yok). Hukuki onay
  sonrası `src/components/legal/kvkk.ts` içindeki `draft` bayrağı `false` yapılmalıdır.
- KVKK Aydınlatma Metni şu an yalnızca iletişim formunu anlatır; iş başvuru formuyla işlenen aday verileri (CV ve içeriği,
  saklama süresi, alıcılar) için hukuk onaylı bir bölüm eklenmelidir. Başvuru formundaki onay kutusu bu metne bağlanır.
- Uygulama ikonları (`public/images/icons/`, sekme simgesi `src/app/favicon.ico`) logodaki küp işaretinden üretilmiştir;
  kurumsal kimlikten kare bir ikon gelirse değiştirilebilir. İkonları `/icons/` altına koymayın: Plesk/Apache sunucusunda
  `/icons/` adresi Apache'nin kendi simge klasörüne ayrılmıştır ve uygulamaya hiç ulaşmaz.
