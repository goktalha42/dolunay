"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function AdminPage() {
  const router = useRouter();
  const { status } = useSession();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Eğer oturum açıksa, dashboard'a yönlendir
    if (status === "authenticated") {
      router.replace("/admin/dashboard");
    }
    // Eğer oturum açık değilse ve yükleme tamamlanmışsa, giriş sayfasına yönlendir
    else if (status === "unauthenticated") {
      // Burada doğrudan sayfayı açıyoruz, replace değil
      // router'ı 1 saniyelik gecikme ile çağıralım ki tarayıcı aşırı yönlendirme döngüsüne girmesin
      setTimeout(() => {
        window.location.href = "/admin/giris";
      }, 300);
    }
  }, [status, router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="mb-6">
          <Image 
            src="/images/logo.png" 
            alt="Dolunay İşitme Cihazları" 
            width={200} 
            height={80} 
            priority
          />
        </div>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-700">Doğrulanıyor...</p>
      </div>
    </div>
  );
} 