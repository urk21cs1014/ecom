import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

interface PageProps {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ page?: string }>;
}

async function getMaterial(name: string) {
    // Decode URL encoded name
    const decodedName = decodeURIComponent(name);

    const [rows]: any = await db.query(
        `SELECT * FROM materials WHERE name = ?`,
        [decodedName]
    );
    return rows?.[0];
}

async function getMaterialProducts(materialId: number, limit: number, offset: number) {
    const [products]: any = await db.query(
        `SELECT DISTINCT p.id, p.title, p.slug, p.short_description, p.image1_url, p.image2_url, p.image3_url,
     c.name as category_name,
     (SELECT MIN(price) FROM product_pricing WHERE product_id = p.id) as min_price,
     p.base_price, p.is_offer, p.discount_type, p.discount_value, p.created_at
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     LEFT JOIN product_pricing pp ON p.id = pp.product_id
     WHERE p.material_id = ? OR pp.material_id = ?
     ORDER BY p.title ASC
     LIMIT ? OFFSET ?`,
        [materialId, materialId, limit, offset]
    );
    return products;
}

async function getMaterialProductsCount(materialId: number) {
    const [[{ total }]]: any = await db.query(
        `SELECT COUNT(DISTINCT p.id) as total
     FROM products p
     LEFT JOIN product_pricing pp ON p.id = pp.product_id
     WHERE p.material_id = ? OR pp.material_id = ?`,
        [materialId, materialId]
    );
    return total;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const material = await getMaterial(slug);

    if (!material) {
        return { title: 'Material Not Found' };
    }

    const title = `${material.name} Valves & Piping – Corrosion-Resistant Solutions`;
    const description = `Specialized ${material.name} valves and piping products for highly corrosive environments. Excellent resistance for chemical and petrochemical applications.`;
    const url = `https://www.africanvalve.com/materials/${encodeURIComponent(material.name)}`;

    return {
        title,
        description,
        keywords: `${material.name} valves, ${material.name} pipe, corrosion resistant valves, chemical process valves`,
        openGraph: {
            title,
            description,
            url,
            siteName: 'African Valve',
            type: 'website',
            locale: 'en_US',
            images: [
                {
                    url: `/images/og-material-${material.name.toLowerCase().replace(/ /g, '-')}.png`, // Placeholder dynamic image
                    width: 1200,
                    height: 630,
                    alt: `${material.name} Industrial Solutions`,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`/images/og-material-${material.name.toLowerCase().replace(/ /g, '-')}.png`],
        },
        alternates: {
            canonical: url,
        }
    };
}

export default async function MaterialDetailPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const { page: pageStr } = await searchParams;
    const material = await getMaterial(slug);

    if (!material) {
        notFound();
    }

    const page = Number(pageStr) || 1;
    const limit = 12;
    const offset = (page - 1) * limit;

    const products = await getMaterialProducts(material.id, limit, offset);
    const totalCount = await getMaterialProductsCount(material.id);
    const totalPages = Math.ceil(totalCount / limit);

    // Parse grades
    let grades: string[] = [];
    try {
        grades = typeof material.grades === 'string' ? JSON.parse(material.grades) : material.grades;
    } catch (e) {
        grades = [];
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Breadcrumb */}
            <div className="hidden md:block bg-gray-900 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
                    <span className="text-gray-700">/</span>
                    <Link href="/materials" className="hover:text-orange-600 transition-colors">Materials</Link>
                    <span className="text-gray-700">/</span>
                    <span className="text-white">{material.name}</span>
                </div>
            </div>

            {/* ================= HERO BANNER ================= */}
            <section className="bg-gray-900 overflow-hidden py-14 lg:py-20 relative">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-600/5 skew-x-[-20deg] translate-x-1/2" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <span className="inline-block text-orange-600 font-black text-[10px] uppercase tracking-[0.4em] mb-4">Material Specification</span>
                        <h1 className="text-4xl lg:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
                            {material.name}
                        </h1>
                        <p className="text-gray-400 text-sm lg:text-base font-medium leading-relaxed italic border-l-2 border-orange-600 pl-4 max-w-2xl">
                            Explore our comprehensive selection of high-performance {material.name} products, engineered for precision and durability in the most demanding industrial environments.
                        </p>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
                {/* Grades Section */}
                {grades.length > 0 && (
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-6">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Available Grades</h3>
                            <div className="h-px bg-gray-100 flex-grow" />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {grades.map((grade, idx) => (
                                <span key={idx} className="px-5 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-black text-gray-700 uppercase tracking-tight hover:border-orange-200 hover:bg-white transition-all">
                                    {grade}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Associated Products */}
                <div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-gray-100">
                        <div>
                            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 uppercase tracking-tight">
                                {material.name} Products
                            </h2>
                            <p className="text-gray-400 text-xs font-bold uppercase mt-1 tracking-widest">
                                Showing {products.length} of {totalCount} items
                            </p>
                        </div>
                        <Link href="/shop" className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em] border-2 border-orange-600 px-6 py-2.5 rounded-xl hover:bg-orange-600 hover:text-white transition-all text-center">
                            Browse All Catalog
                        </Link>
                    </div>

                    {products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {products.map((product: any) => (
                                    <Link
                                        key={product.id}
                                        href={`/products/${product.slug}`}
                                        className="group bg-white border border-gray-100 rounded-[24px] p-5 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 flex flex-col relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-full -mr-12 -mt-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="relative aspect-square bg-[#fafafa] rounded-2xl mb-5 flex items-center justify-center overflow-hidden border border-gray-50 group-hover:border-orange-100 transition-colors">
                                            <Image
                                                src={product.image1_url || product.image2_url || product.image3_url || '/images/product-placeholder.png'}
                                                alt={product.title}
                                                fill
                                                className="object-contain transition-transform duration-700"
                                            />
                                            {/* Offer Badge */}
                                            {product.is_offer === 1 && (
                                                <div className="absolute top-3 right-3 bg-orange-600 text-white text-[8px] font-black px-3 py-1.5 rounded-full shadow-lg z-10 uppercase tracking-widest">
                                                    {product.discount_type === 'PERCENTAGE' ? `${Math.round(parseFloat(product.discount_value))}% OFF` : `$${parseFloat(product.discount_value).toFixed(2)} OFF`}
                                                </div>
                                            )}
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
                                                    {product.is_offer === 1 ? (
                                                        <>
                                                            <p className="text-[8px] font-black text-blue-600 uppercase tracking-[0.1em] mb-0.5">Special Offer</p>
                                                            <div className="flex items-baseline gap-2">
                                                                <p className="text-gray-900 font-black text-base">
                                                                    ${(function () {
                                                                        const rawPrice = product.min_price !== null ? parseFloat(String(product.min_price)) : parseFloat(String(product.base_price || '0'));
                                                                        const isActualOffer = Boolean(product.is_offer);
                                                                        if (isActualOffer) {
                                                                            const disc = parseFloat(String(product.discount_value || '0'));
                                                                            if (product.discount_type === 'PERCENTAGE') {
                                                                                const discounted = rawPrice - (rawPrice * (disc / 100));
                                                                                return discounted.toFixed(2);
                                                                            }
                                                                            return (rawPrice - disc).toFixed(2);
                                                                        }
                                                                        return rawPrice.toFixed(2);
                                                                    })()}
                                                                </p>
                                                                <p className="text-gray-400 font-bold text-[9px] line-through">
                                                                    ${parseFloat(String(product.min_price || product.base_price || '0')).toFixed(2)}
                                                                </p>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.1em] mb-0.5">Starting at</p>
                                                            {product.min_price ? (
                                                                <p className="text-gray-900 font-black text-base">
                                                                    ${parseFloat(product.min_price).toFixed(2)}
                                                                </p>
                                                            ) : (
                                                                <p className="text-orange-600 font-black uppercase text-[10px] tracking-widest">Get Quote</p>
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

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-16 font-black text-[10px] tracking-widest">
                                    {page > 1 ? (
                                        <Link
                                            href={`/materials/${slug}?page=${page - 1}`}
                                            className="px-6 py-4 flex items-center justify-center rounded-xl border border-gray-200 text-gray-900 hover:bg-white hover:text-orange-600 hover:border-orange-600 transition-all uppercase group"
                                        >
                                            <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span>
                                            PREVIOUS
                                        </Link>
                                    ) : (
                                        <div className="px-6 py-4 flex items-center justify-center rounded-xl border border-gray-100 text-gray-300 uppercase cursor-not-allowed">
                                            <span className="mr-2">←</span>
                                            PREVIOUS
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 mx-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                            <Link
                                                key={p}
                                                href={`/materials/${slug}?page=${p}`}
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
                                            href={`/materials/${slug}?page=${page + 1}`}
                                            className="px-6 py-4 flex items-center justify-center rounded-xl border border-gray-200 text-gray-900 hover:bg-white hover:text-orange-600 hover:border-orange-600 transition-all uppercase group"
                                        >
                                            NEXT
                                            <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                                        </Link>
                                    ) : (
                                        <span className="px-6 py-4 flex items-center justify-center rounded-xl border border-gray-100 text-gray-300 uppercase cursor-not-allowed">
                                            NEXT
                                            <span className="ml-2">→</span>
                                        </span>
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="py-20 text-center bg-gray-50 rounded-[40px] border border-gray-100 shadow-inner">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">No Products Found</h3>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8">We currently don't have any products listed for this specific material.</p>
                            <Link href="/contact-us" className="inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all">
                                Request Custom Solutions
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
