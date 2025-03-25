import mysql from 'mysql2/promise';

// Çevresel değişkenleri kontrol et
const useMockData = process.env.USE_MOCK_DATA === 'true';

// Tip tanımlamaları
export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

export interface Product {
  id: number;
  title: string;
  short_description: string;
  category_id: number;
  segment: string;
  main_image: string;
  additional_images: string[];
  features: string[];
}

// Mock veriler
const mockCategories: Category[] = [
  { id: 0, name: 'Kategorisiz', parent_id: null },
  { id: 1, name: 'İşitme Cihazları', parent_id: null },
  { id: 2, name: 'Kulaklık Tipleri', parent_id: null },
  { id: 3, name: 'Kulak İçi', parent_id: 2 },
  { id: 4, name: 'Kulak Arkası', parent_id: 2 },
  { id: 5, name: 'Aksesuarlar', parent_id: null }
];

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Vista V30 Pro İşitme Cihazı',
    short_description: 'Çok kanallı, gürültü azaltma teknolojisine sahip dijital işitme cihazı',
    category_id: 1,
    segment: 'üst',
    main_image: '/images/products/default.jpg',
    additional_images: ['/images/products/default.jpg'],
    features: ['Bluetooth bağlantısı', 'Şarj edilebilir', 'Su ve ter dirençli', '12 kanal dijital işleme']
  },
  {
    id: 2,
    title: 'Vista Mini Kulak İçi',
    short_description: 'Görünmez, küçük boyutlu kulak içi işitme cihazı',
    category_id: 3,
    segment: 'orta',
    main_image: '/images/products/default.jpg',
    additional_images: ['/images/products/default.jpg'],
    features: ['Kulak içi tasarım', 'Uzun pil ömrü', 'Otomatik ses ayarı']
  }
];

// MySQL veritabanı bağlantı havuzu
let pool: mysql.Pool | null = null;

try {
  if (!useMockData) {
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'root', 
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'dolunay_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    console.log('MySQL bağlantı havuzu oluşturuldu');
  }
} catch (error) {
  console.error('MySQL bağlantı havuzu oluşturma hatası:', error);
  pool = null;
}

// Kategori İşlemleri
export async function getCategories(): Promise<Category[]> {
  console.log('getCategories çağrıldı, mock veri:', useMockData);
  
  if (useMockData) {
    return [...mockCategories];
  }
  
  if (!pool) {
    console.error('Veritabanı bağlantısı yok, mock veri kullanılıyor');
    return [...mockCategories];
  }
  
  try {
    const [rows] = await pool.execute('SELECT * FROM categories ORDER BY name');
    return rows as Category[];
  } catch (error) {
    console.error('Kategoriler getirilirken hata:', error);
    return [...mockCategories]; // Hata durumunda mock veri döndür
  }
}

export async function getCategoryById(id: number): Promise<Category | undefined> {
  if (useMockData) {
    return mockCategories.find(c => c.id === id);
  }
  
  if (!pool) return mockCategories.find(c => c.id === id);
  
  try {
    const [rows] = await pool.execute('SELECT * FROM categories WHERE id = ?', [id]);
    const result = rows as Category[];
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error('Kategori getirilirken hata:', error);
    return mockCategories.find(c => c.id === id);
  }
}

export async function addCategory(category: Omit<Category, 'id'>): Promise<Category> {
  console.log('addCategory çağrıldı:', category, 'mock veri:', useMockData);
  
  if (useMockData) {
    const maxId = mockCategories.length > 0 
      ? Math.max(...mockCategories.map(c => c.id)) 
      : 0;
    const newCategory = { ...category, id: maxId + 1 };
    mockCategories.push(newCategory);
    return newCategory;
  }
  
  if (!pool) {
    throw new Error('Veritabanı bağlantısı kurulamadı');
  }
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO categories (name, parent_id) VALUES (?, ?)',
      [category.name, category.parent_id]
    ) as any;
    
    return {
      id: result.insertId,
      ...category
    };
  } catch (error) {
    console.error('Kategori eklenirken hata:', error);
    throw error;
  }
}

export async function updateCategory(id: number, category: Omit<Category, 'id'>): Promise<Category> {
  if (useMockData) {
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Kategori bulunamadı');
    
    const updatedCategory = { ...category, id };
    mockCategories[index] = updatedCategory;
    return updatedCategory;
  }
  
  if (!pool) {
    throw new Error('Veritabanı bağlantısı kurulamadı');
  }
  
  try {
    await pool.execute(
      'UPDATE categories SET name = ?, parent_id = ? WHERE id = ?',
      [category.name, category.parent_id, id]
    );
    
    return {
      id,
      ...category
    };
  } catch (error) {
    console.error('Kategori güncellenirken hata:', error);
    throw error;
  }
}

export async function deleteCategory(id: number): Promise<boolean> {
  if (useMockData) {
    // Alt kategorisi olan kategori silinemez
    const hasChildren = mockCategories.some(c => c.parent_id === id);
    if (hasChildren) return false;
    
    const index = mockCategories.findIndex(c => c.id === id);
    if (index === -1) return false;
    
    mockCategories.splice(index, 1);
    return true;
  }
  
  if (!pool) {
    throw new Error('Veritabanı bağlantısı kurulamadı');
  }
  
  try {
    // Önce alt kategorileri kontrol et
    const [childrenRows] = await pool.execute('SELECT COUNT(*) as count FROM categories WHERE parent_id = ?', [id]) as any;
    if (childrenRows[0].count > 0) {
      return false;
    }
    
    // Sonra bu kategoride ürün var mı kontrol et
    const [productRows] = await pool.execute('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [id]) as any;
    if (productRows[0].count > 0) {
      return false;
    }
    
    await pool.execute('DELETE FROM categories WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('Kategori silinirken hata:', error);
    throw error;
  }
}

// Ürün İşlemleri
export async function getProducts(): Promise<Product[]> {
  console.log('getProducts çağrıldı, mock veri:', useMockData);
  
  if (useMockData) {
    return [...mockProducts];
  }
  
  if (!pool) {
    console.error('Veritabanı bağlantısı yok, mock veri kullanılıyor');
    return [...mockProducts];
  }
  
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.title
    `);
    
    // JSON formatında saklanan alanları parse et
    return (rows as any[]).map(product => {
      if (product.features && typeof product.features === 'string') {
        product.features = JSON.parse(product.features);
      } else {
        product.features = [];
      }
      
      if (product.additional_images && typeof product.additional_images === 'string') {
        product.additional_images = JSON.parse(product.additional_images);
      } else {
        product.additional_images = [];
      }
      
      return product as Product;
    });
  } catch (error) {
    console.error('Ürünler getirilirken hata:', error);
    return [...mockProducts]; // Hata durumunda mock veri döndür
  }
}

export async function getProductById(id: number): Promise<Product | undefined> {
  if (useMockData) {
    return mockProducts.find(p => p.id === id);
  }
  
  if (!pool) return mockProducts.find(p => p.id === id);
  
  try {
    const [rows] = await pool.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `, [id]);
    
    const results = rows as any[];
    if (results.length === 0) return undefined;
    
    const product = results[0];
    
    // JSON formatında saklanan alanları parse et
    if (product.features && typeof product.features === 'string') {
      product.features = JSON.parse(product.features);
    } else {
      product.features = [];
    }
    
    if (product.additional_images && typeof product.additional_images === 'string') {
      product.additional_images = JSON.parse(product.additional_images);
    } else {
      product.additional_images = [];
    }
    
    return product as Product;
  } catch (error) {
    console.error('Ürün getirilirken hata:', error);
    return mockProducts.find(p => p.id === id);
  }
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  console.log('addProduct çağrıldı:', product, 'mock veri:', useMockData);
  
  if (useMockData) {
    const maxId = mockProducts.length > 0 
      ? Math.max(...mockProducts.map(p => p.id)) 
      : 0;
    const newProduct = { ...product, id: maxId + 1 };
    mockProducts.push(newProduct);
    return newProduct;
  }
  
  if (!pool) {
    throw new Error('Veritabanı bağlantısı kurulamadı');
  }
  
  try {
    const features = JSON.stringify(product.features || []);
    const additional_images = JSON.stringify(product.additional_images || []);
    
    const [result] = await pool.execute(
      `INSERT INTO products 
       (title, short_description, category_id, segment, main_image, additional_images, features) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        product.title,
        product.short_description,
        product.category_id,
        product.segment,
        product.main_image,
        additional_images,
        features
      ]
    ) as any;
    
    return {
      id: result.insertId,
      ...product
    };
  } catch (error) {
    console.error('Ürün eklenirken hata:', error);
    throw error;
  }
}

export async function updateProduct(id: number, product: Omit<Product, 'id'>): Promise<Product> {
  if (useMockData) {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Ürün bulunamadı');
    
    const updatedProduct = { ...product, id };
    mockProducts[index] = updatedProduct;
    return updatedProduct;
  }
  
  if (!pool) {
    throw new Error('Veritabanı bağlantısı kurulamadı');
  }
  
  try {
    const features = JSON.stringify(product.features || []);
    const additional_images = JSON.stringify(product.additional_images || []);
    
    await pool.execute(
      `UPDATE products SET 
       title = ?, 
       short_description = ?, 
       category_id = ?, 
       segment = ?, 
       main_image = ?, 
       additional_images = ?, 
       features = ? 
       WHERE id = ?`,
      [
        product.title,
        product.short_description,
        product.category_id,
        product.segment,
        product.main_image,
        additional_images,
        features,
        id
      ]
    );
    
    return {
      id,
      ...product
    };
  } catch (error) {
    console.error('Ürün güncellenirken hata:', error);
    throw error;
  }
}

export async function deleteProduct(id: number): Promise<boolean> {
  if (useMockData) {
    const index = mockProducts.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    mockProducts.splice(index, 1);
    return true;
  }
  
  if (!pool) {
    throw new Error('Veritabanı bağlantısı kurulamadı');
  }
  
  try {
    await pool.execute('DELETE FROM products WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error('Ürün silinirken hata:', error);
    throw error;
  }
} 