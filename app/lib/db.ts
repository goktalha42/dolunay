import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join } from 'path';

export interface Product {
  id: number;
  title: string;
  short_description: string;
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

export interface ProductFeature {
  id: number;
  product_id: number;
  feature: string;
  display_order: number;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
}

// Veritabanı bağlantısı
export async function getDatabase() {
  return open({
    filename: join(process.cwd(), 'dolunay.db'),
    driver: sqlite3.Database
  });
}

// Veritabanı tablolarını oluştur
export async function setupDatabase() {
  const db = await getDatabase();
  
  // Products tablosunu kontrol et ve oluştur (ana tablo)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      short_description TEXT,
      category_id INTEGER,
      segment TEXT DEFAULT 'orta',
      main_image TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Product Images tablosunu oluştur
  await db.exec(`
    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      image_path TEXT NOT NULL,
      is_main INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);
  
  // Product Features tablosunu oluştur
  await db.exec(`
    CREATE TABLE IF NOT EXISTS product_features (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      feature TEXT NOT NULL,
      display_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);
  
  // Eski products tablosunda additional_images ve features sütunları varsa verileri yeni tablolara göç et
  try {
    // Tabloda bu kolonlar var mı kontrol et
    const tableInfo = await db.all(`PRAGMA table_info(products)`);
    const hasAdditionalImages = tableInfo.some(col => col.name === 'additional_images');
    const hasFeatures = tableInfo.some(col => col.name === 'features');
    
    if (hasAdditionalImages || hasFeatures) {
      console.log("Eski veri formatı tespit edildi. Verileri yeni tablolara aktarıyorum...");
      
      // Tüm ürünleri getir
      const products = await db.all(`SELECT * FROM products`);
      
      for (const product of products) {
        // Ana görseli product_images tablosuna ekle
        if (product.main_image) {
          await db.run(`
            INSERT INTO product_images (product_id, image_path, is_main, display_order)
            VALUES (?, ?, 1, 0)
          `, [product.id, product.main_image]);
        }
        
        // Ek görselleri aktar
        if (hasAdditionalImages && product.additional_images) {
          try {
            let additionalImages = [];
            if (typeof product.additional_images === 'string') {
              additionalImages = JSON.parse(product.additional_images);
            } else if (Array.isArray(product.additional_images)) {
              additionalImages = product.additional_images;
            }
            
            if (Array.isArray(additionalImages)) {
              for (let i = 0; i < additionalImages.length; i++) {
                if (additionalImages[i] && typeof additionalImages[i] === 'string') {
                  await db.run(`
                    INSERT INTO product_images (product_id, image_path, is_main, display_order)
                    VALUES (?, ?, 0, ?)
                  `, [product.id, additionalImages[i], i + 1]);
                }
              }
            }
          } catch (error) {
            console.error(`Ürün ${product.id} için ek görseller aktarılırken hata:`, error);
          }
        }
        
        // Özellikleri aktar
        if (hasFeatures && product.features) {
          try {
            let features = [];
            if (typeof product.features === 'string') {
              features = JSON.parse(product.features);
            } else if (Array.isArray(product.features)) {
              features = product.features;
            }
            
            if (Array.isArray(features)) {
              for (let i = 0; i < features.length; i++) {
                if (features[i] && typeof features[i] === 'string') {
                  await db.run(`
                    INSERT INTO product_features (product_id, feature, display_order)
                    VALUES (?, ?, ?)
                  `, [product.id, features[i], i]);
                }
              }
            }
          } catch (error) {
            console.error(`Ürün ${product.id} için özellikler aktarılırken hata:`, error);
          }
        }
      }
      
      console.log("Veri aktarımı tamamlandı.");
      
      // Eski sütunları products tablosundan kaldıralım mı?
      // DİKKAT: Veri kaybı yaşamamak için önce yedek alın. Bu işlemi sonra manuel yapabilirsiniz.
      // await db.exec(`
      //   BEGIN TRANSACTION;
      //   CREATE TABLE products_new (
      //     id INTEGER PRIMARY KEY AUTOINCREMENT,
      //     title TEXT NOT NULL,
      //     short_description TEXT,
      //     category_id INTEGER,
      //     segment TEXT DEFAULT 'orta',
      //     main_image TEXT,
      //     created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      //     updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      //   );
      //   INSERT INTO products_new (id, title, short_description, category_id, segment, main_image, created_at, updated_at)
      //   SELECT id, title, short_description, category_id, segment, main_image, created_at, updated_at FROM products;
      //   DROP TABLE products;
      //   ALTER TABLE products_new RENAME TO products;
      //   COMMIT;
      // `);
    }
  } catch (error) {
    console.error("Veri göçü sırasında hata:", error);
  }
  
  await db.close();
  console.log("Veritabanı tabloları hazır.");
  
  return true;
}

// Ürün getirme fonksiyonu
export async function getProductById(id: number): Promise<Product | null> {
  try {
    const db = await getDatabase();
    const product = await db.get(`SELECT * FROM products WHERE id = ?`, id);
    
    if (!product) {
      console.log(`getProductById(${id}): Ürün bulunamadı`);
      return null;
    }
    
    // Ana resim ve ek resimleri getir
    const images = await db.all(`
      SELECT * FROM product_images 
      WHERE product_id = ? 
      ORDER BY is_main DESC, display_order ASC
    `, id);
    
    // Ana resim bulunursa ürün bilgisine ekle
    const mainImage = images.find(img => img.is_main === 1);
    if (mainImage) {
      product.main_image = mainImage.image_path;
    }
    
    // Ek resimleri dizi olarak ekle
    product.additional_images = images
      .filter(img => img.is_main !== 1)
      .map(img => img.image_path);
    
    // Özellikleri getir
    const features = await db.all(`
      SELECT * FROM product_features 
      WHERE product_id = ? 
      ORDER BY display_order ASC
    `, id);
    
    product.features = features.map(f => f.feature);
    
    await db.close();
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
    const products = await db.all(`SELECT * FROM products ORDER BY id DESC`);
    
    // Her ürün için görselleri ve özellikleri getir
    for (const product of products) {
      // Görselleri getir
      const images = await db.all(`
        SELECT * FROM product_images 
        WHERE product_id = ? 
        ORDER BY is_main DESC, display_order ASC
      `, product.id);
      
      // Ana resim bulunursa ürün bilgisine ekle
      const mainImage = images.find(img => img.is_main === 1);
      if (mainImage) {
        product.main_image = mainImage.image_path;
      }
      
      // Ek resimleri dizi olarak ekle
      product.additional_images = images
        .filter(img => img.is_main !== 1)
        .map(img => img.image_path);
      
      // Özellikleri getir
      const features = await db.all(`
        SELECT * FROM product_features 
        WHERE product_id = ? 
        ORDER BY display_order ASC
      `, product.id);
      
      product.features = features.map(f => f.feature);
    }
    
    await db.close();
    return products;
  } catch (error) {
    console.error('Ürünler getirme hatası:', error);
    return [];
  }
}

// Ürün ekleme fonksiyonu
export async function addProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'> & {
  additional_images?: string[];
  features?: string[];
}): Promise<Product> {
  try {
    const db = await getDatabase();
    
    const now = new Date().toISOString();
    
    // Ürünü ekle - MySQL tablo yapısına göre uyarlandı
    const result = await db.run(`
      INSERT INTO products (
        title, 
        short_description, 
        category_id, 
        segment,
        main_image,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      productData.title,
      productData.short_description || '',
      productData.category_id || 0,
      productData.segment || 'orta',
      productData.main_image || '/images/products/default.jpg', 
      now,
      now
    ]);
    
    const productId = result.lastID as number;
    console.log(`Ürün eklendi, ID: ${productId}`);
    
    // Ana görseli ekle
    if (productData.main_image) {
      try {
        await db.run(`
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
            await db.run(`
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
          const feature = productData.features[i];
          if (feature && typeof feature === 'string') {
            await db.run(`
              INSERT INTO product_features (product_id, feature, display_order)
              VALUES (?, ?, ?)
            `, [productId, feature, i]);
          }
        }
        console.log(`${productData.features.length} adet özellik eklendi`);
      } catch (err) {
        console.error("Özellikler eklenirken hata:", err);
      }
    }
    
    // Eklenen ürünü getir
    const product = await getProductById(productId);
    await db.close();
    
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
  features?: string[];
}): Promise<Product | null> {
  try {
    const db = await getDatabase();
    
    // Mevcut ürünü kontrol et
    const existingProduct = await db.get(`SELECT * FROM products WHERE id = ?`, id);
    if (!existingProduct) {
      return null;
    }
    
    const now = new Date().toISOString();
    
    // Ürün bilgilerini güncelle
    await db.run(`
      UPDATE products SET
        title = COALESCE(?, title),
        short_description = COALESCE(?, short_description),
        category_id = COALESCE(?, category_id),
        segment = COALESCE(?, segment),
        updated_at = ?
      WHERE id = ?
    `, [
      productData.title,
      productData.short_description,
      productData.category_id,
      productData.segment,
      now,
      id
    ]);
    
    // Ana görsel güncelleniyorsa
    if (productData.main_image) {
      // Önce mevcut ana görseli kontrol et
      const existingMainImage = await db.get(`
        SELECT * FROM product_images WHERE product_id = ? AND is_main = 1
      `, id);
      
      if (existingMainImage) {
        // Mevcut ana görseli güncelle
        await db.run(`
          UPDATE product_images SET image_path = ? WHERE id = ?
        `, [productData.main_image, existingMainImage.id]);
      } else {
        // Yeni ana görsel ekle
        await db.run(`
          INSERT INTO product_images (product_id, image_path, is_main, display_order)
          VALUES (?, ?, 1, 0)
        `, [id, productData.main_image]);
      }
      
      // Ürün tablosunda da ana görseli güncelleyelim
      await db.run(`
        UPDATE products SET main_image = ? WHERE id = ?
      `, [productData.main_image, id]);
    }
    
    // Ek görseller güncelleniyorsa
    if (productData.additional_images && Array.isArray(productData.additional_images)) {
      // Mevcut ek görselleri sil
      await db.run(`
        DELETE FROM product_images WHERE product_id = ? AND is_main = 0
      `, id);
      
      // Yeni ek görselleri ekle
      for (let i = 0; i < productData.additional_images.length; i++) {
        const imagePath = productData.additional_images[i];
        if (imagePath && typeof imagePath === 'string') {
          await db.run(`
            INSERT INTO product_images (product_id, image_path, is_main, display_order)
            VALUES (?, ?, 0, ?)
          `, [id, imagePath, i + 1]);
        }
      }
    }
    
    // Özellikler güncelleniyorsa
    if (productData.features && Array.isArray(productData.features)) {
      // Mevcut özellikleri sil
      await db.run(`
        DELETE FROM product_features WHERE product_id = ?
      `, id);
      
      // Yeni özellikleri ekle
      for (let i = 0; i < productData.features.length; i++) {
        const feature = productData.features[i];
        if (feature && typeof feature === 'string') {
          await db.run(`
            INSERT INTO product_features (product_id, feature, display_order)
            VALUES (?, ?, ?)
          `, [id, feature, i]);
        }
      }
    }
    
    // Güncellenmiş ürünü getir
    const updated = await getProductById(id);
    await db.close();
    
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
    const product = await db.get(`SELECT id FROM products WHERE id = ?`, id);
    if (!product) {
      return false;
    }
    
    // İlişkili görselleri ve özellikleri sil (CASCADE olduğu için otomatik silinecek)
    // Eğer CASCADE çalışmazsa, manuel silme:
    await db.run(`DELETE FROM product_images WHERE product_id = ?`, id);
    await db.run(`DELETE FROM product_features WHERE product_id = ?`, id);
    
    // Ürünü sil
    await db.run(`DELETE FROM products WHERE id = ?`, id);
    
    await db.close();
    return true;
  } catch (error) {
    console.error(`deleteProduct(${id}): Hata:`, error);
    return false;
  }
}

// Kategori işlemleri
export async function getCategories(): Promise<Category[]> {
  try {
    const db = await getDatabase();
    const categories = await db.all(`SELECT * FROM categories ORDER BY parent_id, name`);
    await db.close();
    return categories;
  } catch (error) {
    console.error('Kategoriler getirme hatası:', error);
    return [];
  }
}