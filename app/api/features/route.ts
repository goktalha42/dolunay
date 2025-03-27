import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Feature } from '@/app/lib/db';

// Tüm özellikleri getir
export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase();
    
    // Özellikleri al, sıralamaya göre
    const [features] = await db.query(`
      SELECT * FROM features 
      ORDER BY display_order ASC, id ASC
    `);
    
    return NextResponse.json(features);
    
  } catch (error) {
    console.error('API Error: Özellikler getirilirken hata:', error);
    return NextResponse.json(
      { error: 'Özellikler getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Yeni özellik ekle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Temel doğrulama
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: 'Özellik adı gereklidir' },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    
    // Özelliği ekle - icon alanı eklendi
    const [result] = await db.query(`
      INSERT INTO features (name, display_order, icon)
      VALUES (?, ?, ?)
    `, [
      body.name.trim(),
      body.display_order || 0,
      body.icon || 'FaTags'
    ]);
    
    const insertResult = result as any;
    const featureId = insertResult.insertId;
    
    // Eklenen özelliği getir
    const [features] = await db.query(`
      SELECT * FROM features WHERE id = ?
    `, [featureId]);
    
    const featureRows = features as Feature[];
    
    if (!featureRows.length) {
      throw new Error('Özellik eklendi ancak getirilemedi');
    }
    
    return NextResponse.json(featureRows[0], { status: 201 });
    
  } catch (error) {
    console.error('API Error: Özellik eklenirken hata:', error);
    return NextResponse.json(
      { error: 'Özellik eklenirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 