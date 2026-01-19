import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Continental Pipes | Trusted Industrial Valve Supplier',
  description: 'Learn about Continental Pipes - a trusted industrial valve supplier with 10+ years of experience.',
};

export default function AboutUsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="hidden md:block bg-gray-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
          <span className="text-gray-700">/</span>
          <span className="text-white">About Us</span>
        </div>
      </div>

      {/* ================= COMPACT HERO ================= */}
      <section className="bg-gray-900 overflow-hidden py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="max-w-2xl">
              <span className="inline-block text-orange-600 font-black text-[10px] uppercase tracking-[0.4em] mb-3">The Standard of Excellence</span>
              <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter mb-4 leading-none">
                Precision Engineered <br /> Flow Control Solutions
              </h1>
              <p className="text-gray-400 text-sm lg:text-base font-medium leading-relaxed italic border-l-2 border-orange-600 pl-4">
                Supplying high-performance industrial solutions to the world's most demanding sectors for over a decade.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                <p className="text-xl font-black text-white">10+</p>
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Years Exp.</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                <p className="text-xl font-black text-white">500+</p>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Clients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SLEEK OVERVIEW ================= */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div>
                <span className="text-orange-600 font-black text-[10px] uppercase tracking-widest mb-1 block">Our Identity</span>
                <h2 className="text-2xl lg:text-3xl font-black text-gray-900 uppercase tracking-tight">Defining Global Quality</h2>
              </div>
              <p className="text-gray-600 text-sm lg:text-base font-medium leading-relaxed">
                Continental Pipes is a trusted global supplier of high-quality industrial valves and flow control products. We serve the backbone of infrastructure—from Oil & Gas pipelines to critical Water Treatment facilities.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { t: 'ISO Certified', d: 'Global standard manufacturing' },
                  { t: 'API 6D Rated', d: 'High performance testing' }
                ].map(item => (
                  <div key={item.t} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-sm transition-all hover:bg-white hover:border-orange-200">
                    <p className="text-xs font-black text-gray-900 uppercase tracking-tight mb-1">{item.t}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">{item.d}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-[32px] p-8 lg:p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full -mr-16 -mt-16 group-hover:bg-orange-600/20 transition-colors" />
              <h3 className="text-xl font-black uppercase tracking-tight mb-6">Our Mission</h3>
              <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8 italic">
                "To provide reliable, safe, and cost-effective valve solutions that empower industries to operate with absolute confidence."
              </p>
              <Link href="/contact-us" className="inline-flex items-center gap-2 text-orange-600 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
                Work with us <span className="text-lg">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ICON GRID ================= */}
      <section className="py-12 lg:py-16 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-10">Industries Served</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Oil & Gas', icon: '⛽' },
              { name: 'Water', icon: '💧' },
              { name: 'Power', icon: '⚡' },
              { name: 'Chemical', icon: '🧪' },
              { name: 'Manufacturing', icon: '🏭' },
              { name: 'Utilities', icon: '🏗️' }
            ].map((ind) => (
              <div key={ind.name} className="bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-orange-100 transition-all text-center">
                <div className="text-2xl mb-2">{ind.icon}</div>
                <p className="font-black text-[9px] text-gray-400 uppercase tracking-widest">{ind.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COMPACT FOOTER CTA ================= */}
      <section className="py-12 lg:py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gray-900 rounded-[32px] p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left shadow-2xl shadow-gray-200">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Need technical consultation?</h2>
              <p className="text-gray-400 font-medium mt-1 text-sm">Our engineering team is ready to assist with your specifications.</p>
            </div>
            <Link
              href="/contact-us"
              className="w-full md:w-auto px-10 py-4 bg-orange-600 text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-white hover:text-orange-600 transition-all duration-300"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}