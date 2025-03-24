# Dolunay İşitme Cihazları Merkezi - Hosting Yükleme Rehberi

Bu klasör, Dolunay İşitme Cihazları Merkezi web sitesinin Hostinger'a yüklenmesi için hazırlanmış dosyaları içermektedir.

## Dosya İçeriği

Bu klasörde aşağıdaki dosyalar bulunmaktadır:

- `out` klasörü - Build edilmiş statik HTML, CSS, JS ve görsel dosyaları
  - `index.html` - Ana sayfa
  - `hakkimizda/index.html` - Hakkımızda sayfası
  - `urunlerimiz/index.html` - Ürünlerimiz sayfası
  - `iletisim/index.html` - İletişim sayfası
  - `_next/` - Stil ve JavaScript dosyaları
  - `images/` - Görsel dosyaları
  - `.htaccess` - Sunucu yapılandırma dosyası

## Hosting Yükleme Adımları

1. Hostinger kontrol panelinize giriş yapın
2. "Dosya Yöneticisi" aracını açın
3. `public_html` dizinine gidin
4. Eğer sunucuda başka dosyalar varsa, bunları yedekleyin ve temizleyin
5. Bu klasördeki tüm dosyaları ve klasörleri (`out` klasörünün içeriğini) `public_html` dizinine yükleyin
   - **Önemli**: `out` klasörü içindeki dosyaları yükleyin, `out` klasörünün kendisini değil!
6. `.htaccess` dosyasının doğru konumda olduğunu kontrol edin (root dizinde)

## Dikkat Edilmesi Gerekenler

- Tüm dosyalar ve klasörler aynı dizin yapısını korumalıdır
- `_next` ve `images` klasörlerinin tam olarak yüklenmesi önemlidir
- `.htaccess` dosyası ana dizinde olmalıdır
- Tüm sayfaların çalışıp çalışmadığını kontrol edin
- İlk yüklemeden sonra sayfa gösteriminde sorun olursa, tarayıcı önbelleğini temizleyin

## SSL ve Domain Ayarları

1. Hostinger kontrol panelinden SSL sertifikasının kurulu olduğundan emin olun
2. Domain ayarlarını kontrol edin (ankara.dolunayisitmecihazlari.com)
3. DNS ayarlarının tamamen yayılması 24-48 saat sürebilir

## Sorun Giderme

Yükleme sonrası herhangi bir sorunla karşılaşırsanız:

1. `.htaccess` dosyasının doğru yüklendiğinden emin olun
2. Tüm dosya ve klasörlerin tam olarak upload edildiğini kontrol edin
3. Görsel dosyalarının doğru dizinde olduğunu kontrol edin (`/images/` klasöründe)
4. Tarayıcı önbelleğini temizleyin ve sayfayı yeniden yükleyin

## İletişim ve Destek

Teknik destek için: teknik@dolunayisitmecihazlari.com
Telefon: 0555 123 45 67 