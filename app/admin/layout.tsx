"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { 
  FaTachometerAlt, 
  FaNewspaper, 
  FaBox,
  FaBoxOpen,
  FaUsers,
  FaFileAlt,
  FaPhone, 
  FaCalendarAlt,
  FaBell,
  FaQuestionCircle,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaImage
} from "react-icons/fa";
import { Inter } from "next/font/google";
import AdminSidebar from "./components/AdminSidebar";

const inter = Inter({ subsets: ["latin"] });

// Sayfa adlarını pathname'den türetme fonksiyonu
const getPageTitle = (pathname: string) => {
  const parts = pathname.split('/');
  const lastPart = parts[parts.length - 1];
  
  const titles: {[key: string]: string} = {
    'dashboard': 'Gösterge Paneli',
    'urunler': 'Ürünler',
    'stoklar': 'Stoklar',
    'musteriler': 'Müşterilerimiz',
    'belgeler': 'Belgelerimiz',
    'galeri': 'Galeri',
    'iletisim': 'İletişim Formları',
    'takvim': 'Takvim',
    'bildirimler': 'Bildirimler',
    'destek': 'Destek',
    'ayarlar': 'Ayarlar',
    'blog': 'Blog Yazıları'
  };
  
  return titles[lastPart] || 'Admin Panel';
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const pageTitle = getPageTitle(pathname || '');
  
  // Client-side işlemleri güvenli hale getirmek için
  useEffect(() => {
    setIsClient(true);
    
    // Sadece login sayfası değilse kontrol yap
    if (pathname !== "/admin") {
      // Tarih bilgisini ayarla
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      };
      const today = new Date();
      setCurrentDate(today.toLocaleDateString('tr-TR', options));
      
      // Hata durumunda localStorage kontrolü
      if (status === "unauthenticated") {
        const isLoggedIn = localStorage.getItem("adminLoggedIn");
        if (!isLoggedIn) {
          router.push("/admin");
        }
      }
      
      // Mobil görünüm için sidebar'ı kapalı başlat
      const handleResize = () => {
        if (window.innerWidth < 768) {
          setIsSidebarOpen(false);
        } else {
          setIsSidebarOpen(true);
        }
      };
      
      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [pathname, router, status]);
  
  const handleLogout = async () => {
    try {
      localStorage.removeItem("adminLoggedIn");
      await signOut({ redirect: false });
      router.push("/admin");
    } catch (error) {
      console.error("Çıkış hatası:", error);
      localStorage.removeItem("adminLoggedIn");
      router.push("/admin");
    }
  };

  // Sadece login sayfasında layout'u gösterme
  if (pathname === "/admin") {
    return <>{children}</>;
  }

  // Yükleme durumu
  if (!isClient) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f5f7f9]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-700">Yükleniyor...</p>
      </div>
    </div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Admin Paneli Header */}
        <header className="bg-white shadow-sm z-10 border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            {/* Logo ve Sayfa Başlığı */}
            <div className="flex items-center">
              <div className="text-[#505A64] text-sm opacity-75">
                {currentDate}
              </div>
            </div>
            
            {/* Sayfa Başlığı - Orta */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <h1 className="text-xl font-medium text-gray-800">{pageTitle}</h1>
            </div>
            
            {/* Kullanıcı Bilgisi */}
            <div className="flex items-center">
              <span className="text-sm font-medium text-[#505A64] mr-2">
                Merhaba, {session?.user?.name || 'Admin'}
              </span>
              <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="font-medium text-blue-600 text-lg">
                  {session?.user?.name ? session.user.name.charAt(0) : 'A'}
                </span>
              </div>
            </div>
          </div>
        </header>
        
        {/* İçerik Alanı */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 