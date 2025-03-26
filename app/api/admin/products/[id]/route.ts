import { NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct } from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import { existsSync, mkdirSync } from "fs";

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
    const features = JSON.parse(formData.get("features") as string || "[]");
    
    // Ürün var mı kontrol et
    const existingProduct = await getProductById(id);
    if (!existingProduct) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }
    
    // Resim dosyalarını al
    const mainImageFile = formData.get("main_image_file") as File | null;
    const additionalImageFiles = formData.getAll("additional_image_files") as File[];
    const keepExistingAdditionalImages = formData.get("keep_existing_additional_images") === "true";

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Ürün adı boş olamaz" }, { status: 400 });
    }

    // Resimlerin kaydedileceği klasörün varlığını kontrol et ve yoksa oluştur
    const uploadDir = path.join(process.cwd(), "public/images/products");
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Ana resmi işle
    let mainImagePath = existingProduct.main_image; // Mevcut ana resmi koru
    if (mainImageFile) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${mainImageFile.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, filename);
      
      const buffer = Buffer.from(await mainImageFile.arrayBuffer());
      await writeFile(filePath, buffer);
      
      mainImagePath = `/images/products/${filename}`;
    }

    // Ek resimleri işle
    let additionalImagePaths: string[] = [];
    
    // Mevcut ek resimleri koru (eğer istendiyse)
    if (keepExistingAdditionalImages && existingProduct.additional_images) {
      additionalImagePaths = [...existingProduct.additional_images];
    }
    
    // Yeni ek resimleri ekle
    for (const file of additionalImageFiles) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, filename);
      
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);
      
      additionalImagePaths.push(`/images/products/${filename}`);
    }

    const updatedProduct = await updateProduct(id, {
      title: title.trim(),
      short_description,
      category_id,
      segment,
      main_image: mainImagePath,
      additional_images: additionalImagePaths,
      features,
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