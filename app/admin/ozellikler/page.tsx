"use client";

import { useState, useEffect } from "react";
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes, 
  FaTags, 
  FaBluetoothB, 
  FaBatteryFull, 
  FaWater, 
  FaWifi, 
  FaMicrophone, 
  FaVolumeUp, 
  FaCog, 
  FaHeadphones, 
  FaSun, 
  FaMoon,
  FaShieldAlt,
  FaBullhorn,
  FaExclamation,
  FaBell,
  FaMobileAlt,
  FaSyncAlt,
  FaPowerOff,
  FaHeart,
  FaCheck,
  FaCheckCircle
} from "react-icons/fa";
import { ReactNode } from "react";
import { getFeatureColor } from "@/app/lib/utils/coloring";

interface Feature {
  id: number;
  name: string;
  icon: string;
  display_order: number;
  created_at?: string;
}

// Kullanılabilir ikonların bir listesi
const availableIcons: Record<string, ReactNode> = {
  'FaTags': <FaTags />,
  'FaBluetoothB': <FaBluetoothB />,
  'FaBatteryFull': <FaBatteryFull />,
  'FaWater': <FaWater />,
  'FaWifi': <FaWifi />,
  'FaMicrophone': <FaMicrophone />,
  'FaVolumeUp': <FaVolumeUp />,
  'FaCog': <FaCog />,
  'FaHeadphones': <FaHeadphones />,
  'FaSun': <FaSun />,
  'FaMoon': <FaMoon />,
  'FaShieldAlt': <FaShieldAlt />,
  'FaBullhorn': <FaBullhorn />,
  'FaExclamation': <FaExclamation />,
  'FaBell': <FaBell />,
  'FaMobileAlt': <FaMobileAlt />,
  'FaSyncAlt': <FaSyncAlt />,
  'FaPowerOff': <FaPowerOff />,
  'FaHeart': <FaHeart />,
  'FaCheck': <FaCheck />,
  'FaCheckCircle': <FaCheckCircle />
};

// İkon adından React ikonu oluşturan yardımcı fonksiyon
const getIconComponent = (iconName: string) => {
  return availableIcons[iconName as keyof typeof availableIcons] || <FaTags />;
};

export default function FeaturesPage() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [currentFeature, setCurrentFeature] = useState<Feature | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    icon: "FaTags",
    display_order: 0
  });

  // Form önizleme
  const [previewName, setPreviewName] = useState("");
  
  // Ad değiştiğinde önizlemeyi güncelle
  useEffect(() => {
    setPreviewName(formData.name);
  }, [formData.name]);

  // Özellikleri getir
  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/features');
      if (response.ok) {
        const features = await response.json();
        setFeatures(features);
      } else {
        throw new Error('Özellikler getirilirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Veri getirme hatası:', error);
      setError('Özellikler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);
  
  // Verileri sıfırla
  const resetForm = () => {
    setFormData({
      name: "",
      icon: "FaTags",
      display_order: 0
    });
    setCurrentFeature(null);
  };
  
  // Düzenleme modalını aç
  const handleEdit = (feature: Feature) => {
    setCurrentFeature(feature);
    setFormData({
      name: feature.name,
      icon: feature.icon || "FaTags",
      display_order: feature.display_order
    });
    setModalMode("edit");
    setIsModalOpen(true);
  };
  
  // Yeni özellik modalını aç
  const handleAdd = () => {
    resetForm();
    setModalMode("add");
    setIsModalOpen(true);
  };
  
  // Form gönderme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Lütfen bir özellik adı girin.');
      return;
    }
    
    try {
      const url = modalMode === "add" 
        ? "/api/features" 
        : `/api/features/${currentFeature?.id}`;
      
      const method = modalMode === "add" ? "POST" : "PUT";
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`Özellik ${modalMode === "add" ? "eklenirken" : "güncellenirken"} bir hata oluştu.`);
      }
      
      // Başarılı işlemden sonra verileri yenile
      await fetchFeatures();
      
      // Modalı kapat ve formu sıfırla
      setIsModalOpen(false);
      resetForm();
      
    } catch (error) {
      console.error('İşlem hatası:', error);
      alert(`Bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    }
  };
  
  // Özellik silme
  const handleDelete = async (id: number) => {
    if (!confirm('Bu özelliği silmek istediğinize emin misiniz? Bu özellik ürünlerle ilişkiliyse, ürünlerden de otomatik olarak kaldırılacaktır.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/features/${id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Özellik silinirken bir hata oluştu.');
      }
      
      const result = await response.json();
      
      // Başarılı silme işlemi
      let successMessage = 'Özellik başarıyla silindi.';
      if (result.removedRelations) {
        successMessage += ` ${result.removedRelations}`;
      }
      
      alert(successMessage);
      
      // Verileri yenile
      await fetchFeatures();
      
    } catch (error) {
      console.error('Silme hatası:', error);
      alert(`Silme işlemi sırasında bir hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-700">Özellikler yükleniyor...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-2">Hata!</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => fetchFeatures()}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-xl font-semibold text-gray-800">Ürün Özellikleri Yönetimi</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md flex items-center text-sm"
          >
            <FaPlus className="mr-1" /> Yeni Özellik Ekle
          </button>
        </div>
        
        {/* Özellikler Tablosu */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İkon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Özellik Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gösterim Sırası
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Oluşturma Tarihi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {features.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Henüz hiç özellik eklenmemiş. "Yeni Özellik Ekle" butonunu kullanarak özellik ekleyebilirsiniz.
                  </td>
                </tr>
              ) : (
                features.map((feature) => (
                  <tr key={feature.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {feature.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full">
                        {getIconComponent(feature.icon)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 ${getFeatureColor(feature.name).bg} ${getFeatureColor(feature.name).text}`}
                        >
                          {feature.name}
                        </span>
                        <span className="text-gray-500 text-xs">(önizleme)</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {feature.display_order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {feature.created_at ? new Date(feature.created_at).toLocaleDateString('tr-TR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(feature)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(feature.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {modalMode === "add" ? "Yeni Özellik Ekle" : "Özelliği Düzenle"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Özellik Adı
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Özellik adını girin"
                  required
                />
                
                {previewName && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500 mb-1 block">Önizleme:</span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFeatureColor(previewName).bg} ${getFeatureColor(previewName).text}`}
                    >
                      {previewName}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Özellik İkonu
                </label>
                <div className="grid grid-cols-5 gap-2 p-3 border rounded-md max-h-60 overflow-y-auto">
                  {Object.entries(availableIcons).map(([iconName, IconComponent]) => (
                    <div 
                      key={iconName}
                      onClick={() => setFormData({...formData, icon: iconName})}
                      className={`
                        flex flex-col items-center justify-center p-2 rounded-md cursor-pointer
                        ${formData.icon === iconName ? 'bg-blue-100 border border-blue-300' : 'hover:bg-gray-100'}
                      `}
                    >
                      <div className="text-gray-700 text-lg">
                        {IconComponent}
                      </div>
                      <span className="text-xs text-gray-500 mt-1 text-center truncate w-full">
                        {iconName.replace('Fa', '')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="display_order">
                  Gösterim Sırası
                </label>
                <input
                  type="number"
                  id="display_order"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  min="0"
                />
                <p className="text-gray-500 text-xs mt-1">
                  Düşük numaralar daha önce gösterilir. Özellikler bu sıraya göre gösterilecektir.
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
                >
                  <FaSave className="mr-1" />
                  {modalMode === "add" ? "Ekle" : "Güncelle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 