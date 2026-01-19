import type { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Continental Pipes | Support & Enquiries',
  description: 'Get in touch with Continental Pipes. Contact us for product enquiries, quotations, and technical support. Fast response within 24 hours.',
  keywords: 'contact us, industrial support, product enquiry, Continental Pipes, sales, technical support',
  openGraph: {
    title: 'Contact Us | Continental Pipes',
    description: 'Contact Continental Pipes for industrial product enquiries and quotations.',
  },
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="hidden md:block bg-gray-900 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
          <span className="text-gray-700">/</span>
          <span className="text-white">Contact Us</span>
        </div>
      </div>

      {/* ================= COMPACT HERO (About Us Style) ================= */}
      <section className="bg-gray-900 overflow-hidden py-14 lg:py-20">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="max-w-2xl">
              <span className="inline-block text-orange-600 font-black text-[10px] uppercase tracking-[0.4em] mb-3">Connect with our team</span>
              <h1 className="text-3xl lg:text-4xl font-black text-white uppercase tracking-tighter mb-4 leading-none text-left">
                Let's Build the <br /> Future Together
              </h1>
              <p className="text-gray-400 text-sm lg:text-base font-medium leading-relaxed italic border-l-2 border-orange-600 pl-4 text-left">
                From technical specifications to custom bulk orders, our team of industrial specialists is ready to assist you in every step of your project.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                <p className="text-xl font-black text-white">24h</p>
                <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Response</p>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                <p className="text-xl font-black text-white">Global</p>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-start">

          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-6">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-orange-200 transition-colors group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-2">Email Us</h3>
                  <p className="text-gray-600 font-bold">sales@ecom.com</p>
                </div>

                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:border-orange-200 transition-colors group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  </div>
                  <h3 className="font-black text-gray-900 uppercase text-xs tracking-widest mb-2">Call Support</h3>
                  <p className="text-gray-600 font-bold">+91 98765 43210</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight mb-6">Business Hours</h2>
              <div className="space-y-4">
                {[
                  { day: 'Monday - Friday', time: '9:00 AM - 6:00 PM' },
                  { day: 'Saturday', time: '9:00 AM - 2:00 PM' },
                  { day: 'Sunday', time: 'Closed' }
                ].map((schedule, idx) => (
                  <div key={idx} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
                    <span className="font-bold text-gray-900">{schedule.day}</span>
                    <span className="text-gray-500 font-medium">{schedule.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-orange-600 rounded-3xl p-10 text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase mb-4 tracking-tight">Need a custom quote?</h3>
                <p className="text-orange-100 font-medium mb-8">For bulk orders exceeding 500 units, we offer specialized pricing and logistic support.</p>
                <a href="#" className="inline-block bg-white text-orange-600 px-8 py-3 rounded-xl font-black uppercase text-sm tracking-widest hover:bg-gray-100 transition-colors">Bulk Order Form</a>
              </div>
              <svg className="absolute bottom-0 right-0 w-32 h-32 text-orange-500/20 transform translate-x-10 translate-y-10" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 lg:py-32 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-orange-600 font-black text-xs uppercase tracking-widest mb-2 block text-center md:text-left">Global Presence</span>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 uppercase tracking-tight text-center md:text-left">Our Headquarters</h2>
            </div>
            <p className="text-gray-500 font-medium max-w-sm text-center md:text-right italic">Located in the heart of industrial Chennai, serving clients across the globe.</p>
          </div>

          <div className="rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
            <iframe
              title="Continental Pipes Location"
              src="https://www.google.com/maps?q=Chennai,India&output=embed"
              className="w-full h-[500px] border-0 grayscale hover:grayscale-0 transition-all duration-700"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}