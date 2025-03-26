"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

export default function CategoryAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    parent_id: null as number | null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Sıralama için state ekleyelim
  const [sortField, setSortField] = useState<string>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Arama için state ekleyelim
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Kategorileri getir
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/categories");
      if (!response.ok) {
        throw new Error("Kategoriler getirilemedi");
      }
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Kategoriler getirilemedi:", error);
      setError("Kategoriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.");
      setCategories([{ id: 0, name: "Kategorisiz", parent_id: null }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!formData.name.trim()) {
      setError("Kategori adı boş olamaz");
      return;
    }
    
    try {
      setLoading(true);
      const url = selectedCategory 
        ? `/api/admin/categories/${selectedCategory.id}` 
        : "/api/admin/categories";
      
      const method = selectedCategory ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Kategori kaydedilirken bir hata oluştu");
      }
      
      const result = await response.json();
      
      setSuccess(selectedCategory 
        ? "Kategori başarıyla güncellendi!" 
        : "Yeni kategori başarıyla eklendi!"
      );
      
      // 1 saniye sonra modal'ı kapat ve başarı mesajını temizle
      setTimeout(() => {
        setShowModal(false);
        setSuccess("");
        fetchCategories();
        resetForm();
      }, 1000);
    } catch (error: any) {
      console.error("Kategori kaydedilirken hata:", error);
      setError(error.message || "Kategori kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    // Kategorisiz kategorisi silinemez
    if (id === 0) {
      alert("Kategorisiz kategorisi silinemez!");
      return;
    }
    
    // Önce bu kategorinin alt kategorisi var mı kontrol et
    const hasChildren = categories.some(cat => cat.parent_id === id);
    if (hasChildren) {
      alert("Bu kategoriye ait alt kategoriler var. Önce alt kategorileri silmelisiniz!");
      return;
    }
    
    if (confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/categories/${id}`, {
          method: "DELETE"
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Kategori silinemedi");
        }
        
        setSuccess("Kategori başarıyla silindi!");
        fetchCategories();
        
        // 2 saniye sonra başarı mesajını temizle
        setTimeout(() => setSuccess(""), 2000);
      } catch (error: any) {
        console.error("Kategori silinirken hata:", error);
        setError(error.message || "Kategori silinemedi. Lütfen tekrar deneyin.");
        
        // 2 saniye sonra hata mesajını temizle
        setTimeout(() => setError(""), 2000);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      parent_id: null
    });
    setSelectedCategory(null);
  };

  const handleCategoryEdit = (category: Category) => {
    // Kategorisiz kategorisi düzenlenemez
    if (category.id === 0) {
      alert("Kategorisiz kategorisi düzenlenemez!");
      return;
    }
    
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      parent_id: category.parent_id
    });
    setShowModal(true);
  };

  const getParentCategoryName = (parentId: number | null) => {
    if (parentId === null) return "Ana Kategori";
    const parent = categories.find(c => c.id === parentId);
    return parent ? parent.name : "Bilinmeyen Kategori";
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

  // Sıralanmış ve filtrelenmiş kategorileri hesapla
  const filteredAndSortedCategories = [...categories]
    // Önce arama terimine göre filtrele
    .filter(category => {
      if (!searchTerm.trim()) return true;
      
      const search = searchTerm.toLowerCase().trim();
      const name = category.name?.toLowerCase() || "";
      const parentName = getParentCategoryName(category.parent_id)?.toLowerCase() || "";
      
      return (
        name.includes(search) || 
        parentName.includes(search) || 
        (category.id?.toString() || "").includes(search)
      );
    })
    // Sonra sırala
    .sort((a, b) => {
      const fieldA = a[sortField as keyof Category];
      const fieldB = b[sortField as keyof Category];
      
      // Özel durumlar için kontrol
      if (sortField === "parent_id") {
        const parentA = getParentCategoryName(a.parent_id);
        const parentB = getParentCategoryName(b.parent_id);
        
        if (sortDirection === "asc") {
          return parentA.localeCompare(parentB);
        } else {
          return parentB.localeCompare(parentA);
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
        if (fieldA === null) return sortDirection === "asc" ? -1 : 1;
        if (fieldB === null) return sortDirection === "asc" ? 1 : -1;
        
        if (sortDirection === "asc") {
          return fieldA > fieldB ? 1 : -1;
        } else {
          return fieldA < fieldB ? 1 : -1;
        }
      }
    });

  // Kategorileri hiyerarşik olarak görüntüle
  const mainCategories = categories.filter(cat => cat.parent_id === null);
  
  return (
    <div className="p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800">Kategori Yönetimi</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
          disabled={loading}
        >
          <FaPlus /> Yeni Kategori
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
            placeholder="Kategori ara... (Ad, üst kategori veya ID)"
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

      {/* Kategori Listesi */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading && (
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
                  onClick={() => handleSort("name")}
                >
                  Kategori Adı {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th 
                  className="py-3 px-4 text-left text-gray-700 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("parent_id")}
                >
                  Üst Kategori {sortField === "parent_id" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
                <th className="py-3 px-4 text-right text-gray-700">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCategories.map((category) => (
                <tr key={category.id} className="border-t border-gray-200">
                  <td className="py-3 px-4 text-gray-800">{category.id}</td>
                  <td className="py-3 px-4 text-gray-800 font-medium">
                    {category.name}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {getParentCategoryName(category.parent_id)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleCategoryEdit(category)}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        disabled={category.id === 0 || loading}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        disabled={category.id === 0 || loading}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    Henüz kategori bulunmuyor.
                  </td>
                </tr>
              )}
              {categories.length > 0 && filteredAndSortedCategories.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    Arama kriterine uyan kategori bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Kategori Ekleme/Düzenleme Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
              {selectedCategory ? "Kategori Düzenle" : "Yeni Kategori Ekle"}
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Kategori Adı</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">Üst Kategori</label>
                  <select
                    value={formData.parent_id === null ? "" : formData.parent_id}
                    onChange={(e) => setFormData({
                      ...formData, 
                      parent_id: e.target.value === "" ? null : parseInt(e.target.value)
                    })}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                    disabled={loading}
                  >
                    <option value="">Ana Kategori (Üst kategori yok)</option>
                    {categories
                      .filter(cat => cat.parent_id === null && cat.id !== (selectedCategory?.id || -1))
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
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
                    selectedCategory ? "Güncelle" : "Kaydet"
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