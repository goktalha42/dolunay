import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Ürün güncelle
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const id = parseInt(params.id);
    
    // Ana bilgileri al
    const title = formData.get("title") as string;
    const short_description = formData.get("short_description") as string;
    const category_id = parseInt(formData.get("category_id") as string);
    const segment = formData.get("segment") as string;
    const features = JSON.parse(formData.get("features") as string);
    
    // Ürünü güncelle
    const { rows: [product] } = await sql`
      UPDATE products 
      SET 
        title = ${title},
        short_description = ${short_description},
        category_id = ${category_id},
        segment = ${segment}
      WHERE id = ${id}
      RETURNING *
    `;

    // Ana resmi güncelle (eğer yeni resim yüklendiyse)
    const main_image = formData.get("main_image") as File;
    if (main_image) {
      const main_image_path = await saveImage(main_image);
      await sql`
        UPDATE products 
        SET main_image = ${main_image_path}
        WHERE id = ${id}
      `;
    }

    // Özellikleri güncelle
    await sql`DELETE FROM product_features WHERE product_id = ${id}`;
    for (const feature of features) {
      await sql`
        INSERT INTO product_features (product_id, feature_text)
        VALUES (${id}, ${feature})
      `;
    }

    // Ek resimleri güncelle
    const additional_images = formData.getAll("additional_images") as File[];
    if (additional_images.length > 0) {
      await sql`DELETE FROM product_images WHERE product_id = ${id}`;
      for (const image of additional_images) {
        const image_path = await saveImage(image);
        await sql`
          INSERT INTO product_images (product_id, image_path)
          VALUES (${id}, ${image_path})
        `;
      }
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Ürün güncellenirken hata:", error);
    return NextResponse.json(
      { error: "Ürün güncellenemedi" },
      { status: 500 }
    );
  }
}

// Ürün sil
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Önce bağlı kayıtları sil
    await sql`DELETE FROM product_features WHERE product_id = ${id}`;
    await sql`DELETE FROM product_images WHERE product_id = ${id}`;
    
    // Sonra ürünü sil
    await sql`DELETE FROM products WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ürün silinirken hata:", error);
    return NextResponse.json(
      { error: "Ürün silinemedi" },
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