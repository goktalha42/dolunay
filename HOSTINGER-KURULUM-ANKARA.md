# Dolunay İşitme Cihazları Merkezi Web Sitesi - Hostinger Kurulumu

Bu doküman, Dolunay İşitme Cihazları Merkezi web sitesinin Hostinger üzerinde nasıl yayınlanacağını adım adım açıklar.

## Domain Bilgisi

- Domain adı: `ankara.dolunayisitmecihazlari.com`
- Tüm SEO ayarları ve sitemap.xml bu domain için güncellenmiştir.

## Ön Koşullar

- Hostinger hosting hesabı
- Domain adı: ankara.dolunayisitmecihazlari.com
- FTP erişimi veya Hostinger File Manager erişimi

## Adım 1: Web Sitesini Oluşturma ve Yüklemeye Hazırlama

Web sitesini yerel bilgisayarınızda build etmek için şu adımları izleyin:

```bash
# Windows bilgisayarınızda yönetici olarak PowerShell açın
# Proje klasörüne gidin:
cd C:\Users\TalhaGOK\Desktop\dolunay

# Node modüllerinin güncel olduğundan emin olun
npm install next react react-dom react-icons --save

# Next.js projesini build edin
npm run build

# Statik dosyaları kullanmak için projeyi manuel olarak kopyalayın:
# 1. .next/static klasörünü _next/static olarak kopyalayın
# 2. public klasörünü de olduğu gibi kopyalayın
# 3. Oluşturulan HTML sayfalarını da root klasöre kopyalayın
```

## Adım 2: Hostinger'a Dosyaları Yükleme

### Hostinger File Manager İle Yükleme

1. Hostinger kontrol paneline giriş yapın.
2. File Manager'ı açın.
3. `public_html` klasörüne gidin.
4. Tüm build dosyalarını içeren zip dosyasını yükleyin.
5. Zip dosyasını açın ve içeriğini `public_html` klasörüne çıkartın.

### FTP İle Yükleme

1. FileZilla gibi bir FTP programı kullanarak Hostinger hesabınıza bağlanın.
2. Hostinger kontrol panelinden FTP bilgilerinizi alın.
3. Tüm build dosyalarını Hostinger'daki `public_html` klasörüne yükleyin.

## Adım 3: Hostinger'da Alan Adı Yapılandırması

1. Hostinger kontrol panelinden "Domains" bölümüne gidin.
2. "ankara.dolunayisitmecihazlari.com" alt alan adı yapılandırmasını kontrol edin.
3. DNS ayarlarını kontrol edin ve alan adınızın Hostinger hosting hesabınıza yönlendirildiğinden emin olun.

## Adım 4: SSL Sertifikası Kurulumu

1. Hostinger kontrol panelinden "SSL" bölümüne gidin.
2. Alan adınız için ücretsiz Let's Encrypt SSL sertifikası kurun.
3. SSL kurulumunu tamamlayın ve "Force HTTPS" seçeneğini etkinleştirin.

## Sorun Giderme

### Resimler Görünmüyorsa

Eğer resimler doğru görüntülenmiyorsa, dosya yollarını kontrol edin. Tüm resim dosyalarının `/images/` klasöründe olduğundan emin olun.

### 404 Hataları

Hostinger'ın 404 hata sayfasını görmek yerine, kendi özel 404 sayfanızın görüntülenmesi için `.htaccess` dosyasını düzenleyin:

```apache
ErrorDocument 404 /404.html
```

### URL Yönlendirmeleri

Next.js router'ının düzgün çalışması için `.htaccess` dosyasını şu şekilde düzenleyin:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

## Güncelleme Prosedürü

Siteyi güncellemek için aynı adımları tekrarlayın:

1. Yerel ortamda değişiklikleri yapın
2. Projeyi yeniden build edin
3. Oluşturulan dosyaları Hostinger'a yükleyin 

npx next build && npx next export 