"use client";

import { useState } from "react";
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaReply, FaStar, FaRegStar } from "react-icons/fa";

// Demo iletişim formları
const demoContacts = [
  {
    id: 1,
    name: "Ahmet Yılmaz",
    email: "ahmet.yilmaz@example.com",
    phone: "+90 555 123 4567",
    message: "İşitme cihazları hakkında detaylı bilgi almak istiyorum. Fiyat aralığı nedir?",
    date: "24.03.2025 14:22",
    isRead: true,
    isStarred: true
  },
  {
    id: 2,
    name: "Ayşe Kaya",
    email: "ayse.kaya@example.com",
    phone: "+90 555 987 6543",
    message: "En yakın zamanda randevu almak istiyorum. Cumartesi günü müsait misiniz?",
    date: "23.03.2025 10:15",
    isRead: false,
    isStarred: false
  },
  {
    id: 3,
    name: "Mehmet Demir",
    email: "mehmet.demir@example.com",
    phone: "+90 555 456 7890",
    message: "Merhaba, Vista işitme cihazlarının fiyatları hakkında bilgi alabilir miyim?",
    date: "22.03.2025 16:45",
    isRead: false,
    isStarred: false
  },
  {
    id: 4,
    name: "Zeynep Şahin",
    email: "zeynep.sahin@example.com",
    phone: "+90 555 333 2211",
    message: "İşitme testinin fiyatı ne kadar? Çocuklar için ücretsiz test hizmetiniz var mı?",
    date: "20.03.2025 09:30",
    isRead: true,
    isStarred: false
  },
  {
    id: 5,
    name: "Ali Çelik",
    email: "ali.celik@example.com",
    phone: "+90 555 111 2233",
    message: "İşitme cihazımın bakımını yaptırmak istiyorum. Randevu için müsait misiniz?",
    date: "18.03.2025 14:10",
    isRead: true,
    isStarred: true
  }
];

export default function ContactAdmin() {
  const [contacts, setContacts] = useState(demoContacts);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedContact, setSelectedContact] = useState<typeof demoContacts[0] | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  
  // Filtreleme
  const filteredContacts = contacts.filter(contact => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !contact.isRead;
    if (activeFilter === "starred") return contact.isStarred;
    return true;
  });
  
  // İstatistikler
  const stats = {
    all: contacts.length,
    unread: contacts.filter(c => !c.isRead).length,
    starred: contacts.filter(c => c.isStarred).length
  };
  
  // Mesajı oku
  const handleReadMessage = (contact: typeof demoContacts[0]) => {
    setSelectedContact(contact);
    
    // Okundu olarak işaretle
    if (!contact.isRead) {
      const updatedContacts = contacts.map(c => 
        c.id === contact.id ? { ...c, isRead: true } : c
      );
      setContacts(updatedContacts);
    }
  };
  
  // Yıldızla
  const handleToggleStar = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedContacts = contacts.map(c => 
      c.id === id ? { ...c, isStarred: !c.isStarred } : c
    );
    setContacts(updatedContacts);
  };
  
  // Silme
  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedContactId(id);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    if (selectedContactId) {
      const updatedContacts = contacts.filter(c => c.id !== selectedContactId);
      setContacts(updatedContacts);
      
      // Eğer seçili mesaj silindiyse, seçimi kaldır
      if (selectedContact && selectedContact.id === selectedContactId) {
        setSelectedContact(null);
      }
      
      setShowDeleteModal(false);
      setSelectedContactId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">İletişim Formları</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sol Panel - Liste */}
        <div className="md:w-1/2 lg:w-2/5">
          {/* Filtreler */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                  activeFilter === "all" 
                    ? "bg-gray-800 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveFilter("all")}
              >
                <FaEnvelope className="mr-2" />
                Tümü
                <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-700 text-white text-xs">{stats.all}</span>
              </button>
              
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                  activeFilter === "unread" 
                    ? "bg-gray-800 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveFilter("unread")}
              >
                <FaEnvelopeOpen className="mr-2" />
                Okunmamış
                <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-700 text-white text-xs">{stats.unread}</span>
              </button>
              
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center ${
                  activeFilter === "starred" 
                    ? "bg-gray-800 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setActiveFilter("starred")}
              >
                <FaStar className="mr-2" />
                Yıldızlı
                <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-700 text-white text-xs">{stats.starred}</span>
              </button>
            </div>
          </div>
          
          {/* Mesaj Listesi */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {filteredContacts.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <div 
                    key={contact.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      selectedContact?.id === contact.id ? "bg-gray-50" : ""
                    } ${!contact.isRead ? "border-l-4 border-blue-500" : ""}`}
                    onClick={() => handleReadMessage(contact)}
                  >
                    <div className="flex justify-between items-start">
                      <h3 className={`font-medium ${!contact.isRead ? "text-gray-900" : "text-gray-700"}`}>
                        {contact.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <button 
                          className="text-gray-400 hover:text-yellow-500"
                          onClick={(e) => handleToggleStar(contact.id, e)}
                        >
                          {contact.isStarred ? <FaStar className="text-yellow-500" /> : <FaRegStar />}
                        </button>
                        <button 
                          className="text-gray-400 hover:text-red-500"
                          onClick={(e) => handleDelete(contact.id, e)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{contact.email}</p>
                    <p className="text-sm text-gray-600 mt-2 truncate">
                      {contact.message.substring(0, 60)}{contact.message.length > 60 ? "..." : ""}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">{contact.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Bu filtrede mesaj bulunamadı
              </div>
            )}
          </div>
        </div>
        
        {/* Sağ Panel - Mesaj Detayı */}
        <div className="md:w-1/2 lg:w-3/5">
          {selectedContact ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedContact.name}</h2>
                  <p className="text-gray-600">{selectedContact.email}</p>
                  <p className="text-gray-600">{selectedContact.phone}</p>
                  <p className="text-sm text-gray-400 mt-1">{selectedContact.date}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <FaReply />
                  </button>
                  <button 
                    className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={(e) => handleToggleStar(selectedContact.id, e)}
                  >
                    {selectedContact.isStarred ? <FaStar className="text-yellow-500" /> : <FaRegStar />}
                  </button>
                  <button 
                    className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors"
                    onClick={(e) => handleDelete(selectedContact.id, e)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <div className="prose max-w-none">
                  <p className="text-gray-800 whitespace-pre-line">{selectedContact.message}</p>
                </div>
              </div>
              
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Hızlı Yanıt</h3>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-[120px]"
                  placeholder="Mesaja yanıt yazın..."
                ></textarea>
                <div className="flex justify-end mt-4">
                  <button className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    Yanıtla
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center h-full flex items-center justify-center">
              <div>
                <FaEnvelope className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">Mesaj Seçilmedi</h3>
                <p className="text-gray-500">Detayları görüntülemek için sol taraftan bir mesaj seçin.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Mesajı Sil</h3>
            <p className="text-gray-600 mb-6">
              Bu mesajı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
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