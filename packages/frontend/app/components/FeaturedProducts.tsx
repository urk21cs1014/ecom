import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';

const calculateOfferPrice = (basePrice: any, type: string, value: any) => {
  const price = parseFloat(basePrice || 0);
  const disc = parseFloat(value || 0);
  if (type === 'PERCENTAGE') {
    return (price - (price * (disc / 100))).toFixed(2);
  }
  return (price - disc).toFixed(2);
};

export default async function FeaturedProducts({ productIds }: { productIds?: number[] }) {
  // ... existing query logic ...
  let query = `
    SELECT p.id, p.title, p.slug, p.short_description, p.image1_url, p.image2_url, p.image3_url,
     c.name as category_name,
     (SELECT MIN(price) FROM product_pricing WHERE product_id = p.id) as min_price,
     p.is_offer, p.discount_type, p.discount_value
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
  `;

  if (productIds && productIds.length > 0) {
    query += ` WHERE p.id IN (${productIds.join(',')}) ORDER BY FIELD(p.id, ${productIds.join(',')})`;
  } else {
    query += ` ORDER BY p.created_at DESC LIMIT 6`;
  }

  const [products]: any = await db.query(query);

  if (!products.length) return null;

  return (
    <section className="py-4 lg:py-6 bg-gray-100 border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-4">
          <span className="text-orange-600 font-black text-[10px] uppercase tracking-widest block mb-1">Top Selections</span>
          <h2 className="text-2xl lg:text-3xl font-black text-gray-900 uppercase tracking-tight">
            Featured Solutions
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product: any) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group bg-white border border-gray-100 rounded-[20px] p-4 hover:shadow-2xl hover:shadow-orange-100/30 transition-all duration-500 flex flex-col"
            >
              {/* IMAGE CONTAINER - SQUARE RATIO */}
              <div className="relative aspect-square bg-gray-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden border border-gray-50 group-hover:bg-white transition-colors duration-500">
                <Image
                  src={product.image1_url || product.image2_url || product.image3_url || '/images/product-placeholder.png'}
                  alt={product.title}
                  fill
                  className="object-contain transition-transform duration-700"
                />

                {/* Offer Badge Overlay */}
                {product.is_offer === 1 && (
                  <div className="absolute top-2 right-2 bg-orange-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg z-10">
                    {product.discount_type === 'PERCENTAGE' ? `${Math.round(product.discount_value)}% OFF` : `$${product.discount_value} OFF`}
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="flex flex-col flex-grow">
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-widest mb-1">
                  {product.category_name || 'Industrial'}
                </span>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-2 line-clamp-1">
                  {product.title}
                </h3>

                <p className="text-gray-500 text-[10px] font-medium leading-relaxed mb-4 line-clamp-2 uppercase tracking-tight">
                  {product.short_description}
                </p>

                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Price</p>
                    {product.min_price ? (
                      <div className="flex flex-col">
                        {product.is_offer === 1 ? (
                          <>
                            <p className="text-orange-600 font-black text-[13px] leading-none">
                              ${calculateOfferPrice(product.min_price, product.discount_type, product.discount_value)}
                            </p>
                            <p className="text-[9px] text-gray-400 line-through mt-0.5">
                              ${parseFloat(product.min_price).toLocaleString()}
                            </p>
                          </>
                        ) : (
                          <p className="text-gray-900 font-black text-[13px] leading-none">
                            ${parseFloat(product.min_price).toLocaleString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-900 font-black uppercase text-[9px] tracking-tight">Quote Only</p>
                    )}
                  </div>

                  <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
