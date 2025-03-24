"use client";

import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBoxOpen } from "react-icons/fa";

// Demo ürünler
const demoProducts = [
  {
    id: 1,
    name: "Vista Bluetooth İşitme Cihazı Model V1",
    category: "İşitme Cihazları",
    price: 12500,
    stock: 15,
    status: "Aktif"
  },
  {
    id: 2,
    name: "Vista Kulak İçi İşitme Cihazı",
    category: "İşitme Cihazları",
    price: 8750,
    stock: 8,
    status: "Aktif"
  },
  {
    id: 3,
    name: "İşitme Cihazı Bakım Kiti",
    category: "Aksesuarlar",
    price: 450,
    stock: 45,
    status: "Aktif"
  },
  {
    id: 4,
    name: "İşitme Cihazı Pili (6'lı Paket)",
    category: "Sarf Malzemeleri",
    price: 120,
    stock: 200,
    status: "Aktif"
  },
  {
    id: 5,
    name: "Vista Premium İşitme Cihazı",
    category: "İşitme Cihazları",
    price: 18900,
    stock: 4,
    status: "Sınırlı"
  },
  {
    id: 6,
    name: "Kulak Kalıbı",
    category: "Aksesuarlar",
    price: 350,
    stock: 0,
    status: "Tükendi"
  }
];

export default function ProductsAdmin() {
  const [products, setProducts] = useState(demoProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setSelectedProductId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedProductId) {
      const updatedProducts = products.filter(product => product.id !== selectedProductId);
      setProducts(updatedProducts);
      setShowDeleteModal(false);
      setSelectedProductId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ürün Yönetimi</h1>
        <button className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          <FaPlus className="mr-2" />
          Yeni Ürün
        </button>
      </div>
      
      {/* Arama ve Filtreleme */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center relative">
          <input
            type="text"
            placeholder="Ürün ara..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 text-gray-400" />
        </div>
      </div>
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <FaBoxOpen className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Toplam Ürün</p>
              <p className="text-2xl font-bold text-gray-700">{products.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <FaBoxOpen className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Aktif Ürünler</p>
              <p className="text-2xl font-bold text-gray-700">
                {products.filter(p => p.status === "Aktif").length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-500 mr-4">
              <FaBoxOpen className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Tükenen Ürünler</p>
              <p className="text-2xl font-bold text-gray-700">
                {products.filter(p => p.status === "Tükendi").length}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ürün Listesi */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fiyat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.price.toLocaleString('tr-TR')} ₺</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${product.status === "Aktif" ? "bg-green-100 text-green-800" : 
                        product.status === "Sınırlı" ? "bg-yellow-100 text-yellow-800" : 
                        "bg-red-100 text-red-800"}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <FaEdit />
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(product.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    Sonuç bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ürünü Sil</h3>
            <p className="text-gray-600 mb-6">
              Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                İptal
              </button>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                onClick={confirmDelete}
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 