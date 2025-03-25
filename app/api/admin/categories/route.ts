import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";

// Tüm kategorileri getir
export async function GET() {
  try {
    const { rows } = await sql`
      SELECT * FROM categories 
      ORDER BY name ASC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Kategoriler getirilirken hata:", error);
    return NextResponse.json(
      { error: "Kategoriler getirilemedi" },
      { status: 500 }
    );
  }
}

// Yeni kategori ekle
export async function POST(request: Request) {
  try {
    const { name, parent_id } = await request.json();

    const { rows } = await sql`
      INSERT INTO categories (name, parent_id)
      VALUES (${name}, ${parent_id})
      RETURNING *
    `;

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Kategori eklenirken hata:", error);
    return NextResponse.json(
      { error: "Kategori eklenemedi" },
      { status: 500 }
    );
  }
} 