import Link from 'next/link';
import { db } from '@/lib/db';

async function getLatestMaterials() {
  try {
    const [materials]: any = await db.query(`
      SELECT id, name FROM materials ORDER BY created_at DESC LIMIT 3
    `);
    return materials || [];
  } catch (error) {
    console.error('Error fetching materials:', error);
    return [];
  }
}

export default async function Footer() {
  const materials = await getLatestMaterials();

  return (
    <footer className="bg-gray-950 text-gray-400 overflow-hidden relative">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-600/5 -skew-x-12 translate-x-20 pointer-events-none" />

      {/* ================= TOP CTA BAR ================= */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
            Ready to engineer your <span className="text-orange-600">solutions?</span>
          </h2>
          <Link href="/contact-us" className="px-8 py-3 bg-white text-gray-900 font-black uppercase text-[10px] tracking-widest rounded-full hover:bg-orange-600 hover:text-white transition-all duration-300 shadow-xl">
            Get Started
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-12 gap-16">

          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 border-2 border-orange-600 rounded-full flex items-center justify-center relative overflow-hidden group-hover:bg-orange-600 transition-all duration-500">
                <div className="relative flex flex-col gap-0.5 z-10 transition-transform group-hover:rotate-180 duration-700">
                  <div className="w-4 h-0.5 bg-white rounded-full" />
                  <div className="w-6 h-0.5 bg-white rounded-full" />
                  <div className="w-4 h-0.5 bg-white rounded-full ml-2" />
                </div>
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="text-2xl font-black text-white tracking-tighter uppercase group-hover:text-orange-600 transition-colors">
                  Continental
                </span>
                <span className="text-[9px] font-black text-orange-600/60 uppercase tracking-[0.4em]">Precision Engineering</span>
              </div>
            </Link>

            <p className="text-sm leading-relaxed max-w-sm font-medium italic">
              "We provide high-performance industrial solutions designed for the world's most demanding sectors. Quality isn't a goal—it's our standard."
            </p>

            <div className="flex gap-6">
              <a 
                href="https://www.linkedin.com/feed/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-orange-600 transition-colors border-b border-gray-900 pb-1 flex items-center gap-2"
                aria-label="Visit LinkedIn"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.469v6.766z"/></svg>
                LinkedIn
              </a>
              <a 
                href="https://x.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-orange-600 transition-colors border-b border-gray-900 pb-1 flex items-center gap-2"
                aria-label="Visit Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 002.856-3.915 9.953 9.953 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                Twitter
              </a>
              <a 
                href="https://www.youtube.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-orange-600 transition-colors border-b border-gray-900 pb-1 flex items-center gap-2"
                aria-label="Visit YouTube"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                YouTube
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-10">
            <div>
              <h4 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-6">Operations</h4>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-tight">
                <li><Link href="/shop" className="hover:text-orange-600 transition-colors">Catalog</Link></li>
                <li><Link href="/offers" className="hover:text-orange-600 transition-colors">Active Offers</Link></li>
                <li><Link href="/about-us" className="hover:text-orange-600 transition-colors">Our History</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-6">Materials</h4>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-tight">
                {materials && materials.length > 0 ? (
                  materials.map((material: any) => (
                    <li key={material.id}>
                      <Link 
                        href={`/materials/${encodeURIComponent(material.name)}`}
                        className="text-gray-400 hover:text-orange-600 transition-colors"
                      >
                        {material.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No materials available</li>
                )}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h4 className="text-white font-black uppercase text-[10px] tracking-[0.2em] mb-6">Contact</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-1 italic">Email Us</p>
                  <p className="text-xs text-white font-black">sales@ecom.com</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-1 italic">Call Hotline</p>
                  <p className="text-xs text-white font-black">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="bg-black/40 py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-600">
            © {new Date().getFullYear()} Continental Pipes. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-gray-500 uppercase tracking-widest">ISO 9001</div>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-black text-gray-500 uppercase tracking-widest">API Certified</div>
          </div>
        </div>
      </div>
    </footer>
  );
}