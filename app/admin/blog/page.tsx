"use client";

import { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

// Demo veri
const demoBlogs = [
  {
    id: 1,
    title: "İşitme Cihazlarında Teknolojik Gelişmeler",
    status: "Yayında",
    date: "15.03.2025",
    author: "Admin",
    views: 126
  },
  {
    id: 2,
    title: "İşitme Kaybı Belirtileri ve Erken Tanı",
    status: "Yayında",
    date: "10.03.2025",
    author: "Admin",
    views: 84
  },
  {
    id: 3,
    title: "Çocuklarda İşitme Problemleri",
    status: "Taslak",
    date: "05.03.2025",
    author: "Admin",
    views: 0
  },
  {
    id: 4,
    title: "Bluetooth İşitme Cihazlarının Avantajları",
    status: "Yayında",
    date: "01.03.2025",
    author: "Admin",
    views: 57
  },
  {
    id: 5,
    title: "Yaz Aylarında İşitme Cihazı Kullanımı",
    status: "Taslak",
    date: "25.02.2025",
    author: "Admin",
    views: 0
  }
];

export default function BlogAdmin() {
  const [blogs, setBlogs] = useState(demoBlogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.date.includes(searchTerm)
  );

  const handleDelete = (id: number) => {
    setSelectedBlogId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedBlogId) {
      const updatedBlogs = blogs.filter(blog => blog.id !== selectedBlogId);
      setBlogs(updatedBlogs);
      setShowDeleteModal(false);
      setSelectedBlogId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Blog Yazıları</h1>
        <button className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          <FaPlus className="mr-2" />
          Yeni Yazı
        </button>
      </div>
      
      {/* Arama ve Filtreleme */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center relative">
          <input
            type="text"
            placeholder="Yazı ara..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 text-gray-400" />
        </div>
      </div>
      
      {/* Blog Listesi */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yazar</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Görüntüleme</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBlogs.map((blog) => (
                <tr key={blog.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{blog.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{blog.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${blog.status === "Yayında" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.views}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <FaEdit />
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(blog.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredBlogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    Sonuç bulunamadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Yazıyı Sil</h3>
            <p className="text-gray-600 mb-6">
              Bu blog yazısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                İptal
              </button>
              <button 
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                onClick={confirmDelete}
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 