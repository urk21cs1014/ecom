import { db } from '@/lib/db';
import ProductCarousel from './ProductCarousel';

interface RelatedProductsProps {
    categoryId: number;
    currentProductId: number;
}

export default async function RelatedProducts({ categoryId, currentProductId }: RelatedProductsProps) {
    // Fetch products from the same category, excluding the current one
    const [products]: any = await db.query(`
    SELECT p.id, p.title, p.slug, p.short_description, p.image1_url, p.image2_url, p.image3_url,
     c.name as category_name,
     (SELECT MIN(price) FROM product_pricing WHERE product_id = p.id) as min_price
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.category_id = ? AND p.id != ?
     ORDER BY RAND()
     LIMIT 12
  `, [categoryId, currentProductId]);

    if (!products.length) return null;

    return (
        <section className="py-12 border-t border-gray-100 mt-12">
            <div className="text-left mb-8">
                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
                    Related Products
                </h2>
            </div>

            <ProductCarousel products={products} />
        </section>
    );
}
