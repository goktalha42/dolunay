import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';

export async function GET() {
  try {
    const isConnected = await testConnection();
    
    if (isConnected) {
      return NextResponse.json({ 
        success: true, 
        message: 'Veritabanı bağlantısı başarılı' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Veritabanı bağlantısı başarısız' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('API hatası:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Bir hata oluştu', 
      error: error.message 
    }, { status: 500 });
  }
} 