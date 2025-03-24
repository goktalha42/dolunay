"use client";

import { useState } from "react";
import { FaPlus, FaEdit, FaSearch, FaBoxOpen, FaArrowUp, FaArrowDown } from "react-icons/fa";

// Demo stok hareketleri
const demoStockMovements = [
  {
    id: 1,
    productId: 1,
    productName: "Vista Bluetooth İşitme Cihazı Model V1",
    type: "Giriş",
    quantity: 5,
    date: "24.03.2025",
    user: "Admin"
  },
  {
    id: 2,
    productId: 2,
    productName: "Vista Kulak İçi İşitme Cihazı",
    type: "Çıkış",
    quantity: 2,
    date: "23.03.2025",
    user: "Admin"
  },
  {
    id: 3,
    productId: 3,
    productName: "İşitme Cihazı Bakım Kiti",
    type: "Giriş",
    quantity: 15,
    date: "22.03.2025",
    user: "Admin"
  },
  {
    id: 4,
    productId: 4,
    productName: "İşitme Cihazı Pili (6'lı Paket)",
    type: "Giriş",
    quantity: 50,
    date: "21.03.2025",
    user: "Admin"
  },
  {
    id: 5,
    productId: 1,
    productName: "Vista Bluetooth İşitme Cihazı Model V1",
    type: "Çıkış",
    quantity: 1,
    date: "20.03.2025",
    user: "Admin"
  },
  {
    id: 6,
    productId: 5,
    productName: "Vista Premium İşitme Cihazı",
    type: "Giriş",
    quantity: 3,
    date: "19.03.2025",
    user: "Admin"
  }
];

// Demo kritik stok ürünleri
const demoLowStockProducts = [
  {
    id: 5,
    name: "Vista Premium İşitme Cihazı",
    stock: 4,
    minStock: 5
  },
  {
    id: 2,
    name: "Vista Kulak İçi İşitme Cihazı",
    stock: 8,
    minStock: 10
  },
  {
    id: 6,
    name: "Kulak Kalıbı",
    stock: 0,
    minStock: 5
  }
];

export default function StocksAdmin() {
  const [movements, setMovements] = useState(demoStockMovements);
  const [lowStockProducts, setLowStockProducts] = useState(demoLowStockProducts);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMovements = movements.filter(movement => 
    movement.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movement.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movement.date.includes(searchTerm)
  );

  // İstatistikler
  const totalIncoming = movements.filter(m => m.type === "Giriş").reduce((sum, m) => sum + m.quantity, 0);
  const totalOutgoing = movements.filter(m => m.type === "Çıkış").reduce((sum, m) => sum + m.quantity, 0);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Stok Yönetimi</h1>
        <button className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          <FaPlus className="mr-2" />
          Stok Hareketi Ekle
        </button>
      </div>
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <FaBoxOpen className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Toplam Hareket</p>
              <p className="text-2xl font-bold text-gray-700">{movements.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <FaArrowUp className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Toplam Giriş</p>
              <p className="text-2xl font-bold text-gray-700">{totalIncoming}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-500 mr-4">
              <FaArrowDown className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Toplam Çıkış</p>
              <p className="text-2xl font-bold text-gray-700">{totalOutgoing}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Kritik Stok Uyarısı */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Dikkat:</strong> {lowStockProducts.length} ürünün stok seviyesi kritik durumda.
            </p>
          </div>
        </div>
      </div>
      
      {/* Stok Hareketleri ve Kritik Stok */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stok Hareketleri Tablosu */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Son Stok Hareketleri</h2>
              <div className="mt-4 flex items-center relative">
                <input
                  type="text"
                  placeholder="Hareket ara..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 text-gray-400" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ürün</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tür</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miktar</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMovements.map((movement) => (
                    <tr key={movement.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{movement.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{movement.productName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${movement.type === "Giriş" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {movement.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{movement.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{movement.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-blue-500 hover:text-blue-700">
                          <FaEdit />
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredMovements.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        Sonuç bulunamadı
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Kritik Stok Ürünleri */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Kritik Stok Ürünleri</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Min. Stok: {product.minStock} | Mevcut: {product.stock}
                      </p>
                    </div>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${product.stock === 0 ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                      {product.stock === 0 ? "Tükendi" : "Kritik"}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${product.stock === 0 ? "bg-red-500" : "bg-yellow-500"}`} 
                        style={{ width: `${Math.min(100, (product.stock / product.minStock) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              
              {lowStockProducts.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  Kritik stok seviyesinde ürün bulunmuyor
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 