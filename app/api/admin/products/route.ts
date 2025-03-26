import { NextResponse } from "next/server";
import { getProducts, addProduct, deleteProduct } from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import { existsSync, mkdirSync } from "fs";

// Tüm ürünleri getir
export async function GET() {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Ürünler getirilirken hata:", error);
    return NextResponse.json({ error: "Ürünler getirilemedi" }, { status: 500 });
  }
}

// Yeni ürün ekle
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const short_description = formData.get("short_description") as string;
    const category_id = parseInt(formData.get("category_id") as string);
    const segment = formData.get("segment") as string;
    const features = JSON.parse(formData.get("features") as string || "[]");
    
    // Resim dosyalarını al
    const mainImageFile = formData.get("main_image_file") as File | null;
    const additionalImageFiles = formData.getAll("additional_image_files") as File[];

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Ürün adı boş olamaz" }, { status: 400 });
    }

    // Resimlerin kaydedileceği klasörün varlığını kontrol et ve yoksa oluştur
    const uploadDir = path.join(process.cwd(), "public/images/products");
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    // Ana resmi kaydet
    let mainImagePath = '/images/products/default.jpg'; // Varsayılan resim
    if (mainImageFile) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${mainImageFile.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, filename);
      
      const buffer = Buffer.from(await mainImageFile.arrayBuffer());
      await writeFile(filePath, buffer);
      
      mainImagePath = `/images/products/${filename}`;
    }

    // Ek resimleri kaydet
    const additionalImagePaths: string[] = [];
    for (const file of additionalImageFiles) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${file.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, filename);
      
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filePath, buffer);
      
      additionalImagePaths.push(`/images/products/${filename}`);
    }

    const newProduct = await addProduct({
      title: title.trim(),
      short_description,
      category_id,
      segment,
      main_image: mainImagePath,
      additional_images: additionalImagePaths,
      features,
    });

    return NextResponse.json(newProduct);
  } catch (error) {
    console.error("Ürün eklenirken hata:", error);
    return NextResponse.json({ error: "Ürün eklenemedi" }, { status: 500 });
  }
}

// Ürün sil
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (id === undefined || id === null) {
      return NextResponse.json({ error: "Ürün ID'si gerekli" }, { status: 400 });
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