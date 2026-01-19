import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  return null;
}

export async function GET() {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const [products]: any = await db.query(`
      SELECT 
        p.id, 
        p.title, 
        p.slug, 
        p.category, 
        p.sku, 
        p.stock_status, 
        p.created_at,
        m.id as material_id,
        m.name as material_name,
        c.id as category_id,
        c.name as category_name,
        p.base_price,
        p.is_offer,
        p.discount_type,
        p.discount_value
      FROM products p
      LEFT JOIN materials m ON p.material_id = m.id
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `);

    return NextResponse.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error('GET PRODUCTS ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const body = await request.json();
    const {
      title,
      slug,
      material_id,
      category_id,
      category,
      sku,
      short_description,
      full_description,
      image1_url,
      image2_url,
      image3_url,
      og_title,
      og_description,
      twitter_title,
      twitter_description,
      facebook_title,
      facebook_description,
      stock_status,
      base_price,
      is_offer,
      discount_type,
      discount_value,
      pricing, // Array of { material_id, grade, size, price }
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    // Insert product
    const [result]: any = await db.query(
      `INSERT INTO products (
        title, slug, material_id, category_id, category, sku,
        short_description, full_description,
        image1_url, image2_url, image3_url,
        og_title, og_description,
        twitter_title, twitter_description,
        facebook_title, facebook_description,
        stock_status, base_price, is_offer, discount_type, discount_value
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        slug,
        material_id || null,
        category_id || null,
        category || null,
        sku || null,
        short_description || null,
        full_description || null,
        image1_url || null,
        image2_url || null,
        image3_url || null,
        og_title || null,
        og_description || null,
        twitter_title || null,
        twitter_description || null,
        facebook_title || null,
        facebook_description || null,
        stock_status || 'IN_STOCK',
        base_price || null,
        is_offer || 0,
        discount_type || 'PERCENTAGE',
        discount_value || 0,
      ]
    );

    const productId = result.insertId;

    // Insert pricing if provided
    if (Array.isArray(pricing) && pricing.length > 0) {
      const pricingValues = pricing.map((p: any) => [
        productId,
        p.material_id,
        p.grade,
        p.size,
        p.price,
      ]);

      await db.query(
        `INSERT INTO product_pricing (product_id, material_id, grade, size, price) 
         VALUES ?`,
        [pricingValues]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      productId,
    });
  } catch (error: any) {
    console.error('CREATE PRODUCT ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
