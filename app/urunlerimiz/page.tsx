"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBluetooth, FaCheckCircle, FaBatteryFull, FaWater, FaFilter, FaChevronDown, FaChevronRight } from "react-icons/fa";

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

interface Product {
  id: number;
  title: string;
  short_description: string;
  category_id: number;
  category_name: string;
  segment: "başlangıç" | "orta" | "üst";
  main_image: string;
  features: string[];
  additional_images: string[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [imageIndex, setImageIndex] = useState<number>(0);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Seçili ürün değiştiğinde ana resmi güncelle
  useEffect(() => {
    if (selectedProduct && selectedProduct.main_image) {
      setCurrentImage(selectedProduct.main_image);
      setImageIndex(0);
    }
  }, [selectedProduct]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories?onlyWithProducts=true");
      if (!response.ok) {
        throw new Error('Kategoriler getirilemedi');
      }
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Kategoriler yüklenirken hata:", error);
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      if (!response.ok) {
        throw new Error('Ürünler getirilemedi');
      }
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Ürünler yüklenirken hata:", error);
      setProducts([]);
    }
  };

  // Alt kategorileri bul
  const getChildCategories = (parentId: number | null) => {
    return categories.filter(category => category.parent_id === parentId);
  };

  // Kategori alt kategoriye sahip mi kontrol et
  const hasChildren = (categoryId: number) => {
    return categories.some(category => category.parent_id === categoryId);
  };

  // Kategori ve alt kategorilerini içeren tüm kategori ID'lerini getir
  const getCategoryAndDescendantIds = (categoryId: number): number[] => {
    const result = [categoryId];
    const childCategories = getChildCategories(categoryId);
    
    childCategories.forEach(child => {
      result.push(...getCategoryAndDescendantIds(child.id));
    });
    
    return result;
  };

  // Ana kategorileri bul
  const mainCategories = categories.filter(category => category.parent_id === null);

  // Kategori genişletme/daraltma kontrolü
  const toggleCategoryExpansion = (categoryId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
  };

  // Filtrelenmiş ürünler
  const filteredProducts = products.filter(product => {
    // Kategori filtresi
    if (selectedCategory) {
      // Seçilen kategori ve tüm alt kategorileri içeren ID listesi
      const relevantCategoryIds = getCategoryAndDescendantIds(selectedCategory);
      // Ürün bu kategorilerden birine aitse göster
      if (!relevantCategoryIds.includes(product.category_id)) {
        return false;
      }
    }
    
    // Segment filtresi
    if (selectedSegment && product.segment !== selectedSegment) {
      return false;
    }
    
    return true;
  });

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedSegment(null);
  };

  // Resim URL'sini doğru formata çevirme
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "/images/placeholder.jpg";
    
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

  // Tüm ürün resimlerini içeren diziyi oluştur (ana görsel + ek görseller)
  const getAllProductImages = (product: Product) => {
    if (!product) {
      console.error("getAllProductImages: Ürün nesnesi bulunamadı");
      return [];
    }
    
    const images = [];
    
    // Ana görsel varsa ekle
    if (product.main_image) {
      images.push(product.main_image);
      console.log("getAllProductImages: Ana görsel eklendi:", product.main_image);
    }
    
    // Ham ek resimler verilerini kontrol et
    console.log("getAllProductImages: Ham ürün.additional_images değeri:", 
      typeof product.additional_images, 
      product.additional_images
    );
    
    // Ek resimleri işle
    let additionalImages: string[] = [];
    
    // Eğer string ise parse et
    if (typeof product.additional_images === 'string') {
      try {
        const parsed = JSON.parse(product.additional_images);
        if (Array.isArray(parsed)) {
          additionalImages = parsed;
          console.log("getAllProductImages: String'den ek resimler parse edildi:", additionalImages);
        } else {
          console.error("getAllProductImages: Parse edilen değer dizi değil:", parsed);
        }
      } catch (e) {
        console.error("getAllProductImages: Ek resimler parse hatası:", e);
      }
    }
    // Eğer zaten dizi ise doğrudan kullan
    else if (Array.isArray(product.additional_images)) {
      additionalImages = [...product.additional_images];
      console.log("getAllProductImages: Ek resimler zaten dizi:", additionalImages);
    }
    else {
      console.error("getAllProductImages: Ek resimler geçerli bir format değil:", typeof product.additional_images);
    }
    
    // Geçerli ek resimleri ekle
    if (additionalImages.length > 0) {
      const validImages = additionalImages.filter(img => typeof img === 'string' && img.trim() !== '');
      console.log("getAllProductImages: Geçerli ek resim sayısı:", validImages.length);
      images.push(...validImages);
    }
    
    console.log("getAllProductImages: Toplam resim sayısı:", images.length);
    return images;
  };

  // Sonraki resme geç
  const nextImage = () => {
    if (!selectedProduct) return;
    
    const images = getAllProductImages(selectedProduct);
    const newIndex = (imageIndex + 1) % images.length;
    setImageIndex(newIndex);
    setCurrentImage(images[newIndex]);
  };

  // Önceki resme geç
  const prevImage = () => {
    if (!selectedProduct) return;
    
    const images = getAllProductImages(selectedProduct);
    const newIndex = (imageIndex - 1 + images.length) % images.length;
    setImageIndex(newIndex);
    setCurrentImage(images[newIndex]);
  };

  // Belirli bir resme tıklandığında onu ana görsel olarak ayarla
  const selectImage = (index: number) => {
    if (!selectedProduct) return;
    
    const images = getAllProductImages(selectedProduct);
    if (index >= 0 && index < images.length) {
      setImageIndex(index);
      setCurrentImage(images[index]);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-800">
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

      {/* Ürün Teknolojileri Tanıtım Kısmı */}
      <section className="py-16 bg-white text-gray-800">
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

      {/* Ürün Listesi ve Filtreler */}
      <div className="container mx-auto px-4 py-12 bg-white text-gray-800">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Tüm Ürünlerimiz</h2>
        
        {/* Mobil Filtre Butonu */}
        <div className="md:hidden mb-4">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 bg-gray-200 py-3 rounded-lg text-gray-800"
          >
            <FaFilter />
            <span>Filtreleri {showFilters ? 'Gizle' : 'Göster'}</span>
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filtreler - Sol Kenar */}
          <div className={`md:w-1/4 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Kategoriler</h3>
                <div className="space-y-1">
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left py-2 px-3 rounded-md transition-colors ${
                      selectedCategory === null 
                        ? 'bg-blue-500 text-white font-medium' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    Tüm Ürünler
                  </button>
                  
                  {mainCategories.map(category => (
                    <div key={category.id} className="category-item">
                      <div className="category-header">
                        <button 
                          onClick={() => setSelectedCategory(category.id)}
                          className={`group flex items-center w-full text-left py-2 px-3 rounded-md transition-colors ${
                            selectedCategory === category.id 
                              ? 'bg-blue-500 text-white font-medium' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span className="flex-grow">{category.name}</span>
                          {hasChildren(category.id) && (
                            <button 
                              onClick={(e) => toggleCategoryExpansion(category.id, e)}
                              className={`ml-2 p-1 rounded-full transition-colors ${
                                selectedCategory === category.id 
                                  ? 'text-white group-hover:bg-blue-600' 
                                  : 'text-gray-500 group-hover:bg-gray-200'
                              }`}
                            >
                              {expandedCategories.includes(category.id) ? 
                                <FaChevronDown size={12} /> : 
                                <FaChevronRight size={12} />
                              }
                            </button>
                          )}
                        </button>
                      </div>
                      
                      {/* Alt Kategoriler */}
                      {hasChildren(category.id) && expandedCategories.includes(category.id) && (
                        <div className="ml-3 mt-1 pl-3 border-l-2 border-gray-200">
                          {getChildCategories(category.id).map(child => (
                            <div key={child.id} className="subcategory-item">
                              <div className="subcategory-header">
                                <button 
                                  onClick={() => setSelectedCategory(child.id)}
                                  className={`group flex items-center w-full text-left py-2 px-3 rounded-md transition-colors ${
                                    selectedCategory === child.id 
                                      ? 'bg-blue-500 text-white font-medium' 
                                      : 'hover:bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  <span className="flex-grow">{child.name}</span>
                                  {hasChildren(child.id) && (
                                    <button 
                                      onClick={(e) => toggleCategoryExpansion(child.id, e)}
                                      className={`ml-2 p-1 rounded-full transition-colors ${
                                        selectedCategory === child.id 
                                          ? 'text-white group-hover:bg-blue-600' 
                                          : 'text-gray-500 group-hover:bg-gray-200'
                                      }`}
                                    >
                                      {expandedCategories.includes(child.id) ? 
                                        <FaChevronDown size={12} /> : 
                                        <FaChevronRight size={12} />
                                      }
                                    </button>
                                  )}
                                </button>
                              </div>
                              
                              {/* 3. Seviye Kategoriler */}
                              {hasChildren(child.id) && expandedCategories.includes(child.id) && (
                                <div className="ml-3 mt-1 pl-3 border-l-2 border-gray-200">
                                  {getChildCategories(child.id).map(grandchild => (
                                    <button 
                                      key={grandchild.id}
                                      onClick={() => setSelectedCategory(grandchild.id)}
                                      className={`w-full text-left py-2 px-3 rounded-md transition-colors ${
                                        selectedCategory === grandchild.id 
                                          ? 'bg-blue-500 text-white font-medium' 
                                          : 'hover:bg-gray-100 text-gray-500'
                                      }`}
                                    >
                                      {grandchild.name}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Segment</h3>
                <div className="space-y-2">
                  <label className={`block p-2 rounded-md cursor-pointer transition-colors ${
                    selectedSegment === null 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    <input 
                      type="radio" 
                      name="segment" 
                      checked={selectedSegment === null} 
                      onChange={() => setSelectedSegment(null)}
                      className="hidden"
                    />
                    <span className="flex items-center">
                      <span className={`inline-block w-4 h-4 mr-2 rounded-full ${
                        selectedSegment === null 
                          ? 'bg-white border-2 border-white' 
                          : 'border-2 border-gray-400'
                      }`}></span>
                      Tümü
                    </span>
                  </label>
                  
                  <label className={`block p-2 rounded-md cursor-pointer transition-colors ${
                    selectedSegment === 'başlangıç' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    <input 
                      type="radio" 
                      name="segment" 
                      checked={selectedSegment === 'başlangıç'} 
                      onChange={() => setSelectedSegment('başlangıç')}
                      className="hidden"
                    />
                    <span className="flex items-center">
                      <span className={`inline-block w-4 h-4 mr-2 rounded-full ${
                        selectedSegment === 'başlangıç' 
                          ? 'bg-white border-2 border-white' 
                          : 'border-2 border-gray-400'
                      }`}></span>
                      Başlangıç
                    </span>
                  </label>
                  
                  <label className={`block p-2 rounded-md cursor-pointer transition-colors ${
                    selectedSegment === 'orta' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    <input 
                      type="radio" 
                      name="segment" 
                      checked={selectedSegment === 'orta'} 
                      onChange={() => setSelectedSegment('orta')}
                      className="hidden"
                    />
                    <span className="flex items-center">
                      <span className={`inline-block w-4 h-4 mr-2 rounded-full ${
                        selectedSegment === 'orta' 
                          ? 'bg-white border-2 border-white' 
                          : 'border-2 border-gray-400'
                      }`}></span>
                      Orta
                    </span>
                  </label>
                  
                  <label className={`block p-2 rounded-md cursor-pointer transition-colors ${
                    selectedSegment === 'üst' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}>
                    <input 
                      type="radio" 
                      name="segment" 
                      checked={selectedSegment === 'üst'} 
                      onChange={() => setSelectedSegment('üst')}
                      className="hidden"
                    />
                    <span className="flex items-center">
                      <span className={`inline-block w-4 h-4 mr-2 rounded-full ${
                        selectedSegment === 'üst' 
                          ? 'bg-white border-2 border-white' 
                          : 'border-2 border-gray-400'
                      }`}></span>
                      Üst
                    </span>
                  </label>
                </div>
              </div>
              
              <button 
                onClick={resetFilters}
                className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          </div>
          
          {/* Ürün Listesi - Sağ Taraf */}
          <div className="md:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow border border-gray-200">
                <p className="text-gray-600 text-lg">Seçilen kriterlere uygun ürün bulunamadı.</p>
                <button 
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
            <div
              key={product.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200"
            >
              <div className="relative h-64">
                <Image
                        src={getImageUrl(product.main_image)}
                  alt={product.title}
                  fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain"
                        onError={(e) => {
                          console.error("Resim yüklenemedi:", product.main_image);
                          (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                        }}
                />
              </div>
              <div className="p-6">
                      <h2 className="text-xl font-semibold mb-2 text-gray-800">{product.title}</h2>
                <p className="text-gray-600 mb-4">{product.short_description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{product.category_name}</span>
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowModal(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Detaylar
                  </button>
                </div>
              </div>
            </div>
          ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ürün Detay Modalı */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto text-gray-800">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">{selectedProduct.title}</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedProduct(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Sol Taraf - Resimler */}
              <div className="space-y-4">
                <div className="relative h-96 bg-white border border-gray-200 rounded-lg">
                  {/* Ana Görsel */}
                  <Image
                    src={getImageUrl(currentImage)}
                    alt={selectedProduct.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                    onError={(e) => {
                      console.error("Resim yüklenemedi:", currentImage);
                      (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                    }}
                  />

                  {/* Gezinme Okları - Sadece birden fazla resim varsa göster */}
                  {selectedProduct.additional_images && selectedProduct.additional_images.length > 0 && (
                    <>
                      <button 
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full text-gray-800 hover:bg-opacity-100"
                        aria-label="Önceki resim"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      <button 
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 p-2 rounded-full text-gray-800 hover:bg-opacity-100"
                        aria-label="Sonraki resim"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>

                {/* Küçük Resimler (Ana görsel + ek görseller) */}
                <div className="grid grid-cols-5 gap-2">
                  {/* Ana görsel küçük resmi */}
                  <div 
                    className={`relative h-20 border ${imageIndex === 0 ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'} rounded-md cursor-pointer overflow-hidden`}
                    onClick={() => selectImage(0)}
                  >
                    <Image
                      src={getImageUrl(selectedProduct.main_image)}
                      alt={`${selectedProduct.title} - Ana Görsel`}
                      fill
                      sizes="(max-width: 768px) 20vw, 10vw"
                      className="object-contain"
                      onError={(e) => {
                        console.error("Ana resim yüklenemedi:", selectedProduct.main_image);
                        (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                      }}
                    />
                  </div>

                  {/* Ek görseller */}
                  {selectedProduct.additional_images && 
                   Array.isArray(selectedProduct.additional_images) && 
                   selectedProduct.additional_images.length > 0 ? 
                   selectedProduct.additional_images.map((image, idx) => {
                      // Sadece geçerli string değerleri kabul et
                      if (!image || typeof image !== 'string') {
                        console.error("Geçersiz ek resim değeri:", idx, image);
                        return null;
                      }
                      
                      console.log("Ek resim gösteriliyor:", idx, image);
                      
                      return (
                        <div 
                          key={idx} 
                          className={`relative h-20 border ${imageIndex === idx + 1 ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-200'} rounded-md cursor-pointer overflow-hidden`}
                          onClick={() => selectImage(idx + 1)}
                        >
                      <Image
                            src={getImageUrl(image)}
                            alt={`${selectedProduct.title} - ${idx + 1}`}
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
                    }) : (
                      // Ek resim yoksa bilgi mesajı göstermeye gerek yok, seçili ürün için göstermek zorunda değiliz
                      null
                    )}
                </div>
              </div>

              {/* Sağ Taraf - Bilgiler */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Ürün Açıklaması</h3>
                  <p className="text-gray-600">{selectedProduct.short_description}</p>
                </div>

                {selectedProduct.features && Array.isArray(selectedProduct.features) && selectedProduct.features.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Özellikler</h3>
                  <ul className="list-disc list-inside space-y-2">
                      {selectedProduct.features.map((feature, index) => {
                        if (!feature || typeof feature !== 'string') {
                          console.error("Geçersiz özellik:", index, feature);
                          return null;
                        }
                        return (
                      <li key={index} className="text-gray-600">{feature}</li>
                        );
                      })}
                  </ul>
                </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Kategori</h3>
                  <p className="text-gray-600">{selectedProduct.category_name}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">Segment</h3>
                  <p className="text-gray-600 capitalize">{selectedProduct.segment}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
} 