"use client";

import { useEffect } from "react";
import { FaUsers, FaNewspaper, FaPhoneAlt, FaImage } from "react-icons/fa";

export default function Dashboard() {
  useEffect(() => {
    // Admin girişi yapıldığında localStorage'a kaydet (basit demo için)
    localStorage.setItem("adminLoggedIn", "true");
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Gösterge Paneli</h1>
      
      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500 mr-4">
              <FaUsers className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Ziyaretçiler</p>
              <p className="text-2xl font-bold text-gray-700">1,254</p>
            </div>
          </div>
          <p className="text-sm text-green-500 mt-4">↑ 12% geçen haftaya göre</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500 mr-4">
              <FaNewspaper className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Blog Yazıları</p>
              <p className="text-2xl font-bold text-gray-700">24</p>
            </div>
          </div>
          <p className="text-sm text-green-500 mt-4">↑ 2 yeni yazı bu ay</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500 mr-4">
              <FaPhoneAlt className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">İletişim Formları</p>
              <p className="text-2xl font-bold text-gray-700">8</p>
            </div>
          </div>
          <p className="text-sm text-red-500 mt-4">↓ 3 okunmamış mesaj</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-500 mr-4">
              <FaImage className="text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Galeri Resimleri</p>
              <p className="text-2xl font-bold text-gray-700">36</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Son güncelleme: 2 gün önce</p>
        </div>
      </div>
      
      {/* Son Aktiviteler */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Son Aktiviteler</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">24.03.2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Yeni blog yazısı eklendi</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Admin</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Tamamlandı
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">23.03.2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">İletişim formu cevaplandı</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Admin</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Tamamlandı
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">22.03.2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Galeri resmi eklendi</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Admin</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Tamamlandı
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">20.03.2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Sistem güncellemesi</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sistem</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    İşleniyor
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Hızlı Erişim Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Blog Yazısı Ekle</h3>
          <p className="text-gray-600 mb-4">Sitenize yeni bir blog yazısı ekleyin.</p>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            Yazı Ekle
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Galeri Güncelle</h3>
          <p className="text-gray-600 mb-4">Galeri bölümüne yeni resimler ekleyin.</p>
          <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
            Galeriye Git
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Mesajları Kontrol Et</h3>
          <p className="text-gray-600 mb-4">Okunmamış iletişim formlarını inceleyin.</p>
          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Mesajlara Git
          </button>
        </div>
      </div>
    </div>
  );
} 