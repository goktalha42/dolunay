"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md" : "bg-black/80"}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <div className="relative h-12 w-48">
              <Image 
                src="/images/logo.png" 
                alt="Dolunay İşitme Cihazları Merkezi"
                fill
                style={{ objectFit: 'contain' }}
                priority
                className={isScrolled ? "" : "filter brightness-0 invert"}
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/" 
              className={`font-medium hover:text-gray-300 transition-colors ${isScrolled ? "text-gray-800" : "text-white"}`}
            >
              Ana Sayfa
            </Link>
            <Link 
              href="/hakkimizda" 
              className={`font-medium hover:text-gray-300 transition-colors ${isScrolled ? "text-gray-800" : "text-white"}`}
            >
              Hakkımızda
            </Link>
            <Link 
              href="/urunlerimiz" 
              className={`font-medium hover:text-gray-300 transition-colors ${isScrolled ? "text-gray-800" : "text-white"}`}
            >
              Ürünlerimiz
            </Link>
            <Link 
              href="/iletisim" 
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${isScrolled 
                ? "bg-gray-800 text-white hover:bg-gray-700" 
                : "bg-white text-gray-800 hover:bg-gray-100"}`}
            >
              İletişim
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-2xl"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menüyü Aç/Kapat"
          >
            {isOpen ? (
              <FaTimes className="text-white" />
            ) : (
              <FaBars className="text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden bg-white overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-screen opacity-100 shadow-lg" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <Link 
            href="/" 
            className="font-medium text-gray-800 hover:text-gray-600 py-2"
            onClick={() => setIsOpen(false)}
          >
            Ana Sayfa
          </Link>
          <Link 
            href="/hakkimizda" 
            className="font-medium text-gray-800 hover:text-gray-600 py-2"
            onClick={() => setIsOpen(false)}
          >
            Hakkımızda
          </Link>
          <Link 
            href="/urunlerimiz" 
            className="font-medium text-gray-800 hover:text-gray-600 py-2"
            onClick={() => setIsOpen(false)}
          >
            Ürünlerimiz
          </Link>
          <Link 
            href="/iletisim" 
            className="font-medium text-gray-800 hover:text-gray-600 py-2"
            onClick={() => setIsOpen(false)}
          >
            İletişim
          </Link>
        </nav>
      </div>
    </header>
  );
} 