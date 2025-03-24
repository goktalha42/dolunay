"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  
  // Client-side işlemleri güvenli hale getirmek için
  useEffect(() => {
    setMounted(true);
    
    // LocalStorage kontrolü
    const isLoggedIn = localStorage.getItem("adminLoggedIn");
    if (isLoggedIn) {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError("Kullanıcı adı ve şifre gereklidir");
      return;
    }
    
    try {
      setIsLoading(true);
      setError("");
      
      // Demo amaçlı doğrudan giriş
      if (username === "admin" && password === "123456") {
        localStorage.setItem("adminLoggedIn", "true");
        router.push("/admin/dashboard");
        return;
      }
      
      // NextAuth ile giriş dene
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false
      });
      
      if (result?.error) {
        setError("Kullanıcı adı veya şifre hatalı!");
        setIsLoading(false);
        return;
      }
      
      // Demo amaçlı localStorage'a kayıt
      localStorage.setItem("adminLoggedIn", "true");
      
      // Yönlendirme
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Giriş hatası:", error);
      
      // Hata durumunda basit giriş
      if (username === "admin" && password === "123456") {
        localStorage.setItem("adminLoggedIn", "true");
        router.push("/admin/dashboard");
        return;
      }
      
      setError("Giriş sırasında bir hata oluştu");
      setIsLoading(false);
    }
  };

  // Client tarafında render olana kadar bekle
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-[900px] flex flex-col items-center">
        {/* Logo ve Başlık */}
        <div className="w-full flex justify-center mb-8">
          <div className="text-center">
            <Image 
              src="/images/logo.png" 
              alt="Dolunay İşitme Cihazları" 
              width={300} 
              height={100} 
              priority
              className="mb-4"
            />
            <h1 className="text-2xl md:text-3xl font-bold text-[#2c3e94]">DOLUNAY İŞİTME CİHAZLARI</h1>
            <h2 className="text-xl md:text-2xl font-semibold text-[#e63131] mt-1">YÖNETİM PANELİ</h2>
          </div>
        </div>

        {/* Giriş Formu */}
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg p-8 shadow-lg">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm font-medium text-center">
                {error}
              </div>
            )}
            
            <div>
              <div className="relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2c3e94]"
                  placeholder="E-posta / Kullanıcı Adı"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2c3e94]"
                  placeholder="Şifre"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#2c3e94] focus:ring-[#2c3e94] border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Beni hatırla
              </label>
            </div>
            
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2c3e94] hover:bg-[#1e2b6b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2c3e94] disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Giriş Yapılıyor...' : 'Giriş'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          Dolunay İşitme Cihazları Yönetim Paneli © {new Date().getFullYear()}
        </div>
      </div>
    </div>
  );
} 