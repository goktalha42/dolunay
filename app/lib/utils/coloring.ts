/**
 * Özellik metinleri için otomatik renk belirleme yardımcısı
 * Özellik adına göre uygun renk ve arka plan rengi seçer
 */

interface ColorData {
  bg: string;
  text: string;
  border: string;
}

// Temel renkler
const colors: { [key: string]: ColorData } = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200'
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200'
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-800', 
    border: 'border-purple-200'
  },
  indigo: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    border: 'border-indigo-200'
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200'
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200'
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200'
  },
  teal: {
    bg: 'bg-teal-100',
    text: 'text-teal-800',
    border: 'border-teal-200'
  },
  gray: {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200'
  }
};

// Anahtar kelimeler ve eşleşen renkler
const keywordColorMap: { [key: string]: string } = {
  // Mavi tonu
  bluetooth: 'blue',
  bağlantı: 'blue',
  kablosuz: 'blue',
  wifi: 'blue',
  
  // Yeşil tonu
  pil: 'green',
  şarj: 'green',
  batarya: 'green',
  enerji: 'green',
  
  // Mor tonu
  konfor: 'purple',
  konforlu: 'purple',
  premium: 'purple',
  lüks: 'purple',
  
  // İndigo tonu
  ses: 'indigo',
  kalite: 'indigo',
  netlik: 'indigo',
  
  // Kırmızı tonu 
  alarm: 'red',
  uyarı: 'red',
  
  // Sarı tonu
  güvenlik: 'yellow',
  koruma: 'yellow',
  
  // Turuncu tonu
  akıllı: 'orange',
  smart: 'orange',
  otomatik: 'orange',
  
  // Teal tonu
  su: 'teal',
  nem: 'teal',
  sıvı: 'teal',
  
  // Gri tonu (varsayılan)
  varsayılan: 'gray'
};

/**
 * Özellik adına göre uygun renk sınıflarını belirler
 * @param featureName Özellik adı
 * @returns Renk sınıfları (bg, text, border)
 */
export function getFeatureColor(featureName: string): ColorData {
  if (!featureName) return colors.gray; // Varsayılan renk
  
  const lowerName = featureName.toLowerCase();
  
  // Anahtar kelimeleri kontrol et
  for (const [keyword, colorName] of Object.entries(keywordColorMap)) {
    if (lowerName.includes(keyword)) {
      return colors[colorName];
    }
  }
  
  // Hiçbir eşleşme yoksa metinin uzunluğuna göre renk belirle (döngülü olarak)
  const colorNames = Object.keys(colors);
  const colorIndex = featureName.length % colorNames.length;
  
  return colors[colorNames[colorIndex]];
}

/**
 * Özellik adına göre uygun CSS sınıfları dizisini döndürür
 * @param featureName Özellik adı
 * @returns CSS sınıfları dizisi
 */
export function getFeatureClassNames(featureName: string): string[] {
  const { bg, text, border } = getFeatureColor(featureName);
  return [bg, text, border];
} 