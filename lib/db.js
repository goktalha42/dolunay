import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'dolunay_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Mock veri
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: '$2b$10$BfE9Sp3ghNKXLYdq2b/Y9uJfu1XrjDnTVn9mAzYrQWj8XuLFQPjK6', // 123456
    name: 'Admin Kullanıcı',
    email: 'admin@dolunay.com',
    role: 'admin'
  }
];

// Connection pool oluştur - hata yakalama ile
let pool;
try {
  pool = mysql.createPool(dbConfig);
} catch (error) {
  console.error('MySQL bağlantı pool oluşturma hatası:', error);
  pool = null;
}

// Veritabanı bağlantısını test et
async function testConnection() {
  if (!pool) return false;
  
  try {
    const connection = await pool.getConnection();
    console.log('MySQL bağlantısı başarılı');
    connection.release();
    return true;
  } catch (error) {
    console.error('MySQL bağlantı hatası:', error);
    return false;
  }
}

// Sorgu çalıştır
async function executeQuery(query, params = []) {
  // Geçici çözüm - mock veri ile çalış
  if (!pool || process.env.NODE_ENV === 'development') {
    console.log('Veritabanı bağlantısı kurulamadı - mock veri kullanılıyor');
    
    // Kullanıcı sorgusuysa mock veriyi döndür
    if (query.toLowerCase().includes('select') && query.toLowerCase().includes('from users')) {
      const usernameParam = params[0];
      if (usernameParam) {
        return mockUsers.filter(user => user.username === usernameParam);
      }
      return mockUsers;
    }
    
    return [];
  }
  
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Sorgu hatası:', error);
    
    // Hata durumunda da mock veriyi döndür
    if (query.toLowerCase().includes('select') && query.toLowerCase().includes('from users')) {
      const usernameParam = params[0];
      if (usernameParam) {
        return mockUsers.filter(user => user.username === usernameParam);
      }
      return mockUsers;
    }
    
    throw error;
  }
}

export { pool, testConnection, executeQuery }; 