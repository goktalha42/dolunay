"use client";

import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaPlus, FaEdit, FaTrash, FaClock, FaUser, FaMapMarkerAlt } from "react-icons/fa";

// Demo etkinlikler
const demoEvents = [
  {
    id: 1,
    title: "Ahmet Yılmaz - İşitme Testi",
    start: "2025-03-25T09:00:00",
    end: "2025-03-25T09:30:00",
    type: "test",
    customer: "Ahmet Yılmaz",
    location: "Merkez Şube"
  },
  {
    id: 2,
    title: "Fatma Kaya - Kontrol",
    start: "2025-03-25T10:00:00",
    end: "2025-03-25T10:30:00",
    type: "control",
    customer: "Fatma Kaya",
    location: "Merkez Şube"
  },
  {
    id: 3,
    title: "Mehmet Demir - Cihaz Teslimi",
    start: "2025-03-25T11:30:00",
    end: "2025-03-25T12:00:00",
    type: "delivery",
    customer: "Mehmet Demir",
    location: "Merkez Şube"
  },
  {
    id: 4,
    title: "Ayşe Şahin - İşitme Testi",
    start: "2025-03-26T14:00:00",
    end: "2025-03-26T14:30:00",
    type: "test",
    customer: "Ayşe Şahin",
    location: "Merkez Şube"
  },
  {
    id: 5,
    title: "Ali Öztürk - Danışma",
    start: "2025-03-26T15:30:00",
    end: "2025-03-26T16:00:00",
    type: "consultation",
    customer: "Ali Öztürk",
    location: "Merkez Şube"
  },
  {
    id: 6,
    title: "Zeynep Aydın - Bakım",
    start: "2025-03-27T10:30:00",
    end: "2025-03-27T11:00:00",
    type: "maintenance",
    customer: "Zeynep Aydın",
    location: "Merkez Şube"
  }
];

// Türkçe ay isimleri
const MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

// Türkçe gün isimleri
const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];
const SHORT_DAYS = ["Pts", "Sal", "Çar", "Per", "Cum", "Cts", "Paz"];

export default function CalendarAdmin() {
  const [events, setEvents] = useState(demoEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState("month"); // month, week, day
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Ayın ilk gününü belirle
  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    // Pazartesi = 0 olacak şekilde ayarla (JS'de Pazar = 0)
    return (firstDay.getDay() === 0) ? 6 : firstDay.getDay() - 1;
  };
  
  // Aydaki gün sayısını belirle
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  // Sonraki aya/haftaya/güne geç
  const nextPeriod = () => {
    if (currentView === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    } else if (currentView === "week") {
      const nextWeek = new Date(currentDate);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setCurrentDate(nextWeek);
    } else {
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      setCurrentDate(nextDay);
    }
  };
  
  // Önceki aya/haftaya/güne geç
  const prevPeriod = () => {
    if (currentView === "month") {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    } else if (currentView === "week") {
      const prevWeek = new Date(currentDate);
      prevWeek.setDate(prevWeek.getDate() - 7);
      setCurrentDate(prevWeek);
    } else {
      const prevDay = new Date(currentDate);
      prevDay.setDate(prevDay.getDate() - 1);
      setCurrentDate(prevDay);
    }
  };
  
  // Bugüne dön
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  // Tarih, ay, yıl formatı
  const formatDate = (date: Date) => {
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
  };
  
  // Saat, dakika formatı
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };
  
  // Etkinlik arkaplan rengi
  const getEventColor = (type: string) => {
    switch(type) {
      case 'test':
        return 'bg-blue-100 border-blue-400 text-blue-800';
      case 'control':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'delivery':
        return 'bg-purple-100 border-purple-400 text-purple-800';
      case 'consultation':
        return 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'maintenance':
        return 'bg-gray-100 border-gray-400 text-gray-800';
      default:
        return 'bg-blue-100 border-blue-400 text-blue-800';
    }
  };
  
  // Gün için etkinlikleri filtrele
  const getEventsForDay = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  // Etkinlik görüntüleme
  const viewEvent = (event: any) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };
  
  // Etkinlik silme onay
  const confirmDelete = () => {
    setShowDeleteModal(true);
  };
  
  // Etkinlik silme
  const handleDeleteEvent = () => {
    setEvents(events.filter(event => event.id !== selectedEvent.id));
    setShowDeleteModal(false);
    setShowEventModal(false);
  };
  
  // Takvim oluştur (ay görünümü)
  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Önceki ayın günlerini ekle
    const prevMonthDays = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();
    for (let i = 1; i <= firstDayOfMonth; i++) {
      days.push({
        day: prevMonthDays - firstDayOfMonth + i,
        isCurrentMonth: false,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, prevMonthDays - firstDayOfMonth + i)
      });
    }
    
    // Mevcut ayın günlerini ekle
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      });
    }
    
    // Sonraki ayın günlerini ekle (42 güne tamamla - 6 satır * 7 gün)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day)
      });
    }
    
    // Haftaları oluştur
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    
    return (
      <div className="mt-4">
        {/* Günler */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {SHORT_DAYS.map((day, index) => (
            <div key={index} className="bg-gray-50 text-gray-500 text-xs uppercase py-2 text-center">
              {day}
            </div>
          ))}
        </div>
        
        {/* Takvim Hücreleri */}
        <div className="bg-gray-200 gap-px">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-px">
              {week.map((day, dayIndex) => {
                const dayEvents = getEventsForDay(day.day);
                const today = new Date();
                const isToday = day.isCurrentMonth && 
                  day.date.getDate() === today.getDate() && 
                  day.date.getMonth() === today.getMonth() && 
                  day.date.getFullYear() === today.getFullYear();
                
                return (
                  <div 
                    key={dayIndex} 
                    className={`bg-white min-h-[100px] ${!day.isCurrentMonth ? 'bg-opacity-50' : ''}`}
                  >
                    <div className={`text-right p-1 ${isToday ? 'bg-blue-100' : ''}`}>
                      <span className={`inline-block rounded-full w-6 h-6 text-center leading-6 text-sm
                        ${isToday ? 'bg-blue-500 text-white' : day.isCurrentMonth ? 'text-gray-700' : 'text-gray-400'}`}>
                        {day.day}
                      </span>
                    </div>
                    <div className="p-1 space-y-1">
                      {dayEvents.slice(0, 3).map((event, eventIndex) => (
                        <div 
                          key={eventIndex}
                          className={`text-xs p-1 rounded border-l-2 truncate cursor-pointer ${getEventColor(event.type)}`}
                          onClick={() => viewEvent(event)}
                        >
                          {formatTime(event.start)} {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          + {dayEvents.length - 3} daha fazla
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Günlük görünüm
  const renderDayView = () => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    const dayEvents = events.filter(event => event.start.startsWith(dateStr));
    dayEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
    
    // Saat dilimleri
    const hours = [];
    for (let i = 8; i <= 18; i++) {
      hours.push(`${i}:00`);
    }
    
    return (
      <div className="mt-4">
        <div className="bg-white border rounded-lg shadow-sm">
          {hours.map((hour, index) => {
            // Bu saat dilimine düşen etkinlikler
            const hourEvents = dayEvents.filter(event => {
              const eventHour = new Date(event.start).getHours();
              return eventHour === parseInt(hour.split(':')[0]);
            });
            
            return (
              <div key={index} className="border-b last:border-b-0">
                <div className="grid grid-cols-12 min-h-[80px]">
                  <div className="col-span-1 border-r p-2 text-center text-sm text-gray-500">
                    {hour}
                  </div>
                  <div className="col-span-11 p-2 relative">
                    {hourEvents.map((event, eventIndex) => (
                      <div 
                        key={eventIndex}
                        className={`absolute left-2 right-2 p-2 rounded border-l-2 ${getEventColor(event.type)}`}
                        style={{ 
                          top: `${(new Date(event.start).getMinutes() / 60) * 100}%`,
                          height: `${((new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 60 * 60)) * 100}%`
                        }}
                        onClick={() => viewEvent(event)}
                      >
                        <div className="text-sm font-medium">{event.title}</div>
                        <div className="text-xs flex items-center mt-1">
                          <FaClock className="mr-1" size={10} />
                          {formatTime(event.start)} - {formatTime(event.end)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Takvim</h1>
        <button className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          <FaPlus className="mr-2" />
          Yeni Etkinlik
        </button>
      </div>
      
      {/* Takvim Kontrolleri */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              className="p-2 rounded-lg hover:bg-gray-100"
              onClick={prevPeriod}
            >
              <FaChevronLeft />
            </button>
            <button 
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              onClick={goToToday}
            >
              Bugün
            </button>
            <button 
              className="p-2 rounded-lg hover:bg-gray-100"
              onClick={nextPeriod}
            >
              <FaChevronRight />
            </button>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {currentView === "month" 
              ? `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
              : formatDate(currentDate)
            }
          </h2>
          <div className="flex border rounded-lg overflow-hidden">
            <button 
              className={`px-3 py-1 text-sm ${currentView === 'month' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setCurrentView('month')}
            >
              Ay
            </button>
            <button 
              className={`px-3 py-1 text-sm ${currentView === 'day' ? 'bg-gray-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              onClick={() => setCurrentView('day')}
            >
              Gün
            </button>
          </div>
        </div>
      </div>
      
      {/* Takvim İçeriği */}
      {currentView === "month" ? renderMonthView() : renderDayView()}
      
      {/* Etkinlik Detay Modalı */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900">{selectedEvent.title}</h3>
              <div className="flex space-x-2">
                <button className="text-blue-500 hover:text-blue-700">
                  <FaEdit />
                </button>
                <button 
                  className="text-red-500 hover:text-red-700"
                  onClick={confirmDelete}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <FaClock className="mr-2" />
                <span>{formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaUser className="mr-2" />
                <span>{selectedEvent.customer}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="mr-2" />
                <span>{selectedEvent.location}</span>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={() => setShowEventModal(false)}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Etkinliği Silmeyi Onaylayın</h3>
            <p className="text-sm text-gray-500 mb-4">
              Bu etkinliği silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
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
                onClick={handleDeleteEvent}
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