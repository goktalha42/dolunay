import Image from "next/image";
import Link from "next/link";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaBluetooth, FaCheckCircle } from "react-icons/fa";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Resim2.jpg"
            alt="İşitme Cihazları Arka Plan"
            fill
            style={{ objectFit: 'cover', opacity: 0.2 }}
            priority
          />
        </div>
        <div className="absolute inset-0 z-0 bg-black/50"></div>
        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
                Daha İyi <span className="text-white">Duymanın</span> Keyfini Yaşayın
              </h1>
              <p className="text-xl mb-8 text-white drop-shadow-lg">
                Dolunay İşitme Merkezi ile işitme sorunlarınıza modern ve estetik çözümler sunuyoruz. Vista işitme cihazları ile hayatı daha iyi duyun.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/iletisim" 
                  className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-center"
                >
                  Ücretsiz İşitme Testi
                </Link>
                <Link 
                  href="/hakkimizda" 
                  className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-center"
                >
                  Daha Fazla Bilgi
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-80 h-80">
                <Image
                  src="/images/Resim1.jpg"
                  alt="İşitme Testi"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Neden Biz? */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Neden Bizi Tercih Etmelisiniz?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Dolunay İşitme Cihazları Merkezi olarak, işitme sorunlarınıza profesyonel çözümler sunuyoruz.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-50 rounded-xl p-8 shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <div className="relative w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-6 mx-auto">
                <Image
                  src="/images/UN_Packshot_B-312_Right_Right_Receiver_P7_Pewter_Actual_Size_RGB_050-6401-P744_01.png"
                  alt="Profesyonel Cihazlar"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-full"
                />
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Kaliteli Cihazlar</h3>
              <p className="text-gray-700 text-center">En son teknolojiye sahip Vista işitme cihazları ile hizmetinizdeyiz.</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8 shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <div className="relative w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-6 mx-auto overflow-hidden">
                <FaBluetooth className="text-3xl text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Bluetooth Bağlantı</h3>
              <p className="text-gray-700 text-center">İşitme cihazlarınızı telefonunuza bağlayarak daha pratik bir kullanım elde edin.</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8 shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <div className="relative w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-6 mx-auto overflow-hidden">
                <Image
                  src="/images/Ekran görüntüsü 2025-01-16 085441.jpg"
                  alt="Müşteri Memnuniyeti"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-full"
                />
              </div>
              <h3 className="text-xl font-bold text-center mb-4 text-gray-800">Müşteri Memnuniyeti</h3>
              <p className="text-gray-700 text-center">Yüzlerce mutlu müşterimizle işitme sağlığınızı önemsiyoruz.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hizmetlerimiz */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">Hizmetlerimiz</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-72 w-full">
                <Image
                  src="/images/Resim6.jpg"
                  alt="İşitme Testleri"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">İşitme Testleri</h3>
                <p className="text-gray-700 mb-4">Uzman odyometristlerimiz tarafından gerçekleştirilen kapsamlı işitme testleri ile işitme kaybınızın derecesini ve tipini belirliyor, size en uygun çözümü sunuyoruz.</p>
                <Link href="/iletisim" className="inline-block px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Randevu Alın
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-72 w-full">
                <Image
                  src="/images/Resim7.jpg"
                  alt="İşitme Cihazı Bakımı"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">İşitme Cihazı Bakımı</h3>
                <p className="text-gray-700 mb-4">İşitme cihazınızın uzun ömürlü olması ve en iyi performansı göstermesi için düzenli bakım ve ayarlama hizmetleri sunuyoruz.</p>
                <Link href="/iletisim" className="inline-block px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Detaylı Bilgi
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-700 mb-8 max-w-3xl mx-auto">Daha fazla bilgi almak ve işitme sağlığınızla ilgili profesyonel destek için bizimle iletişime geçin.</p>
            <Link href="/urunlerimiz" className="inline-block px-8 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors">
              Ürünlerimizi Keşfedin
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
