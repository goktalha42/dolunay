"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaArrowLeft, FaCheckCircle, FaQuestionCircle, FaPhoneAlt } from "react-icons/fa";

export default function UygunlukTesti() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<"başlangıç" | "orta" | "üst" | null>(null);
  
  // Test soruları
  const questions = [
    {
      id: "hearing_level",
      question: "İşitme kaybınızın derecesi nedir?",
      options: [
        { value: "mild", label: "Hafif - Bazı sesleri duymakta güçlük çekiyorum" },
        { value: "moderate", label: "Orta - Normal konuşmaları duymakta zorluk yaşıyorum" },
        { value: "severe", label: "İleri - Konuşmaları yüksek sesle söylendiğinde duyabiliyorum" },
        { value: "profound", label: "Çok İleri - İşitme cihazı olmadan konuşmaları duyamıyorum" },
        { value: "unknown", label: "Bilmiyorum - Henüz bir test yaptırmadım" }
      ]
    },
    {
      id: "environment",
      question: "Günlük yaşamınızda en çok hangi ortamlarda bulunuyorsunuz?",
      options: [
        { value: "quiet", label: "Genellikle sessiz ortamlarda (ev, ofis vb.)" },
        { value: "mixed", label: "Hem sessiz hem gürültülü ortamlarda dengeli olarak" },
        { value: "noisy", label: "Sıklıkla gürültülü ortamlarda (restoranlar, toplantılar vb.)" },
        { value: "outdoor", label: "Çoğunlukla dış mekanlarda" }
      ]
    },
    {
      id: "tech_usage",
      question: "Teknolojik cihazları ne sıklıkta kullanıyorsunuz?",
      options: [
        { value: "low", label: "Nadiren - Akıllı telefon veya bilgisayar çok az kullanırım" },
        { value: "medium", label: "Orta - Günlük olarak telefonumu kullanırım, bazen TV izlerim" },
        { value: "high", label: "Sık - Akıllı telefon, TV, bilgisayar gibi cihazları yoğun kullanırım" },
        { value: "very_high", label: "Çok Sık - Teknoloji hayatımın ayrılmaz bir parçası" }
      ]
    },
    {
      id: "lifestyle",
      question: "Sosyal yaşam tarzınızı nasıl tanımlarsınız?",
      options: [
        { value: "quiet", label: "Sakin - Genelde evde veya küçük arkadaş gruplarıyla vakit geçiririm" },
        { value: "active", label: "Aktif - Sık sık dışarı çıkar, sosyal etkinliklere katılırım" },
        { value: "very_active", label: "Çok Aktif - Sürekli hareket halindeyim, kalabalık ortamlarda bulunurum" },
        { value: "mixed", label: "Karma - Bazen aktif, bazen sakin bir yaşam tarzım var" }
      ]
    },
    {
      id: "budget",
      question: "İşitme cihazı için düşündüğünüz bütçe aralığı nedir?",
      options: [
        { value: "economic", label: "Ekonomik - SGK'nın karşıladığı oranda veya biraz üstü" },
        { value: "mid_range", label: "Orta Segment - Performans/fiyat dengesi önemli" },
        { value: "premium", label: "Premium - En iyi teknolojiyi ve özellikleri istiyorum" },
        { value: "undecided", label: "Kararsızım - Henüz bir bütçe belirlemedim" }
      ]
    }
  ];
  
  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
    if (step < questions.length) {
      setStep(step + 1);
    } else {
      // Son adımda sonucu hesapla
      calculateResult();
    }
  };
  
  const calculateResult = () => {
    // Basit bir hesaplama algoritması
    let score = 0;
    
    // İşitme kaybı derecesi
    if (answers.hearing_level === "mild") score += 1;
    else if (answers.hearing_level === "moderate") score += 2;
    else if (answers.hearing_level === "severe") score += 3;
    else if (answers.hearing_level === "profound") score += 4;
    
    // Ortam
    if (answers.environment === "quiet") score += 1;
    else if (answers.environment === "mixed") score += 2;
    else if (answers.environment === "noisy") score += 3;
    else if (answers.environment === "outdoor") score += 3;
    
    // Teknoloji kullanımı
    if (answers.tech_usage === "low") score += 1;
    else if (answers.tech_usage === "medium") score += 2;
    else if (answers.tech_usage === "high") score += 3;
    else if (answers.tech_usage === "very_high") score += 4;
    
    // Yaşam tarzı
    if (answers.lifestyle === "quiet") score += 1;
    else if (answers.lifestyle === "mixed") score += 2;
    else if (answers.lifestyle === "active") score += 3;
    else if (answers.lifestyle === "very_active") score += 4;
    
    // Bütçe
    if (answers.budget === "economic") score += 1;
    else if (answers.budget === "mid_range") score += 2;
    else if (answers.budget === "premium") score += 4;
    
    // Toplam puana göre segment belirleme
    const maxPossibleScore = 20; // 5 soru, her biri max 4 puan
    const percentage = (score / maxPossibleScore) * 100;
    
    if (percentage < 40) {
      setResult("başlangıç");
    } else if (percentage < 70) {
      setResult("orta");
    } else {
      setResult("üst");
    }
  };
  
  const resetTest = () => {
    setStep(1);
    setAnswers({});
    setResult(null);
  };
  
  const renderSegmentProducts = () => {
    if (!result) return null;
    
    const segmentInfo = {
      başlangıç: {
        title: "Başlangıç Seviyesi İşitme Cihazları",
        description: "Temel işitme ihtiyaçlarınızı karşılayacak, kullanımı kolay ve ekonomik cihazlar",
        imageUrl: "/images/UN_Packshot_B-312_Right_Right_Receiver_P7_Pewter_Actual_Size_RGB_050-6401-P744_01.png"
      },
      orta: {
        title: "Orta Seviye İşitme Cihazları",
        description: "Dengeli performans ve fiyat sunan, birçok ortamda iyi çalışan cihazlar",
        imageUrl: "/images/UN_Packshot_B-312_Right_Right_Receiver_P7_Pewter_Actual_Size_RGB_050-6401-P744_01.png"
      },
      üst: {
        title: "Üst Seviye İşitme Cihazları",
        description: "En gelişmiş teknoloji ve özelliklere sahip, her ortamda üstün performans sunan cihazlar",
        imageUrl: "/images/UN_Packshot_B-312_Right_Right_Receiver_P7_Pewter_Actual_Size_RGB_050-6401-P744_01.png"
      }
    };
    
    return (
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">{segmentInfo[result].title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="text-center">
              <div className="relative h-48 mb-3">
                <Image 
                  src={segmentInfo[result].imageUrl}
                  alt="İşitme Cihazı" 
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-medium text-gray-900">Vista {result === "başlangıç" ? "Essential" : result === "orta" ? "Comfort" : "Premium"}</h3>
              <p className="text-sm text-gray-500 mt-1">
                <span className={`text-xs ${result === "başlangıç" ? "bg-green-100 text-green-800" : result === "orta" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"} px-2 py-0.5 rounded-full`}>
                  {result === "başlangıç" ? "Başlangıç Seviyesi" : result === "orta" ? "Orta Seviye" : "Üst Seviye"}
                </span>
              </p>
              <div className="mt-4">
                <Link 
                  href="/urunlerimiz"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Ürünleri İncele
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Size Uygun İşitme Cihazını Bulun</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Birkaç soruya vereceğiniz cevaplarla, ihtiyaçlarınıza ve yaşam tarzınıza en uygun işitme cihazı segmentini belirlemenize yardımcı olalım.
          </p>
        </div>
        
        {/* Test Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
          {!result ? (
            <>
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${(step / questions.length) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-gray-500 text-right">
                  Soru {step}/{questions.length}
                </div>
              </div>
              
              {/* Question */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <FaQuestionCircle className="text-blue-500 mr-2" />
                  {questions[step-1].question}
                </h2>
                <div className="space-y-3">
                  {questions[step-1].options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(questions[step-1].id, option.value)}
                      className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-start">
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex-shrink-0 mt-0.5"></div>
                        <div className="ml-3">
                          <span className="font-medium text-gray-900">{option.label}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex justify-between">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="flex items-center text-gray-600 hover:text-gray-900"
                  >
                    <FaArrowLeft className="mr-2" /> Önceki Soru
                  </button>
                )}
                <div></div> {/* Boş div ile sağa hizalama */}
              </div>
            </>
          ) : (
            // Result Section
            <div className="text-center">
              <div className="inline-block p-4 bg-blue-100 text-blue-700 rounded-full mb-6">
                <FaCheckCircle className="w-12 h-12" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Değerlendirme Sonucunuz</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                Verdiğiniz cevaplara göre, sizin için en uygun işitme cihazı segmenti:
              </p>
              
              <div className="mb-8">
                <span className={`text-2xl font-bold px-6 py-2 rounded-full ${
                  result === "başlangıç" 
                    ? "bg-green-100 text-green-800" 
                    : result === "orta" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-purple-100 text-purple-800"
                }`}>
                  {result === "başlangıç" 
                    ? "Başlangıç Seviyesi" 
                    : result === "orta" 
                      ? "Orta Seviye" 
                      : "Üst Seviye"
                  } İşitme Cihazları
                </span>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 text-left">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Neden Bu Segment?</h3>
                <p className="text-gray-600 mb-4">
                  {result === "başlangıç" 
                    ? "Yaşam tarzınız ve ihtiyaçlarınız temel işitme özelliklerine sahip, ekonomik ve kullanımı kolay bir cihazla karşılanabilir." 
                    : result === "orta" 
                      ? "Aktif yaşam tarzınız ve teknoloji kullanımınız, daha gelişmiş özelliklere sahip orta segment bir cihazdan faydalanabileceğinizi gösteriyor." 
                      : "Yoğun sosyal yaşamınız, teknoloji kullanımınız ve işitme ihtiyaçlarınız en gelişmiş özelliklere sahip bir işitme cihazı gerektirebilir."
                  }
                </p>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">
                      {result === "başlangıç" 
                        ? "Temel işitme iyileştirmesi" 
                        : result === "orta" 
                          ? "Dengeli performans/fiyat oranı" 
                          : "Maksimum işitme performansı"
                      }
                    </span>
                  </div>
                  <div className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">
                      {result === "başlangıç" 
                        ? "Sessiz ve az gürültülü ortamlarda iyi performans" 
                        : result === "orta" 
                          ? "Çoğu ortamda yeterli performans" 
                          : "Her ortamda üstün işitme deneyimi"
                      }
                    </span>
                  </div>
                  <div className="flex items-start">
                    <FaCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">
                      {result === "başlangıç" 
                        ? "Temel teknolojik özellikler" 
                        : result === "orta" 
                          ? "Orta düzey teknolojik özellikler" 
                          : "En gelişmiş teknolojik özellikler"
                      }
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Önerilen ürünler */}
              {renderSegmentProducts()}
              
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <button
                  onClick={resetTest}
                  className="bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-lg inline-flex items-center hover:bg-gray-50 transition-colors font-medium"
                >
                  Testi Yeniden Başlat
                </button>
                <Link 
                  href="/urunlerimiz" 
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg inline-flex items-center hover:bg-blue-700 transition-colors font-medium"
                >
                  Tüm Ürünleri İncele
                </Link>
                <a 
                  href="tel:+905537502842" 
                  className="bg-green-600 text-white px-6 py-3 rounded-lg inline-flex items-center hover:bg-green-700 transition-colors font-medium"
                >
                  <FaPhoneAlt className="mr-2" /> Ücretsiz Danışmanlık İçin Arayın
                </a>
              </div>
            </div>
          )}
        </div>
        
        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/urunlerimiz"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" /> Ürünler Sayfasına Dön
          </Link>
        </div>
      </div>
    </div>
  );
} 