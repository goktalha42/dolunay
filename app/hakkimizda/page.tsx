import Link from 'next/link';
import { FaUserMd, FaCertificate, FaHandshake, FaClock, FaHeadphones, FaTrophy } from 'react-icons/fa';

export default function Hakkimizda() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Biz Kimiz?
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Dolunay İşitme Cihazları Merkezi olarak, Ankara Keçiören'de işitme sağlığı alanında kaliteli ve güvenilir hizmet sunuyoruz.
            </p>
          </div>
        </div>
      </section>
      
      {/* Hakkımızda İçerik */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="prose lg:prose-lg mb-12">
              <p className="text-lg text-gray-700 leading-relaxed">
                Dolunay İşitme Cihazları Merkezi olarak, işitme sorunu yaşayan bireylerin hayat kalitesini artırmak için çalışıyoruz. 
                Deneyimli ekibimiz ve modern teknolojik altyapımız sayesinde, her yaştan müşterimize en uygun işitme çözümlerini sunuyoruz.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Vista işitme cihazlarının yetkili satıcısı olarak, en son teknolojiye sahip ürünleri müşterilerimizle buluşturuyoruz. 
                İşitme cihazı seçiminde kişiye özel değerlendirme yaparak, her bireyin ihtiyacına en uygun cihazı öneriyor ve profesyonel bakım hizmetleri sunuyoruz.
              </p>
            </div>
          </div>
          
          {/* İstatistikler */}
          <div className="bg-indigo-50 p-8 rounded-2xl shadow-sm mb-16">
            <h2 className="text-3xl font-bold text-center text-indigo-900 mb-10">Dolunay İşitme Merkezi</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
                  <FaClock className="text-indigo-600 text-2xl" />
                </div>
                <h3 className="text-4xl font-bold text-indigo-900 mb-2">5+</h3>
                <p className="text-gray-700">Yıllık Deneyim</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
                  <FaUserMd className="text-indigo-600 text-2xl" />
                </div>
                <h3 className="text-4xl font-bold text-indigo-900 mb-2">500+</h3>
                <p className="text-gray-700">Mutlu Müşteri</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
                  <FaHeadphones className="text-indigo-600 text-2xl" />
                </div>
                <h3 className="text-4xl font-bold text-indigo-900 mb-2">10+</h3>
                <p className="text-gray-700">Farklı Cihaz Modeli</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 mb-4">
                  <FaTrophy className="text-indigo-600 text-2xl" />
                </div>
                <h3 className="text-4xl font-bold text-indigo-900 mb-2">%98</h3>
                <p className="text-gray-700">Müşteri Memnuniyeti</p>
              </div>
            </div>
          </div>
          
          {/* Değerlerimiz */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">Değerlerimiz</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 mb-6">
                  <FaUserMd className="text-yellow-600 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Uzman Kadro</h3>
                <p className="text-gray-600">İşinde uzman, deneyimli ekibimizle her zaman yanınızdayız.</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 mb-6">
                  <FaCertificate className="text-indigo-600 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Kaliteli Ürünler</h3>
                <p className="text-gray-600">Yalnızca en kaliteli ve güvenilir işitme cihazlarını sunuyoruz.</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
                  <FaHandshake className="text-green-600 text-3xl" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Güven & Samimiyet</h3>
                <p className="text-gray-600">Müşterilerimizle güvene dayalı, samimi bir ilişki kuruyoruz.</p>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-10 text-white text-center">
            <h2 className="text-3xl font-bold mb-6">Hemen Bizimle İletişime Geçin</h2>
            <p className="text-xl mb-8 max-w-xl mx-auto">
              Ücretsiz işitme testi için randevu alın ve Vista işitme cihazları hakkında bilgi edinin.
            </p>
            <Link 
              href="/#iletisim"
              className="inline-block px-8 py-4 bg-yellow-500 text-indigo-900 font-bold rounded-full hover:bg-yellow-400 transition-colors"
            >
              Randevu Alın
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 