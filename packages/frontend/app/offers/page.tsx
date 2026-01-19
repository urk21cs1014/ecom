import { db } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Exclusive Offers | Continental Pipes - Premium Industrial Deals',
  description: 'Discover limited-time offers and exclusive discounts on our high-performance industrial pipes and materials.',
};

async function getOfferProducts() {
  const [products]: any = await db.query(`
    SELECT DISTINCT p.id, p.title, p.slug, p.image1_url, p.image2_url, p.image3_url, 
           p.stock_status, p.short_description, p.base_price, 
           p.is_offer, p.discount_type, p.discount_value, p.created_at,
           c.name as category_name,
           (SELECT MIN(price) FROM product_pricing WHERE product_id = p.id) as min_price
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_offer = 1
    ORDER BY p.created_at DESC
  `);
  return products;
}

export default async function OffersPage() {
  const products = await getOfferProducts();

  const calculateOfferPrice = (product: any) => {
    const price = parseFloat(product.min_price || product.base_price || 0);
    const disc = parseFloat(product.discount_value || 0);
    if (product.discount_type === 'PERCENTAGE') {
      return (price - (price * (disc / 100))).toFixed(2);
    }
    return (price - disc).toFixed(2);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="hidden md:block bg-gray-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
          <span className="text-gray-700">/</span>
          <span className="text-white">Active Offers</span>
        </div>
      </div>

      {/* ================= HERO BANNER ================= */}
      <section className="bg-gray-900 overflow-hidden py-14 lg:py-20 relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-600/5 skew-x-[-20deg] translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-orange-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4">Limited Time Deals</span>
            <h1 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
              Exclusive <span className="text-orange-600">Offers</span>
            </h1>
            <p className="text-gray-400 text-sm lg:text-base font-medium leading-relaxed italic border-l-2 border-orange-600 pl-4 max-w-2xl">
              Maximize your project efficiency with our premium industrial solutions at promotional prices. Uncompromising quality across our entire range of stainless steel and alloy piping systems.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product: any) => {
              const offerPrice = calculateOfferPrice(product);
              const badge = product.discount_type === 'PERCENTAGE'
                ? `${Math.round(product.discount_value)}% OFF`
                : 'SPECIAL OFFER';

              return (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group bg-white border border-gray-100 rounded-[24px] p-5 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 flex flex-col relative overflow-hidden"
                >
                  {/* Offer Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-orange-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-orange-100">
                      {badge}
                    </span>
                  </div>

                  <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative aspect-square bg-[#fafafa] rounded-2xl mb-5 flex items-center justify-center overflow-hidden border border-gray-50 group-hover:border-orange-100 transition-colors">
                    <Image
                      src={product.image1_url || product.image2_url || product.image3_url || '/images/product-placeholder.png'}
                      alt={product.title}
                      fill
                      className="object-contain transition-transform duration-700"
                    />
                  </div>

                  <div className="flex flex-col flex-grow relative z-10">
                    <span className="text-[9px] font-black text-orange-600 uppercase tracking-[0.2em] mb-1.5">
                      {product.category_name}
                    </span>
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                      {product.title}
                    </h3>

                    <p className="text-gray-500 text-[10px] font-medium leading-relaxed mb-6 line-clamp-2 uppercase tracking-tight opacity-70">
                      {product.short_description}
                    </p>

                    <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                      <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.1em] mb-0.5 text-blue-600">Offer Price</p>
                        <div className="flex items-baseline gap-2">
                          <p className="text-gray-900 font-black text-xl">
                            ${offerPrice}
                          </p>
                          <p className="text-gray-400 font-bold text-[10px] line-through">
                            ${parseFloat(product.min_price || product.base_price || 0).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center group-hover:bg-orange-600 group-hover:scale-110 transition-all shadow-lg shadow-gray-200 group-hover:shadow-orange-200">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">No Active Offers</h3>
            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8">We don't have any promotional offers at this moment. Please check back later or browse our catalog.</p>
            <Link href="/shop" className="inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all">
              Browse Full catalog
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}