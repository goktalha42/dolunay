"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  FaTachometerAlt,
  FaBars,
  FaTimes,
  FaNewspaper,
  FaBox,
  FaBoxOpen,
  FaUsers,
  FaFileAlt,
  FaImage,
  FaPhone,
  FaCalendarAlt,
  FaBell,
  FaQuestionCircle,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

export default function AdminSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  
  // Session için gerekirse burada auth işlemleri eklenebilir
  const handleLogout = () => {
    // Logout işlemi burada gerçekleştirilebilir
    console.log("Logout clicked");
  };

  return (
    <>
      {/* Sidebar */}
      <div 
        className={`bg-white text-[#505A64] ${
          isSidebarOpen ? "w-56" : "w-16"
        } transition-all duration-300 overflow-hidden h-screen fixed md:relative z-50`}
      >
        <div className="flex flex-col h-full relative">
          {/* Logo alanı için özel border efekti */}
          <div className="absolute top-[52px] left-0 right-0 h-[1px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
          <div className="absolute top-0 right-0 w-[1px] h-screen bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200" />
          
          {/* Logo ve Menü İkonu */}
          <div className={`flex items-center py-3 px-3 ${isSidebarOpen ? "justify-between" : "justify-center"}`}>
            <div className={`relative ${isSidebarOpen ? "h-8 w-32" : "h-8 w-8"} overflow-hidden`}>
              {isSidebarOpen ? (
                <Image 
                  src="/images/logo.png" 
                  alt="Logo" 
                  width={128} 
                  height={32}
                  className="object-contain"
                />
              ) : (
                <div className="bg-blue-600 rounded-full h-8 w-8 flex items-center justify-center text-white relative">
                  <span className="font-bold text-sm">D</span>
                  
                  {/* Menü açma ikonu D harfinin üstünde */}
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="absolute -top-1 -right-1 bg-white rounded-full p-1 shadow-sm border border-gray-200"
                  >
                    <FaBars className="text-blue-600 text-[10px]" />
                  </button>
                </div>
              )}
            </div>
            
            {/* Menü Kapatma İkonu (Sadece sidebar açıkken görünür) */}
            {isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <FaTimes className="text-sm" />
              </button>
            )}
          </div>
          
          {/* Ana Menü */}
          <nav className="flex-1 py-2 overflow-y-auto">
            <ul className="space-y-0.5 px-2">
              <li>
                <Link 
                  href="/admin/dashboard" 
                  className={`flex items-center ${isSidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-md text-sm transition-colors ${
                    pathname === "/admin/dashboard" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaTachometerAlt className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
                  {isSidebarOpen && <span className="font-medium">Gösterge Paneli</span>}
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/admin/blog" 
                  className={`flex items-center ${isSidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-md text-sm transition-colors ${
                    pathname === "/admin/blog" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaNewspaper className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
                  {isSidebarOpen && <span className="font-medium">Blog Yazıları</span>}
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/admin/urunler" 
                  className={`flex items-center ${isSidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-md text-sm transition-colors ${
                    pathname === "/admin/urunler" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaBox className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
                  {isSidebarOpen && <span className="font-medium">Ürünler</span>}
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/admin/stoklar" 
                  className={`flex items-center ${isSidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-md text-sm transition-colors ${
                    pathname === "/admin/stoklar" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaBoxOpen className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
                  {isSidebarOpen && <span className="font-medium">Stoklar</span>}
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/admin/musteriler" 
                  className={`flex items-center ${isSidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-md text-sm transition-colors ${
                    pathname === "/admin/musteriler" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaUsers className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
                  {isSidebarOpen && <span className="font-medium">Müşterilerimiz</span>}
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/admin/belgeler" 
                  className={`flex items-center ${isSidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-md text-sm transition-colors ${
                    pathname === "/admin/belgeler" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaFileAlt className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
                  {isSidebarOpen && <span className="font-medium">Belgelerimiz</span>}
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/admin/galeri" 
                  className={`flex items-center ${isSidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-md text-sm transition-colors ${
                    pathname === "/admin/galeri" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaImage className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
                  {isSidebarOpen && <span className="font-medium">Galeri</span>}
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/admin/iletisim" 
                  className={`flex items-center ${isSidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-md text-sm transition-colors ${
                    pathname === "/admin/iletisim" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaPhone className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
                  {isSidebarOpen && <span className="font-medium">İletişim Formları</span>}
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/admin/takvim" 
                  className={`flex items-center ${isSidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-md text-sm transition-colors ${
                    pathname === "/admin/takvim" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaCalendarAlt className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
                  {isSidebarOpen && <span className="font-medium">Takvim</span>}
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* Alt menü */}
          <div className="mt-auto px-2 py-3 border-t border-gray-200">
            <ul className="space-y-0.5">
              <li>
                <Link
                  href="/admin/bildirimler"
                  className={`flex items-center ${isSidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-md text-sm transition-colors ${
                    pathname === "/admin/bildirimler" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaBell className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
                  {isSidebarOpen && <span className="font-medium">Bildirimler</span>}
                </Link>
              </li>
              
              <li>
                <Link
                  href="/admin/destek"
                  className={`flex items-center ${isSidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-md text-sm transition-colors ${
                    pathname === "/admin/destek" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaQuestionCircle className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
                  {isSidebarOpen && <span className="font-medium">Destek</span>}
                </Link>
              </li>
              
              <li>
                <Link
                  href="/admin/ayarlar"
                  className={`flex items-center ${isSidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-md text-sm transition-colors ${
                    pathname === "/admin/ayarlar" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaCog className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
                  {isSidebarOpen && <span className="font-medium">Ayarlar</span>}
                </Link>
              </li>
              
              <li>
                <button
                  onClick={handleLogout}
                  className={`flex items-center w-full ${isSidebarOpen ? 'px-3' : 'justify-center'} py-2 text-sm text-gray-600 rounded-md hover:bg-gray-50 transition-colors`}
                >
                  <FaSignOutAlt className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
                  {isSidebarOpen && <span className="font-medium">Çıkış Yap</span>}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
} 