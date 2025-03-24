"use client";

import { useState } from "react";
import Image from "next/image";
import { FaPlus, FaTrash, FaEdit, FaEye } from "react-icons/fa";

// Demo galeri resimleri
const demoGallery = [
  {
    id: 1,
    title: "İşitme Cihazı Modeli 1",
    image: "/images/Ekran görüntüsü 2025-01-15 090157.jpg",
    date: "15.03.2025",
    category: "Ürünler"
  },
  {
    id: 2,
    title: "İşitme Testi",
    image: "/images/Ekran görüntüsü 2025-01-15 090115.jpg",
    date: "10.03.2025",
    category: "Hizmetler"
  },
  {
    id: 3,
    title: "İşitme Cihazı Modeli 2",
    image: "/images/Ekran görüntüsü 2025-01-16 083611.jpg",
    date: "05.03.2025",
    category: "Ürünler"
  },
  {
    id: 4,
    title: "Vista Cihaz",
    image: "/images/Ekran görüntüsü 2025-01-16 085441.jpg",
    date: "01.03.2025",
    category: "Ürünler"
  },
  {
    id: 5,
    title: "Arka Plan Görseli",
    image: "/images/birinci.jpg",
    date: "25.02.2025",
    category: "Diğer"
  },
  {
    id: 6,
    title: "İşitme Cihazı 3",
    image: "/images/UN_Packshot_B-312_Right_Right_Receiver_P7_Pewter_Actual_Size_RGB_050-6401-P744_01.png",
    date: "20.02.2025",
    category: "Ürünler"
  }
];

export default function GalleryAdmin() {
  const [gallery, setGallery] = useState(demoGallery);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Kategoriye göre filtrele
  const filteredGallery = activeFilter === "all" 
    ? gallery 
    : gallery.filter(item => item.category.toLowerCase() === activeFilter.toLowerCase());
  
  // Kategorileri al
  const categories = ["all", ...new Set(gallery.map(item => item.category.toLowerCase()))];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Galeri Yönetimi</h1>
        <button className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          <FaPlus className="mr-2" />
          Yeni Resim Ekle
        </button>
      </div>
      
      {/* Filtreler */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                activeFilter === category 
                  ? "bg-gray-800 text-white" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveFilter(category)}
            >
              {category === "all" ? "Tümü" : category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Galeri */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src={item.image}
                alt={item.title}
                fill
                style={{ objectFit: "cover" }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex space-x-2">
                  <button 
                    className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-100"
                    onClick={() => setSelectedImage(item.image)}
                  >
                    <FaEye />
                  </button>
                  <button className="p-2 bg-white rounded-full text-blue-500 hover:bg-gray-100">
                    <FaEdit />
                  </button>
                  <button className="p-2 bg-white rounded-full text-red-500 hover:bg-gray-100">
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-800">{item.title}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">{item.date}</span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {item.category}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {filteredGallery.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            Bu kategoride resim bulunamadı
          </div>
        )}
      </div>
      
      {/* Resim Önizleme Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[80vh] w-full">
              <Image
                src={selectedImage}
                alt="Önizleme"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
            <button 
              className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg text-gray-800 hover:bg-gray-100"
              onClick={() => setSelectedImage(null)}
            >
              <FaTrash />
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 