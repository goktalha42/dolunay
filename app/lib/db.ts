import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join } from 'path';

export interface Product {
  id: number;
  title: string;
  short_description: string;
  category_id: number;
  category_name: string;
  segment: string;
  main_image: string;
  additional_images: string[];
  features: string[];
  created_at?: string;
  updated_at?: string;
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

// Ürün getirme fonksiyonu
export async function getProductById(id: number): Promise<Product | null> {
  try {
    const db = await getDatabase();
    const product = await db.get(`SELECT * FROM products WHERE id = ?`, id);
    
    if (!product) {
      return null;
    }
    
    // JSON alanlarını parse et
    product.additional_images = JSON.parse(product.additional_images || '[]');
    product.features = JSON.parse(product.features || '[]');
    
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
    
    // JSON alanlarını parse et
    products.forEach(product => {
      product.additional_images = JSON.parse(product.additional_images || '[]');
      product.features = JSON.parse(product.features || '[]');
    });
    
    await db.close();
    return products;
  } catch (error) {
    console.error('Ürünler getirme hatası:', error);
    return [];
  }
}

// Ürün ekleme fonksiyonu
export async function addProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  try {
    const db = await getDatabase();
    
    // Önce kategori bilgisini alalım (category_name için)
    const category = await db.get(`SELECT name FROM categories WHERE id = ?`, productData.category_id);
    const category_name = category ? category.name : "Kategorisiz";
    
    const now = new Date().toISOString();
    
    const result = await db.run(`
      INSERT INTO products (
        title, 
        short_description, 
        category_id, 
        category_name,
        segment,
        main_image,
        additional_images,
        features,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      productData.title,
      productData.short_description,
      productData.category_id,
      category_name,
      productData.segment,
      productData.main_image,
      JSON.stringify(productData.additional_images),
      JSON.stringify(productData.features),
      now,
      now
    ]);
    
    const newProduct: Product = {
      id: result.lastID!,
      ...productData,
      category_name,
      created_at: now,
      updated_at: now
    };
    
    await db.close();
    return newProduct;
  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    throw error;
  }
}

// Ürün güncelleme fonksiyonu
export async function updateProduct(id: number, productData: Partial<Product>): Promise<Product | null> {
  try {
    // Mevcut ürünü kontrol et
    const existingProduct = await getProductById(id);
    if (!existingProduct) {
      return null;
    }

    const db = await getDatabase();
    
    // Önce kategori bilgisini alalım (category_name için)
    const category = await db.get(`SELECT name FROM categories WHERE id = ?`, productData.category_id);
    const category_name = category ? category.name : "Kategorisiz";
    
    // Güncellenecek alanları hazırla
    const updated = {
      ...existingProduct,
      ...productData,
      category_name,
      updated_at: new Date().toISOString()
    };
    
    // Güncelleme sorgusunu hazırla
    const stmt = await db.prepare(`
      UPDATE products SET 
        title = ?, 
        short_description = ?, 
        category_id = ?, 
        category_name = ?,
        segment = ?,
        main_image = ?,
        additional_images = ?,
        features = ?,
        updated_at = ?
      WHERE id = ?
    `);
    
    await stmt.run(
      updated.title,
      updated.short_description,
      updated.category_id,
      updated.category_name,
      updated.segment,
      updated.main_image,
      JSON.stringify(updated.additional_images),
      JSON.stringify(updated.features),
      updated.updated_at,
      id
    );
    
    await stmt.finalize();
    await db.close();
    
    return updated;
  } catch (error) {
    console.error('Ürün güncellenirken hata:', error);
    throw error;
  }
}

// Ürün silme fonksiyonu
export async function deleteProduct(id: number): Promise<boolean> {
  try {
    const db = await getDatabase();
    const result = await db.run(`DELETE FROM products WHERE id = ?`, id);
    await db.close();
    
    return result.changes ? result.changes > 0 : false;
  } catch (error) {
    console.error('Ürün silme hatası:', error);
    return false;
  }
}

// Kategorileri getirme fonksiyonu
export async function getCategories(): Promise<Category[]> {
  try {
    const db = await getDatabase();
    const categories = await db.all(`SELECT * FROM categories ORDER BY name ASC`);
    await db.close();
    return categories;
  } catch (error) {
    console.error('Kategoriler getirme hatası:', error);
    return [];
  }
} 