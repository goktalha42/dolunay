import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Tüm ürünleri getir
export async function GET() {
  try {
    const { rows: products } = await sql`
      SELECT 
        p.*,
        c.name as category_name,
        array_agg(pf.feature_text) as features,
        array_agg(pi.image_path) as additional_images
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN product_features pf ON p.id = pf.product_id
      LEFT JOIN product_images pi ON p.id = pi.product_id
      GROUP BY p.id, c.id
      ORDER BY p.created_at DESC
    `;
    
    return NextResponse.json(products);
  } catch (error) {
    console.error("Ürünler getirilirken hata:", error);
    return NextResponse.json(
      { error: "Ürünler getirilemedi" },
      { status: 500 }
    );
  }
}

// Yeni ürün ekle
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Ana bilgileri al
    const title = formData.get("title") as string;
    const short_description = formData.get("short_description") as string;
    const category_id = parseInt(formData.get("category_id") as string);
    const segment = formData.get("segment") as string;
    const features = JSON.parse(formData.get("features") as string);
    
    // Ana resmi kaydet
    const main_image = formData.get("main_image") as File;
    const main_image_path = await saveImage(main_image);
    
    // Ürünü veritabanına ekle
    const { rows: [product] } = await sql`
      INSERT INTO products (
        title, 
        short_description, 
        category_id, 
        segment, 
        main_image
      )
      VALUES (
        ${title}, 
        ${short_description}, 
        ${category_id}, 
        ${segment}, 
        ${main_image_path}
      )
      RETURNING *
    `;

    // Özellikleri ekle
    for (const feature of features) {
      await sql`
        INSERT INTO product_features (product_id, feature_text)
        VALUES (${product.id}, ${feature})
      `;
    }

    // Ek resimleri kaydet
    const additional_images = formData.getAll("additional_images") as File[];
    for (const image of additional_images) {
      const image_path = await saveImage(image);
      await sql`
        INSERT INTO product_images (product_id, image_path)
        VALUES (${product.id}, ${image_path})
      `;
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Ürün eklenirken hata:", error);
    return NextResponse.json(
      { error: "Ürün eklenemedi" },
      { status: 500 }
    );
  }
}

// Resim kaydetme fonksiyonu
async function saveImage(file: File): Promise<string> {
  // Burada resmi bir CDN'e veya local storage'a kaydetme işlemi yapılacak
  // Şimdilik dummy bir path döndürüyoruz
  return `/images/products/${file.name}`;
} 