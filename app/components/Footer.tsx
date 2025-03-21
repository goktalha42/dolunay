"use client";

import Image from "next/image";
import Link from "next/link";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="relative h-12 w-48 mb-4">
              <Image 
                src="/images/logo.png" 
                alt="Dolunay İşitme Cihazları Merkezi"
                fill
                style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
              />
            </div>
            <p className="text-gray-400 mb-4">Daha iyi duymak için yanınızdayız</p>
            <div className="flex space-x-4">
              <Link href="/hakkimizda" className="text-gray-400 hover:text-white transition-colors">Hakkımızda</Link>
              <Link href="/urunlerimiz" className="text-gray-400 hover:text-white transition-colors">Ürünlerimiz</Link>
              <Link href="/iletisim" className="text-gray-400 hover:text-white transition-colors">İletişim</Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">İletişim Bilgileri</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <FaPhone className="mr-2 text-gray-400" />
                <span>+90 552 794 77 48</span>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="mr-2 text-gray-400" />
                <span>dolunayisitme@gmail.com</span>
              </div>
              <div className="flex items-start">
                <FaMapMarkerAlt className="mr-2 text-gray-400 mt-1 flex-shrink-0" />
                <span>Aşağı Eğlence, Beste Sk. 16/C, 06010 Keçiören/Ankara</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Çalışma Saatleri</h3>
            <div className="space-y-1">
              <p>Pazartesi - Cuma: 09:00 - 18:00</p>
              <p>Cumartesi: 10:00 - 15:00</p>
              <p>Pazar: Kapalı</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">&copy; 2024 Dolunay İşitme Cihazları Merkezi. Tüm hakları saklıdır.</p>
          <Link href="/iletisim" className="px-6 py-2 bg-white text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">
            İletişime Geçin
          </Link>
        </div>
      </div>
    </footer>
  );
} 