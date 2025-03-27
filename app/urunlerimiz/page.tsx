"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaFilter, FaChevronDown, FaChevronRight, FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

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
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

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

  // Ürüne tıklama işlevi - detay sayfasına yönlendir
  const handleProductClick = (product: Product) => {
    router.push(`/urunlerimiz/${product.id}`);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="relative bg-gray-900 text-white py-16">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/birinci.jpg"
            alt="İşitme Cihazları"
            fill
            style={{ objectFit: 'cover', opacity: 0.3 }}
            priority
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Dolunay İşitme Merkezi Cihazları</h1>
            <p className="text-xl max-w-3xl mx-auto">
              En son teknoloji ile üretilmiş Vista işitme cihazlarını keşfedin
            </p>
            
            <Link 
              href="/urunlerimiz/test" 
              className="mt-6 inline-block bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Size Uygun İşitme Cihazını Bulun
            </Link>
          </div>
        </div>
      </div>

      {/* Ürün Listesi */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtreler - Sol Kenar */}
          <div className="lg:w-1/4">
            {/* Mobil Filtre Butonu */}
            <div className="lg:hidden mb-4">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center gap-2 bg-white py-3 rounded-lg shadow-sm border border-gray-200 text-gray-800"
              >
                <FaFilter />
                <span>Filtreleri {showFilters ? 'Gizle' : 'Göster'}</span>
              </button>
            </div>
            
            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Kategoriler */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Kategoriler</h3>
                
                <div className="space-y-1">
                  <button 
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full text-left py-2 px-3 rounded-md transition-colors ${
                      selectedCategory === null 
                        ? 'bg-blue-600 text-white font-medium' 
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
                              ? 'bg-blue-600 text-white font-medium' 
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span className="flex-grow">{category.name}</span>
                          {hasChildren(category.id) && (
                            <button 
                              onClick={(e) => toggleCategoryExpansion(category.id, e)}
                              className={`ml-2 p-1 rounded-full transition-colors ${
                                selectedCategory === category.id 
                                  ? 'text-white group-hover:bg-blue-700' 
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
                                      ? 'bg-blue-600 text-white font-medium' 
                                      : 'hover:bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  <span className="flex-grow">{child.name}</span>
                                  {hasChildren(child.id) && (
                                    <button 
                                      onClick={(e) => toggleCategoryExpansion(child.id, e)}
                                      className={`ml-2 p-1 rounded-full transition-colors ${
                                        selectedCategory === child.id 
                                          ? 'text-white group-hover:bg-blue-700' 
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
                                          ? 'bg-blue-600 text-white font-medium' 
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
              
              {/* Segment Filtresi */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Segment</h3>
                <div className="space-y-2">
                  <label className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                    selectedSegment === null 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="segment" 
                      checked={selectedSegment === null} 
                      onChange={() => setSelectedSegment(null)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2">Tümü</span>
                  </label>
                  
                  <label className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                    selectedSegment === 'başlangıç' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="segment" 
                      checked={selectedSegment === 'başlangıç'} 
                      onChange={() => setSelectedSegment('başlangıç')}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2">Başlangıç</span>
                  </label>
                  
                  <label className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                    selectedSegment === 'orta' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="segment" 
                      checked={selectedSegment === 'orta'} 
                      onChange={() => setSelectedSegment('orta')}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2">Orta</span>
                  </label>
                  
                  <label className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${
                    selectedSegment === 'üst' 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}>
                    <input 
                      type="radio" 
                      name="segment" 
                      checked={selectedSegment === 'üst'} 
                      onChange={() => setSelectedSegment('üst')}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2">Üst</span>
                  </label>
                </div>
                
                <button 
                  onClick={resetFilters}
                  className="w-full mt-4 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                >
                  Filtreleri Temizle
                </button>
              </div>
              
              {/* İpucu Kartı */}
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                <div className="flex items-start">
                  <FaInfoCircle className="text-blue-500 mt-1 flex-shrink-0" />
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">Nasıl Yardımcı Olabiliriz?</h4>
                    <p className="mt-1 text-sm text-blue-700">
                      İşitme cihazı seçimi konusunda yardıma mı ihtiyacınız var? 
                      Uzman ekibimiz size en uygun cihazı bulmanızda yardımcı olabilir.
                    </p>
                    <Link href="/iletisim" className="mt-2 text-sm font-medium text-blue-700 hover:text-blue-800 inline-block">
                      İletişime Geçin &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Ürün Listesi - Sağ Taraf */}
          <div className="lg:w-3/4">
            {/* Sonuç Özeti */}
            <div className="mb-6 flex flex-wrap justify-between items-center">
              <h2 className="text-xl font-medium text-gray-900">
                Ürünlerimiz 
                {selectedCategory && categories.find(c => c.id === selectedCategory) && 
                  ` - ${categories.find(c => c.id === selectedCategory)?.name}`
                }
                {selectedSegment && 
                  ` - ${selectedSegment.charAt(0).toUpperCase() + selectedSegment.slice(1)} Segment`
                }
              </h2>
              <p className="text-sm text-gray-500">
                {filteredProducts.length} ürün gösteriliyor
              </p>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="mx-auto w-16 h-16 mb-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
          </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sonuç Bulunamadı</h3>
                <p className="text-gray-500 mb-6">Seçilen filtrelere uygun ürün bulunamadı.</p>
                <button 
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Filtreleri Temizle
                </button>
        </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const segmentInfo = getSegmentInfo(product.segment);
                  
                  return (
            <div
              key={product.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => handleProductClick(product)}
            >
                      {/* Ürün Görseli */}
                      <div className="relative h-64 bg-gray-50 border-b border-gray-100 flex items-center justify-center p-4">
                <Image
                          src={getImageUrl(product.main_image || "")}
                  alt={product.title}
                  fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain p-4 transition-transform group-hover:scale-105"
                          onError={(e) => {
                            console.error("Ürün resmi yüklenemedi:", product.main_image);
                            (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                          }}
                />
              </div>
                      
                      {/* Ürün Bilgileri */}
                      <div className="p-4">
                        <div className="mb-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${segmentInfo.color}`}>
                            {segmentInfo.text}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-medium text-gray-900 mb-1">{product.title}</h3>
                        
                        <p className="text-sm text-gray-500 mb-2">{product.category_name}</p>
                        
                        <p className="text-gray-700 text-sm mb-4 line-clamp-2">{product.short_description}</p>
                        
                <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {product.features && Array.isArray(product.features) ? `${product.features.length} özellik` : ''}
                          </span>
                          
                  <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleProductClick(product);
                            }}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100"
                  >
                    Detaylar
                  </button>
                </div>
              </div>
            </div>
                  );
                })}
              </div>
            )}
            
            {/* İletişim CTA */}
            <div className="mt-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-12 text-center text-white">
                <h3 className="text-2xl font-bold mb-4">İhtiyacınız olan işitme çözümünü birlikte bulalım</h3>
                <p className="mb-8 max-w-2xl mx-auto">
                  Vista işitme cihazlarının size sunduğu avantajları keşfetmek ve ihtiyaçlarınıza en uygun cihazı bulmak için bizimle iletişime geçin.
                </p>
                <a
                  href="tel:+905537502842"
                  className="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
                >
                  Hemen Arayın: +90 553 750 28 42
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 