import Link from 'next/link';
import Image from 'next/image';
import { FaUserMd, FaCertificate, FaHandshake, FaClock, FaHeadphones, FaTrophy, FaCog } from 'react-icons/fa';

export default function Hakkimizda() {
  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-24 md:py-32">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Ekran görüntüsü 2025-01-15 090157.jpg"
            alt="Mutlu Müşterilerimiz"
            fill
            style={{ objectFit: 'cover', opacity: 0.2 }}
            priority
          />
        </div>
        <div className="absolute inset-0 z-0 bg-black/50"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">Hakkımızda</h1>
            <p className="text-xl text-white drop-shadow-lg">
              Dolunay İşitme Cihazları Merkezi olarak, Ankara'nın Keçiören ilçesinde 10 yılı aşkın süredir
              işitme kaybı yaşayan bireylere kaliteli hizmet sunuyoruz.
            </p>
          </div>
        </div>
      </section>
      
      {/* Hakkımızda İçerik */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-800">Biz Kimiz?</h2>
              <div className="prose lg:prose-lg">
                <p className="text-gray-600">
                  Dolunay İşitme Cihazları Merkezi olarak, işitme sorunu yaşayan bireylerin hayat kalitesini artırmak için çalışıyoruz. Deneyimli ekibimiz ve modern teknolojik altyapımız sayesinde, her yaştan müşterimize en uygun işitme çözümlerini sunuyoruz.
                </p>
                <p className="text-gray-600">
                  Vista işitme cihazlarının yetkili satıcısı olarak, en son teknolojiye sahip ürünleri müşterilerimizle buluşturuyoruz. İşitme cihazı seçiminde kişiye özel değerlendirme yaparak, her bireyin ihtiyacına en uygun cihazı öneriyor ve profesyonel bakım hizmetleri sunuyoruz.
                </p>
              </div>
            </div>
            <div className="relative h-96 w-full rounded-xl overflow-hidden shadow-lg">
              <Image 
                src="/images/Resim6.jpg" 
                alt="İşitme Testi"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </div>
          
          {/* Hizmetlerimiz */}
          <div className="my-16">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Hizmetlerimiz</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-8 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaUserMd className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">İşitme Testleri</h3>
                <p className="text-gray-600">
                  Uzman odyometristlerimiz tarafından gerçekleştirilen kapsamlı işitme testleri ile işitme kaybınızın derecesini ve tipini belirliyor, size en uygun çözümü sunuyoruz.
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="relative w-8 h-8">
                    <Image
                      src="/images/UN_Packshot_B-312_Right_Right_Receiver_P7_Pewter_Actual_Size_RGB_050-6401-P744_01.png"
                      alt="İşitme Cihazları"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">İşitme Cihazları</h3>
                <p className="text-gray-600">
                  Vista işitme cihazlarının geniş ürün yelpazesi ile her bütçeye ve ihtiyaca uygun, modern ve estetik cihazlar sunuyoruz.
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl shadow-lg text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCog className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Bakım ve Servis</h3>
                <p className="text-gray-600">
                  İşitme cihazınızın uzun ömürlü olması ve en iyi performansı göstermesi için düzenli bakım ve ayarlama hizmetleri sunuyoruz.
                </p>
              </div>
            </div>
          </div>
          
          {/* Vizyon ve Misyon */}
          <div className="my-16">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Vizyonumuz ve Misyonumuz</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Vizyonumuz</h3>
                <p className="text-gray-600 mb-4">
                  İşitme sağlığı alanında en güvenilir ve tercih edilen merkez olmak, modern teknolojileri kullanarak müşterilerimizin yaşam kalitesini artırmak.
                </p>
                <div className="relative h-48 w-full rounded-lg overflow-hidden">
                  <Image 
                    src="/images/Ekran görüntüsü 2025-01-16 083611.jpg"
                    alt="Vista İşitme Cihazları"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Misyonumuz</h3>
                <p className="text-gray-600 mb-4">
                  Her müşterimize kişiselleştirilmiş, kaliteli ve uygun fiyatlı işitme çözümleri sunarak, işitme sorunu yaşayan bireylerin sosyal hayata tam katılımını sağlamak.
                </p>
                <div className="relative h-48 w-full rounded-lg overflow-hidden">
                  <Image 
                    src="/images/Resim1.jpg"
                    alt="Vista İşitme Cihazları"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="my-16 bg-gray-100 p-12 rounded-xl text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Ücretsiz İşitme Testi İçin Bize Ulaşın</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              İşitme sağlığınızı önemsiyoruz. Ücretsiz işitme testi ile işitme durumunuzu değerlendirelim ve ihtiyacınıza en uygun çözümü birlikte belirleyelim.
            </p>
            <Link 
              href="/iletisim" 
              className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Hemen İletişime Geçin
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 