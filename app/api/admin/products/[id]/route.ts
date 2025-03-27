import { NextResponse } from "next/server";
import { getProductById, updateProduct, deleteProduct, Product } from "@/app/lib/db";
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
    
    // features değerini al ve parse et
    let features: number[] = [];
    const featuresStr = formData.get("features") as string;
    
    try {
      if (featuresStr) {
        const parsedFeatures = JSON.parse(featuresStr);
        if (Array.isArray(parsedFeatures)) {
          features = parsedFeatures.map(f => {
            if (typeof f === 'number') return f;
            if (typeof f === 'string' && !isNaN(Number(f))) return Number(f);
            return 0;
          }).filter(f => f > 0);
        }
      }
      console.log("Features parsed:", features);
    } catch (e) {
      console.error("Features parse error:", e);
      features = [];
    }
    
    // Ürün var mı kontrol et
    const existingProduct = await getProductById(id);
    if (!existingProduct) {
      return NextResponse.json({ error: "Ürün bulunamadı" }, { status: 404 });
    }
    
    // Tip güvenliği için düzeltme - API endpoint'inden dönen ürün nesnesi additional_images içerebilir
    const product = existingProduct as Product & { 
      additional_images?: string[] | string;
      features?: string[] | string;
    };

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
    let mainImagePath = product.main_image; // Mevcut ana resmi koru
    
    // formData'dan gelen değeri kontrol et
    const useDefaultImage = formData.get("main_image_default") === "true";
    
    if (useDefaultImage) {
      // Eğer varsayılan resim kullanılmak isteniyorsa, logo resmini kullan
      mainImagePath = '/images/logo.png';
      console.log("Varsayılan logo resmi kullanılıyor");
    } else if (mainImageFile) {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${mainImageFile.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, filename);
      
      const buffer = Buffer.from(await mainImageFile.arrayBuffer());
      await writeFile(filePath, buffer);
      
      mainImagePath = `/images/products/${filename}`;
      console.log("Yeni ana resim yüklendi:", mainImagePath);
    }

    // Ek resimleri işle
    let additionalImagePaths: string[] = [];
    
    // Mevcut ek resimleri koru parametresini logla
    console.log("keepExistingAdditionalImages:", keepExistingAdditionalImages);
    console.log("product.additional_images tipi:", typeof product.additional_images);
    console.log("product.additional_images dizisi mi?", Array.isArray(product.additional_images));
    
    if (Array.isArray(product.additional_images)) {
      console.log("product.additional_images içeriği:", product.additional_images);
    } else {
      console.log("product.additional_images içeriği (dizi değil):", product.additional_images);
    }
    
    // Mevcut ek resimleri koru (eğer istendiyse)
    if (keepExistingAdditionalImages) {
      try {
        if (Array.isArray(product.additional_images)) {
          additionalImagePaths = [...product.additional_images];
          console.log("Mevcut ek resimler (dizi olarak) korunuyor:", additionalImagePaths);
        } else if (typeof product.additional_images === 'string') {
          try {
            const parsedImages = JSON.parse(product.additional_images);
            if (Array.isArray(parsedImages)) {
              additionalImagePaths = parsedImages;
              console.log("Mevcut ek resimler (string'den parse edilen) korunuyor:", additionalImagePaths);
            } else {
              console.log("Parse edilen değer dizi değil:", parsedImages);
              additionalImagePaths = [];
            }
          } catch (parseError) {
            console.error("String parse edilemedi:", parseError);
            additionalImagePaths = [];
          }
        } else {
          console.log("Mevcut ek resimler ne dizi ne de string:", typeof product.additional_images);
          additionalImagePaths = [];
        }
      } catch (error) {
        console.error("Mevcut ek resimleri işlerken beklenmeyen hata:", error);
        additionalImagePaths = [];
      }
    } else {
      console.log("Mevcut ek resimler korunmuyor, boş dizi başlatılıyor");
      additionalImagePaths = [];
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
    
    if (additionalImageFiles.length > 0) {
      console.log("Yeni ek resimler eklendi:", additionalImageFiles.length);
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
    
    console.log("Güncellenen ürün verileri:", {
      title: title.trim(),
      category_id,
      segment,
      main_image: mainImagePath,
      additional_images_count: additionalImagePaths.length,
      additional_images: additionalImagePaths,
      features_count: features.length
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