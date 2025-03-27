import { NextRequest, NextResponse } from 'next/server';
import { getDatabase, Feature } from '@/app/lib/db';

// Tek bir özelliği getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Geçersiz özellik ID' },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    
    // Özellik verisini getir
    const [features] = await db.query(`
      SELECT * FROM features WHERE id = ?
    `, [id]);
    
    const featureRows = features as Feature[];
    
    if (!featureRows.length) {
      return NextResponse.json(
        { error: 'Özellik bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(featureRows[0]);
    
  } catch (error) {
    console.error(`API Error: Özellik (ID: ${params.id}) getirilirken hata:`, error);
    return NextResponse.json(
      { error: 'Özellik getirilirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Özelliği güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Geçersiz özellik ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Temel doğrulama
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: 'Özellik adı gereklidir' },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    
    // Önce özelliğin var olup olmadığını kontrol et
    const [features] = await db.query(`
      SELECT * FROM features WHERE id = ?
    `, [id]);
    
    const featureRows = features as Feature[];
    
    if (!featureRows.length) {
      return NextResponse.json(
        { error: 'Güncellenecek özellik bulunamadı' },
        { status: 404 }
      );
    }
    
    // Özelliği güncelle - icon alanı eklendi
    await db.query(`
      UPDATE features
      SET name = ?, display_order = ?, icon = ?
      WHERE id = ?
    `, [
      body.name.trim(),
      body.display_order !== undefined ? body.display_order : featureRows[0].display_order,
      body.icon || featureRows[0].icon || 'FaTags',
      id
    ]);
    
    // Güncellenmiş özelliği getir
    const [updatedFeatures] = await db.query(`
      SELECT * FROM features WHERE id = ?
    `, [id]);
    
    const updatedFeatureRows = updatedFeatures as Feature[];
    
    return NextResponse.json(updatedFeatureRows[0]);
    
  } catch (error) {
    console.error(`API Error: Özellik (ID: ${params.id}) güncellenirken hata:`, error);
    return NextResponse.json(
      { error: 'Özellik güncellenirken bir hata oluştu' },
      { status: 500 }
    );
  }
}

// Özelliği sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Geçersiz özellik ID' },
        { status: 400 }
      );
    }
    
    const db = await getDatabase();
    
    // Önce özelliğin var olup olmadığını kontrol et
    const [features] = await db.query(`
      SELECT * FROM features WHERE id = ?
    `, [id]);
    
    const featureRows = features as Feature[];
    
    if (!featureRows.length) {
      return NextResponse.json(
        { error: 'Silinecek özellik bulunamadı' },
        { status: 404 }
      );
    }
    
    // Bu özelliğin ürünlerle ilişkisini kontrol et
    const [relations] = await db.query(`
      SELECT COUNT(*) as count FROM product_features WHERE feature_id = ?
    `, [id]);
    
    const relationsCount = (relations as any[])[0]?.count || 0;
    
    // Transaction başlat
    await db.query('START TRANSACTION');
    
    try {
      // Eğer ilişkili ürünler varsa, önce product_features tablosundaki ilgili kayıtları sil
      if (relationsCount > 0) {
        await db.query(`
          DELETE FROM product_features WHERE feature_id = ?
        `, [id]);
      }
      
      // Ardından özelliğin kendisini sil
      await db.query(`
        DELETE FROM features WHERE id = ?
      `, [id]);
      
      // Transaction'ı doğrula
      await db.query('COMMIT');
      
      return NextResponse.json({ 
        success: true, 
        message: 'Özellik başarıyla silindi', 
        removedRelations: relationsCount > 0 ? `${relationsCount} ürünle olan ilişki de kaldırıldı.` : undefined 
      });
      
    } catch (error) {
      // Hata durumunda geri al
      await db.query('ROLLBACK');
      throw error;
    }
    
  } catch (error) {
    console.error(`API Error: Özellik (ID: ${params.id}) silinirken hata:`, error);
    return NextResponse.json(
      { error: 'Özellik silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 