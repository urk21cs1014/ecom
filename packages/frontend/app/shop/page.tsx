import { db } from '@/lib/db';
import Link from 'next/link';
import { Metadata } from 'next';
import ShopFilters from './ShopFilters';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Shop | Continental Pipes - Premium Industrial Products',
  description: 'Explore our wide range of premium industrial pipes, materials, and accessories at Continental Pipes.',
  openGraph: {
    title: 'Shop | Continental Pipes',
    description: 'Explore our wide range of premium industrial pipes and materials.',
  }
};

type Product = {
  id: number;
  title: string;
  slug: string;
  image1_url: string | null;
  image2_url: string | null;
  image3_url: string | null;
  stock_status: string;
  material_name: string | null;
  category_name: string | null;
  short_description: string | null;
  min_price: string | null;
  base_price: string | null;
  is_offer: number;
  discount_type: string;
  discount_value: string;
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    material?: string;
    stock?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || '';
  const categoriesParam = params.category ? params.category.split(',') : [];
  const materialsParam = params.material ? params.material.split(',') : [];
  const stockParam = params.stock ? params.stock.split(',') : [];
  const minPrice = params.minPrice ? parseFloat(params.minPrice) : null;
  const maxPrice = params.maxPrice ? parseFloat(params.maxPrice) : null;
  const sort = params.sort || 'relevance';

  const limit = 12;
  const offset = (page - 1) * limit;

  // Fetch Filters Metadata
  const [categories]: any = await db.query('SELECT id, name FROM categories ORDER BY name ASC');
  const [materials]: any = await db.query('SELECT id, name FROM materials ORDER BY name ASC');

  // Build Query
  let query = `
    SELECT DISTINCT p.id, p.title, p.slug, p.image1_url, p.image2_url, p.image3_url, p.stock_status, p.short_description, p.created_at,
    c.name as category_name,
    (SELECT MIN(price) FROM product_pricing WHERE product_id = p.id) as min_price,
    p.base_price,
    p.is_offer,
    p.discount_type,
    p.discount_value
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN product_pricing pp ON p.id = pp.product_id
    LEFT JOIN materials m ON (p.material_id = m.id OR pp.material_id = m.id)
    WHERE 1=1
  `;

  const queryParams: any[] = [];

  if (search) {
    query += ` AND (p.title LIKE ? OR p.short_description LIKE ? OR c.name LIKE ? OR m.name LIKE ?) `;
    const searchPattern = `%${search}%`;
    queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
  }

  if (categoriesParam.length > 0) {
    query += ` AND c.name IN (${categoriesParam.map(() => '?').join(',')}) `;
    queryParams.push(...categoriesParam);
  }

  if (materialsParam.length > 0) {
    query += ` AND m.name IN (${materialsParam.map(() => '?').join(',')}) `;
    queryParams.push(...materialsParam);
  }

  if (stockParam.length > 0) {
    query += ` AND p.stock_status IN (${stockParam.map(() => '?').join(',')}) `;
    queryParams.push(...stockParam);
  }

  if (minPrice !== null) {
    query += ` AND EXISTS (SELECT 1 FROM product_pricing WHERE product_id = p.id AND price >= ?) `;
    queryParams.push(minPrice);
  }

  if (maxPrice !== null) {
    query += ` AND EXISTS (SELECT 1 FROM product_pricing WHERE product_id = p.id AND price <= ?) `;
    queryParams.push(maxPrice);
  }

  // Store base query for count before adding ORDER BY
  const countQuery = `SELECT COUNT(DISTINCT id) as total FROM (${query}) as t`;
  const [[{ total }]]: any = await db.query(countQuery, queryParams);

  // Sorting
  switch (sort) {
    case 'name-asc': query += ` ORDER BY title ASC `; break;
    case 'name-desc': query += ` ORDER BY title DESC `; break;
    case 'price-asc': query += ` ORDER BY min_price ASC `; break;
    case 'price-desc': query += ` ORDER BY min_price DESC `; break;
    case 'newest': query += ` ORDER BY created_at DESC `; break;
    default: query += ` ORDER BY created_at DESC `; break;
  }

  query += ` LIMIT ? OFFSET ? `;
  queryParams.push(limit, offset);

  const [products]: any = await db.query(query, queryParams);
  const totalPages = Math.ceil(total / limit);

  return (
    <main className="min-h-screen bg-[#FDFDFD]">
      {/* Breadcrumb */}
      <div className="hidden md:block bg-gray-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
          <span className="text-gray-700">/</span>
          <span className="text-white">Shop</span>
        </div>
      </div>

      {/* ================= HERO BANNER (Material Style) ================= */}
      <section className="bg-gray-900 overflow-hidden py-14 lg:py-20 relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-600/5 skew-x-[-20deg] translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block text-orange-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4">Product Catalog</span>
            <h1 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
              {search ? `Results for "${search}"` : 'Premium Solutions'}
            </h1>
            <p className="text-gray-400 text-sm lg:text-base font-medium leading-relaxed italic border-l-2 border-orange-600 pl-4 max-w-2xl">
              Explore our comprehensive range of high-performance industrial valves and piping products, engineered for precision, durability, and safety across global operations.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Advanced Client Sidebar - Sticky via ShopFilters component */}
          <ShopFilters initialCategories={categories} initialMaterials={materials} />

          {/* Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Showing <span className="text-gray-900">{products.length}</span> of <span className="text-gray-900">{total}</span> Results
              </p>
              <div className="hidden lg:flex items-center gap-2">
                {/* Quick view toggles could go here */}
              </div>
            </div>

            {products.length === 0 ? (
              <div className="bg-white rounded-[40px] px-10 py-24 text-center border border-gray-100 shadow-sm shadow-gray-50">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">No matching products</h3>
                <p className="text-gray-500 mb-10 max-w-sm mx-auto text-sm leading-relaxed uppercase tracking-tight font-medium opacity-70">
                  Try adjusting your filters or search keywords to find what you're looking for.
                </p>
                <Link href="/shop" className="inline-flex items-center justify-center bg-gray-900 text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl shadow-gray-100 hover:shadow-orange-100">
                  Clear All Filters
                </Link>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8 mb-16">
                  {products.map((product: Product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="group bg-white rounded-[24px] p-5 border border-gray-100 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 flex flex-col relative overflow-hidden h-full"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Image */}
                      <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#fafafa] mb-5 flex items-center justify-center group-hover:bg-white transition-colors duration-500 border border-gray-50">
                        <Image
                          src={product.image1_url || product.image2_url || '/images/product-placeholder.png'}
                          alt={product.title}
                          fill
                          className="object-contain transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-1 rounded-full text-[8px] font-black tracking-widest uppercase ${product.stock_status === 'IN_STOCK' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                            {product.stock_status === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                        {/* Offer Badge */}
                        {product.is_offer === 1 && (
                          <div className="absolute top-3 right-3 bg-orange-600 text-white text-[8px] font-black px-3 py-1.5 rounded-full shadow-lg z-10 uppercase tracking-widest">
                            {product.discount_type === 'PERCENTAGE' ? `${Math.round(parseFloat(product.discount_value))}% OFF` : `$${parseFloat(product.discount_value).toFixed(2)} OFF`}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-grow relative z-10">
                        <span className="text-[9px] font-black text-orange-600 uppercase tracking-[0.2em] mb-1.5">
                          {product.category_name || 'Industrial'}
                        </span>
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                          {product.title}
                        </h2>
                        <p className="text-gray-500 text-[10px] font-medium leading-relaxed mb-6 line-clamp-2 uppercase tracking-tight opacity-70">
                          {product.short_description}
                        </p>

                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                          <div>
                            {product.is_offer === 1 ? (
                              <>
                                <p className="text-[8px] font-black text-blue-600 uppercase tracking-[0.1em] mb-0.5">Special Offer</p>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-gray-900 font-black text-base">
                                    ${(function () {
                                      const bp = parseFloat(product.min_price || product.base_price || '0');
                                      const dv = parseFloat(product.discount_value || '0');
                                      if (product.discount_type === 'PERCENTAGE') return (bp - (bp * (dv / 100))).toFixed(2);
                                      return (bp - dv).toFixed(2);
                                    })()}
                                  </span>
                                  <span className="text-gray-400 font-bold text-[9px] line-through">
                                    ${parseFloat(product.min_price || product.base_price || '0').toFixed(2)}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.1em] mb-0.5">
                                  {product.min_price ? 'Starting at' : 'Standard Price'}
                                </p>
                                {(product.min_price || product.base_price) ? (
                                  <span className="text-gray-900 font-black text-base">
                                    ${parseFloat(product.min_price || product.base_price || '0').toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="text-orange-600 font-black uppercase text-[10px] tracking-widest">Quote Required</span>
                                )}
                              </>
                            )}
                          </div>
                          <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center group-hover:bg-orange-600 group-hover:scale-110 transition-all shadow-lg shadow-gray-200 group-hover:shadow-orange-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Refined Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 font-black text-[10px] tracking-widest">
                    {page > 1 ? (
                      <Link
                        href={`/shop?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams(Object.entries(params).map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : v ?? '']))), page: (page - 1).toString() }).toString()}`}
                        className="px-6 py-4 flex items-center justify-center rounded-xl border border-gray-200 text-gray-900 hover:bg-white hover:text-orange-600 hover:border-orange-600 transition-all uppercase group"
                      >
                        <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> PREVIOUS
                      </Link>
                    ) : (
                      <span className="px-6 py-4 flex items-center justify-center rounded-xl border border-gray-100 text-gray-200 uppercase cursor-not-allowed">
                        <span className="mr-2">←</span> PREVIOUS
                      </span>
                    )}

                    <div className="flex items-center gap-2 mx-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <Link
                          key={p}
                          href={`/shop?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams(Object.entries(params).map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : v ?? '']))), page: p.toString() }).toString()}`}
                          className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all ${p === page
                            ? 'bg-orange-600 text-white shadow-xl shadow-orange-100'
                            : 'border border-gray-200 text-gray-600 hover:bg-white hover:border-orange-600 hover:text-orange-600'
                            }`}
                        >
                          {p}
                        </Link>
                      ))}
                    </div>

                    {page < totalPages ? (
                      <Link
                        href={`/shop?${new URLSearchParams({ ...Object.fromEntries(new URLSearchParams(Object.entries(params).map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : v ?? '']))), page: (page + 1).toString() }).toString()}`}
                        className="px-6 py-4 flex items-center justify-center rounded-xl border border-gray-200 text-gray-900 hover:bg-white hover:text-orange-600 hover:border-orange-600 transition-all uppercase group"
                      >
                        NEXT <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                      </Link>
                    ) : (
                      <span className="px-6 py-4 flex items-center justify-center rounded-xl border border-gray-100 text-gray-200 uppercase cursor-not-allowed">
                        NEXT <span className="ml-2">→</span>
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
