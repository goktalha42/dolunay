import { NextResponse } from "next/server";
import { getCategoryById, updateCategory, deleteCategory } from "@/lib/db";

export async function GET(request: Request, context: { params: { id: string } }) {
  const { params } = context;
  
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Geçersiz kategori ID'si" }, { status: 400 });
    }
    
    const category = await getCategoryById(id);
    
    if (!category) {
      return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
    }
    
    return NextResponse.json(category);
  } catch (error) {
    console.error("Kategori getirilirken hata:", error);
    return NextResponse.json({ error: "Kategori getirilemedi" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: { id: string } }) {
  const { params } = context;
  
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Geçersiz kategori ID'si" }, { status: 400 });
    }
    
    const { name, parent_id } = await request.json();
    
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Kategori adı boş olamaz" }, { status: 400 });
    }
    
    // Kategori var mı kontrol et
    const existingCategory = await getCategoryById(id);
    if (!existingCategory) {
      return NextResponse.json({ error: "Kategori bulunamadı" }, { status: 404 });
    }
    
    // Kendisini kendi alt kategorisi yapma kontrolü
    if (parent_id === id) {
      return NextResponse.json({ error: "Bir kategori kendisini alt kategori olarak alamaz" }, { status: 400 });
    }
    
    const updatedCategory = await updateCategory(id, { 
      name: name.trim(), 
      parent_id: parent_id || null 
    });
    
    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Kategori güncellenirken hata:", error);
    return NextResponse.json({ error: "Kategori güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  const { params } = context;
  
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Geçersiz kategori ID'si" }, { status: 400 });
    }
    
    const success = await deleteCategory(id);
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