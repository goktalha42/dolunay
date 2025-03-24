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
        {/* İçerik Alanı */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 