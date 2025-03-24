"use client";

import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";

export default function ClientPathCheck({ 
  children 
}: { 
  children: React.ReactNode
}) {
  // usePathname kullanarak URL'yi kontrol et
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin') || false;

  return (
    <>
      {/* Admin sayfaları dışında Navbar'ı göster */}
      {!isAdminPage && <Navbar />}
      
      {/* Admin sayfalarında padding ekleme, site sayfalarında padding ekle */}
      <div className={!isAdminPage ? "pt-16" : ""}>
        {children}
      </div>
    </>
  );
} 