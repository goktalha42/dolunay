"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaImage } from "react-icons/fa";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  short_description: string;
  category_id: number;
  segment: string;
  main_image: string;
  additional_images: string[];
  features: string[];
}

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

interface FormDataType {
  title: string;
  short_description: string;
  category_id: number;
  segment: string;
  main_image: string;
  additional_images: string[];
  features: string[];
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    short_description: "",
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

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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
        formDataToSend.append(key, JSON.stringify(value));
      } else if (key !== "main_image" && key !== "additional_images") {
        // Resim yolları form data'dan çıkarılıyor, bunun yerine dosyalar gönderilecek
        formDataToSend.append(key, String(value));
      }
    });
    
    // Ana resim dosyasını ekle
    if (mainImageFile) {
      formDataToSend.append("main_image_file", mainImageFile);
    }
    
    // Ek resim dosyalarını ekle
    additionalImageFiles.forEach(file => {
      formDataToSend.append("additional_image_files", file);
    });
    
    // Güncelleme yaparken mevcut ek resimleri koru
    if (selectedProduct && selectedProduct.additional_images && selectedProduct.additional_images.length > 0) {
      formDataToSend.append("keep_existing_additional_images", "true");
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
        const error = await response.json();
        throw new Error(error.error || 'Bir hata oluştu');
      }
    } catch (error: any) {
      console.error("Ürün kaydedilirken hata:", error);
      setError(error.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
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
      }
    } catch (error: any) {
      console.error("Ürün silinirken hata:", error);
      setError(error.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      short_description: "",
      category_id: 0,
      segment: "başlangıç",
      main_image: "",
      additional_images: [],
      features: [],
    });
    setSelectedProduct(null);
    setMainImageFile(null);
    setAdditionalImageFiles([]);
    setMainImagePreview("");
    setAdditionalImagePreviews([]);
  };

  const handleProductEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      title: product.title,
      short_description: product.short_description || "",
      category_id: product.category_id || 0,
      segment: product.segment || "başlangıç",
      main_image: product.main_image || "",
      additional_images: product.additional_images || [],
      features: product.features || [],
    });
    setShowModal(true);
  };

  const getCategoryName = (categoryId: number): string => {
    if (!categories || !Array.isArray(categories)) {
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

  // Ana görsel sil fonksiyonu
  const removeMainImage = () => {
    setMainImageFile(null);
    setMainImagePreview("");
    if (selectedProduct) {
      // Ürün düzenleme modundayken ana görseli sil
      // Bu işlemle görsel yolu yerine default.jpg kullanılacak
      setFormData({
        ...formData,
        main_image: "/images/products/default.jpg"
      });
    }
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
                <th className="py-3 px-4 text-left text-gray-700">ID</th>
                <th className="py-3 px-4 text-left text-gray-700">Ürün Adı</th>
                <th className="py-3 px-4 text-left text-gray-700">Kategori</th>
                <th className="py-3 px-4 text-right text-gray-700">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-gray-200">
                  <td className="py-3 px-4 text-gray-800">{product.id}</td>
                  <td className="py-3 px-4 text-gray-800 font-medium">{product.title}</td>
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
                  Ürün Açıklaması
                </label>
                <textarea
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  rows={3}
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
                      onChange={(e) => handleFileChange(e, 'main_image')}
                      accept="image/*"
                      className="sr-only"
                      id="main-image-upload"
                    />
                    <label
                      htmlFor="main-image-upload"
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
                {(mainImagePreview || selectedProduct?.main_image) && (
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
                        src={mainImagePreview || selectedProduct?.main_image || "/images/placeholder.jpg"}
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
                      {selectedProduct?.additional_images && selectedProduct.additional_images.length > 0 && 
                       additionalImagePreviews.length === 0 && 
                       selectedProduct.additional_images.map((image, index) => (
                        <div key={`existing-${index}`} className="relative w-20 h-20 border border-gray-200 rounded-md overflow-hidden bg-white">
                          <Image
                            src={image}
                            alt={`Mevcut ek görsel ${index + 1}`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Özellikler */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Özellikler
                </label>
                <div className="space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const updatedFeatures = [...formData.features];
                          updatedFeatures[index] = e.target.value;
                          setFormData({ ...formData, features: updatedFeatures });
                        }}
                        className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-800"
                        placeholder="Örn: Su geçirmez"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedFeatures = [...formData.features];
                          updatedFeatures.splice(index, 1);
                          setFormData({ ...formData, features: updatedFeatures });
                        }}
                        className="ml-2 p-2 text-red-600 hover:text-red-800"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                    className="py-1 px-3 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                  >
                    + Özellik Ekle
                  </button>
                </div>
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