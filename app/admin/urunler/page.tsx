"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaImage } from "react-icons/fa";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  short_description: string;
  category_id: number;
  segment: "başlangıç" | "orta" | "üst";
  main_image: string;
  features: string[];
  additional_images: string[];
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
  segment: "başlangıç" | "orta" | "üst";
  main_image: File | null;
  features: string[];
  additional_images: File[];
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    title: "",
    short_description: "",
    category_id: 0,
    segment: "orta",
    main_image: null,
    features: [""],
    additional_images: []
  });

  // Ürünleri getir
  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/admin/products");
      if (!response.ok) {
        throw new Error('Ürünler getirilemedi');
      }
      const data = await response.json();
      // API'den gelen veriyi kontrol ediyoruz
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Ürünler yüklenirken hata:", error);
      setProducts([]); // Hata durumunda boş array
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
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "features") {
        formDataToSend.append(key, JSON.stringify(value));
      } else if (key === "additional_images") {
        Array.from(value as File[]).forEach((file) => {
          formDataToSend.append("additional_images", file);
        });
      } else if (key === "main_image" && value) {
        formDataToSend.append(key, value as File);
      } else {
        formDataToSend.append(key, value as string);
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
      }
    } catch (error) {
      console.error("Ürün kaydedilirken hata:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
      try {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchProducts();
        }
      } catch (error) {
        console.error("Ürün silinirken hata:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      short_description: "",
      category_id: 0,
      segment: "orta",
      main_image: null,
      features: [""],
      additional_images: []
    });
    setSelectedProduct(null);
  };

  const handleProductEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      title: product.title,
      short_description: product.short_description,
      category_id: product.category_id,
      segment: product.segment,
      main_image: null,
      features: product.features,
      additional_images: []
    });
    setShowModal(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Ürün Yönetimi</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Yeni Ürün
        </button>
      </div>

      {/* Ürün Listesi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="relative h-48 mb-4">
              <Image
                src={product.main_image}
                alt={product.title}
                fill
                className="object-contain rounded-lg"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{product.short_description}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleProductEdit(product)}
                className="text-blue-600 hover:text-blue-800"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="text-red-600 hover:text-red-800"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ürün Ekleme/Düzenleme Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {selectedProduct ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ürün Adı</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full border rounded-lg p-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Kısa Açıklama</label>
                  <textarea
                    value={formData.short_description}
                    onChange={(e) => setFormData({...formData, short_description: e.target.value})}
                    className="w-full border rounded-lg p-2"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Kategori</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({...formData, category_id: parseInt(e.target.value)})}
                    className="w-full border rounded-lg p-2"
                    required
                  >
                    <option value={0}>Kategori Seçin</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Segment</label>
                  <select
                    value={formData.segment}
                    onChange={(e) => setFormData({...formData, segment: e.target.value as any})}
                    className="w-full border rounded-lg p-2"
                    required
                  >
                    <option value="başlangıç">Başlangıç Segmenti</option>
                    <option value="orta">Orta Segment</option>
                    <option value="üst">Üst Segment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ana Resim</label>
                  <input
                    type="file"
                    onChange={(e) => setFormData({...formData, main_image: e.target.files?.[0] || null})}
                    className="w-full border rounded-lg p-2"
                    accept="image/*"
                    required={!selectedProduct}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ek Resimler</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => setFormData({...formData, additional_images: Array.from(e.target.files || [])})}
                    className="w-full border rounded-lg p-2"
                    accept="image/*"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Özellikler</label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...formData.features];
                          newFeatures[index] = e.target.value;
                          setFormData({...formData, features: newFeatures});
                        }}
                        className="flex-1 border rounded-lg p-2"
                        placeholder="Ürün özelliği"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newFeatures = formData.features.filter((_, i) => i !== index);
                          setFormData({...formData, features: newFeatures});
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, features: [...formData.features, ""]})}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    + Özellik Ekle
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  {selectedProduct ? "Güncelle" : "Kaydet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 