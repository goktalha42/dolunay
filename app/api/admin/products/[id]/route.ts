import { NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/lib/db";

export async function GET(request: Request, context: { params: { id: string } }) {
  const { params } = context;
  
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Geçersiz ürün ID'si" }, { status: 400 });
    }
    
    const product = await getProductById(id);
    
    if (!product) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error("Ürün getirilirken hata:", error);
    return NextResponse.json({ error: "Ürün getirilemedi" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: { params: { id: string } }) {
  const { params } = context;
  
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Geçersiz ürün ID'si" }, { status: 400 });
    }
    
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const short_description = formData.get("short_description") as string;
    const category_id = parseInt(formData.get("category_id") as string);
    const segment = formData.get("segment") as string;
    const main_image = formData.get("main_image") as string || '/images/products/default.jpg';
    const features = JSON.parse(formData.get("features") as string || "[]");
    const additional_images = JSON.parse(formData.get("additional_images") as string || "[]");
    
    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Ürün adı boş olamaz" }, { status: 400 });
    }
    
    // Ürün var mı kontrol et
    const existingProduct = await getProductById(id);
    if (!existingProduct) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }
    
    const updatedProduct = await updateProduct(id, { 
      title: title.trim(),
      short_description,
      category_id,
      segment,
      main_image,
      additional_images,
      features
    });
    
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Ürün güncellenirken hata:", error);
    return NextResponse.json({ error: "Ürün güncellenemedi" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  const { params } = context;
  
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Geçersiz ürün ID'si" }, { status: 400 });
    }
    
    const success = await deleteProduct(id);
    if (!success) {
      return NextResponse.json({ error: "Ürün silinemedi" }, { status: 400 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ürün silinirken hata:", error);
    return NextResponse.json({ error: "Ürün silinemedi" }, { status: 500 });
  }
} 