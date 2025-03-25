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
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "additional_images" || key === "features") {
        formDataToSend.append(key, JSON.stringify(value));
      } else {
        formDataToSend.append(key, String(value));
      }
    });
    
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
      // Ana görsel için dosya ismini kullan
      const file = e.target.files[0];
      setFormData({
        ...formData,
        main_image: `/images/products/${file.name}`,
      });
    } else if (field === 'additional_images') {
      // Ek görseller için tüm dosya isimlerini kullan
      const fileNames = Array.from(e.target.files).map(file => `/images/products/${file.name}`);
      setFormData({
        ...formData,
        additional_images: [...formData.additional_images, ...fileNames],
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              {selectedProduct ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
            </h2>

            {/* Form içi hata mesajı */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {/* Form içi başarı mesajı */}
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Ürün Adı</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Kategori</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: parseInt(e.target.value)})}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                    disabled={loading}
                  >
                    <option value="0">Kategorisiz</option>
                    {categories
                      .filter(cat => cat.id !== 0)
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Kısa Açıklama</label>
                  <textarea
                    value={formData.short_description}
                    onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                    rows={3}
                    disabled={loading}
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Segment</label>
                  <select
                    value={formData.segment}
                    onChange={(e) => setFormData({...formData, segment: e.target.value})}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                    disabled={loading}
                  >
                    <option value="başlangıç">Başlangıç Segmenti</option>
                    <option value="orta">Orta Segment</option>
                    <option value="üst">Üst Segment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Ana Görsel</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.main_image}
                      onChange={(e) => setFormData({...formData, main_image: e.target.value})}
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                      placeholder="/images/products/ornek.jpg"
                      disabled={loading}
                    />
                    <div className="relative">
                      <label className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 cursor-pointer flex items-center">
                        <span>Gözat</span>
                        <input
                          type="file"
                          onChange={(e) => handleFileChange(e, 'main_image')}
                          className="absolute inset-0 opacity-0 w-full cursor-pointer"
                          accept="image/*"
                          disabled={loading}
                        />
                      </label>
                    </div>
                  </div>
                  {formData.main_image && (
                    <div className="mt-2 p-2 border rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500 mb-1">Seçilen görsel:</p>
                      <div className="h-16 overflow-hidden">
                        <img
                          src={formData.main_image}
                          alt="Ana görsel önizleme"
                          className="h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "/images/no-image.png";
                            e.currentTarget.onerror = null;
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Ek Görseller</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={Array.isArray(formData.additional_images) ? formData.additional_images.join(', ') : ''}
                      onChange={(e) => 
                        setFormData({
                          ...formData, 
                          additional_images: e.target.value.split(',').map(img => img.trim()).filter(Boolean)
                        })
                      }
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                      placeholder="/images/products/ornek1.jpg, /images/products/ornek2.jpg"
                      disabled={loading}
                    />
                    <div className="relative">
                      <label className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 cursor-pointer flex items-center">
                        <span>Gözat</span>
                        <input
                          type="file"
                          multiple
                          onChange={(e) => handleFileChange(e, 'additional_images')}
                          className="absolute inset-0 opacity-0 w-full cursor-pointer"
                          accept="image/*"
                          disabled={loading}
                        />
                      </label>
                    </div>
                  </div>
                  {formData.additional_images.length > 0 && (
                    <div className="mt-2 p-2 border rounded-lg bg-gray-50">
                      <p className="text-xs text-gray-500 mb-1">Ek görseller ({formData.additional_images.length}):</p>
                      <div className="flex gap-2 overflow-x-auto py-1">
                        {formData.additional_images.map((img, idx) => (
                          <div key={idx} className="h-12 w-12 flex-shrink-0 relative group">
                            <img
                              src={img}
                              alt={`Görsel ${idx + 1}`}
                              className="h-full w-full object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.src = "/images/no-image.png";
                                e.currentTarget.onerror = null;
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newImages = [...formData.additional_images];
                                newImages.splice(idx, 1);
                                setFormData({...formData, additional_images: newImages});
                              }}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100"
                              disabled={loading}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2 text-gray-700">Özellikler</label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...formData.features];
                            newFeatures[index] = e.target.value;
                            setFormData({...formData, features: newFeatures});
                          }}
                          className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                          placeholder="Ürün özelliği"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newFeatures = [...formData.features];
                            newFeatures.splice(index, 1);
                            setFormData({...formData, features: newFeatures});
                          }}
                          className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200"
                          disabled={loading}
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({...formData, features: [...formData.features, '']});
                      }}
                      className="bg-blue-100 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-200 flex items-center gap-1 text-sm"
                      disabled={loading}
                    >
                      <FaPlus size={12} /> Özellik Ekle
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  disabled={loading}
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-lg text-white ${
                    loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                      İşleniyor...
                    </span>
                  ) : (
                    selectedProduct ? "Güncelle" : "Kaydet"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 