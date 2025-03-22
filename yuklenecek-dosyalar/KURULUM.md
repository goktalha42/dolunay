# Dolunay İşitme Cihazları Web Sitesi Kurulum Talimatları

## Hostinger'a Nasıl Yüklenir?

### Adım 1: FTP ile Dosyaları Yükleme

1. **FTP Programını Açın**: FileZilla gibi bir FTP istemcisi kullanabilirsiniz.
2. **Bağlantı Bilgilerini Girin**: 
   - Sunucu: ftp.dolunayisitmecihazlari.com (Hostinger'dan alınan bilgilere göre değişebilir)
   - Kullanıcı Adı: Hostinger kontrol panelinden FTP kullanıcısı
   - Şifre: FTP şifreniz
   - Port: 21

3. **Dosyaları Yükleme**:
   - Sol tarafta yerel bilgisayarınızdaki `yuklenecek-dosyalar` klasörünün içindeki tüm dosyaları seçin
   - Sağ tarafta `public_html` klasörüne (veya Hostinger'ın belirttiği ana dizine) sürükleyip bırakın
   - Tüm dosyaların doğru klasörlere yüklendiğinden emin olun

### Adım 2: Hostinger Dosya Yöneticisi ile Yükleme (Alternatif)

1. **Hostinger Kontrol Paneline Giriş Yapın**
2. **Dosya Yöneticisini Açın**
3. **public_html** klasörüne gidin
4. **Yükle** düğmesine tıklayın ve bu klasördeki tüm dosyaları yükleyin
   - Ya da tüm dosyaları bir ZIP olarak sıkıştırıp, ZIP'i yükleyebilir ve sonra çıkartabilirsiniz

### Adım 3: Alan Adı ve SSL Ayarları

1. **Alan Adı Ayarları**:
   - Hostinger kontrol panelinde alan adı ayarlarınızı kontrol edin
   - `ankara.dolunayisitmecihazlari.com` alt alan adının doğru yapılandırıldığından emin olun

2. **SSL Sertifikası**:
   - Hostinger kontrol panelinden SSL sertifikası yükleyin
   - "SSL'i Etkinleştir" seçeneğini kullanın

### Adım 4: Son Kontroller

1. **Sitenizi Tarayıcıda Açın**: `https://ankara.dolunayisitmecihazlari.com` adresine giderek sitenizin çalışıp çalışmadığını kontrol edin.

2. **Tüm Sayfaları Kontrol Edin**: Tüm sayfalara erişilebildiğinden ve görüntülerin doğru şekilde yüklendiğinden emin olun.

3. **Mobil Görünümü Test Edin**: Sitenizi farklı cihazlarda test edin.

## Dosya Açıklamaları

- `index.html`: Ana sayfa
- `hakkimizda.html`: Hakkımızda sayfası
- `urunlerimiz.html`: Ürünler sayfası
- `iletisim.html`: İletişim sayfası
- `404.html`: Sayfa bulunamadı hata sayfası
- `.htaccess`: Sunucu yapılandırma dosyası (URL yönlendirmeleri ve diğer ayarlar için)
- `_next/static/css/app.css`: Ana CSS dosyası
- `_next/static/js/app.js`: JavaScript dosyası
- `images/`: Görsellerin bulunduğu klasör

## Sorun Giderme

- **Sayfalar Yüklenmiyor**: `.htaccess` dosyasının doğru yüklendiğinden emin olun
- **Görseller Görünmüyor**: Görsel dosyalarının doğru klasörde olduğunu ve HTML dosyalarındaki yolların doğru olduğunu kontrol edin
- **SSL Hatası**: SSL sertifikasının doğru yüklendiğinden emin olun

Herhangi bir sorunla karşılaşırsanız, teknik destek için iletişime geçin. 

## Dışa Aktarım İşlemi

npx next build 