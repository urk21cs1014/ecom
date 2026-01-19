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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    const [products]: any = await db.query(
      `SELECT p.*, m.name as material_name, m.grades as material_grades, c.name as category_name
       FROM products p
       LEFT JOIN materials m ON p.material_id = m.id
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );

    if (products.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const product = products[0];

    // Parse material grades
    if (product.material_grades) {
      product.material_grades = typeof product.material_grades === 'string'
        ? JSON.parse(product.material_grades)
        : product.material_grades;
    }

    // Get pricing
    const [pricing]: any = await db.query(
      `SELECT pp.*, m.name as material_name
       FROM product_pricing pp
       LEFT JOIN materials m ON pp.material_id = m.id
       WHERE pp.product_id = ?
       ORDER BY pp.material_id, pp.size`,
      [id]
    );

    product.pricing = pricing;

    return NextResponse.json(product);
  } catch (error) {
    console.error('GET PRODUCT ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
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
      pricing,
    } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required' },
        { status: 400 }
      );
    }

    // Update product
    await db.query(
      `UPDATE products SET
        title = ?, slug = ?, material_id = ?, category_id = ?, category = ?, sku = ?,
        short_description = ?, full_description = ?,
        image1_url = ?, image2_url = ?, image3_url = ?,
        og_title = ?, og_description = ?,
        twitter_title = ?, twitter_description = ?,
        facebook_title = ?, facebook_description = ?,
        stock_status = ?, base_price = ?,
        is_offer = ?, discount_type = ?, discount_value = ?
      WHERE id = ?`,
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
        id,
      ]
    );

    // Update pricing - delete old and insert new
    if (Array.isArray(pricing)) {
      await db.query('DELETE FROM product_pricing WHERE product_id = ?', [id]);

      if (pricing.length > 0) {
        const pricingValues = pricing.map((p: any) => [
          id,
          p.material_id,
          p.grade || '-',
          p.size || '-',
          p.price || 0,
        ]);

        await db.query(
          `INSERT INTO product_pricing (product_id, material_id, grade, size, price) 
           VALUES ?`,
          [pricingValues]
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
    });
  } catch (error: any) {
    console.error('UPDATE PRODUCT ERROR:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAuth();
  if (authError) return authError;

  try {
    const { id } = await params;
    // Delete pricing first (cascade should handle this, but being explicit)
    await db.query('DELETE FROM product_pricing WHERE product_id = ?', [id]);
    await db.query('DELETE FROM products WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('DELETE PRODUCT ERROR:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
