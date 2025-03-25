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
  FaSignOutAlt,
  FaList
} from "react-icons/fa";

export default function AdminSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  
  // Session için gerekirse burada auth işlemleri eklenebilir
  const handleLogout = () => {
    // Logout işlemi burada gerçekleştirilebilir
    console.log("Logout clicked");
  };

  // Admin sidebar öğeleri
  const sidebarItems = [
    { 
      path: "/admin/dashboard", 
      label: "Gösterge Paneli", 
      icon: <FaTachometerAlt className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
    },
    { 
      path: "/admin/kategoriler", 
      label: "Kategoriler", 
      icon: <FaList className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
    },
    { 
      path: "/admin/urunler", 
      label: "Ürünler", 
      icon: <FaBoxOpen className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
    },
    { 
      path: "/admin/blog", 
      label: "Blog Yazıları", 
      icon: <FaNewspaper className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
    },
    { 
      path: "/admin/stoklar", 
      label: "Stoklar", 
      icon: <FaBox className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
    },
    { 
      path: "/admin/musteriler", 
      label: "Müşterilerimiz", 
      icon: <FaUsers className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
    },
    { 
      path: "/admin/belgeler", 
      label: "Belgelerimiz", 
      icon: <FaFileAlt className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
    },
    { 
      path: "/admin/galeri", 
      label: "Galeri", 
      icon: <FaImage className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
    },
    { 
      path: "/admin/iletisim", 
      label: "İletişim Formları", 
      icon: <FaPhone className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
    },
    { 
      path: "/admin/takvim", 
      label: "Takvim", 
      icon: <FaCalendarAlt className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} />
    }
  ];

  // Alt menü öğeleri
  const bottomItems = [
    { 
      path: "/admin/bildirimler", 
      label: "Bildirimler", 
      icon: <FaBell className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} /> 
    },
    { 
      path: "/admin/destek", 
      label: "Destek", 
      icon: <FaQuestionCircle className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} /> 
    },
    { 
      path: "/admin/ayarlar", 
      label: "Ayarlar", 
      icon: <FaCog className={`${isSidebarOpen ? "mr-2" : ""} text-[14px]`} /> 
    }
  ];

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
              {sidebarItems.map((item) => (
                <li key={item.path}>
                  <Link 
                    href={item.path} 
                    className={`flex items-center ${isSidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-md text-sm transition-colors ${
                      pathname === item.path 
                        ? "bg-blue-50 text-blue-600" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.icon}
                    {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Alt menü */}
          <div className="mt-auto px-2 py-3 border-t border-gray-200">
            <ul className="space-y-0.5">
              {bottomItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`flex items-center ${isSidebarOpen ? 'px-3' : 'justify-center'} py-2 rounded-md text-sm transition-colors ${
                      pathname === item.path 
                        ? "bg-blue-50 text-blue-600" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.icon}
                    {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                  </Link>
                </li>
              ))}
              
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