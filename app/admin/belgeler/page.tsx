"use client";

import { useState } from "react";
import { FaPlus, FaDownload, FaEye, FaTrash, FaSearch, FaFileAlt, FaFileInvoice, FaFileContract, FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

// Demo belge listesi
const demoDocuments = [
  {
    id: 1,
    name: "İşitme Cihazı Kullanım Kılavuzu",
    type: "PDF",
    category: "Kılavuz",
    size: "2.4 MB",
    uploadDate: "24.03.2025",
    uploadedBy: "Admin"
  },
  {
    id: 2,
    name: "Hasta Bilgilendirme Formu",
    type: "DOCX",
    category: "Form",
    size: "532 KB",
    uploadDate: "23.03.2025",
    uploadedBy: "Admin"
  },
  {
    id: 3,
    name: "İşitme Testi Sonuçları - Ahmet Yılmaz",
    type: "PDF",
    category: "Rapor",
    size: "1.7 MB",
    uploadDate: "22.03.2025",
    uploadedBy: "Admin"
  },
  {
    id: 4,
    name: "Fatura #1234",
    type: "PDF",
    category: "Fatura",
    size: "765 KB",
    uploadDate: "21.03.2025",
    uploadedBy: "Admin"
  },
  {
    id: 5,
    name: "Ödeme Makbuzu - Fatma Kaya",
    type: "PDF",
    category: "Makbuz",
    size: "430 KB",
    uploadDate: "20.03.2025",
    uploadedBy: "Admin"
  },
  {
    id: 6,
    name: "Garanti Belgesi - Vista Premium",
    type: "PDF",
    category: "Belge",
    size: "375 KB",
    uploadDate: "19.03.2025",
    uploadedBy: "Admin"
  },
  {
    id: 7,
    name: "Satış Sözleşmesi Şablonu",
    type: "DOCX",
    category: "Sözleşme",
    size: "645 KB",
    uploadDate: "18.03.2025",
    uploadedBy: "Admin"
  },
  {
    id: 8,
    name: "Stok Listesi - Mart 2025",
    type: "XLSX",
    category: "Rapor",
    size: "1.2 MB",
    uploadDate: "17.03.2025",
    uploadedBy: "Admin"
  }
];

export default function DocumentsAdmin() {
  const [documents, setDocuments] = useState(demoDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: string} | null>(null);
  
  const getIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'fatura':
        return <FaFileInvoice className="text-blue-500" />;
      case 'sözleşme':
        return <FaFileContract className="text-green-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };
  
  const requestSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const getSortIcon = (columnName: string) => {
    if (!sortConfig || sortConfig.key !== columnName) {
      return <FaSort className="ml-1 text-gray-400" />;
    }
    return sortConfig.direction === 'ascending' ? 
      <FaSortUp className="ml-1 text-gray-700" /> : 
      <FaSortDown className="ml-1 text-gray-700" />;
  };
  
  const sortedDocuments = [...documents];
  if (sortConfig !== null) {
    sortedDocuments.sort((a, b) => {
      if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }
  
  const filteredDocuments = sortedDocuments.filter(document => 
    document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    document.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    document.type.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const confirmDelete = (documentId: number) => {
    setDocumentToDelete(documentId);
    setShowDeleteModal(true);
  };
  
  const handleDelete = () => {
    if (documentToDelete) {
      setDocuments(documents.filter(document => document.id !== documentToDelete));
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    }
  };
  
  // Dosya tiplerini kategorize etme
  const docTypes = documents.reduce((acc, doc) => {
    const { category } = doc;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Belge Yönetimi</h1>
        <button className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          <FaPlus className="mr-2" />
          Yeni Belge Yükle
        </button>
      </div>
      
      {/* Belge Tipleri Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(docTypes).slice(0, 4).map(([category, count], index) => (
          <div key={category} className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 text-blue-500 mr-3">
                {getIcon(category)}
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{category}</p>
                <p className="text-xl font-bold text-gray-700">{count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Belge Tablosu */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Belgeler</h2>
          <div className="mt-4 flex items-center relative">
            <input
              type="text"
              placeholder="Belge ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 text-gray-400" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('name')}
                >
                  <div className="flex items-center">
                    Belge Adı {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('category')}
                >
                  <div className="flex items-center">
                    Kategori {getSortIcon('category')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('type')}
                >
                  <div className="flex items-center">
                    Tür {getSortIcon('type')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('size')}
                >
                  <div className="flex items-center">
                    Boyut {getSortIcon('size')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('uploadDate')}
                >
                  <div className="flex items-center">
                    Yükleme Tarihi {getSortIcon('uploadDate')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((document) => (
                <tr key={document.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getIcon(document.category)}
                      <span className="ml-2 text-sm font-medium text-gray-900">{document.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{document.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${document.type === "PDF" ? "bg-red-100 text-red-800" : 
                      document.type === "DOCX" ? "bg-blue-100 text-blue-800" :
                      "bg-green-100 text-green-800"}`}>
                      {document.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{document.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{document.uploadDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                      <button className="text-blue-500 hover:text-blue-700" title="Görüntüle">
                        <FaEye />
                      </button>
                      <button className="text-green-500 hover:text-green-700" title="İndir">
                        <FaDownload />
                      </button>
                      <button 
                        className="text-red-500 hover:text-red-700" 
                        title="Sil"
                        onClick={() => confirmDelete(document.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredDocuments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Belgeyi Silmeyi Onaylayın</h3>
            <p className="text-sm text-gray-500 mb-4">
              Bu belgeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                İptal
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={handleDelete}
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