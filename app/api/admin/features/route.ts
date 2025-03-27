import { NextResponse } from "next/server";
import { getFeatures, addFeature } from "@/app/lib/db";

// Tüm özellikleri getir
export async function GET() {
  try {
    const features = await getFeatures();
    return NextResponse.json(features);
  } catch (error) {
    console.error("Özellikler getirilirken hata:", error);
    return NextResponse.json({ error: "Özellikler getirilemedi" }, { status: 500 });
  }
}

// Yeni özellik ekle
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, icon, display_order } = data;
    
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Özellik adı boş olamaz" }, { status: 400 });
    }
    
    const feature = await addFeature({
      name: name.trim(),
      icon: icon || 'FaTags',
      display_order: display_order || 0
    });
    
    if (!feature) {
      return NextResponse.json({ error: "Özellik eklenemedi" }, { status: 500 });
    }
    
    return NextResponse.json(feature);
  } catch (error) {
    console.error("Özellik eklenirken hata:", error);
    return NextResponse.json({ error: "Özellik eklenemedi" }, { status: 500 });
  }
} 