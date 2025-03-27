"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaArrowLeft, FaCheckCircle, FaInfoCircle, FaShoppingCart, FaTruck, FaPhoneAlt } from "react-icons/fa";
import Link from "next/link";

interface Product {
  id?: number;
  title: string;
  short_description?: string;
  category_id?: number;
  category_name?: string;
  segment?: string;
  main_image?: string;
  additional_images?: string[] | string;
  features?: string[] | string;
  [key: string]: any;
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Resim galerisi için
  const [currentImage, setCurrentImage] = useState<string>("");
  const [imageIndex, setImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'description' | 'features'>('description');
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`/api/admin/products/${params.id}`);
        if (!response.ok) {
          throw new Error("Ürün bilgileri alınamadı");
        }
        
        const productData = await response.json();
        setProduct(productData);
        
        // Ana resmi ayarla
        if (productData && productData.main_image) {
          setCurrentImage(productData.main_image);
        }
      } catch (error) {
        console.error("Ürün getirme hatası:", error);
        setError("Ürün bilgileri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };
    
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);
  
  // Resim değiştirme fonksiyonları
  const nextImage = () => {
    if (!product) return;
    
    const mainImage = product.main_image;
    const additionalImages = product.additional_images && Array.isArray(product.additional_images) 
      ? product.additional_images 
      : [];
      
    const totalImages = 1 + additionalImages.length; // Ana görsel + ek görseller
    
    if (totalImages <= 1) return;
    
    const newIndex = (imageIndex + 1) % totalImages;
    selectImage(newIndex);
  };
  
  const prevImage = () => {
    if (!product) return;
    
    const mainImage = product.main_image;
    const additionalImages = product.additional_images && Array.isArray(product.additional_images) 
      ? product.additional_images 
      : [];
      
    const totalImages = 1 + additionalImages.length; // Ana görsel + ek görseller
    
    if (totalImages <= 1) return;
    
    const newIndex = (imageIndex - 1 + totalImages) % totalImages;
    selectImage(newIndex);
  };
  
  const selectImage = (index: number) => {
    if (!product) return;
    
    setImageIndex(index);
    
    if (index === 0) {
      setCurrentImage(product.main_image || "/images/placeholder.jpg");
    } else {
      const additionalImages = product.additional_images && Array.isArray(product.additional_images) 
        ? product.additional_images 
        : [];
        
      if (additionalImages.length >= index) {
        setCurrentImage(additionalImages[index - 1]);
      }
    }
  };
  
  // Resim URL'sini doğru formata çevirme
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) {
      return "/images/placeholder.jpg";
    }
    
    // İzin güvenliğini sağla - Sadece string değerleri kabul et
    if (typeof imageUrl !== 'string') {
      console.error("getImageUrl: Geçersiz imageUrl türü:", typeof imageUrl);
      return "/images/placeholder.jpg";
    }
    
    // Eğer URL zaten http veya https ile başlıyorsa olduğu gibi döndür
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // Eğer URL / ile başlıyorsa, domain'in kök dizininden başlar
    if (imageUrl.startsWith('/')) {
      return imageUrl;
    }
    
    // Aksi takdirde göreceli yol olarak değerlendir ve / ekle
    return `/${imageUrl}`;
  };
  
  // Segment rengini ve metnini belirleme
  const getSegmentInfo = (segment?: string) => {
    switch(segment) {
      case 'başlangıç':
        return { color: 'bg-green-100 text-green-800', text: 'Başlangıç Seviyesi' };
      case 'orta':
        return { color: 'bg-blue-100 text-blue-800', text: 'Orta Seviye' };
      case 'üst':
        return { color: 'bg-purple-100 text-purple-800', text: 'Üst Seviye' };
      default:
        return { color: 'bg-gray-100 text-gray-800', text: 'Genel' };
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Ürün bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Ürün Bulunamadı</h1>
          <p className="text-gray-600 mb-6">{error || "Aradığınız ürün bulunamadı veya kaldırılmış olabilir."}</p>
          <Link
            href="/urunlerimiz"
            className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Tüm Ürünlere Dön
          </Link>
        </div>
      </div>
    );
  }
  
  const segmentInfo = getSegmentInfo(product.segment);
  
  return (
    <div className="bg-gray-50 py-8">
      {/* Breadcrumb ve Temel Bilgiler */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Link href="/" className="hover:text-gray-700">Anasayfa</Link>
          <span className="mx-2">/</span>
          <Link href="/urunlerimiz" className="hover:text-gray-700">Ürünlerimiz</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{product.title}</span>
        </div>
      </div>
      
      {/* Ana İçerik */}
      <div className="max-w-7xl mx-auto bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Sol Taraf - Resim Alanı */}
          <div className="p-6 lg:p-8 bg-white">
            <div className="sticky top-24">
              {/* Ana Görsel */}
              <div className="relative h-80 md:h-[500px] bg-white mb-6 flex items-center justify-center">
                <Image
                  src={getImageUrl(currentImage)}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain"
                  onError={(e) => {
                    console.error("Resim yüklenemedi:", currentImage);
                    (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                  }}
                />

                {/* Gezinme Okları - Sadece birden fazla resim varsa göster */}
                {product.additional_images && Array.isArray(product.additional_images) && product.additional_images.length > 0 && (
                  <>
                    <button 
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 p-3 rounded-full text-gray-800 hover:bg-opacity-100 shadow-md z-10"
                      aria-label="Önceki resim"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button 
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 p-3 rounded-full text-gray-800 hover:bg-opacity-100 shadow-md z-10"
                      aria-label="Sonraki resim"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Küçük Resimler (Ana görsel + ek görseller) */}
              <div className="grid grid-cols-6 gap-2">
                {/* Ana görsel küçük resmi */}
                <div 
                  className={`relative h-20 border ${imageIndex === 0 ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'} rounded-md cursor-pointer overflow-hidden`}
                  onClick={() => selectImage(0)}
                >
                  <Image
                    src={getImageUrl(product.main_image || "")}
                    alt={`${product.title} - Ana Görsel`}
                    fill
                    sizes="(max-width: 768px) 20vw, 10vw"
                    className="object-contain"
                    onError={(e) => {
                      console.error("Ana resim yüklenemedi:", product.main_image);
                      (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                    }}
                  />
                </div>

                {/* Ek görseller */}
                {product.additional_images && 
                  Array.isArray(product.additional_images) && 
                  product.additional_images.length > 0 ? 
                  product.additional_images.map((image, idx) => {
                    // Sadece geçerli string değerleri kabul et
                    if (!image || typeof image !== 'string') {
                      console.error("Geçersiz ek resim değeri:", idx, image);
                      return null;
                    }
                    
                    return (
                      <div 
                        key={idx} 
                        className={`relative h-20 border ${imageIndex === idx + 1 ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'} rounded-md cursor-pointer overflow-hidden`}
                        onClick={() => selectImage(idx + 1)}
                      >
                        <Image
                          src={getImageUrl(image)}
                          alt={`${product.title} - ${idx + 1}`}
                          fill
                          sizes="(max-width: 768px) 20vw, 10vw"
                          className="object-contain"
                          onError={(e) => {
                            console.error("Ek resim yüklenemedi:", image);
                            (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                          }}
                        />
                      </div>
                    );
                  }) : null
                }
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Ürün Bilgileri */}
          <div className="p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-gray-200">
            {/* Segment etiketi ve kategori */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${segmentInfo.color}`}>
                {segmentInfo.text}
              </span>
              <span className="text-sm text-gray-500">
                Kategori: <span className="font-medium">{product.category_name || "Genel"}</span>
              </span>
            </div>
            
            {/* Ürün Başlığı */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
            
            {/* Kısa açıklama */}
            <p className="text-gray-700 mb-8 leading-relaxed">{product.short_description}</p>
            
            {/* Özellikler ve açıklamalar arasında geçiş için sekme menüsü */}
            <div className="mb-8 border-b border-gray-200">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-4 text-sm font-medium border-b-2 ${
                    activeTab === 'description' 
                      ? 'border-blue-600 text-blue-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Ürün Detayları
                </button>
                
                {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                  <button
                    onClick={() => setActiveTab('features')}
                    className={`py-4 text-sm font-medium border-b-2 ${
                      activeTab === 'features' 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Teknik Özellikler
                  </button>
                )}
              </div>
            </div>
            
            {/* Detay içeriği */}
            <div className="mb-8">
              {activeTab === 'description' ? (
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {product.short_description || "Bu ürün için detaylı açıklama bulunmamaktadır."}
                  </p>
                  
                  <div className="mt-6 bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                      <FaInfoCircle className="mr-2" /> Ürün Hakkında
                    </h4>
                    <p className="text-blue-700 text-sm">
                      Vista işitme cihazları, gelişmiş teknolojisi ve yenilikçi özellikleriyle kullanıcılarına üstün işitme deneyimi sunar.
                      Bu ürün, {product.segment === 'başlangıç' ? 'başlangıç' : product.segment === 'orta' ? 'orta' : product.segment === 'üst' ? 'üst' : 'genel'} 
                      segment için tasarlanmıştır.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <ul className="space-y-3">
                    {product.features && Array.isArray(product.features) ? 
                      product.features.map((feature, index) => {
                        if (!feature || typeof feature !== 'string') {
                          return null;
                        }
                        return (
                          <li key={index} className="flex items-start">
                            <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        );
                      }) : 
                      <li className="text-gray-500">Bu ürün için özellik bilgisi bulunmamaktadır.</li>
                    }
                  </ul>
                </div>
              )}
            </div>
            
            {/* İletişim ve Sipariş Bilgileri */}
            <div className="space-y-5 mt-10">
              <div className="flex items-center">
                <FaShoppingCart className="text-gray-400 mr-4" />
                <span className="text-gray-700">Fiyat bilgisi için bizimle iletişime geçin</span>
              </div>
              <div className="flex items-center">
                <FaTruck className="text-gray-400 mr-4" />
                <span className="text-gray-700">Ürünlerimiz gerekli testler ve uyumlamalar yapıldıktan sonra teslim edilir</span>
              </div>
              <div className="flex items-center">
                <FaPhoneAlt className="text-gray-400 mr-4" />
                <span className="text-gray-700">Detaylı bilgi için: <Link href="/iletisim" className="text-blue-600 hover:text-blue-800">İletişim Sayfası</Link></span>
              </div>
            </div>
            
            {/* İletişim Butonları */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link 
                href="/iletisim" 
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg inline-flex items-center justify-center hover:bg-blue-700 transition-colors font-medium"
              >
                <FaPhoneAlt className="mr-2" /> İletişime Geçin
              </Link>
              <Link 
                href="/urunlerimiz" 
                className="flex-1 bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg inline-flex items-center justify-center hover:bg-gray-50 transition-colors font-medium"
              >
                <FaArrowLeft className="mr-2" /> Diğer Ürünler
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ürün Varyasyonları */}
      <div className="max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Diğer Vista İşitme Cihazı Modelleri</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Benzer ürünler burada listelenebilir */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="relative h-48 mb-3">
                <Image 
                  src="/images/UN_Packshot_B-312_Right_Right_Receiver_P7_Pewter_Actual_Size_RGB_050-6401-P744_01.png" 
                  alt="Vista İşitme Cihazı" 
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-medium text-gray-900">Vista Premium</h3>
              <p className="text-sm text-gray-500 mt-1">Üst Segment</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="relative h-48 mb-3">
                <Image 
                  src="/images/UN_Packshot_B-312_Right_Right_Receiver_P7_Pewter_Actual_Size_RGB_050-6401-P744_01.png"
                  alt="Vista İşitme Cihazı" 
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-medium text-gray-900">Vista Comfort</h3>
              <p className="text-sm text-gray-500 mt-1">Orta Segment</p>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="relative h-48 mb-3">
                <Image 
                  src="/images/UN_Packshot_B-312_Right_Right_Receiver_P7_Pewter_Actual_Size_RGB_050-6401-P744_01.png"
                  alt="Vista İşitme Cihazı" 
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-medium text-gray-900">Vista Essential</h3>
              <p className="text-sm text-gray-500 mt-1">Başlangıç Segment</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Avantajlar */}
      <div className="max-w-7xl mx-auto mt-12 px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Vista İşitme Cihazları Avantajları</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">2 Yıl Garanti</h3>
              <p className="text-gray-600">Tüm işitme cihazlarımız 2 yıl garantilidir. Teknik servis desteği sağlanmaktadır.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Kişiye Özel Ayarlar</h3>
              <p className="text-gray-600">Her kullanıcının ihtiyacına göre işitme cihazı ayarları profesyonel ekibimiz tarafından yapılır.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Gelişmiş Teknoloji</h3>
              <p className="text-gray-600">Vista işitme cihazları, gelişmiş gürültü azaltma ve bluetooth bağlantı özellikleriyle donatılmıştır.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 