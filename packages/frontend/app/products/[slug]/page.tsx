import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import QuoteButton from './QuoteButton';
import PricingCalculator from './PricingCalculator';
import { Metadata } from 'next';
import Link from 'next/link';
import RelatedProducts from './RelatedProducts';
import ImageGallery from './ImageGallery';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  const [rows]: any = await db.query(
    `SELECT p.*, m.name as material_name, m.grades as material_grades, c.name as category_name
     FROM products p
     LEFT JOIN materials m ON p.material_id = m.id
     LEFT JOIN categories c ON p.category_id = c.id
     WHERE p.slug = ?`,
    [slug]
  );
  return rows?.[0];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const staticDescription = "High-quality industrial materials and products.";
  const metaTitle = product.title || product.og_title || `${product.title} | Continental Pipes`;
  const metaDesc = product.og_description || product.short_description || staticDescription;

  return {
    title: metaTitle,
    description: metaDesc,
    openGraph: {
      title: product.og_title || metaTitle,
      description: product.og_description || metaDesc,
      type: 'website',
      images: [product.image1_url, product.image2_url, product.image3_url].filter(Boolean),
    },
    twitter: {
      card: 'summary_large_image',
      title: product.twitter_title || metaTitle,
      description: product.twitter_description || metaDesc,
      images: [product.image1_url].filter(Boolean),
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  // Parse material grades
  let materialGrades: string[] = [];
  if (product.material_grades) {
    try {
      materialGrades = typeof product.material_grades === 'string'
        ? JSON.parse(product.material_grades)
        : product.material_grades;
    } catch (e) {
      console.error("Error parsing grades", e);
    }
  }

  // Get pricing
  const [pricing]: any = await db.query(
    `SELECT pp.*, m.name as material_name
     FROM product_pricing pp
     LEFT JOIN materials m ON pp.material_id = m.id
     WHERE pp.product_id = ?
     ORDER BY pp.material_id, pp.size`,
    [product.id]
  );

  const minPrice = pricing.length > 0
    ? Math.min(...pricing.map((p: any) => parseFloat(p.price)))
    : (product.base_price ? parseFloat(product.base_price) : null);

  const isOffer = product.is_offer === 1;
  const discountType = product.discount_type;
  const discountValue = parseFloat(product.discount_value || '0');

  const offerMinPrice = minPrice !== null ? (
    discountType === 'PERCENTAGE'
      ? minPrice - (minPrice * (discountValue / 100))
      : minPrice - discountValue
  ) : null;

  const images = [product.image1_url, product.image2_url, product.image3_url].filter(Boolean);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="hidden md:block bg-gray-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
          <span className="text-gray-700">/</span>
          <Link href="/shop" className="hover:text-orange-600 transition-colors">Shop</Link>
          <span className="text-gray-700">/</span>
          <span className="text-white">{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24">

          {/* Left: Image Gallery */}
          <ImageGallery
            images={images}
            title={product.title}
            stockStatus={product.stock_status}
          />

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <div className="mb-8">
              <span className="inline-block text-orange-600 font-black text-sm uppercase tracking-[0.2em] mb-3">
                {product.category_name || product.category || 'Premium Industrial'}
              </span>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-4 uppercase">
                {product.title}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm font-medium">
                {product.material_name && (
                  <span className="bg-gray-900 text-white px-3 py-1 rounded-md">
                    {product.material_name}
                  </span>
                )}
                {product.sku && (
                  <span className="text-gray-400">SKU: {product.sku}</span>
                )}
              </div>
            </div>

            <div className="prose prose-orange max-w-none text-gray-600 leading-relaxed text-lg mb-10">
              <p>{product.full_description || product.short_description}</p>
            </div>

            {/* Pricing Section */}
            <div className="bg-[#fcfcfc] border border-gray-100 rounded-2xl p-5 lg:p-6 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/5 rounded-full -mr-24 -mt-24" />

              <div className="relative z-10 flex items-end justify-between">
                <div>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                    {pricing.length > 0 ? (isOffer ? 'Special Offer Price' : 'Estimated Starting Price') : 'Product Price'}
                  </p>
                  {minPrice !== null ? (
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-3">
                        <span className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter">
                          ${(isOffer ? (offerMinPrice ?? 0) : (minPrice ?? 0)).toFixed(2)}
                        </span>
                        <span className="text-sm font-bold text-gray-400 uppercase">USD</span>
                        {isOffer && (
                          <span className="bg-orange-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ml-2 animate-pulse">
                            {discountType === 'PERCENTAGE' ? `${discountValue}% OFF` : 'LIMITED DEAL'}
                          </span>
                        )}
                      </div>
                      {isOffer && (
                        <p className="text-gray-400 font-bold text-lg line-through mt-1">
                          ${minPrice.toFixed(2)} <span className="text-[10px] uppercase tracking-widest no-underline">Original Price</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-3xl font-black text-orange-600 uppercase tracking-tight">Price on Request</span>
                  )}
                </div>
              </div>
            </div>

            {/* Dynamic Pricing / Table Section */}
            {pricing.length > 0 && (
              <div className="mt-4 lg:mt-5">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:p-6">
                  <PricingCalculator
                    pricing={pricing}
                    basePrice={product.base_price}
                    isOffer={product.is_offer === 1}
                    discountType={product.discount_type}
                    discountValue={product.discount_value}
                  />
                </div>
              </div>
            )}

            {/* CTA's */}
            <div className="space-y-4">
              <QuoteButton
                productName={product.title}
                categoryName={product.category_name || product.category}
                productSlug={product.slug}
              />
              <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Fast Global Shipping • Technical Support Included
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {product.category_id && (
        <RelatedProducts categoryId={product.category_id} currentProductId={product.id} />
      )}

    </div>
  );
}
