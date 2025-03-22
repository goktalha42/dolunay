# Dolunay İşitme Cihazları Merkezi Web Sitesi - Hostinger Kurulumu

Bu doküman, Dolunay İşitme Cihazları Merkezi web sitesinin Hostinger üzerinde nasıl yayınlanacağını adım adım açıklar.

## Ön Koşullar

- Hostinger hosting hesabı
- Domain adınız (kendi domain adınızı kullanabilirsiniz)
- FTP erişimi veya Hostinger File Manager erişimi

## Adım 1: Domain Ayarı

1. Öncelikle projenizdeki domain adı referanslarını kendi domain adınızla değiştirin:
   - `app/layout.tsx` içindeki `DOMAIN` değişkenini kendi domain adınızla güncelleyin
   - Eğer domain adınızı diğer dosyalarda doğrudan kullanıyorsanız onları da güncelleyin

## Adım 2: Web Sitesini Oluşturma

Web sitesini yerel bilgisayarınızda build etmek için şu adımları izleyin:

```bash
# Önce paketleri yükleyin
npm install

# Statik HTML dosyalarını oluşturun
npm run export
```

Bu işlemden sonra 'out' klasöründe statik HTML dosyalarınız oluşturulacaktır.

## Adım 3: Hostinger'a Dosyaları Yükleme

### FTP İle Yükleme

1. FileZilla gibi bir FTP programı kullanarak Hostinger hesabınıza bağlanın.
2. Hostinger kontrol panelinden FTP bilgilerinizi alın.
3. `out` klasöründeki tüm dosyaları, Hostinger'daki `public_html` klasörüne yükleyin.

### Hostinger File Manager İle Yükleme

1. Hostinger kontrol paneline giriş yapın.
2. File Manager'ı açın.
3. `public_html` klasörüne gidin.
4. `out` klasöründeki tüm dosyaları zip olarak sıkıştırın.
5. Zip dosyasını File Manager üzerinden yükleyin.
6. Zip dosyasını açın ve içeriğini `public_html` klasörüne çıkartın.

## Adım 4: Hostinger'da Alan Adı Yapılandırması

1. Hostinger kontrol panelinden "Domains" bölümüne gidin.
2. Alan adınızı (domain) seçin.
3. DNS ayarlarını kontrol edin ve alan adınızın Hostinger hosting hesabınıza yönlendirildiğinden emin olun.

## Adım 5: SSL Sertifikası Kurulumu

1. Hostinger kontrol panelinden "SSL" bölümüne gidin.
2. Alan adınız için ücretsiz Let's Encrypt SSL sertifikası kurun.
3. SSL kurulumunu tamamlayın ve "Force HTTPS" seçeneğini etkinleştirin.

## Sorun Giderme

### Resimler Görünmüyorsa

Eğer resimler doğru görüntülenmiyorsa, dosya yollarını kontrol edin. Next.js export modunda `unoptimized: true` ayarının kullanıldığından emin olun.

### 404 Hataları

Hostinger'ın 404 hata sayfasını görmek yerine, kendi özel 404 sayfanızın görüntülenmesi için `.htaccess` dosyasını düzenleyin:

```apache
ErrorDocument 404 /404.html
```

### Diğer Sorunlar

Herhangi bir sorunla karşılaşırsanız, Hostinger'ın 24/7 canlı desteğine başvurun veya iletişim bilgileriniz üzerinden yardım isteyin.

## Güncelleme Prosedürü

Siteyi güncellemek için aynı adımları tekrarlayın:

1. Yerel ortamda değişiklikleri yapın
2. Domain adı ayarlarını güncelleyin
3. `npm run export` komutunu çalıştırın
4. Oluşturulan 'out' klasöründeki dosyaları Hostinger'a yükleyin 