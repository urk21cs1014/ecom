import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'Industrial Products & B2B Supplier | Professional Enquiry Platform',
  description: 'Browse certified industrial products by categories, industries, and materials. Professional B2B platform for bulk orders and custom requirements. Fast enquiry response and competitive pricing.',
  keywords: 'industrial products, B2B supplier, wholesale industrial, bulk orders, industrial materials, certified products, enquiry system',
  openGraph: {
    title: 'Industrial Products & B2B Supplier | Professional Enquiry Platform',
    description: 'Browse certified industrial products by categories, industries, and materials. Professional B2B platform for bulk orders.',
    url: 'https://yourdomain.com',
    siteName: 'Industrial Products Store',
    type: 'website',
    images: [
      {
        url: 'https://yourdomain.com/images/home.png',
        width: 1200,
        height: 630,
        alt: 'Industrial Products B2B Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Industrial Products & B2B Supplier | Professional Enquiry Platform',
    description: 'Browse certified industrial products. Fast enquiry response for bulk orders and custom requirements.',
  },
  alternates: {
    canonical: 'https://yourdomain.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

export default function HomePage() {
  return (
    <main>

      {/* ================= HERO SECTION ================= */}
      <section className="bg-linear-to-r from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Reliable <span className="text-orange-600">Industrial Products</span>
              <br />for Your Business
            </h1>

            <p className="mt-6 text-gray-600 text-lg">
              A professional B2B platform supplying certified industrial products
              with enquiry-based purchasing for bulk and custom requirements.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/shop"
                className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 transition"
              >
                Browse Products
              </Link>

              <Link
                href="/contact-us"
                className="border border-orange-600 text-orange-600 px-6 py-3 rounded-md hover:bg-orange-50 transition"
              >
                Send Enquiry
              </Link>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative w-full h-80 md:h-105 bg-white border rounded-xl shadow-sm overflow-hidden">
            <Image
              src="/images/home.png"
              alt="Industrial Products"
              fill
              priority
              className="object-cover"
            />
          </div>

        </div>
      </section>

      {/* ================= HOW B2B ENQUIRY WORKS ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            How Our B2B Enquiry System Works
          </h2>

          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            Unlike traditional e-commerce, our platform is designed for
            industrial buyers who require quotations, specifications, and
            long-term business relationships.
          </p>

          <div className="mt-12 grid md:grid-cols-4 gap-6">
            {[
              'Browse Products',
              'Send Enquiry',
              'Expert Review',
              'Quotation & Confirmation',
            ].map((step, index) => (
              <div
                key={step}
                className="border rounded-xl p-6 hover:shadow-md transition bg-gray-50"
              >
                <div className="text-orange-600 font-bold text-xl">
                  Step {index + 1}
                </div>
                <h3 className="mt-2 font-semibold text-gray-800">{step}</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Structured workflow for accurate B2B transactions.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= PRODUCT CATEGORIES ================= */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Product Categories
          </h2>

          <div className="mt-10 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {['Valves', 'Pipes', 'Fittings', 'Industrial Tools'].map((cat) => (
              <div
                key={cat}
                className="bg-white border rounded-xl p-6 text-center hover:shadow-md transition"
              >
                <div className="text-orange-600 text-xl font-semibold">
                  {cat}
                </div>
                <p className="mt-2 text-gray-500 text-sm">
                  High-quality {cat.toLowerCase()} for industrial usage
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= OFFER PRODUCTS ================= */}
      <section className="relative w-full bg-orange-50 py-20 border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-6">

          {/* SECTION HEADER */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              🔥 Special Offer Products
            </h2>

            <Link
              href="/offers"
              className="mt-4 md:mt-0 text-orange-600 font-medium hover:underline"
            >
              View All Offers →
            </Link>
          </div>

          {/* OFFER GRID */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="relative bg-white border rounded-xl p-4 hover:shadow-lg transition"
              >
                {/* OFFER BADGE */}
                <span className="absolute top-3 left-3 bg-orange-600 text-white text-xs px-2 py-1 rounded">
                  OFFER
                </span>

                {/* IMAGE */}
                <div className="h-36 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                  Product Image
                </div>

                {/* CONTENT */}
                <h3 className="mt-4 font-semibold text-gray-800">
                  Offer Product {item}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Limited-time B2B promotional pricing
                </p>

                <Link
                  href={`/product/offer-product-${item}`}
                  className="inline-block mt-4 text-orange-600 text-sm font-medium hover:underline"
                >
                  Send Enquiry →
                </Link>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Why Choose Us
          </h2>

          <div className="mt-10 grid md:grid-cols-4 gap-6 text-center">
            {[
              'Trusted B2B Supplier',
              'Fast Enquiry Response',
              'Certified Products',
              'Dedicated Support',
            ].map((reason) => (
              <div
                key={reason}
                className="border rounded-xl p-6 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-gray-800">{reason}</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Designed specifically for industrial and enterprise buyers.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-orange-600 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold">
            Need Bulk Orders or Custom Specifications?
          </h2>

          <p className="mt-4 text-orange-100">
            Submit an enquiry and our sales experts will assist you quickly.
          </p>

          <Link
            href="/contact-us"
            className="inline-block mt-6 bg-white text-orange-600 px-6 py-3 rounded-md font-medium hover:bg-orange-50 transition"
          >
            Send Enquiry
          </Link>
        </div>
      </section>

    </main>
  );
}