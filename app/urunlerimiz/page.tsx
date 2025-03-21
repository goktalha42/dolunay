import Image from "next/image";
import Link from "next/link";
import { FaBluetooth, FaCheckCircle, FaBatteryFull, FaWater } from "react-icons/fa";

export default function Urunlerimiz() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white py-24 md:py-32 mt-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/birinci.jpg"
            alt="İşitme Cihazları"
            fill
            style={{ objectFit: 'cover', opacity: 0.2 }}
            priority
          />
        </div>
        <div className="absolute inset-0 z-0 bg-black/50"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">Ürünlerimiz</h1>
            <p className="text-xl text-white drop-shadow-lg">
              Dolunay İşitme Merkezi olarak, Vista markasının en son teknolojiye sahip işitme cihazlarını sizlere sunuyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Ürün Kategorileri */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-800">Vista İşitme Cihazları</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="relative h-72 w-full bg-white flex items-center justify-center p-4">
                <div className="relative h-64 w-64">
                  <Image
                    src="/images/UN_Packshot_B-312_Right_Right_Receiver_P7_Pewter_Actual_Size_RGB_050-6401-P744_01.png"
                    alt="Vista Premium Serisi"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
              <div className="p-6 bg-gray-50">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">Vista Premium Serisi</h3>
                <p className="text-gray-700 mb-4 text-base">Yüksek performanslı işitme cihazları ile en net ses deneyimini yaşayın. Şarj edilebilir pil ve Bluetooth bağlantısı ile hayatınızı kolaylaştırır.</p>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-gray-800">Özellikler:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">Gürültü azaltma teknolojisi</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">Şarj edilebilir pil</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">Bluetooth bağlantısı</span>
                    </li>
                  </ul>
                </div>
                <Link href="/iletisim" className="inline-block px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Detaylı Bilgi
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
              <div className="relative h-72 w-full bg-white flex items-center justify-center p-4">
                <div className="relative h-64 w-64">
                  <Image
                    src="/images/UN_Packshot_B-312_Right_Right_Receiver_P7_Pewter_Actual_Size_RGB_050-6401-P744_01.png"
                    alt="Vista Comfort Serisi"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
              <div className="p-6 bg-gray-50">
                <h3 className="text-2xl font-bold mb-2 text-gray-800">Vista Comfort Serisi</h3>
                <p className="text-gray-700 mb-4 text-base">Ergonomik tasarımı ve uzun pil ömrü ile günlük kullanım için ideal. Farklı cilt tonlarına uyumlu renk seçenekleri mevcuttur.</p>
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-gray-800">Özellikler:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">Ergonomik tasarım</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">Uzun pil ömrü</span>
                    </li>
                    <li className="flex items-start">
                      <FaCheckCircle className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">Çoklu renk seçenekleri</span>
                    </li>
                  </ul>
                </div>
                <Link href="/iletisim" className="inline-block px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  Detaylı Bilgi
                </Link>
              </div>
            </div>
          </div>
          
          {/* Bluetooth Teknolojisi */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-16 border border-gray-200">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 md:pr-8 mb-6 md:mb-0">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">Bluetooth Teknolojisi</h3>
                <p className="text-gray-700 mb-4">Vista işitme cihazları, bluetooth teknolojisi sayesinde akıllı telefonunuzla doğrudan iletişim kurabilir. Bu özellik sayesinde:</p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Telefon görüşmelerini doğrudan işitme cihazınızdan duyabilirsiniz</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Müzik ve medya içeriklerini cihazınıza aktarabilirsiniz</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-green-600 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Mobil uygulama ile ses ayarlarınızı kolayca değiştirebilirsiniz</span>
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="rounded-full bg-blue-100 w-36 h-36 flex items-center justify-center shadow-md">
                  <FaBluetooth className="text-6xl text-blue-600" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Teknolojik Özellikler */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold mb-8 text-center text-gray-800">Vista İşitme Cihazları Teknolojik Özellikleri</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center">
                    <FaBluetooth className="text-4xl text-blue-600" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-gray-800">Bluetooth Bağlantısı</h4>
                <p className="text-gray-700">Telefonunuz ve diğer cihazlarla kablosuz bağlantı kurabilme</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
                    <FaBatteryFull className="text-4xl text-green-600" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-gray-800">Şarj Edilebilir Pil</h4>
                <p className="text-gray-700">Tek şarjla 24 saate kadar kullanım imkanı</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center">
                    <FaWater className="text-4xl text-blue-500" />
                  </div>
                </div>
                <h4 className="text-lg font-semibold mb-2 text-gray-800">Su Dayanıklılığı</h4>
                <p className="text-gray-700">IP68 sertifikası ile toz ve suya karşı dayanıklılık</p>
              </div>
            </div>
          </div>
          
          {/* CTA */}
          <div className="bg-gray-100 p-12 rounded-xl text-center border border-gray-200 shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">İhtiyacınıza Uygun İşitme Cihazını Birlikte Belirleyelim</h3>
            <p className="text-gray-700 mb-8 max-w-3xl mx-auto">Diğer Vista işitme cihazı modelleri hakkında bilgi almak için bizimle iletişime geçebilirsiniz. Kişisel ihtiyaçlarınıza en uygun cihazı bulmak için ücretsiz danışmanlık hizmeti sunuyoruz.</p>
            <Link href="/iletisim" className="inline-block px-8 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors">
              İletişime Geçin
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 