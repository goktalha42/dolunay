"use client";

import { useState, useEffect, useRef } from "react";
import { FaPlus, FaEdit, FaTrash, FaImage, FaSearch } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { getFeatureColor } from "@/app/lib/utils/coloring";

interface Product {
  id?: number;
  title: string;
  short_description?: string;
  long_description?: string;
  category_id?: number;
  category_name?: string;
  segment?: string;
  image?: string;
  main_image?: string;
  additional_images?: string[] | string;
  features?: number[] | string[];
  [key: string]: any; // Diğer olası alanlar için
}

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

interface Feature {
  id: number;
  name: string;
  display_order: number;
}

interface FormDataType {
  title: string;
  short_description: string;
  long_description: string;
  category_id: number;
  segment: string;
  main_image: string;
  additional_images: string[];
  features: any[]; // Özellik ID'lerini veya string'leri tutan dizi
  [key: string]: any; // Diğer olası alanlar için
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]); // Özellikleri tutmak için
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    short_description: "",
    long_description: "",
    category_id: 0,
    segment: "orta",
    main_image: "",
    additional_images: [],
    features: [],
  });

  // Dosya yükleme formları için ekler yapalım
  const [showForm, setShowForm] = useState(false);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [mainImagePreview, setMainImagePreview] = useState<string>("");
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [existingAdditionalImages, setExistingAdditionalImages] = useState<string[]>([]);

  // useRef için ana görsel input referansı ekleyelim
  const mainImageRef = useRef<HTMLInputElement>(null);

  // Sıralama için state ekleyelim
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Arama için state ekleyelim
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Kullanılabilir özellikleri getir
  const [availableFeatures, setAvailableFeatures] = useState<Feature[]>([]);
  const [loadingFeatures, setLoadingFeatures] = useState(false);

  // Ürünleri getir
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/products");
      if (!response.ok) {
        throw new Error("Ürünler getirilemedi");
      }
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Ürünler getirilemedi:", error);
      setError("Ürünler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Kategorileri getir
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Kategoriler yüklenirken hata:", error);
      // Hata durumunda mock kategoriler gösteriyoruz
      setCategories([
        { id: 1, name: 'İşitme Cihazları', parent_id: null },
        { id: 2, name: 'Kulaklık Tipleri', parent_id: null },
        { id: 3, name: 'Kulak İçi', parent_id: 2 }
      ]);
    }
  };

  // Özellikleri getir
  const fetchFeatures = async () => {
    try {
      setLoadingFeatures(true);
      const response = await fetch('/api/features');
      if (response.ok) {
        const features = await response.json();
        setAvailableFeatures(features);
      } else {
        console.error('Özellikler getirilemedi');
      }
    } catch (error) {
      console.error('Özellikler getirirken hata:', error);
    } finally {
      setLoadingFeatures(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchFeatures(); // Özellikleri getir
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Ürün adı girilmelidir.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const formDataToSend = new FormData();
    
    // Metin verilerini ekle
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "features") {
        // Features dizisinin doğru şekilde gönderildiğinden emin ol
        if (Array.isArray(value)) {
          formDataToSend.append(key, JSON.stringify(value));
          console.log("Features formData'ya eklendi:", JSON.stringify(value));
        } else {
          formDataToSend.append(key, JSON.stringify([]));
          console.error("Features dizi değil:", value);
        }
      } else if (key !== "main_image" && key !== "additional_images") {
        // Resim yolları form data'dan çıkarılıyor, bunun yerine dosyalar gönderilecek
        formDataToSend.append(key, String(value));
      }
    });
    
    // Ana resim dosyasını ekle
    if (mainImageFile) {
      formDataToSend.append("main_image_file", mainImageFile);
    } else if (formData.main_image === "/images/logo.png") {
      // Eğer ana resim yoksa ve logo kullanılacaksa
      formDataToSend.append("main_image_default", "true");
    }
    
    // Ek resim dosyalarını ekle
    additionalImageFiles.forEach(file => {
      formDataToSend.append("additional_image_files", file);
    });
    
    // Güncelleme yaparken mevcut ek resimleri koru - her zaman gönderiyoruz çünkü
    // üründe ek resimler varsa ve selectedProduct ayarlanmışsa, bunun anlamı ürün düzenleme modundayız
    if (selectedProduct) {
      formDataToSend.append("keep_existing_additional_images", "true");
      
      if (selectedProduct.additional_images && Array.isArray(selectedProduct.additional_images) && selectedProduct.additional_images.length > 0) {
        console.log("Mevcut ek resimler korunuyor:", selectedProduct.additional_images);
      } else {
        console.log("Ek resim yok veya boş dizi, ama keep_existing_additional_images yine de true olarak gönderiliyor");
      }
    }
    
    try {
      const url = selectedProduct 
        ? `/api/admin/products/${selectedProduct.id}`
        : "/api/admin/products";
      
      const method = selectedProduct ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });
      
      if (response.ok) {
        setShowModal(false);
        fetchProducts();
        resetForm();
        setSuccess(selectedProduct ? 'Ürün başarıyla güncellendi.' : 'Ürün başarıyla eklendi.');
        
        // 3 saniye sonra başarı mesajını kaldır
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Bir hata oluştu');
      }
    } catch (error: any) {
      console.error("Ürün kaydedilirken hata:", error);
      setError(error.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | undefined) => {
    if (!id) {
      console.error("Geçersiz ürün ID'si:", id);
      setError("Silinecek ürün bulunamadı.");
      return;
    }
    
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        fetchProducts();
        setSuccess('Ürün başarıyla silindi.');
        
        // 3 saniye sonra başarı mesajını kaldır
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Bir hata oluştu');
      }
    } catch (error: any) {
      console.error("Ürün silinirken hata:", error);
      setError(error.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setFormData({
      title: "",
      short_description: "",
      long_description: "",
      category_id: 0,
      segment: "orta",
      main_image: "",
      additional_images: [],
      features: []
    });
    setMainImageFile(null);
    setMainImagePreview("");
    setAdditionalImageFiles([]);
    setAdditionalImagePreviews([]);
  };

  const handleProductEdit = (product: Product) => {
    setSelectedProduct(product);
    
    // Önceki form datayı temizle ve güncel veriyi ayarla
    setFormData({
      title: product.title || "",
      short_description: product.short_description || "",
      long_description: product.long_description || "",
      category_id: product.category_id || 0,
      segment: product.segment || "orta",
      main_image: product.main_image || "",
      additional_images: [],
      features: product.feature_ids || [] // feature_ids kullan
    });

    // Ana görsel için önizleme ayarla
    if (product.main_image) {
      setMainImagePreview(getImageUrl(product.main_image));
    }

    // Ek görseller için
    if (product.additional_images && Array.isArray(product.additional_images)) {
      setExistingAdditionalImages(
        product.additional_images.filter(img => typeof img === 'string') as string[]
      );
    }

    // Modal'ı aç
    setShowModal(true);
  };

  const getCategoryName = (categoryId: number | undefined): string => {
    if (!categoryId || !categories || !Array.isArray(categories)) {
      return "Kategorisiz";
    }
    
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      if (category.parent_id === null) {
        return category.name;
      } else {
        const parentCategory = categories.find((c) => c.id === category.parent_id);
        if (parentCategory) {
          return `${category.name} (${parentCategory.name})`;
        }
        return category.name;
      }
    }
    return "Kategorisiz";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    
    if (field === 'main_image') {
      const file = e.target.files[0];
      setMainImageFile(file);
      
      // Önizleme URL'i oluştur
      const imageUrl = URL.createObjectURL(file);
      setMainImagePreview(imageUrl);
    } else if (field === 'additional_images') {
      const files = Array.from(e.target.files);
      setAdditionalImageFiles(prevFiles => [...prevFiles, ...files]);
      
      // Önizleme URL'leri oluştur
      const imageUrls = files.map(file => URL.createObjectURL(file));
      setAdditionalImagePreviews(prevUrls => [...prevUrls, ...imageUrls]);
    }
  };

  const removeAdditionalImage = (index: number) => {
    // Seçili ek resmi kaldır
    setAdditionalImageFiles(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
    
    // Önizlemeyi de kaldır
    setAdditionalImagePreviews(prev => {
      const updated = [...prev];
      // URL'i temizle
      URL.revokeObjectURL(updated[index]);
      updated.splice(index, 1);
      return updated;
    });
  };

  // Ana görseli temizle
  const removeMainImage = () => {
    console.log("Ana görsel siliniyor");
    // FormData kullanmak yerine doğrudan state güncellemesi yapalım
    setMainImageFile(null);
    setMainImagePreview("");
    // Input alanını da temizleyelim
    if (mainImageRef.current) {
      mainImageRef.current.value = "";
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
    
    console.log("getImageUrl çağrıldı:", imageUrl);
    
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

  // Sıralama fonksiyonu
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Aynı alana tekrar tıklandığında sıralama yönünü değiştir
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Farklı bir alana tıklandığında, o alanı sırala ve varsayılan olarak artan sırala
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sıralanmış ve filtrelenmiş ürünleri hesapla
  const filteredAndSortedProducts = [...products]
    // Önce arama terimine göre filtrele
    .filter(product => {
      if (!searchTerm.trim()) return true;
      
      const search = searchTerm.toLowerCase().trim();
      const title = product.title?.toLowerCase() || "";
      const description = product.short_description?.toLowerCase() || "";
      const category = getCategoryName(product.category_id)?.toLowerCase() || "";
      
      return (
        title.includes(search) || 
        description.includes(search) || 
        category.includes(search) ||
        (product.id?.toString() || "").includes(search)
      );
    })
    // Sonra sırala
    .sort((a, b) => {
      const fieldA = a[sortField];
      const fieldB = b[sortField];
      
      // Özel durumlar için kontrol
      if (sortField === "category_id") {
        const catA = getCategoryName(a.category_id);
        const catB = getCategoryName(b.category_id);
        
        if (sortDirection === "asc") {
          return catA.localeCompare(catB);
        } else {
          return catB.localeCompare(catA);
        }
      }
      
      // Genel sıralama mantığı
      if (typeof fieldA === "string" && typeof fieldB === "string") {
        // String sıralama
        if (sortDirection === "asc") {
          return fieldA.localeCompare(fieldB);
        } else {
          return fieldB.localeCompare(fieldA);
        }
      } else {
        // Sayısal veya diğer tipler için
        if (sortDirection === "asc") {
          return fieldA > fieldB ? 1 : -1;
        } else {
          return fieldA < fieldB ? 1 : -1;
        }
      }
    });

  // Özellik seçim/kaldırma işlevi
  const handleFeatureToggle = (featureId: number) => {
    setFormData(prev => {
      // Eğer özellik zaten seçiliyse, kaldır
      if (prev.features.includes(featureId)) {
        return {
          ...prev,
          features: prev.features.filter(id => id !== featureId)
        };
      }
      // Değilse ekle
      else {
        return {
          ...prev,
          features: [...prev.features, featureId]
        };
      }
    });
  };

  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800">Ürün Yönetimi</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          disabled={loading}
        >
          <FaPlus /> Yeni Ürün
        </button>
      </div>

      {/* Başarı Mesajı */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {/* Hata Mesajı */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Arama Çubuğu */}
      <div className="mb-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-blue-500" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ürün ara... (Ad, açıklama, kategori veya ID)"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 text-gray-800 placeholder-gray-500"
          />
          {searchTerm && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button 
                onClick={() => setSearchTerm('')}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading && !showModal && (
          <div className="w-full p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-500">Yükleniyor...</p>
          </div>
        )}

        {!loading && (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th 
                  className="py-3 px-4 text-left text-gray-700 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("id")}
                >
                  ID {sortField === "id" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="py-3 px-4 text-left text-gray-700 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("title")}
                >
                  Ürün Adı {sortField === "title" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="py-3 px-4 text-left text-gray-700 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("category_id")}
                >
                  Kategori {sortField === "category_id" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th className="py-3 px-4 text-right text-gray-700">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedProducts.map((product) => (
                <tr key={product.id} className="border-t border-gray-200">
                  <td className="py-3 px-4 text-gray-800">{product.id}</td>
                  <td className="py-3 px-4">
                    <div>
                      <div className="text-gray-800 font-medium">{product.title}</div>
                      
                      {/* Özellikler */}
                      {product.features && Array.isArray(product.features) && product.features.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1">
                          {product.features.slice(0, 3).map((feature, idx) => {
                            // Özellik bir nesne mi kontrol et
                            const featureName = typeof feature === 'object' && feature !== null 
                              ? (feature as any).name  // Nesne ise name özelliğini kullan (any tipine dönüştür)
                              : typeof feature === 'string' 
                                ? feature   // String ise doğrudan kullan
                                : String(feature);  // Diğer durumlarda stringe dönüştür
                            
                            return (
                              <span
                                key={idx}
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getFeatureColor(featureName).bg} ${getFeatureColor(featureName).text}`}
                              >
                                {featureName}
                              </span>
                            );
                          })}
                          {product.features.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              +{product.features.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {getCategoryName(product.category_id)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleProductEdit(product)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        disabled={loading}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        disabled={loading}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    Henüz ürün bulunmuyor.
                  </td>
                </tr>
              )}
              {products.length > 0 && filteredAndSortedProducts.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    Arama kriterine uyan ürün bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Ürün Ekleme/Düzenleme Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
            </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
              </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Ürün Adı */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ürün Adı*
                </label>
                  <input
                    type="text"
                    value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                    required
                />
              </div>

              {/* Kısa Açıklama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kısa Açıklama
                </label>
                <textarea
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                />
              </div>

              {/* Uzun Açıklama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Detaylı Açıklama
                </label>
                <textarea
                  value={formData.long_description}
                  onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                  rows={6}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                />
              </div>

              {/* Kategori */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                  <select
                    value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                >
                  <option value="0">Kategori Seçin</option>
                  {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                    ))}
                  </select>
                </div>

              {/* Segment */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Segment
                </label>
                  <select
                    value={formData.segment}
                  onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                >
                  <option value="başlangıç">Başlangıç</option>
                  <option value="orta">Orta</option>
                  <option value="üst">Üst</option>
                  </select>
                </div>

              {/* Ana Görsel */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ana Görsel
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="file"
                      ref={mainImageRef}
                      onChange={(e) => handleFileChange(e, 'main_image')}
                      accept="image/*"
                      className="hidden"
                      id="mainImageInput"
                    />
                    <label
                      htmlFor="mainImageInput"
                      className="cursor-pointer py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      Resim Seç
                      </label>
                    </div>
                  <div className="text-sm text-gray-500">
                    {mainImageFile ? mainImageFile.name : "Henüz resim seçilmedi"}
                  </div>
                </div>
                
                {/* Ana görsel önizleme */}
                {mainImagePreview && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-700">Önizleme:</h4>
                      <button 
                        type="button"
                        onClick={removeMainImage}
                        className="text-red-600 hover:text-red-800 text-sm flex items-center"
                      >
                        <FaTrash className="mr-1" size={12} />
                        Ana görseli kaldır
                      </button>
                    </div>
                    <div className="relative w-40 h-40 border border-gray-200 rounded-md overflow-hidden bg-white">
                      <Image
                        src={mainImagePreview}
                          alt="Ana görsel önizleme"
                        fill
                        className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>

              {/* Ek Görseller */}
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ek Görseller
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <input
                      type="file"
                      onChange={(e) => handleFileChange(e, 'additional_images')}
                      accept="image/*"
                      multiple
                      className="sr-only"
                      id="additional-images-upload"
                    />
                    <label
                      htmlFor="additional-images-upload"
                      className="cursor-pointer py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                    >
                      Resimler Seç
                      </label>
                    </div>
                  <div className="text-sm text-gray-500">
                    {additionalImageFiles.length > 0 
                      ? `${additionalImageFiles.length} resim seçildi` 
                      : "Henüz resim seçilmedi"}
                  </div>
                </div>
                
                {/* Ek görseller önizleme */}
                {(additionalImagePreviews.length > 0 || (selectedProduct?.additional_images && selectedProduct.additional_images.length > 0)) && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Ek Görseller Önizleme:</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {/* Yeni yüklenen resimlerin önizlemesi */}
                      {additionalImagePreviews.map((preview, index) => (
                        <div key={`new-${index}`} className="relative w-20 h-20 border border-gray-200 rounded-md overflow-hidden group bg-white">
                          <Image
                            src={preview}
                            alt={`Ek görsel ${index + 1}`}
                            fill
                            className="object-contain"
                            />
                            <button
                              type="button"
                            onClick={() => removeAdditionalImage(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      
                      {/* Mevcut ek resimlerin gösterimi (sadece düzenleme modunda) */}
                      {(selectedProduct?.additional_images && Array.isArray(selectedProduct.additional_images) && selectedProduct.additional_images.length > 0) ? (
                        <div className="col-span-4 mt-2 border-t border-gray-200 pt-2">
                          <h5 className="text-sm font-medium text-gray-700 mb-2">Mevcut Ek Görseller ({selectedProduct.additional_images.length}):</h5>
                          <div className="flex flex-wrap gap-2">
                            {selectedProduct.additional_images.map((image, index) => {
                              if (!image || typeof image !== 'string') {
                                console.error("Geçersiz resim değeri:", index, image);
                                return null;
                              }
                              return (
                                <div key={`existing-${index}`} className="relative w-20 h-20 border border-gray-200 rounded-md overflow-hidden bg-white">
                                  <Image
                                    src={getImageUrl(image)}
                                    alt={`Mevcut ek görsel ${index + 1}`}
                                    fill
                                    className="object-contain"
                                    onError={(e) => {
                                      console.error("Mevcut ek görsel yüklenemedi:", image);
                                      (e.target as HTMLImageElement).src = "/images/placeholder.jpg";
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : null}
                      </div>
                    </div>
                  )}
                </div>

              {/* Özellikler */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">
                  Ürün Özellikleri
                </label>
                
                {loadingFeatures ? (
                  <div className="text-gray-500 text-sm">Özellikler yükleniyor...</div>
                ) : availableFeatures.length === 0 ? (
                  <div className="text-gray-500 text-sm">
                    Henüz hiç özellik eklenmemiş. 
                    <Link href="/admin/ozellikler" className="text-blue-500 hover:underline ml-1">
                      Özellik eklemek için tıklayın
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 bg-white p-3 border rounded-md max-h-60 overflow-y-auto">
                    {availableFeatures.map(feature => (
                      <div key={feature.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`feature-${feature.id}`}
                          checked={formData.features.includes(feature.id)}
                          onChange={() => handleFeatureToggle(feature.id)}
                          className="mr-2 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label 
                          htmlFor={`feature-${feature.id}`}
                          className="text-sm cursor-pointer flex items-center"
                        >
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getFeatureColor(feature.name).bg} ${getFeatureColor(feature.name).text}`}
                          >
                            {feature.name}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
                
                <p className="text-gray-500 text-xs mt-1">
                  Ürün için geçerli olan özellikleri seçin.
                </p>
              </div>

              {/* Hata Mesajı */}
              {error && (
                <div className="p-2 text-red-700 bg-red-100 rounded-md">{error}</div>
              )}

              {/* Gönder Butonu */}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "İşleniyor..." : selectedProduct ? "Güncelle" : "Ekle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 