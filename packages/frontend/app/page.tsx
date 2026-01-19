import Image from 'next/image';
import Link from 'next/link';
import FeaturedProducts from './components/FeaturedProducts';
import type { Metadata } from 'next';
import { db } from '@/lib/db';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'Continental Pipes | Global Industrial B2B Solutions',
  description: 'Precision-engineered industrial solutions. Continental Pipes provides certified valves, pipes, and fittings for the world\'s leading industries.',
  keywords: 'Continental Pipes, industrial B2B, wholesale valves, industrial fittings, certified engineering, bulk industrial supply',
  openGraph: {
    title: 'Continental Pipes | Precision Industrial Solutions',
    description: 'The global standard for industrial flow control and B2B piping solutions.',
    siteName: 'Continental Pipes',
  },
};

const calculateOfferPrice = (basePrice: any, type: string, value: any) => {
  const price = parseFloat(basePrice || 0);
  const disc = parseFloat(value || 0);
  if (type === 'PERCENTAGE') {
    return (price - (price * (disc / 100))).toFixed(2);
  }
  return (price - disc).toFixed(2);
};

export default async function HomePage() {
  // Fetch Homepage Configuration
  const [configs]: any = await db.query('SELECT * FROM homepage_items ORDER BY section_key, sort_order');

  const mainCategoryIds = configs.filter((c: any) => c.section_key === 'MAIN_CATEGORIES').map((c: any) => c.item_id);
  const featuredProductIds = configs.filter((c: any) => c.section_key === 'FEATURED_SOLUTIONS').map((c: any) => c.item_id);
  const supplyOfferIds = configs.filter((c: any) => c.section_key === 'SUPPLY_OFFERS').map((c: any) => c.item_id);

  // Fetch Categories and Supply Offers details
  const [categories]: any = mainCategoryIds.length > 0
    ? await db.query(`SELECT id, name FROM categories WHERE id IN (${mainCategoryIds.join(',')}) ORDER BY FIELD(id, ${mainCategoryIds.join(',')})`)
    : [[]];

  const [supplyOffers]: any = supplyOfferIds.length > 0
    ? await db.query(`
        SELECT p.id, p.title, p.slug, p.image1_url, p.is_offer, p.discount_type, p.discount_value,
        (SELECT MIN(price) FROM product_pricing WHERE product_id = p.id) as min_price
        FROM products p 
        WHERE p.id IN (${supplyOfferIds.join(',')}) 
        ORDER BY FIELD(id, ${supplyOfferIds.join(',')})
      `)
    : [[]];

  return (
    <div className="bg-white overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[70vh] flex items-center bg-gray-900 overflow-hidden">
        {/* Abstract Background Accents */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-600/5 skew-x-12 transform translate-x-20" />
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center relative z-10 py-12 lg:py-16">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full">
              <span className="text-orange-500 font-black text-[9px] uppercase tracking-[0.3em]">Precision Engineering</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter uppercase">
              The Lifeline of <br />
              <span className="text-orange-600 italic">Modern Industry.</span>
            </h1>

            <p className="text-gray-400 text-base md:text-lg font-medium max-w-lg leading-relaxed">
              Global B2B platform supplying mission-critical components with precision specifications and bulk enquiry systems.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/shop"
                className="bg-orange-600 text-white px-8 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-orange-600 transition-all duration-300 shadow-xl shadow-orange-600/20 text-center"
              >
                Browse Catalog
              </Link>
              <Link
                href="/contact-us"
                className="bg-white/5 border border-white/10 text-white px-8 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-white hover:text-gray-900 transition-all duration-300 text-center"
              >
                Request Quote
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative group hidden lg:block">
            <div className="relative aspect-video bg-gray-800 rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
              <Image
                src="/images/home.png"
                alt="Continental Pipes"
                fill
                priority
                className="object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= PROCUREMENT ENGINE ================= */}
      <section className="py-12 lg:py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="max-w-xl text-center md:text-left mx-auto md:mx-0">
              <span className="text-orange-600 font-black text-[10px] uppercase tracking-widest block mb-1">Workflow</span>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 uppercase tracking-tight leading-none">
                Procurement Engine
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 lg:gap-6">
            {[
              { title: 'Global Catalog', desc: 'Browse certified industrial components.', icon: '🔍' },
              { title: 'Bulk Enquiry', desc: 'Specify quantities and engineering demands.', icon: '📝' },
              { title: 'Expert Valuation', desc: 'Engineers review for technical compliance.', icon: '⚙️' },
              { title: 'Contract Quote', desc: 'Receive finalized pricing and timelines.', icon: '📋' },
            ].map((step, index) => (
              <div
                key={step.title}
                className="group relative p-6 bg-gray-50 rounded-[24px] border border-gray-100 hover:bg-gray-900 transition-all duration-500"
              >
                <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-500">{step.icon}</div>
                <div className="text-orange-600 font-black text-[9px] uppercase tracking-[0.3em] mb-2">
                  Phase 0{index + 1}
                </div>
                <h3 className="text-sm font-black text-gray-900 group-hover:text-white uppercase tracking-tight mb-2 transition-colors">{step.title}</h3>
                <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRODUCT CATEGORIES ================= */}
      {categories.length > 0 && (
        <section className="py-6 lg:py-10 bg-gray-100 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-6">
              <span className="text-orange-600 font-black text-[10px] uppercase tracking-widest block mb-1">Product Ecosystem</span>
              <h2 className="text-3xl lg:text-4xl font-black text-gray-900 uppercase tracking-tight">Main Category Lines</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat: any) => (
                <div
                  key={cat.id}
                  className="group bg-white p-6 rounded-[24px] text-center border border-gray-100 hover:shadow-xl hover:shadow-orange-600/10 transition-all duration-500"
                >
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                  </div>
                  <h3 className="font-black text-gray-900 uppercase text-[10px] tracking-widest mb-1">{cat.name}</h3>
                  <Link href={`/shop?category=${cat.id}`} className="inline-block mt-2 text-orange-600 font-black text-[9px] uppercase tracking-widest hover:text-gray-900 transition-colors">
                    Catalog +
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= FEATURED PRODUCTS ================= */}
      <div className="bg-white">
        <FeaturedProducts productIds={featuredProductIds} />
      </div>

      {/* ================= SUPPLY OFFERS ================= */}
      {supplyOffers.length > 0 && (
        <section className="relative w-full bg-gray-900 py-12 lg:py-16 overflow-hidden border-y border-white/5">
          <div className="absolute top-0 left-0 w-full h-full bg-orange-600/5 opacity-50" />
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 gap-6">
              <div>
                <span className="text-orange-600 font-black text-[10px] uppercase tracking-widest block mb-1">Special Offers</span>
                <h2 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tight text-center md:text-left">Supply Offers</h2>
              </div>
              <Link
                href="/offers"
                className="group text-orange-600 font-black text-[9px] uppercase tracking-widest flex items-center gap-2 bg-white/5 px-5 py-3 rounded-xl hover:bg-orange-600 hover:text-white transition-all duration-300 mx-auto md:mx-0"
              >
                Offer Portal →
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {supplyOffers.map((product: any) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-[20px] p-5 hover:bg-white transition-all duration-500 flex flex-col items-center text-center h-full"
                >
                  <div className="aspect-square w-full bg-white/5 rounded-xl mb-4 flex items-center justify-center group-hover:bg-gray-50 transition-colors relative overflow-hidden">
                    {product.image1_url ? (
                      <Image src={product.image1_url} alt={product.title} fill className="object-contain" />
                    ) : (
                      <svg className="w-8 h-8 text-white/10 group-hover:text-orange-600/20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4 4v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" /></svg>
                    )}

                    {/* Offer Badge Overlay */}
                    <div className="absolute top-2 right-2 bg-orange-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full shadow-lg">
                      {product.discount_type === 'PERCENTAGE' ? `${Math.round(product.discount_value)}% OFF` : `$${product.discount_value} OFF`}
                    </div>
                  </div>

                  <h3 className="font-black text-white group-hover:text-gray-900 uppercase text-[10px] tracking-widest mb-1 transition-colors line-clamp-1">
                    {product.title}
                  </h3>

                  {product.min_price && (
                    <div className="mt-2 text-center">
                      <span className="text-orange-600 font-black text-xs block">
                        ${calculateOfferPrice(product.min_price, product.discount_type, product.discount_value)}
                      </span>
                      <span className="text-[8px] text-gray-500 line-through">
                        ${parseFloat(product.min_price).toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="w-full mt-auto pt-4">
                    <div className="w-full bg-orange-600 text-white py-2.5 rounded-lg text-center font-black uppercase text-[8px] tracking-widest hover:bg-gray-900 transition-all duration-300">
                      Quick Enquiry
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= FINAL CTA ================= */}
      <section className="bg-orange-600 py-12 lg:py-16 relative overflow-hidden text-center">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
            Bulk Orders & <span className="text-black italic">Specs?</span>
          </h2>
          <p className="text-orange-100 text-sm md:text-base font-medium max-w-lg mx-auto mb-6">
            Direct enquiry system for custom engineering and bulk quotes.
          </p>
          <Link
            href="/contact-us"
            className="inline-block px-10 py-4 bg-gray-900 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300 shadow-xl shadow-black/20"
          >
            Initiate Enquiry
          </Link>
        </div>
      </section>
    </div>
  );
}
