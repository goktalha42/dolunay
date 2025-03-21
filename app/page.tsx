import Image from "next/image";
import Link from "next/link";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaBluetooth, FaCheckCircle, FaHeadphones, FaCog } from "react-icons/fa";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-700 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] bg-center"></div>
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Yeniden <span className="text-yellow-300">Duymanın</span> Mutluluğunu Yaşayın
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Dolunay İşitme Merkezi ile ses dolu bir dünyaya adım atın. Vista işitme cihazları ile yaşam kalitenizi artırın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="#iletisim" 
                  className="px-8 py-3 bg-yellow-500 text-blue-900 font-semibold rounded-full hover:bg-yellow-400 transition-colors text-center"
                >
                  Ücretsiz İşitme Testi
                </Link>
                <Link 
                  href="/hakkimizda" 
                  className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors text-center"
                >
                  Daha Fazla Bilgi
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-80 h-80 relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-pulse"></div>
                <div className="absolute inset-8 bg-blue-400 rounded-full opacity-30 animate-pulse animation-delay-700"></div>
                <div className="absolute inset-16 bg-blue-300 rounded-full opacity-40 animate-pulse animation-delay-1000"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <FaHeadphones className="text-white text-9xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Özellikler Bölümü */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">En İyi İşitme Deneyimi</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Modern teknoloji ile güçlendirilmiş işitme cihazları ile hayatın her anını doyasıya yaşayın.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-50 rounded-xl p-8 shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FaBluetooth className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">Bluetooth Bağlantı</h3>
              <p className="text-gray-600 text-center">Akıllı cihazlarınızla kesintisiz bağlantı kurarak telefon görüşmesi yapın, müzik dinleyin.</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-8 shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FaCog className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-4">Uzun Ömürlü</h3>
              <p className="text-gray-600 text-center">Uzun pil ömrü ve dayanıklı tasarım ile uzun yıllar boyunca sorunsuz kullanabilirsiniz.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Vista Cihazları */}
      <section className="py-20 bg-gradient-to-b from-indigo-50 to-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-6">Vista İşitme Cihazları</h2>
              <p className="text-gray-600 mb-6">Vista işitme cihazları, modern teknoloji ve kullanıcı dostu tasarımıyla hayatınızı kolaylaştırır. Bluetooth entegrasyonu sayesinde:</p>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Akıllı Telefon Bağlantısı</h4>
                    <p className="text-gray-600">Telefonunuzla doğrudan bağlantı kurarak aramaları doğrudan cihazınızdan duyabilirsiniz.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Müzik ve Medya Kontrolü</h4>
                    <p className="text-gray-600">Sevdiğiniz müzikleri yüksek kalitede doğrudan işitme cihazınızdan dinleyebilirsiniz.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-green-500 mt-1 mr-3" />
                  <div>
                    <h4 className="font-semibold text-gray-800">Uzaktan Ayarlama</h4>
                    <p className="text-gray-600">Mobil uygulama üzerinden cihazınızın ayarlarını kolayca değiştirebilirsiniz.</p>
                  </div>
                </li>
              </ul>
              
              <div className="mt-8">
                <Link 
                  href="#iletisim" 
                  className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Detaylı Bilgi Alın
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center px-4">
              <div className="relative">
                <div className="w-80 h-80 bg-indigo-100 rounded-2xl shadow-lg p-6 flex items-center justify-center">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute w-48 h-48 bg-indigo-200 rounded-full animate-pulse"></div>
                    <FaHeadphones className="text-8xl text-indigo-600 relative z-10" />
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-indigo-900 font-bold py-2 px-4 rounded-lg">
                  Vista Premium
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* İletişim */}
      <section id="iletisim" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Bizimle İletişime Geçin</h2>
          
          <div className="max-w-4xl mx-auto bg-gray-50 rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 bg-indigo-800 text-white">
                <h3 className="text-2xl font-semibold mb-6">İletişim Bilgilerimiz</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <FaPhone className="mt-1 mr-4 text-yellow-400" />
                    <div>
                      <h4 className="font-medium text-yellow-300">Telefon</h4>
                      <p>+90 552 794 77 48</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaEnvelope className="mt-1 mr-4 text-yellow-400" />
                    <div>
                      <h4 className="font-medium text-yellow-300">E-posta</h4>
                      <p>dolunayisitme@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="mt-1 mr-4 text-yellow-400" />
                    <div>
                      <h4 className="font-medium text-yellow-300">Adres</h4>
                      <p>Aşağı Eğlence, Beste Sk. 16/C, 06010 Keçiören/Ankara</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Mesaj Gönderin</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adınız Soyadınız</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon Numaranız</label>
                    <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mesajınız</label>
                    <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                    Gönder
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">Dolunay İşitme</h2>
              <p className="text-gray-400 mt-2">Daha iyi duymak için yanınızdayız</p>
            </div>
            
            <div className="text-center mb-6 md:mb-0">
              <p>&copy; 2024 Dolunay İşitme Cihazları Merkezi.</p>
              <p className="text-gray-400">Tüm hakları saklıdır.</p>
            </div>
            
            <div>
              <Link href="#iletisim" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                İletişime Geçin
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
