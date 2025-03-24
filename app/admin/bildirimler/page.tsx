"use client";

import { useState } from "react";
import { FaBell, FaCheckCircle, FaEye, FaTrash, FaCheck, FaFilter } from "react-icons/fa";

// Demo bildirimler
const demoNotifications = [
  {
    id: 1,
    title: "Stok Uyarısı",
    message: "Vista Premium İşitme Cihazı stok seviyesi kritik duruma geldi.",
    type: "warning",
    date: "24.03.2025 - 10:15",
    read: false
  },
  {
    id: 2,
    title: "Yeni Randevu",
    message: "Ahmet Yılmaz için 25.03.2025 tarihinde yeni bir randevu oluşturuldu.",
    type: "info",
    date: "24.03.2025 - 09:30",
    read: false
  },
  {
    id: 3,
    title: "Sipariş Onayı",
    message: "5 adet Vista Bluetooth İşitme Cihazı siparişi tedarikçi tarafından onaylandı.",
    type: "success",
    date: "23.03.2025 - 16:45",
    read: true
  },
  {
    id: 4,
    title: "Destek Talebi",
    message: "Fatma Kaya cihazı ile ilgili yeni bir destek talebi oluşturdu.",
    type: "warning",
    date: "23.03.2025 - 14:20",
    read: false
  },
  {
    id: 5,
    title: "Ödeme Bildirimi",
    message: "Ali Öztürk'ün #12345 numaralı faturası için ödeme alındı.",
    type: "success",
    date: "22.03.2025 - 11:10",
    read: true
  },
  {
    id: 6,
    title: "Hatırlatma",
    message: "Yarın saat 10:00'da Mehmet Demir'in kontrol randevusu bulunmaktadır.",
    type: "info",
    date: "22.03.2025 - 09:00",
    read: true
  },
  {
    id: 7,
    title: "Sistem Güncellemesi",
    message: "Sistem bakımı için 25.03.2025 tarihinde saat 22:00-00:00 arası hizmet verilmeyecektir.",
    type: "warning",
    date: "21.03.2025 - 15:30",
    read: true
  },
  {
    id: 8,
    title: "İşitme Testi Tamamlandı",
    message: "Ayşe Şahin'in işitme testi tamamlandı. Sonuçlar hazır.",
    type: "info",
    date: "21.03.2025 - 13:45",
    read: false
  }
];

export default function NotificationsAdmin() {
  const [notifications, setNotifications] = useState(demoNotifications);
  const [activeFilter, setActiveFilter] = useState("all"); // all, unread, read
  const [activeTypeFilter, setActiveTypeFilter] = useState("all"); // all, warning, info, success
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<number | null>(null);
  
  // Notifikasyon tipi için renk ve ikon
  const getNotificationTypeInfo = (type: string) => {
    switch(type) {
      case 'warning':
        return {
          icon: <FaBell className="text-yellow-500" />,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-400'
        };
      case 'success':
        return {
          icon: <FaCheckCircle className="text-green-500" />,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-400'
        };
      case 'info':
      default:
        return {
          icon: <FaEye className="text-blue-500" />,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-400'
        };
    }
  };
  
  // Filtreleme
  const filteredNotifications = notifications.filter(notification => {
    // Okunma durumuna göre filtrele
    if (activeFilter === "unread" && notification.read) return false;
    if (activeFilter === "read" && !notification.read) return false;
    
    // Türe göre filtrele
    if (activeTypeFilter !== "all" && notification.type !== activeTypeFilter) return false;
    
    return true;
  });
  
  // Okundu olarak işaretle
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  // Tümünü okundu olarak işaretle
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Silme onayı
  const confirmDelete = (id: number) => {
    setNotificationToDelete(id);
    setShowDeleteModal(true);
  };
  
  // Bildirimi sil
  const handleDelete = () => {
    if (notificationToDelete) {
      setNotifications(notifications.filter(notification => notification.id !== notificationToDelete));
      setShowDeleteModal(false);
      setNotificationToDelete(null);
    }
  };
  
  // Tüm bildirimleri temizle
  const clearAll = () => {
    setNotifications([]);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bildirimler</h1>
        <div className="flex space-x-2">
          <button 
            className="flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
            onClick={markAllAsRead}
          >
            <FaCheck className="mr-2" />
            Tümünü Okundu İşaretle
          </button>
          <button 
            className="flex items-center bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
            onClick={clearAll}
          >
            <FaTrash className="mr-2" />
            Tümünü Temizle
          </button>
        </div>
      </div>
      
      {/* Filtreler */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center">
          <FaFilter className="text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-700 mr-4">Filtreler:</span>
          
          <div className="space-x-2 mr-6">
            <button 
              className={`px-3 py-1 text-sm rounded-full ${activeFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setActiveFilter('all')}
            >
              Tümü
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-full ${activeFilter === 'unread' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setActiveFilter('unread')}
            >
              Okunmamış
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-full ${activeFilter === 'read' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setActiveFilter('read')}
            >
              Okunmuş
            </button>
          </div>
          
          <div className="space-x-2">
            <button 
              className={`px-3 py-1 text-sm rounded-full ${activeTypeFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setActiveTypeFilter('all')}
            >
              Tüm Türler
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-full ${activeTypeFilter === 'warning' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
              onClick={() => setActiveTypeFilter('warning')}
            >
              Uyarılar
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-full ${activeTypeFilter === 'info' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
              onClick={() => setActiveTypeFilter('info')}
            >
              Bilgiler
            </button>
            <button 
              className={`px-3 py-1 text-sm rounded-full ${activeTypeFilter === 'success' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
              onClick={() => setActiveTypeFilter('success')}
            >
              Başarılı
            </button>
          </div>
        </div>
      </div>
      
      {/* Bildirimler Listesi */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-2">
              <FaBell className="mx-auto text-5xl opacity-20" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">Bildirim Bulunmuyor</h3>
            <p className="text-sm text-gray-500 mt-1">
              Şu an için görüntülenecek bildirim yok.
            </p>
          </div>
        )}
        
        {filteredNotifications.map((notification) => {
          const typeInfo = getNotificationTypeInfo(notification.type);
          
          return (
            <div 
              key={notification.id} 
              className={`border-l-4 ${typeInfo.borderColor} ${typeInfo.bgColor} ${!notification.read ? 'bg-opacity-100' : 'bg-opacity-50'} rounded-lg shadow-sm p-4 transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="mt-1 mr-3">
                    {typeInfo.icon}
                  </div>
                  <div>
                    <h3 className={`text-base font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h3>
                    <p className={`mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {notification.date}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!notification.read && (
                    <button 
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => markAsRead(notification.id)}
                      title="Okundu olarak işaretle"
                    >
                      <FaCheck />
                    </button>
                  )}
                  <button 
                    className="text-red-500 hover:text-red-700"
                    onClick={() => confirmDelete(notification.id)}
                    title="Bildirimi sil"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Bildirimi Silmeyi Onaylayın</h3>
            <p className="text-sm text-gray-500 mb-4">
              Bu bildirimi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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