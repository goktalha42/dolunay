-- Veritabanı oluştur
CREATE DATABASE IF NOT EXISTS dolunay_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE dolunay_db;

-- Kullanıcılar tablosu
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  role ENUM('admin', 'editor', 'viewer') DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ürünler tablosu
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  status ENUM('Aktif', 'Pasif', 'Sınırlı', 'Tükendi') DEFAULT 'Aktif',
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Stok hareketleri tablosu
CREATE TABLE IF NOT EXISTS stock_movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  type ENUM('Giriş', 'Çıkış') NOT NULL,
  quantity INT NOT NULL,
  note TEXT,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Müşteriler tablosu
CREATE TABLE IF NOT EXISTS customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT,
  last_purchase_date DATE,
  total_purchases DECIMAL(10, 2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Belgeler tablosu
CREATE TABLE IF NOT EXISTS documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  category VARCHAR(100),
  file_size VARCHAR(20),
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

-- Blog yazıları tablosu
CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  image_url VARCHAR(255),
  is_published BOOLEAN DEFAULT FALSE,
  author_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  published_at TIMESTAMP NULL,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- Galeri tablosu
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- İletişim formları tablosu
CREATE TABLE IF NOT EXISTS contact_forms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status ENUM('Yeni', 'İnceleniyor', 'Yanıtlandı', 'Kapalı') DEFAULT 'Yeni',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Takvim/Etkinlikler tablosu
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  type VARCHAR(50),
  customer_id INT,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Bildirimler tablosu
CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info', 'warning', 'success') DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Destek tablosu
CREATE TABLE IF NOT EXISTS support_tickets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject VARCHAR(255) NOT NULL,
  customer_id INT,
  status ENUM('Açık', 'İşlemde', 'Kapalı') DEFAULT 'Açık',
  priority ENUM('Düşük', 'Orta', 'Yüksek') DEFAULT 'Orta',
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Destek mesajları tablosu
CREATE TABLE IF NOT EXISTS support_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  message TEXT NOT NULL,
  sender_type ENUM('customer', 'agent') NOT NULL,
  sender_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES support_tickets(id)
);

-- Admin hesabı oluştur (şifre: 123456)
INSERT INTO users (username, password, name, email, role)
VALUES ('admin', '$2y$10$V3eCRKoPhUJ9cgYX7e99N.frhIOIPLXuhCkUUWMTnEEOCYqNS4Q6.', 'Admin Kullanıcı', 'admin@dolunay.com', 'admin');

-- Örnek ürünler
INSERT INTO products (name, description, category, price, stock, status, image_url) VALUES
('Vista Bluetooth İşitme Cihazı Model V1', 'Bluetooth bağlantılı premium işitme cihazı', 'İşitme Cihazları', 12500, 15, 'Aktif', '/images/products/vista-v1.jpg'),
('Vista Kulak İçi İşitme Cihazı', 'Kulak içi yüksek kaliteli işitme cihazı', 'İşitme Cihazları', 8750, 8, 'Aktif', '/images/products/vista-in-ear.jpg'),
('İşitme Cihazı Bakım Kiti', 'Tam kapsamlı işitme cihazı bakım seti', 'Aksesuarlar', 450, 45, 'Aktif', '/images/products/maintenance-kit.jpg'),
('İşitme Cihazı Pili (6\'lı Paket)', 'Uzun ömürlü işitme cihazı pilleri', 'Sarf Malzemeleri', 120, 200, 'Aktif', '/images/products/batteries.jpg'),
('Vista Premium İşitme Cihazı', 'En üst seviye teknolojiye sahip işitme cihazı', 'İşitme Cihazları', 18900, 4, 'Sınırlı', '/images/products/vista-premium.jpg'),
('Kulak Kalıbı', 'Özelleştirilebilir kulak kalıbı', 'Aksesuarlar', 350, 0, 'Tükendi', '/images/products/ear-mold.jpg'); 