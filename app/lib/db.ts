import mysql from 'mysql2/promise';

export interface Product {
  id: number;
  title: string;
  short_description: string;
  long_description: string;
  category_id: number;
  segment: string;
  main_image: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_path: string;
  is_main: number; // 1: Ana görsel, 0: Ek görsel
  display_order: number;
  created_at: string;
}

export interface Feature {
  id: number;
  name: string;
  display_order: number;
  created_at?: string;
}

export interface ProductFeature {
  id: number;
  product_id: number;
  feature_id: number;
  feature?: string; // Geriye uyumluluk için
  display_order: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

// MySQL bağlantı havuzu
let pool: mysql.Pool | null = null;

// Veritabanı bağlantısı
export async function getDatabase() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'dolunay_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }
  return pool;
}

// Veritabanı tablolarını oluştur
export async function setupDatabase() {
  const db = await getDatabase();
  
  // Products tablosunu kontrol et ve oluştur (ana tablo)
  await db.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      short_description TEXT,
      long_description TEXT,
      category_id INT DEFAULT NULL,
      segment VARCHAR(50) DEFAULT 'orta',
      main_image VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);
  
  // Features tablosunu oluştur
  await db.query(`
    CREATE TABLE IF NOT EXISTS features (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Product Images tablosunu oluştur
  await db.query(`
    CREATE TABLE IF NOT EXISTS product_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      image_path VARCHAR(255) NOT NULL,
      is_main TINYINT DEFAULT 0,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);
  
  // Product Features tablosunu oluştur
  await db.query(`
    CREATE TABLE IF NOT EXISTS product_features (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      feature_id INT NOT NULL,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (feature_id) REFERENCES features(id) ON DELETE CASCADE
    )
  `);
  
  console.log("Veritabanı tabloları hazır.");
  
  return true;
}

// Ürün getirme fonksiyonu
export async function getProductById(id: number): Promise<Product | null> {
  try {
    const db = await getDatabase();
    
    // Ürünü getir
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    const productRows = products as any[];
    
    if (!productRows || productRows.length === 0) {
      console.log(`getProductById(${id}): Ürün bulunamadı`);
      return null;
    }
    
    const product = productRows[0] as Product;
    
    // Ana resim ve ek resimleri getir
    const [images] = await db.query(`
      SELECT * FROM product_images 
      WHERE product_id = ? 
      ORDER BY is_main DESC, display_order ASC
    `, [id]);
    
    const imageRows = images as ProductImage[];
    
    // Ana resim bulunursa ürün bilgisine ekle
    const mainImage = imageRows.find(img => img.is_main === 1);
    if (mainImage) {
      product.main_image = mainImage.image_path;
    }
    
    // Ek resimleri dizi olarak ekle
    const additionalImages = imageRows
      .filter(img => img.is_main !== 1)
      .map(img => img.image_path);
    
    (product as any).additional_images = additionalImages;
    
    // Özellikleri getir - artık features tablosundan
    const [features] = await db.query(`
      SELECT f.id, f.name, pf.display_order 
      FROM features f
      JOIN product_features pf ON f.id = pf.feature_id
      WHERE pf.product_id = ? 
      ORDER BY pf.display_order ASC
    `, [id]);
    
    const featureRows = features as Feature[];
    
    // Hem ID'leri hem de özellik adlarını dizi olarak ekle (geriye uyumluluk için)
    (product as any).feature_ids = featureRows.map(f => f.id);
    (product as any).features = featureRows.map(f => f.name);
    
    return product;
  } catch (error) {
    console.error('Ürün getirme hatası:', error);
    return null;
  }
}

// Tüm ürünleri getirme fonksiyonu
export async function getProducts(): Promise<Product[]> {
  try {
    const db = await getDatabase();
    
    // Tüm ürünleri getir
    const [products] = await db.query('SELECT * FROM products ORDER BY id DESC');
    const productRows = products as Product[];
    
    // Her ürün için görselleri ve özellikleri getir
    for (const product of productRows) {
      // Görselleri getir
      const [images] = await db.query(`
        SELECT * FROM product_images 
        WHERE product_id = ? 
        ORDER BY is_main DESC, display_order ASC
      `, [product.id]);
      
      const imageRows = images as ProductImage[];
      
      // Ana resim bulunursa ürün bilgisine ekle
      const mainImage = imageRows.find(img => img.is_main === 1);
      if (mainImage) {
        product.main_image = mainImage.image_path;
      }
      
      // Ek resimleri dizi olarak ekle
      const additionalImages = imageRows
        .filter(img => img.is_main !== 1)
        .map(img => img.image_path);
      
      (product as any).additional_images = additionalImages;
      
      // Özellikleri getir - artık features tablosundan
      const [features] = await db.query(`
        SELECT f.id, f.name, pf.display_order 
        FROM features f
        JOIN product_features pf ON f.id = pf.feature_id
        WHERE pf.product_id = ? 
        ORDER BY pf.display_order ASC
      `, [product.id]);
      
      const featureRows = features as Feature[];
      
      // Hem ID'leri hem de özellik adlarını dizi olarak ekle (geriye uyumluluk için)
      (product as any).feature_ids = featureRows.map(f => f.id);
      (product as any).features = featureRows.map(f => f.name);
    }
    
    return productRows;
  } catch (error) {
    console.error('Ürünler getirme hatası:', error);
    return [];
  }
}

// Ürün ekleme fonksiyonu
export async function addProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'> & {
  additional_images?: string[];
  features?: number[];
}): Promise<Product> {
  try {
    const db = await getDatabase();
    
    // Ürünü ekle - MySQL tablo yapısına göre
    const [result] = await db.query(`
      INSERT INTO products (
        title, 
        short_description,
        long_description, 
        category_id, 
        segment,
        main_image
      ) VALUES (?, ?, ?, ?, ?, ?)
    `, [
      productData.title,
      productData.short_description || '',
      productData.long_description || '',
      productData.category_id || null,
      productData.segment || 'orta',
      productData.main_image || '/images/products/default.jpg'
    ]);
    
    const insertResult = result as any;
    const productId = insertResult.insertId;
    
    console.log(`Ürün eklendi, ID: ${productId}`);
    
    // Ana görseli ekle
    if (productData.main_image) {
      try {
        await db.query(`
          INSERT INTO product_images (product_id, image_path, is_main, display_order)
          VALUES (?, ?, 1, 0)
        `, [productId, productData.main_image]);
        
        console.log(`Ana görsel eklendi: ${productData.main_image}`);
      } catch (err) {
        console.error("Ana görsel eklenirken hata:", err);
      }
    }
    
    // Ek görselleri ekle
    if (productData.additional_images && Array.isArray(productData.additional_images)) {
      try {
        for (let i = 0; i < productData.additional_images.length; i++) {
          const imagePath = productData.additional_images[i];
          if (imagePath && typeof imagePath === 'string') {
            await db.query(`
              INSERT INTO product_images (product_id, image_path, is_main, display_order)
              VALUES (?, ?, 0, ?)
            `, [productId, imagePath, i + 1]);
          }
        }
        console.log(`${productData.additional_images.length} adet ek görsel eklendi`);
      } catch (err) {
        console.error("Ek görseller eklenirken hata:", err);
      }
    }
    
    // Özellikleri ekle
    if (productData.features && Array.isArray(productData.features)) {
      try {
        for (let i = 0; i < productData.features.length; i++) {
          const featureId = productData.features[i];
          if (featureId && typeof featureId === 'number') {
            await db.query(`
              INSERT INTO product_features (product_id, feature_id, display_order)
              VALUES (?, ?, ?)
            `, [productId, featureId, i]);
          }
        }
        console.log(`${productData.features.length} adet özellik eklendi`);
      } catch (err) {
        console.error("Özellikler eklenirken hata:", err);
      }
    }
    
    // Eklenen ürünü getir
    const product = await getProductById(productId);
    
    if (!product) {
      throw new Error('Ürün eklenmiş görünüyor ama getirilemedi');
    }
    
    return product;
  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    throw error;
  }
}

// Ürün güncelleme fonksiyonu
export async function updateProduct(id: number, productData: Partial<Product> & {
  additional_images?: string[];
  features?: number[];
}): Promise<Product | null> {
  try {
    const db = await getDatabase();
    
    // Mevcut ürünü kontrol et
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    const productRows = products as any[];
    
    if (!productRows || productRows.length === 0) {
      return null;
    }
    
    // Ürün bilgilerini güncelle
    const updateFields = [];
    const updateValues = [];
    
    if (productData.title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(productData.title);
    }
    
    if (productData.short_description !== undefined) {
      updateFields.push('short_description = ?');
      updateValues.push(productData.short_description);
    }
    
    if (productData.long_description !== undefined) {
      updateFields.push('long_description = ?');
      updateValues.push(productData.long_description);
    }
    
    if (productData.category_id !== undefined) {
      updateFields.push('category_id = ?');
      updateValues.push(productData.category_id);
    }
    
    if (productData.segment !== undefined) {
      updateFields.push('segment = ?');
      updateValues.push(productData.segment);
    }
    
    if (productData.main_image !== undefined) {
      updateFields.push('main_image = ?');
      updateValues.push(productData.main_image);
    }
    
    if (updateFields.length > 0) {
      // ID parametresini sona ekle
      updateValues.push(id);
      
      await db.query(`
        UPDATE products SET ${updateFields.join(', ')}
        WHERE id = ?
      `, updateValues);
    }
    
    // Ana görsel güncelleniyorsa
    if (productData.main_image) {
      // Önce mevcut ana görseli kontrol et
      const [mainImages] = await db.query(`
        SELECT * FROM product_images WHERE product_id = ? AND is_main = 1
      `, [id]);
      
      const mainImageRows = mainImages as any[];
      
      if (mainImageRows && mainImageRows.length > 0) {
        // Mevcut ana görseli güncelle
        await db.query(`
          UPDATE product_images SET image_path = ? WHERE id = ?
        `, [productData.main_image, mainImageRows[0].id]);
      } else {
        // Yeni ana görsel ekle
        await db.query(`
          INSERT INTO product_images (product_id, image_path, is_main, display_order)
          VALUES (?, ?, 1, 0)
        `, [id, productData.main_image]);
      }
    }
    
    // Ek görseller güncelleniyorsa
    if (productData.additional_images && Array.isArray(productData.additional_images)) {
      // Mevcut ek görselleri sil
      await db.query(`
        DELETE FROM product_images WHERE product_id = ? AND is_main = 0
      `, [id]);
      
      // Yeni ek görselleri ekle
      for (let i = 0; i < productData.additional_images.length; i++) {
        const imagePath = productData.additional_images[i];
        if (imagePath && typeof imagePath === 'string') {
          await db.query(`
            INSERT INTO product_images (product_id, image_path, is_main, display_order)
            VALUES (?, ?, 0, ?)
          `, [id, imagePath, i + 1]);
        }
      }
    }
    
    // Özellikler güncelleniyorsa
    if (productData.features && Array.isArray(productData.features)) {
      // Mevcut özellikleri sil
      await db.query(`
        DELETE FROM product_features WHERE product_id = ?
      `, [id]);
      
      // Yeni özellikleri ekle
      for (let i = 0; i < productData.features.length; i++) {
        const featureId = productData.features[i];
        if (featureId && typeof featureId === 'number') {
          await db.query(`
            INSERT INTO product_features (product_id, feature_id, display_order)
            VALUES (?, ?, ?)
          `, [id, featureId, i]);
        }
      }
    }
    
    // Güncellenmiş ürünü getir
    const updated = await getProductById(id);
    return updated;
  } catch (error) {
    console.error(`updateProduct(${id}): Hata:`, error);
    return null;
  }
}

// Ürün silme fonksiyonu
export async function deleteProduct(id: number): Promise<boolean> {
  try {
    const db = await getDatabase();
    
    // Ürünün var olup olmadığını kontrol et
    const [products] = await db.query('SELECT id FROM products WHERE id = ?', [id]);
    const productRows = products as any[];
    
    if (!productRows || productRows.length === 0) {
      return false;
    }
    
    // İlişkili görselleri ve özellikleri sil
    // CASCADE varsa otomatik silinecek, yoksa manuel olarak silelim
    await db.query('DELETE FROM product_images WHERE product_id = ?', [id]);
    await db.query('DELETE FROM product_features WHERE product_id = ?', [id]);
    
    // Ürünü sil
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    
    return true;
  } catch (error) {
    console.error(`deleteProduct(${id}): Hata:`, error);
    return false;
  }
}

// Kategorileri getir
export async function getCategories(): Promise<Category[]> {
  try {
    const db = await getDatabase();
    const [rows] = await db.query('SELECT * FROM categories ORDER BY parent_id, name');
    return rows as Category[];
  } catch (error) {
    console.error('Kategoriler getirme hatası:', error);
    return [];
  }
}

// İçinde ürün olan kategorileri getir
export async function getCategoriesWithProducts(): Promise<Category[]> {
  try {
    const db = await getDatabase();
    
    // Tüm kategorileri getir
    const [allCategories] = await db.query('SELECT * FROM categories ORDER BY parent_id, name');
    const categories = allCategories as Category[];
    
    // Her kategori için ürün sayısını getir
    const [productCounts] = await db.query(`
      SELECT c.id, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.id = p.category_id
      GROUP BY c.id
    `);
    
    const categoryProductCounts = (productCounts as any[]).reduce((acc, row) => {
      acc[row.id] = row.product_count;
      return acc;
    }, {} as Record<number, number>);
    
    // Alt kategorilerdeki ürünleri de ana kategoriye ekle
    const categoryWithChildren: Record<number, number[]> = {};
    
    // Kategori hiyerarşisini oluştur
    categories.forEach(category => {
      if (category.parent_id !== null) {
        if (!categoryWithChildren[category.parent_id]) {
          categoryWithChildren[category.parent_id] = [];
        }
        categoryWithChildren[category.parent_id].push(category.id);
      }
    });
    
    // Kategori ağacını takip ederek alt kategorilerdeki ürünleri ana kategoriye ekle
    const getCategoryProductCount = (categoryId: number): number => {
      let count = categoryProductCounts[categoryId] || 0;
      
      const childCategories = categoryWithChildren[categoryId] || [];
      for (const childId of childCategories) {
        count += getCategoryProductCount(childId);
      }
      
      return count;
    };
    
    // İçinde ürün olmayan kategorileri filtrele
    const categoriesWithProducts = categories.filter(category => {
      const totalProductCount = getCategoryProductCount(category.id);
      return totalProductCount > 0;
    });
    
    return categoriesWithProducts;
  } catch (error) {
    console.error('Ürünlü kategoriler getirme hatası:', error);
    return [];
  }
}

// Kategori işlemleri

// Kategori getir (ID'ye göre)
export async function getCategoryById(id: number): Promise<Category | null> {
  try {
    const db = await getDatabase();
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    const categories = rows as Category[];
    return categories.length > 0 ? categories[0] : null;
  } catch (error) {
    console.error(`getCategoryById(${id}): Hata:`, error);
    return null;
  }
}

// Kategori ekle
export async function addCategory(categoryData: Omit<Category, 'id'>): Promise<Category | null> {
  try {
    const db = await getDatabase();
    
    const [result] = await db.query(
      'INSERT INTO categories (name, parent_id) VALUES (?, ?)',
      [categoryData.name, categoryData.parent_id]
    );
    
    const insertResult = result as any;
    const categoryId = insertResult.insertId;
    
    // Yeni eklenen kategoriyi getir
    return await getCategoryById(categoryId);
  } catch (error) {
    console.error('addCategory:', error);
    return null;
  }
}

// Kategori güncelle
export async function updateCategory(id: number, categoryData: Partial<Omit<Category, 'id'>>): Promise<Category | null> {
  try {
    const db = await getDatabase();
    
    const updateFields = [];
    const updateValues = [];
    
    if (categoryData.name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(categoryData.name);
    }
    
    if (categoryData.parent_id !== undefined) {
      updateFields.push('parent_id = ?');
      updateValues.push(categoryData.parent_id);
    }
    
    if (updateFields.length === 0) {
      // Güncellenecek alan yok, mevcut kategoriyi döndür
      return await getCategoryById(id);
    }
    
    // ID'yi son parametre olarak ekle
    updateValues.push(id);
    
    await db.query(
      `UPDATE categories SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    // Güncellenmiş kategoriyi getir
    return await getCategoryById(id);
  } catch (error) {
    console.error(`updateCategory(${id}):`, error);
    return null;
  }
}

// Kategori sil
export async function deleteCategory(id: number): Promise<boolean> {
  try {
    const db = await getDatabase();
    
    // Önce bu kategorideki alt kategorileri kontrol et
    const [subCategories] = await db.query(
      'SELECT COUNT(*) as count FROM categories WHERE parent_id = ?', 
      [id]
    );
    
    const subCategoriesCount = (subCategories as any[])[0].count;
    if (subCategoriesCount > 0) {
      console.log(`deleteCategory(${id}): Alt kategoriler var, silinemez.`);
      return false;
    }
    
    // Bu kategoriye ait ürünleri kontrol et
    const [products] = await db.query(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ?', 
      [id]
    );
    
    const productsCount = (products as any[])[0].count;
    if (productsCount > 0) {
      console.log(`deleteCategory(${id}): Ürünler var, silinemez.`);
      return false;
    }
    
    // Kategoriyi sil
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
    const deleteResult = result as any;
    
    return deleteResult.affectedRows > 0;
  } catch (error) {
    console.error(`deleteCategory(${id}):`, error);
    return false;
  }
}

// Features CRUD İşlemleri

// Tüm özellikleri getir
export async function getFeatures(): Promise<Feature[]> {
  try {
    const db = await getDatabase();
    
    const [features] = await db.query(`
      SELECT * FROM features
      ORDER BY display_order ASC, id ASC
    `);
    
    return features as Feature[];
  } catch (error) {
    console.error('Özellikler getirme hatası:', error);
    return [];
  }
}

// Özellik detayını getir
export async function getFeatureById(id: number): Promise<Feature | null> {
  try {
    const db = await getDatabase();
    
    const [features] = await db.query(`
      SELECT * FROM features
      WHERE id = ?
    `, [id]);
    
    const featureRows = features as Feature[];
    
    if (featureRows.length === 0) {
      return null;
    }
    
    return featureRows[0];
  } catch (error) {
    console.error(`Özellik (ID: ${id}) getirme hatası:`, error);
    return null;
  }
}

// Özellik ekle
export async function addFeature(feature: Omit<Feature, 'id' | 'created_at'>): Promise<Feature | null> {
  try {
    const db = await getDatabase();
    
    const [result] = await db.query(`
      INSERT INTO features (name, display_order)
      VALUES (?, ?)
    `, [
      feature.name,
      feature.display_order || 0
    ]);
    
    const insertResult = result as any;
    const featureId = insertResult.insertId;
    
    return getFeatureById(featureId);
  } catch (error) {
    console.error('Özellik ekleme hatası:', error);
    return null;
  }
}

// Özellik güncelle
export async function updateFeature(id: number, feature: Partial<Feature>): Promise<Feature | null> {
  try {
    const db = await getDatabase();
    
    // Önce mevcut özelliği al
    const currentFeature = await getFeatureById(id);
    
    if (!currentFeature) {
      return null;
    }
    
    // Güncellenecek alanları belirle
    const updateFields = [];
    const updateValues = [];
    
    if (feature.name !== undefined) {
      updateFields.push('name = ?');
      updateValues.push(feature.name);
    }
    
    if (feature.display_order !== undefined) {
      updateFields.push('display_order = ?');
      updateValues.push(feature.display_order);
    }
    
    if (updateFields.length === 0) {
      return currentFeature; // Değişiklik yok
    }
    
    // ID'yi en sona ekle
    updateValues.push(id);
    
    // Güncelleme yap
    await db.query(`
      UPDATE features 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `, updateValues);
    
    return getFeatureById(id);
  } catch (error) {
    console.error(`Özellik (ID: ${id}) güncelleme hatası:`, error);
    return null;
  }
}

// Özellik sil
export async function deleteFeature(id: number): Promise<boolean> {
  try {
    const db = await getDatabase();
    
    // Önce mevcut özelliği al
    const currentFeature = await getFeatureById(id);
    
    if (!currentFeature) {
      return false;
    }
    
    // Özelliğin ürünlerle ilişkisi var mı kontrol et
    const [relations] = await db.query(`
      SELECT COUNT(*) as count FROM product_features WHERE feature_id = ?
    `, [id]);
    
    const relationsCount = (relations as any[])[0]?.count || 0;
    
    if (relationsCount > 0) {
      throw new Error(`Özellik (ID: ${id}) ${relationsCount} ürünle ilişkilidir ve silinemez`);
    }
    
    // Özelliği sil
    await db.query(`
      DELETE FROM features WHERE id = ?
    `, [id]);
    
    return true;
  } catch (error) {
    console.error(`Özellik (ID: ${id}) silme hatası:`, error);
    return false;
  }
}

// Ürünün özelliklerini getir
export async function getProductFeatures(productId: number): Promise<Feature[]> {
  try {
    const db = await getDatabase();
    
    const [rows] = await db.query(`
      SELECT f.* 
      FROM features f
      JOIN product_features pf ON f.id = pf.feature_id
      WHERE pf.product_id = ?
      ORDER BY pf.display_order, f.name
    `, [productId]);
    
    return rows as Feature[];
  } catch (error) {
    console.error(`getProductFeatures(${productId}): Hata:`, error);
    return [];
  }
}

// Ürün özelliklerini güncelle
export async function updateProductFeatures(productId: number, featureIds: number[]): Promise<boolean> {
  try {
    const db = await getDatabase();
    
    // Mevcut ürün-özellik ilişkilerini sil
    await db.query('DELETE FROM product_features WHERE product_id = ?', [productId]);
    
    // Yeni ürün-özellik ilişkilerini ekle
    for (let i = 0; i < featureIds.length; i++) {
      const featureId = featureIds[i];
      await db.query(`
        INSERT INTO product_features (product_id, feature_id, display_order)
        VALUES (?, ?, ?)
      `, [productId, featureId, i]);
    }
    
    return true;
  } catch (error) {
    console.error(`updateProductFeatures(${productId}): Hata:`, error);
    return false;
  }
}