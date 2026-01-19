import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const [rows]: any = await db.query(`
      SELECT id, name, slug, image_url, short_description
      FROM products
      WHERE stock_status = 'IN_STOCK'
      ORDER BY RAND()
      LIMIT 3
    `);

    return NextResponse.json({
      success: true,
      products: rows,
    });
  } catch (error) {
    console.error('FEATURED PRODUCTS ERROR:', error);
    return NextResponse.json(
      { success: false, products: [] },
      { status: 500 }
    );
  }
}