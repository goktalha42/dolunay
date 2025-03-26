import { NextResponse } from 'next/server';
import { setupDatabase } from '@/app/lib/db';

// Veritabanı tablolarını oluşturmak için API endpoint
export async function GET() {
  try {
    await setupDatabase();
    return NextResponse.json({ success: true, message: 'Veritabanı tabloları başarıyla oluşturuldu' });
  } catch (error) {
    console.error('Veritabanı kurulumu hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Veritabanı tabloları oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
} 