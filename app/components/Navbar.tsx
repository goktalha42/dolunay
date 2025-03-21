"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaHeadphones } from 'react-icons/fa';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className={`text-2xl font-bold flex items-center ${
            scrolled ? 'text-indigo-900' : 'text-white'
          }`}>
            <FaHeadphones className="mr-2" />
            <span>Dolunay İşitme</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className={`md:hidden ${
              scrolled ? 'text-indigo-900' : 'text-white'
            } hover:opacity-80 transition-opacity`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`font-medium ${
                scrolled ? 'text-gray-700 hover:text-indigo-700' : 'text-white hover:text-yellow-300'
              } transition-colors`}
            >
              Ana Sayfa
            </Link>
            <Link
              href="/hakkimizda"
              className={`font-medium ${
                scrolled ? 'text-gray-700 hover:text-indigo-700' : 'text-white hover:text-yellow-300'
              } transition-colors`}
            >
              Hakkımızda
            </Link>
            <Link
              href="/#iletisim"
              className={`font-medium ${
                scrolled ? 'text-gray-700 hover:text-indigo-700' : 'text-white hover:text-yellow-300'
              } transition-colors`}
            >
              İletişim
            </Link>
            <Link
              href="/#iletisim"
              className={`px-6 py-2 rounded-full font-medium ${
                scrolled 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                  : 'bg-yellow-500 text-indigo-900 hover:bg-yellow-400'
              } transition-colors`}
            >
              Randevu Al
            </Link>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 mt-2 bg-white rounded-lg shadow-lg">
            <div className="flex flex-col space-y-4 p-4">
              <Link
                href="/"
                className="text-indigo-900 hover:text-indigo-700 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Ana Sayfa
              </Link>
              <Link
                href="/hakkimizda"
                className="text-indigo-900 hover:text-indigo-700 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Hakkımızda
              </Link>
              <Link
                href="/#iletisim"
                className="text-indigo-900 hover:text-indigo-700 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                İletişim
              </Link>
              <Link
                href="/#iletisim"
                className="px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Randevu Al
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 