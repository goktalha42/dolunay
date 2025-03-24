"use client";

import { useState } from "react";
import { FaSave, FaUser, FaLock, FaBuilding, FaGlobe, FaBell, FaPalette } from "react-icons/fa";

export default function SettingsAdmin() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  
  // Form durumları
  const [profileForm, setProfileForm] = useState({
    name: "Admin Kullanıcı",
    email: "admin@example.com",
    phone: "0532 123 4567",
    position: "Sistem Yöneticisi"
  });
  
  const [companyForm, setCompanyForm] = useState({
    name: "Dolunay İşitme Merkezi",
    address: "Örnek Mahallesi, Atatürk Caddesi No:123, Kadıköy/İstanbul",
    phone: "0216 123 4567",
    email: "info@dolunayisitme.com",
    taxId: "1234567890",
    website: "www.dolunayisitme.com"
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    stockAlerts: true,
    appointmentReminders: true,
    supportTickets: true,
    systemUpdates: false
  });
  
  const [uiSettings, setUiSettings] = useState({
    theme: "light",
    sidebarCollapsed: false,
    denseMode: false
  });
  
  // Form gönderim işlemi
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    
    // Başarılı kaydetmeden sonra bildirimi 3 saniye göster
    setTimeout(() => {
      setSaved(false);
    }, 3000);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Ayarlar</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4">
          {/* Sol Menü */}
          <div className="bg-gray-50 p-4 md:p-6 border-r border-gray-200">
            <nav className="space-y-1">
              <button
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                  activeTab === "profile" ? "bg-gray-800 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("profile")}
              >
                <FaUser className="mr-3" />
                <span>Profil Ayarları</span>
              </button>
              
              <button
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                  activeTab === "security" ? "bg-gray-800 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("security")}
              >
                <FaLock className="mr-3" />
                <span>Güvenlik</span>
              </button>
              
              <button
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                  activeTab === "company" ? "bg-gray-800 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("company")}
              >
                <FaBuilding className="mr-3" />
                <span>Şirket Bilgileri</span>
              </button>
              
              <button
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                  activeTab === "notifications" ? "bg-gray-800 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("notifications")}
              >
                <FaBell className="mr-3" />
                <span>Bildirim Ayarları</span>
              </button>
              
              <button
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                  activeTab === "appearance" ? "bg-gray-800 text-white" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab("appearance")}
              >
                <FaPalette className="mr-3" />
                <span>Görünüm</span>
              </button>
            </nav>
          </div>
          
          {/* İçerik Alanı */}
          <div className="col-span-3 p-6">
            {/* Kaydetme Bildirimi */}
            {saved && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Ayarlarınız başarıyla kaydedildi.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Profil Ayarları */}
            {activeTab === "profile" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Profil Ayarları</h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ad Soyad</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2 border"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2 border"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Telefon</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2 border"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pozisyon</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2 border"
                        value={profileForm.position}
                        onChange={(e) => setProfileForm({...profileForm, position: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <FaSave className="mr-2" />
                      Kaydet
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Güvenlik */}
            {activeTab === "security" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Güvenlik Ayarları</h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Mevcut Şifre</label>
                      <input
                        type="password"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2 border"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Yeni Şifre</label>
                      <input
                        type="password"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2 border"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Yeni Şifre (Tekrar)</label>
                      <input
                        type="password"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2 border"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <FaSave className="mr-2" />
                      Kaydet
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Şirket Bilgileri */}
            {activeTab === "company" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Şirket Bilgileri</h2>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Şirket Adı</label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2 border"
                        value={companyForm.name}
                        onChange={(e) => setCompanyForm({...companyForm, name: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Adres</label>
                      <textarea
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2 border"
                        value={companyForm.address}
                        onChange={(e) => setCompanyForm({...companyForm, address: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Telefon</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2 border"
                          value={companyForm.phone}
                          onChange={(e) => setCompanyForm({...companyForm, phone: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2 border"
                          value={companyForm.email}
                          onChange={(e) => setCompanyForm({...companyForm, email: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Vergi No</label>
                        <input
                          type="text"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2 border"
                          value={companyForm.taxId}
                          onChange={(e) => setCompanyForm({...companyForm, taxId: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Web Sitesi</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                            <FaGlobe />
                          </span>
                          <input
                            type="text"
                            className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm p-2 border"
                            value={companyForm.website}
                            onChange={(e) => setCompanyForm({...companyForm, website: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <FaSave className="mr-2" />
                      Kaydet
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Bildirim Ayarları */}
            {activeTab === "notifications" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Bildirim Ayarları</h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="emailNotifications"
                          type="checkbox"
                          className="focus:ring-gray-500 h-4 w-4 text-gray-800 border-gray-300 rounded"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="emailNotifications" className="font-medium text-gray-700">E-posta Bildirimleri</label>
                        <p className="text-gray-500">Tüm güncellemeler ve bildirimler için e-posta alın.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="stockAlerts"
                          type="checkbox"
                          className="focus:ring-gray-500 h-4 w-4 text-gray-800 border-gray-300 rounded"
                          checked={notificationSettings.stockAlerts}
                          onChange={(e) => setNotificationSettings({...notificationSettings, stockAlerts: e.target.checked})}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="stockAlerts" className="font-medium text-gray-700">Stok Uyarıları</label>
                        <p className="text-gray-500">Stok seviyesi kritik duruma geldiğinde bildirim alın.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="appointmentReminders"
                          type="checkbox"
                          className="focus:ring-gray-500 h-4 w-4 text-gray-800 border-gray-300 rounded"
                          checked={notificationSettings.appointmentReminders}
                          onChange={(e) => setNotificationSettings({...notificationSettings, appointmentReminders: e.target.checked})}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="appointmentReminders" className="font-medium text-gray-700">Randevu Hatırlatmaları</label>
                        <p className="text-gray-500">Yaklaşan randevular için hatırlatma alın.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="supportTickets"
                          type="checkbox"
                          className="focus:ring-gray-500 h-4 w-4 text-gray-800 border-gray-300 rounded"
                          checked={notificationSettings.supportTickets}
                          onChange={(e) => setNotificationSettings({...notificationSettings, supportTickets: e.target.checked})}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="supportTickets" className="font-medium text-gray-700">Destek Talepleri</label>
                        <p className="text-gray-500">Yeni destek talepleri olduğunda bildirim alın.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="systemUpdates"
                          type="checkbox"
                          className="focus:ring-gray-500 h-4 w-4 text-gray-800 border-gray-300 rounded"
                          checked={notificationSettings.systemUpdates}
                          onChange={(e) => setNotificationSettings({...notificationSettings, systemUpdates: e.target.checked})}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="systemUpdates" className="font-medium text-gray-700">Sistem Güncellemeleri</label>
                        <p className="text-gray-500">Sistem güncellemeleri ve bakım bildirimleri alın.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <FaSave className="mr-2" />
                      Kaydet
                    </button>
                  </div>
                </form>
              </div>
            )}
            
            {/* Görünüm */}
            {activeTab === "appearance" && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Görünüm Ayarları</h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                      <div className="grid grid-cols-3 gap-4">
                        <div 
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${uiSettings.theme === 'light' ? 'border-gray-800 bg-gray-50' : 'border-gray-200 hover:bg-gray-50'}`}
                          onClick={() => setUiSettings({...uiSettings, theme: 'light'})}
                        >
                          <div className="h-10 bg-white border border-gray-200 rounded mb-2"></div>
                          <div className="text-sm font-medium text-center">Açık</div>
                        </div>
                        
                        <div 
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${uiSettings.theme === 'dark' ? 'border-gray-800 bg-gray-50' : 'border-gray-200 hover:bg-gray-50'}`}
                          onClick={() => setUiSettings({...uiSettings, theme: 'dark'})}
                        >
                          <div className="h-10 bg-gray-800 border border-gray-700 rounded mb-2"></div>
                          <div className="text-sm font-medium text-center">Koyu</div>
                        </div>
                        
                        <div 
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${uiSettings.theme === 'system' ? 'border-gray-800 bg-gray-50' : 'border-gray-200 hover:bg-gray-50'}`}
                          onClick={() => setUiSettings({...uiSettings, theme: 'system'})}
                        >
                          <div className="h-10 bg-gradient-to-r from-white to-gray-800 border border-gray-200 rounded mb-2"></div>
                          <div className="text-sm font-medium text-center">Sistem</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="sidebarCollapsed"
                            type="checkbox"
                            className="focus:ring-gray-500 h-4 w-4 text-gray-800 border-gray-300 rounded"
                            checked={uiSettings.sidebarCollapsed}
                            onChange={(e) => setUiSettings({...uiSettings, sidebarCollapsed: e.target.checked})}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="sidebarCollapsed" className="font-medium text-gray-700">Kenar Çubuğunu Daralt</label>
                          <p className="text-gray-500">Kenar çubuğunu varsayılan olarak daraltılmış göster.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="denseMode"
                            type="checkbox"
                            className="focus:ring-gray-500 h-4 w-4 text-gray-800 border-gray-300 rounded"
                            checked={uiSettings.denseMode}
                            onChange={(e) => setUiSettings({...uiSettings, denseMode: e.target.checked})}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="denseMode" className="font-medium text-gray-700">Sıkışık Mod</label>
                          <p className="text-gray-500">Daha fazla içeriği ekranda görmek için boşlukları azalt.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      <FaSave className="mr-2" />
                      Kaydet
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 