"use client";

import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUsers, FaUserPlus, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

// Demo müşteri listesi
const demoCustomers = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    phone: "0532 123 4567",
    email: "ahmet.yilmaz@example.com",
    address: "Kadıköy, İstanbul",
    lastPurchase: "24.03.2025",
    totalPurchases: 3250
  },
  {
    id: 2,
    name: "Fatma Kaya",
    phone: "0533 765 4321",
    email: "fatma.kaya@example.com",
    address: "Keçiören, Ankara",
    lastPurchase: "15.03.2025",
    totalPurchases: 5100
  },
  {
    id: 3,
    name: "Mehmet Demir",
    phone: "0535 987 6543",
    email: "mehmet.demir@example.com",
    address: "Bornova, İzmir",
    lastPurchase: "10.03.2025",
    totalPurchases: 2850
  },
  {
    id: 4,
    name: "Ayşe Şahin",
    phone: "0537 456 7890",
    email: "ayse.sahin@example.com",
    address: "Beyoğlu, İstanbul",
    lastPurchase: "05.03.2025",
    totalPurchases: 4200
  },
  {
    id: 5,
    name: "Ali Öztürk",
    phone: "0539 234 5678",
    email: "ali.ozturk@example.com",
    address: "Çankaya, Ankara",
    lastPurchase: "01.03.2025",
    totalPurchases: 3800
  },
  {
    id: 6,
    name: "Zeynep Aydın",
    phone: "0531 876 5432",
    email: "zeynep.aydin@example.com",
    address: "Konak, İzmir",
    lastPurchase: "27.02.2025",
    totalPurchases: 1950
  }
];

export default function CustomersAdmin() {
  const [customers, setCustomers] = useState(demoCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<number | null>(null);
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.address.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const confirmDelete = (customerId: number) => {
    setCustomerToDelete(customerId);
    setShowDeleteModal(true);
  };
  
  const handleDelete = () => {
    if (customerToDelete) {
      setCustomers(customers.filter(customer => customer.id !== customerToDelete));
      setShowDeleteModal(false);
      setCustomerToDelete(null);
    }
  };
  
  const totalCustomerValue = customers.reduce((sum, customer) => sum + customer.totalPurchases, 0);
  const averagePurchaseValue = totalCustomerValue / customers.length;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Müşteri Yönetimi</h1>
        <button className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          <FaPlus className="mr-2" />
          Yeni Müşteri Ekle
        </button>
      </div>
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <FaUsers className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Toplam Müşteri</p>
              <p className="text-2xl font-bold text-gray-700">{customers.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <FaUserPlus className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Toplam Değer</p>
              <p className="text-2xl font-bold text-gray-700">{totalCustomerValue} ₺</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <FaUsers className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Ort. Müşteri Değeri</p>
              <p className="text-2xl font-bold text-gray-700">{averagePurchaseValue.toFixed(0)} ₺</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Müşteri Tablosu */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Müşteri Listesi</h2>
          <div className="mt-4 flex items-center relative">
            <input
              type="text"
              placeholder="Müşteri ara..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Müşteri Bilgisi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İletişim</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Son Alışveriş</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Toplam Alışveriş</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{customer.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 flex items-center mb-1">
                      <FaPhoneAlt className="text-gray-400 mr-2" size={12} /> {customer.phone}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <FaEnvelope className="text-gray-400 mr-2" size={12} /> {customer.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.lastPurchase}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{customer.totalPurchases} ₺</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <button className="text-blue-500 hover:text-blue-700" title="Düzenle">
                        <FaEdit />
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700" 
                        title="Sil"
                        onClick={() => confirmDelete(customer.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredCustomers.length === 0 && (
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
      
      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Müşteriyi Silmeyi Onaylayın</h3>
            <p className="text-sm text-gray-500 mb-4">
              Bu müşteriyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                İptal
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={handleDelete}
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