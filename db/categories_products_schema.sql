-- Veritabanı oluştur (eğer mevcut değilse)
CREATE DATABASE IF NOT EXISTS dolunay_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dolunay_db;

-- Kategoriler tablosu
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  parent_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Ürünler tablosu
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  short_description TEXT,
  category_id INT,
  segment VARCHAR(50) DEFAULT 'orta', -- başlangıç, orta, üst
  main_image VARCHAR(255) DEFAULT '/images/products/default.jpg',
  additional_images JSON, -- JSON formatında resim dizisi
  features JSON, -- JSON formatında özellikler dizisi
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Temel kategorileri ekle
INSERT INTO categories (id, name, parent_id) VALUES 
(1, 'İşitme Cihazları', NULL),
(2, 'Kulaklık Tipleri', NULL),
(3, 'Kulak İçi', 2),
(4, 'Kulak Arkası', 2),
(5, 'Aksesuarlar', NULL);

-- Örnek ürünler
INSERT INTO products (title, short_description, category_id, segment, main_image, additional_images, features) VALUES 
('Vista V30 Pro İşitme Cihazı', 'Çok kanallı, gürültü azaltma teknolojisine sahip dijital işitme cihazı', 1, 'üst', '/images/products/default.jpg', 
 '["images/products/default.jpg"]', 
 '["Bluetooth bağlantısı", "Şarj edilebilir", "Su ve ter dirençli", "12 kanal dijital işleme"]'),
 
('Vista Mini Kulak İçi', 'Görünmez, küçük boyutlu kulak içi işitme cihazı', 3, 'orta', '/images/products/default.jpg', 
 '["images/products/default.jpg"]', 
 '["Kulak içi tasarım", "Uzun pil ömrü", "Otomatik ses ayarı"]'); 