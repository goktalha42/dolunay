import { NextResponse } from "next/server";
import { getCategories, getCategoriesWithProducts } from "@/app/lib/db";

// Tüm kategorileri getir
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const onlyWithProducts = searchParams.get('onlyWithProducts') === 'true';
    
    let categories;
    if (onlyWithProducts) {
      categories = await getCategoriesWithProducts();
    } else {
      categories = await getCategories();
    }
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Kategoriler getirilirken hata:", error);
    return NextResponse.json({ error: "Kategoriler getirilemedi" }, { status: 500 });
  }
}

// Yeni kategori ekle
export async function POST(request: Request) {
  try {
    const { name, parent_id } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Kategori adı boş olamaz" }, { status: 400 });
    }

    // İstek doğrudan veritabanı bağlantı yolunu kullanıyor
    const db = await import('@/app/lib/db');
    const newCategory = await db.addCategory({ name: name.trim(), parent_id: parent_id || null });
    return NextResponse.json(newCategory);
  } catch (error) {
    console.error("Kategori eklenirken hata:", error);
    return NextResponse.json({ error: "Kategori eklenemedi" }, { status: 500 });
  }
}

// Kategori güncelle
export async function PUT(request: Request) {
  try {
    const { id, name, parent_id } = await request.json();
    
    if (id === undefined || id === null) {
      return NextResponse.json({ error: "Kategori ID'si gerekli" }, { status: 400 });
    }
    
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Kategori adı boş olamaz" }, { status: 400 });
    }
    
    // İstek doğrudan veritabanı bağlantı yolunu kullanıyor
    const db = await import('@/app/lib/db');
    
    // Kategori var mı kontrol et
    const existingCategory = await db.getCategoryById(id);
    if (!existingCategory) {
      return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
    }
    
    // Kendisini kendi alt kategorisi yapma kontrolü
    if (parent_id === id) {
      return NextResponse.json({ error: "Bir kategori kendisini alt kategori olarak alamaz" }, { status: 400 });
    }
    
    const updatedCategory = await db.updateCategory(id, { 
      name: name.trim(), 
      parent_id: parent_id || null 
    });
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Kategori güncellenirken hata:", error);
    return NextResponse.json({ error: "Kategori güncellenemedi" }, { status: 500 });
  }
}

// Kategori sil
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (id === undefined || id === null) {
      return NextResponse.json({ error: "Kategori ID'si gerekli" }, { status: 400 });
    }

    const db = await import('@/app/lib/db');
    const success = await db.deleteCategory(id);
    if (!success) {
      return NextResponse.json({ 
        error: "Kategori silinemedi. Bu kategoriye ait alt kategoriler veya ürünler olabilir." 
      }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Kategori silinirken hata:", error);
    return NextResponse.json({ error: "Kategori silinemedi" }, { status: 500 });
  }
}