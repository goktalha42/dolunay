import { NextResponse } from "next/server";
import { getFeatures, updateFeature, deleteFeature } from "@/app/lib/db";

// Tek bir özelliği güncelle
export async function PUT(request: Request, context: { params: { id: string } }) {
  const { params } = context;
  
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Geçersiz özellik ID'si" }, { status: 400 });
    }
    
    const data = await request.json();
    const { name, icon, display_order } = data;
    
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Özellik adı boş olamaz" }, { status: 400 });
    }
    
    const feature = await updateFeature(id, {
      name: name.trim(),
      icon: icon || 'FaTags', 
      display_order: display_order || 0
    });
    
    if (!feature) {
      return NextResponse.json({ error: "Özellik bulunamadı veya güncellenemedi" }, { status: 404 });
    }
    
    return NextResponse.json(feature);
  } catch (error) {
    console.error("Özellik güncellenirken hata:", error);
    return NextResponse.json({ error: "Özellik güncellenemedi" }, { status: 500 });
  }
}

// Bir özelliği sil
export async function DELETE(request: Request, context: { params: { id: string } }) {
  const { params } = context;
  
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Geçersiz özellik ID'si" }, { status: 400 });
    }
    
    const success = await deleteFeature(id);
    
    if (!success) {
      return NextResponse.json({ error: "Özellik bulunamadı veya silinemedi" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Özellik silinirken hata:", error);
    return NextResponse.json({ error: "Özellik silinemedi" }, { status: 500 });
  }
} 