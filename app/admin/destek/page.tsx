"use client";

import { useState } from "react";
import { FaSearch, FaFilter, FaPlus, FaUser, FaHeadset, FaCheck, FaClock, FaExclamationTriangle, FaTimes, FaReply } from "react-icons/fa";

// Demo destek talepleri
const demoTickets = [
  {
    id: 1,
    subject: "İşitme Cihazı Arızası",
    customer: "Ahmet Yılmaz",
    email: "ahmet.yilmaz@example.com",
    phone: "0532 123 4567",
    status: "open", // open, inProgress, closed
    priority: "high", // low, medium, high
    category: "Teknik Destek",
    created: "24.03.2025 - 09:15",
    lastUpdate: "24.03.2025 - 10:30",
    agent: "Admin",
    messages: [
      {
        id: 1,
        from: "customer",
        message: "Vista Bluetooth İşitme Cihazım çalışmayı durdurdu. Şarj ettim ancak açılmıyor. Acil yardımınıza ihtiyacım var.",
        date: "24.03.2025 - 09:15"
      },
      {
        id: 2,
        from: "agent",
        message: "Merhaba Ahmet Bey, sorununuz için üzgünüm. Reset düğmesine 10 saniye basılı tutup yeniden başlatmayı denediniz mi?",
        date: "24.03.2025 - 10:30"
      }
    ]
  },
  {
    id: 2,
    subject: "Ödeme Sorunu",
    customer: "Fatma Kaya",
    email: "fatma.kaya@example.com",
    phone: "0533 765 4321",
    status: "inProgress",
    priority: "medium",
    category: "Fatura/Ödeme",
    created: "23.03.2025 - 14:20",
    lastUpdate: "23.03.2025 - 16:45",
    agent: "Admin",
    messages: [
      {
        id: 1,
        from: "customer",
        message: "Kredi kartı ile yaptığım ödeme iki kere çekilmiş görünüyor. Bu durumun düzeltilmesini rica ediyorum.",
        date: "23.03.2025 - 14:20"
      },
      {
        id: 2,
        from: "agent",
        message: "Merhaba Fatma Hanım, ödeme bilgilerinizi kontrol ediyorum. Biraz bekleyebilir misiniz?",
        date: "23.03.2025 - 15:30"
      },
      {
        id: 3,
        from: "agent",
        message: "Sistemde çift ödeme tespit ettim. İade işlemi başlattım, 2-3 iş günü içinde kartınıza yansıyacaktır.",
        date: "23.03.2025 - 16:45"
      }
    ]
  },
  {
    id: 3,
    subject: "Randevu Değişikliği",
    customer: "Mehmet Demir",
    email: "mehmet.demir@example.com",
    phone: "0535 987 6543",
    status: "closed",
    priority: "low",
    category: "Randevu",
    created: "22.03.2025 - 11:10",
    lastUpdate: "22.03.2025 - 12:30",
    agent: "Admin",
    messages: [
      {
        id: 1,
        from: "customer",
        message: "27 Mart tarihindeki kontrol randevumu 29 Mart'a alabilir miyim?",
        date: "22.03.2025 - 11:10"
      },
      {
        id: 2,
        from: "agent",
        message: "Merhaba Mehmet Bey, 29 Mart saat 10:30'da müsait bir randevu bulunmaktadır. Bu saatte uygun musunuz?",
        date: "22.03.2025 - 11:45"
      },
      {
        id: 3,
        from: "customer",
        message: "Evet, bu saat benim için uygun. Teşekkür ederim.",
        date: "22.03.2025 - 12:15"
      },
      {
        id: 4,
        from: "agent",
        message: "Randevunuz 29 Mart saat 10:30 olarak güncellenmiştir. Görüşmek üzere.",
        date: "22.03.2025 - 12:30"
      }
    ]
  },
  {
    id: 4,
    subject: "İşitme Cihazı Bakımı",
    customer: "Ali Öztürk",
    email: "ali.ozturk@example.com",
    phone: "0539 234 5678",
    status: "open",
    priority: "medium",
    category: "Teknik Destek",
    created: "21.03.2025 - 15:30",
    lastUpdate: "21.03.2025 - 15:30",
    agent: null,
    messages: [
      {
        id: 1,
        from: "customer",
        message: "İşitme cihazımın düzenli bakımı için ne yapmam gerekiyor? Ne sıklıkla temizlik yapmalıyım?",
        date: "21.03.2025 - 15:30"
      }
    ]
  },
  {
    id: 5,
    subject: "Garanti Sorgulama",
    customer: "Zeynep Aydın",
    email: "zeynep.aydin@example.com",
    phone: "0531 876 5432",
    status: "inProgress",
    priority: "low",
    category: "Garanti",
    created: "20.03.2025 - 10:15",
    lastUpdate: "21.03.2025 - 09:30",
    agent: "Admin",
    messages: [
      {
        id: 1,
        from: "customer",
        message: "Geçen yıl aldığım Vista Premium cihazının garanti süresini öğrenmek istiyorum.",
        date: "20.03.2025 - 10:15"
      },
      {
        id: 2,
        from: "agent",
        message: "Merhaba Zeynep Hanım, cihazınızın seri numarasını paylaşabilir misiniz?",
        date: "20.03.2025 - 14:45"
      },
      {
        id: 3,
        from: "customer",
        message: "Seri numarası: VP2023-45678",
        date: "21.03.2025 - 09:00"
      },
      {
        id: 4,
        from: "agent",
        message: "Teşekkürler, cihazınızın garanti bilgilerini kontrol ediyorum.",
        date: "21.03.2025 - 09:30"
      }
    ]
  }
];

export default function SupportAdmin() {
  const [tickets, setTickets] = useState(demoTickets);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, open, inProgress, closed
  const [priorityFilter, setPriorityFilter] = useState("all"); // all, low, medium, high
  const [selectedTicket, setSelectedTicket] = useState<typeof demoTickets[0] | null>(null);
  const [replyText, setReplyText] = useState("");
  
  // Duruma göre etiket rengi
  const getStatusStyles = (status: string) => {
    switch(status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'inProgress':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Önceliğe göre etiket rengi
  const getPriorityStyles = (priority: string) => {
    switch(priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Öncelik için ikon
  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'high':
        return <FaExclamationTriangle className="text-red-500" />;
      case 'medium':
        return <FaClock className="text-yellow-500" />;
      case 'low':
        return <FaCheck className="text-green-500" />;
      default:
        return null;
    }
  };
  
  // Filtreleme
  const filteredTickets = tickets.filter(ticket => {
    // Arama filtresi
    const searchMatch = 
      ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Durum filtresi
    const statusMatch = statusFilter === "all" || ticket.status === statusFilter;
    
    // Öncelik filtresi
    const priorityMatch = priorityFilter === "all" || ticket.priority === priorityFilter;
    
    return searchMatch && statusMatch && priorityMatch;
  });
  
  // Talep seçme
  const selectTicket = (ticket: typeof demoTickets[0]) => {
    setSelectedTicket(ticket);
  };
  
  // Yanıt gönderme
  const sendReply = () => {
    if (replyText.trim() === "" || !selectedTicket) return;
    
    const newMessage = {
      id: selectedTicket.messages.length + 1,
      from: "agent",
      message: replyText.trim(),
      date: `${new Date().toLocaleDateString('tr-TR')} - ${new Date().toLocaleTimeString('tr-TR').slice(0, 5)}`
    };
    
    const updatedTicket = {
      ...selectedTicket,
      status: "inProgress",
      lastUpdate: newMessage.date,
      messages: [...selectedTicket.messages, newMessage]
    };
    
    setTickets(tickets.map(ticket => 
      ticket.id === selectedTicket.id ? updatedTicket : ticket
    ));
    
    setSelectedTicket(updatedTicket);
    setReplyText("");
  };
  
  // Talebi kapat
  const closeTicket = () => {
    if (!selectedTicket) return;
    
    const updatedTicket = {
      ...selectedTicket,
      status: "closed",
      lastUpdate: `${new Date().toLocaleDateString('tr-TR')} - ${new Date().toLocaleTimeString('tr-TR').slice(0, 5)}`
    };
    
    setTickets(tickets.map(ticket => 
      ticket.id === selectedTicket.id ? updatedTicket : ticket
    ));
    
    setSelectedTicket(updatedTicket);
  };
  
  // Durumu Türkçeleştir
  const getStatusText = (status: string) => {
    switch(status) {
      case 'open':
        return 'Açık';
      case 'inProgress':
        return 'İşlemde';
      case 'closed':
        return 'Kapalı';
      default:
        return status;
    }
  };
  
  // Önceliği Türkçeleştir
  const getPriorityText = (priority: string) => {
    switch(priority) {
      case 'high':
        return 'Yüksek';
      case 'medium':
        return 'Orta';
      case 'low':
        return 'Düşük';
      default:
        return priority;
    }
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Destek Talepleri</h1>
        <button className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          <FaPlus className="mr-2" />
          Yeni Talep Oluştur
        </button>
      </div>
      
      {/* Filtreler ve Arama */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between items-center">
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Talep ara..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400 mr-1" />
            <span className="text-sm font-medium text-gray-700 mr-2">Durum:</span>
            <select
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tümü</option>
              <option value="open">Açık</option>
              <option value="inProgress">İşlemde</option>
              <option value="closed">Kapalı</option>
            </select>
            
            <span className="text-sm font-medium text-gray-700 mx-2">Öncelik:</span>
            <select
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">Tümü</option>
              <option value="high">Yüksek</option>
              <option value="medium">Orta</option>
              <option value="low">Düşük</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Ana İçerik */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Talep Listesi */}
        <div className="md:col-span-5 lg:col-span-4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                Talepler ({filteredTickets.length})
              </h2>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {filteredTickets.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Gösterilecek talep bulunamadı
                </div>
              ) : (
                filteredTickets.map(ticket => (
                  <div 
                    key={ticket.id}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${selectedTicket?.id === ticket.id ? 'bg-gray-50' : ''}`}
                    onClick={() => selectTicket(ticket)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{ticket.subject}</h3>
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <FaUser className="mr-1 text-gray-400" size={10} />
                          {ticket.customer}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyles(ticket.status)}`}>
                          {getStatusText(ticket.status)}
                        </span>
                        <span className="text-xs text-gray-500 mt-1 flex items-center">
                          {getPriorityIcon(ticket.priority)}
                          <span className="ml-1">{getPriorityText(ticket.priority)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>{ticket.category}</span>
                      <span>{ticket.lastUpdate.split(' - ')[0]}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
        {/* Talep Detayı */}
        <div className="md:col-span-7 lg:col-span-8">
          {selectedTicket ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
              {/* Üst Bilgi */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">{selectedTicket.subject}</h2>
                  <div className="flex space-x-2">
                    {selectedTicket.status !== "closed" && (
                      <button 
                        className="flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors text-sm"
                        onClick={closeTicket}
                      >
                        <FaTimes className="mr-1" />
                        Talebi Kapat
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Talep ID:</span>
                    <span className="ml-1 font-medium">#{selectedTicket.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Durum:</span>
                    <span className={`ml-1 font-medium ${selectedTicket.status === 'open' ? 'text-blue-700' : 
                      selectedTicket.status === 'inProgress' ? 'text-yellow-700' : 'text-green-700'}`}>
                      {getStatusText(selectedTicket.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Öncelik:</span>
                    <span className={`ml-1 font-medium ${selectedTicket.priority === 'high' ? 'text-red-700' : 
                      selectedTicket.priority === 'medium' ? 'text-yellow-700' : 'text-green-700'}`}>
                      {getPriorityText(selectedTicket.priority)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Kategori:</span>
                    <span className="ml-1 font-medium">{selectedTicket.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Müşteri:</span>
                    <span className="ml-1 font-medium">{selectedTicket.customer}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">E-posta:</span>
                    <span className="ml-1">{selectedTicket.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Telefon:</span>
                    <span className="ml-1">{selectedTicket.phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Oluşturulma:</span>
                    <span className="ml-1">{selectedTicket.created}</span>
                  </div>
                </div>
              </div>
              
              {/* Mesajlar */}
              <div className="flex-grow p-4 overflow-y-auto max-h-[400px]">
                {selectedTicket.messages.map(message => (
                  <div 
                    key={message.id}
                    className={`mb-4 flex ${message.from === 'agent' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-lg rounded-lg p-3 ${message.from === 'agent' ? 
                      'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-900'}`}
                    >
                      <div className="text-sm">{message.message}</div>
                      <div className="text-xs mt-1 text-gray-500 text-right">
                        {message.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Yanıt Formu */}
              {selectedTicket.status !== "closed" && (
                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-start">
                    <div className="mr-2 mt-2">
                      <FaHeadset className="text-gray-500" />
                    </div>
                    <div className="flex-grow">
                      <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        placeholder="Yanıtınızı yazın..."
                        rows={3}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                      ></textarea>
                      <div className="flex justify-end mt-2">
                        <button 
                          className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                          onClick={sendReply}
                          disabled={replyText.trim() === ""}
                        >
                          <FaReply className="mr-2" />
                          Yanıtla
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center h-full flex items-center justify-center">
              <div>
                <FaHeadset className="mx-auto text-5xl text-gray-400 opacity-20 mb-4" />
                <h3 className="text-lg font-medium text-gray-700">Detayları Görüntülemek İçin Bir Talep Seçin</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Destek talebi detaylarını görüntülemek ve yanıtlamak için listeden bir talep seçin.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 