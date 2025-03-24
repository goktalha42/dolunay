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
          isSidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 overflow-hidden h-screen fixed md:relative z-50 shadow-md`}
      >
        <div className="flex flex-col h-full">
          {/* Logo ve Menü İkonu */}
          <div className={`flex items-center py-4 px-4 border-b ${isSidebarOpen ? "justify-between" : "justify-center"}`}>
            <div className={`relative ${isSidebarOpen ? "h-12 w-44" : "h-12 w-12"} overflow-hidden`}>
              {isSidebarOpen ? (
                <Image 
                  src="/images/logo.png" 
                  alt="Logo" 
                  width={176} 
                  height={48}
                  className="object-contain"
                />
              ) : (
                <div className="bg-blue-600 rounded-full h-12 w-12 flex items-center justify-center text-white relative">
                  <span className="font-bold text-xl">D</span>
                  
                  {/* Menü açma ikonu D harfinin üstünde */}
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-200"
                  >
                    <FaBars className="text-blue-600 text-xs" />
                  </button>
                </div>
              )}
            </div>
            
            {/* Menü Kapatma İkonu (Sadece sidebar açıkken görünür) */}
            {isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-500 focus:outline-none"
              >
                <FaTimes className="text-[#505A64] text-xl" />
              </button>
            )}
          </div>
          
          {/* Ana Menü */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-2">
              <li>
                <Link 
                  href="/admin/dashboard" 
                  className={`flex items-center ${isSidebarOpen ? 'px-4' : 'justify-center'} py-3 rounded-lg transition-colors ${
                    pathname === "/admin/dashboard" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-[#505A64] hover:bg-gray-100"
                  }`}
                >
                  <FaTachometerAlt className={`${isSidebarOpen ? "mr-3" : ""} text-xl`} />
                  {isSidebarOpen && <span>Gösterge Paneli</span>}
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/admin/blog" 
                  className={`flex items-center ${isSidebarOpen ? 'px-4' : 'justify-center'} py-3 rounded-lg transition-colors ${
                    pathname === "/admin/blog" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-[#505A64] hover:bg-gray-100"
                  }`}
                >
                  <FaNewspaper className={`${isSidebarOpen ? "mr-3" : ""} text-xl`} />
                  {isSidebarOpen && <span>Blog Yazıları</span>}
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/admin/urunler" 
                  className={`flex items-center ${isSidebarOpen ? 'px-4' : 'justify-center'} py-3 rounded-lg transition-colors ${
                    pathname === "/admin/urunler" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-[#505A64] hover:bg-gray-100"
                  }`}
                >
                  <FaBox className={`${isSidebarOpen ? "mr-3" : ""} text-xl`} />
                  {isSidebarOpen && <span>Ürünler</span>}
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/admin/stoklar" 
                  className={`flex items-center ${isSidebarOpen ? 'px-4' : 'justify-center'} py-3 rounded-lg transition-colors ${
                    pathname === "/admin/stoklar" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-[#505A64] hover:bg-gray-100"
                  }`}
                >
                  <FaBoxOpen className={`${isSidebarOpen ? "mr-3" : ""} text-xl`} />
                  {isSidebarOpen && <span>Stoklar</span>}
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/admin/musteriler" 
                  className={`flex items-center ${isSidebarOpen ? 'px-4' : 'justify-center'} py-3 rounded-lg transition-colors ${
                    pathname === "/admin/musteriler" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-[#505A64] hover:bg-gray-100"
                  }`}
                >
                  <FaUsers className={`${isSidebarOpen ? "mr-3" : ""} text-xl`} />
                  {isSidebarOpen && <span>Müşterilerimiz</span>}
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/admin/belgeler" 
                  className={`flex items-center ${isSidebarOpen ? 'px-4' : 'justify-center'} py-3 rounded-lg transition-colors ${
                    pathname === "/admin/belgeler" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-[#505A64] hover:bg-gray-100"
                  }`}
                >
                  <FaFileAlt className={`${isSidebarOpen ? "mr-3" : ""} text-xl`} />
                  {isSidebarOpen && <span>Belgelerimiz</span>}
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/admin/galeri" 
                  className={`flex items-center ${isSidebarOpen ? 'px-4' : 'justify-center'} py-3 rounded-lg transition-colors ${
                    pathname === "/admin/galeri" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-[#505A64] hover:bg-gray-100"
                  }`}
                >
                  <FaImage className={`${isSidebarOpen ? "mr-3" : ""} text-xl`} />
                  {isSidebarOpen && <span>Galeri</span>}
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/admin/iletisim" 
                  className={`flex items-center ${isSidebarOpen ? 'px-4' : 'justify-center'} py-3 rounded-lg transition-colors ${
                    pathname === "/admin/iletisim" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-[#505A64] hover:bg-gray-100"
                  }`}
                >
                  <FaPhone className={`${isSidebarOpen ? "mr-3" : ""} text-xl`} />
                  {isSidebarOpen && <span>İletişim Formları</span>}
                </Link>
              </li>
              
              <li>
                <Link 
                  href="/admin/takvim" 
                  className={`flex items-center ${isSidebarOpen ? 'px-4' : 'justify-center'} py-3 rounded-lg transition-colors ${
                    pathname === "/admin/takvim" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-[#505A64] hover:bg-gray-100"
                  }`}
                >
                  <FaCalendarAlt className={`${isSidebarOpen ? "mr-3" : ""} text-xl`} />
                  {isSidebarOpen && <span>Takvim</span>}
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* Alt menü */}
          <div className="mt-auto px-2 py-4 border-t">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/admin/bildirimler"
                  className={`flex items-center ${isSidebarOpen ? 'px-4' : 'justify-center'} py-3 rounded-lg transition-colors ${
                    pathname === "/admin/bildirimler" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-[#505A64] hover:bg-gray-100"
                  }`}
                >
                  <FaBell className={`${isSidebarOpen ? "mr-3" : ""} text-xl`} />
                  {isSidebarOpen && <span>Bildirimler</span>}
                </Link>
              </li>
              
              <li>
                <Link
                  href="/admin/destek"
                  className={`flex items-center ${isSidebarOpen ? 'px-4' : 'justify-center'} py-3 rounded-lg transition-colors ${
                    pathname === "/admin/destek" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-[#505A64] hover:bg-gray-100"
                  }`}
                >
                  <FaQuestionCircle className={`${isSidebarOpen ? "mr-3" : ""} text-xl`} />
                  {isSidebarOpen && <span>Destek</span>}
                </Link>
              </li>
              
              <li>
                <Link
                  href="/admin/ayarlar"
                  className={`flex items-center ${isSidebarOpen ? 'px-4' : 'justify-center'} py-3 rounded-lg transition-colors ${
                    pathname === "/admin/ayarlar" 
                      ? "bg-blue-50 text-blue-600" 
                      : "text-[#505A64] hover:bg-gray-100"
                  }`}
                >
                  <FaCog className={`${isSidebarOpen ? "mr-3" : ""} text-xl`} />
                  {isSidebarOpen && <span>Ayarlar</span>}
                </Link>
              </li>
              
              <li>
                <button
                  onClick={handleLogout}
                  className={`flex items-center w-full ${isSidebarOpen ? 'px-4' : 'justify-center'} py-3 text-[#505A64] rounded-lg hover:bg-gray-100 transition-colors`}
                >
                  <FaSignOutAlt className={`${isSidebarOpen ? "mr-3" : ""} text-xl`} />
                  {isSidebarOpen && <span>Çıkış Yap</span>}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
} 