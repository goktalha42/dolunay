import Image from "next/image";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function Iletisim() {
  return (
    <main className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-24 md:py-32">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/Ekran görüntüsü 2025-01-15 090115.jpg"
            alt="İletişim"
            fill
            style={{ objectFit: 'cover', opacity: 0.2 }}
            priority
          />
        </div>
        <div className="absolute inset-0 z-0 bg-black/50"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">İletişim</h1>
            <p className="text-xl text-white drop-shadow-lg">
              Dolunay İşitme Merkezi ile iletişime geçerek ücretsiz işitme testi randevusu alabilir, ürünlerimiz hakkında bilgi edinebilirsiniz.
            </p>
          </div>
        </div>
      </section>

      {/* İletişim Bilgileri ve Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-gray-50 rounded-xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 bg-gray-800 text-white">
                <h3 className="text-2xl font-semibold mb-6">İletişim Bilgilerimiz</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <FaPhone className="mt-1 mr-4 text-gray-300" />
                    <div>
                      <h4 className="font-medium text-gray-300">Telefon</h4>
                      <p>+90 552 794 77 48</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaEnvelope className="mt-1 mr-4 text-gray-300" />
                    <div>
                      <h4 className="font-medium text-gray-300">E-posta</h4>
                      <p>dolunayisitme@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="mt-1 mr-4 text-gray-300" />
                    <div>
                      <h4 className="font-medium text-gray-300">Adres</h4>
                      <p>Aşağı Eğlence, Beste Sk. 16/C, 06010 Keçiören/Ankara</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-medium text-gray-300 mb-4">Çalışma Saatlerimiz</h4>
                  <div className="flex items-start mb-2">
                    <FaClock className="mt-1 mr-4 text-gray-300" />
                    <div>
                      <p className="mb-1">Pazartesi - Cuma: 09:00 - 18:00</p>
                      <p>Cumartesi: 10:00 - 15:00</p>
                      <p>Pazar: Kapalı</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Mesaj Gönderin</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adınız Soyadınız</label>
                    <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon Numaranız</label>
                    <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mesajınız</label>
                    <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-gray-800 text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                    Gönder
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Harita */}
      <section className="pb-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Bize Ulaşın</h3>
            <div className="rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-96 w-full">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3060.440428340531!2d32.85800441530992!3d39.90520099336745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d34c4445555555%3A0x2d99b1b6c1c7d4cb!2zQcWfYcSfxLEgRcSfbGVuY2UsIEJlc3RlIFNrLiAxNkMsIDA2MDEwIEtlw6dpw7ZyZW4vQW5rYXJh!5e0!3m2!1str!2str!4v1711089674124!5m2!1str!2str" 
                  width="100%" 
                  height="450" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-gray-100 rounded-xl p-8 md:p-12 text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Ücretsiz İşitme Testi</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              İşitme sağlığınızı önemsiyoruz. Profesyonel odyometristlerimiz tarafından gerçekleştirilen ücretsiz işitme testi için hemen bizi arayın.
            </p>
            <div className="inline-flex items-center justify-center bg-gray-800 text-white px-6 py-3 rounded-lg">
              <FaPhone className="mr-2" />
              <span className="font-medium">+90 552 794 77 48</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 