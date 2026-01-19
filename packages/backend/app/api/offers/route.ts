import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
    try {
        const [products]: any = await db.query(`
      SELECT 
        p.id, 
        p.title, 
        p.slug, 
        p.category_id,
        p.short_description, 
        p.image1_url, 
        p.image2_url, 
        p.image3_url, 
        p.stock_status,
        p.base_price,
        p.is_offer,
        p.discount_type,
        p.discount_value,
        c.name as category_name,
        (SELECT MIN(price) FROM product_pricing WHERE product_id = p.id) as min_price
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_offer = 1
      ORDER BY p.created_at DESC
    `);

        return NextResponse.json({
            success: true,
            products,
        });
    } catch (error) {
        console.error('GET OFFERS ERROR:', error);
        return NextResponse.json(
            { error: 'Failed to fetch offers' },
            { status: 500 }
        );
    }
}
