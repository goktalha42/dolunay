import { NextResponse } from "next/server";
import { getProducts, addProduct, deleteProduct } from "@/lib/db";

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

    if (!title || !title.trim()) {
      return NextResponse.json({ error: "Ürün adı boş olamaz" }, { status: 400 });
    }

    const newProduct = await addProduct({
      title: title.trim(),
      short_description,
      category_id,
      segment,
      main_image: '/images/products/default.jpg', // Varsayılan resim
      additional_images: [],
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