import { db } from '@/lib/db';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Materials | Continental Pipes',
    description: 'Explore our wide range of high-quality industrial materials including Stainless Steel, Carbon Steel, Nickel Alloys, and more.',
};

export default async function MaterialsPage() {
    const [materials]: any = await db.query(`
    SELECT * FROM materials ORDER BY name ASC
  `);

    return (
        <div className="bg-white min-h-screen">
            {/* Breadcrumb */}
            <div className="hidden md:block bg-gray-900 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
                    <span className="text-gray-700">/</span>
                    <span className="text-white">All Materials</span>
                </div>
            </div>

            {/* ================= HERO BANNER ================= */}
            <section className="bg-gray-900 overflow-hidden py-14 lg:py-20">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                        <div className="max-w-2xl">
                            <span className="inline-block text-orange-600 font-black text-[10px] uppercase tracking-[0.4em] mb-3">Industrial Standards</span>
                            <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                                High-Performance <br /> Material Grades
                            </h1>
                            <p className="text-gray-400 text-sm lg:text-base font-medium leading-relaxed italic border-l-2 border-orange-600 pl-4">
                                Explore our comprehensive selection of premium materials engineered for the most demanding industrial environments.
                            </p>
                        </div>
                        {/* Optional Stats or Graphic */}
                        <div className="hidden lg:block">
                            <div className="w-16 h-16 border-2 border-orange-600 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Materials Grid */}
            <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {materials.map((material: any) => (
                        <Link
                            key={material.id}
                            href={`/materials/${encodeURIComponent(material.name)}`}
                            className="group bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 flex flex-col items-start"
                        >
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-3 group-hover:text-orange-600 transition-colors">
                                {material.name}
                            </h2>

                            <div className="mt-auto pt-6 w-full">
                                <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-orange-600 transition-colors">
                                    View Specifications
                                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
