'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length >= 1) {
        setIsLoading(true);
        try {
          const res = await fetch(`/api/search-suggestions?q=${encodeURIComponent(searchTerm)}`);
          const data = await res.json();
          setSuggestions(data.suggestions || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        router.push(`/products/${suggestions[activeIndex].slug}`);
        setShowSuggestions(false);
        setSearchTerm('');
      } else if (searchTerm.trim()) {
        router.push(`/shop?search=${encodeURIComponent(searchTerm)}`);
        setShowSuggestions(false);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Materials', href: '/materials' },
    { name: 'Offers', href: '/offers' },
    { name: 'About Us', href: '/about-us' },
    { name: 'Contact', href: '/contact-us' },
  ];

  return (
    <>
      {/* ================= TOP INFO BAR ================= */}
      <div className="bg-gray-900 text-[10px] font-black uppercase tracking-widest text-gray-400">
        <div className="max-w-7xl mx-auto px-6 py-2.5 flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-2">
              <span className="text-orange-600">CALL</span> +91 98765 43210
            </span>
            <span className="hidden sm:flex items-center gap-2 border-l border-gray-800 pl-6">
              <span className="text-orange-600">EMAIL</span> sales@ecom.com
            </span>
          </div>

          <Link
            href="/offers"
            className="flex items-center gap-2 hover:text-white transition group"
          >
            Special Offers
            <span className="bg-orange-600 text-white text-[8px] px-1.5 py-0.5 rounded-sm group-hover:bg-white group-hover:text-orange-600 transform group-hover:scale-110 transition-all">
              LIVE
            </span>
          </Link>
        </div>
      </div>

      {/* ================= MAIN HEADER ================= */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-3' : 'bg-white py-5'
        }`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* ================= UNIQUE LOGO DESIGN ================= */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative flex items-center justify-center">
              {/* Pipe Flow Icon */}
              <div className="w-10 h-10 border-2 border-gray-900 rounded-full flex items-center justify-center relative overflow-hidden group-hover:border-orange-600 transition-colors duration-500">
                <div className="absolute inset-0 bg-gray-900 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full" />
                <div className="relative flex flex-col gap-0.5 z-10">
                  <div className="w-4 h-0.5 bg-orange-600 rounded-full group-hover:bg-white transition-colors" />
                  <div className="w-6 h-0.5 bg-gray-900 rounded-full group-hover:bg-orange-500 transition-colors" />
                  <div className="w-4 h-0.5 bg-orange-600 rounded-full group-hover:bg-white transition-colors ml-2" />
                </div>
              </div>
            </div>

            <div className="flex flex-col -space-y-1">
              <span className="text-xl font-black text-gray-900 tracking-tighter uppercase group-hover:text-orange-600 transition-colors">
                Continental
              </span>
              <div className="flex items-center gap-1.5">
                <span className="h-px w-3 bg-orange-600" />
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-[0.3em]">Precision Pipes</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Changed from lg to xl to support tablet view better if needed, or stick to lg as requested. 
              The request says "Tablet (iPad / Medium Screens) -> Full navigation must be hidden". 
              Common breakpoints: md (768px), lg (1024px). 
              If we want iPad (768+) to have hamburger, we should hide desktop nav below lg.
              Existing was hidden lg:flex. So below lg (1024px) it is hidden. 
              Wait, existing code was `hidden lg:flex`. 
              Let's re-read the file content I saw earlier.
              Line 148: `hidden lg:flex` -> This means it is flex on lg (1024px) and up. Hidden on md (768px). 
              So on iPad Portrait (768px), it is ALREADY hidden?
              Ah, maybe "Tablet" implies up to 1024px or similar? 
              The user wants "Hamburger menu appears on all tablet viewports".
              iPad Pro is often 1024px wide. If we use `lg` (1024px), it might show desktop menu on iPad Pro LANDSCAPE.
              However, the requirement says "Tablet (iPad / Medium Screens) Full navigation must be hidden".
              Let's stick to the plan: change breakpoints from `md` to `lg`? 
              Actually, the desktop nav was `hidden lg:flex`. That means visible on 1024px+.
              The Search+CTA was `hidden md:flex`. That means visible on 768px+. 
              So on iPad (768px), Nav is hidden, but Search+CTA is visible. 
              The user wants EVERYTHING hidden and in the hamburger menu on Tablet.
              So I need to change Search+CTA from `hidden md:flex` to `hidden lg:flex`.
              And Mobile Menu Button from `md:hidden` to `lg:hidden`.
              And Mobile Menu Dropdown from `md:hidden` to `lg:hidden`.
          */}
          <nav className="hidden xl:flex items-center gap-10 text-[11px] font-black uppercase tracking-widest">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors relative group ${pathname === link.href ? 'text-orange-600' : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-orange-600 transition-all duration-300 ${pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
              </Link>
            ))}
          </nav>

          {/* Search + CTA - Changed md:flex to lg:flex to hide on tablet */}
          <div className="hidden xl:flex items-center gap-8 relative" ref={suggestionRef}>
            <div className="relative group/search">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setActiveIndex(-1);
                }}
                onKeyDown={handleSearch}
                onFocus={() => searchTerm.length >= 1 && setShowSuggestions(true)}
                className="bg-gray-50 border-none rounded-2xl px-5 py-2.5 text-xs font-bold
                text-black placeholder:text-gray-400 w-48
                focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all focus:w-64"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/search:text-orange-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-4 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-slide-down p-2">
                  <div className="space-y-1">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.slug}
                        className={`w-full flex items-center gap-4 px-3 py-2 rounded-xl transition-all ${index === activeIndex ? 'bg-gray-50' : 'hover:bg-gray-50'
                          }`}
                        onClick={() => {
                          router.push(`/products/${suggestion.slug}`);
                          setShowSuggestions(false);
                          setSearchTerm('');
                        }}
                      >
                        <div className="w-12 h-12 flex-shrink-0 bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden flex items-center justify-center p-1">
                          <img
                            src={suggestion.image1_url || '/images/product-placeholder.png'}
                            alt=""
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-black text-gray-900 line-clamp-1">{suggestion.title}</span>
                          <span className="text-[10px] text-orange-600 font-bold uppercase tracking-tight">{suggestion.category || 'Product'}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/contact-us"
              className="bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-2xl hover:bg-orange-600 shadow-xl shadow-gray-100 hover:shadow-orange-100 transition-all duration-300"
            >
              Send Enquiry
            </Link>
          </div>

          {/* Mobile Menu Button - Changed md:hidden to lg:hidden */}
          <button
            className="xl:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-900 z-50 relative"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? (
              <svg className="w-5 h-5 font-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5 font-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            )}
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {menuOpen && (
          // Changed md:hidden to lg:hidden to show on tablet
          <div className="xl:hidden bg-white border-t p-6 space-y-6 fixed inset-0 top-[70px] z-40 overflow-y-auto">
            {/* Search for Tablet ONLY - Hidden on mobile (< md), Visible on Tablet (md - lg) */}
            <div className="hidden md:block relative group/search mb-6">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setActiveIndex(-1);
                }}
                onKeyDown={(e) => {
                  handleSearch(e);
                  if (e.key === 'Enter') setMenuOpen(false);
                }}
                className="bg-gray-50 border-none rounded-2xl px-5 py-3 text-sm font-bold
                text-black placeholder:text-gray-400 w-full
                focus:outline-none focus:ring-2 focus:ring-orange-600 transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
            </div>

            <nav className="flex flex-col gap-4 text-[13px] font-black uppercase tracking-widest text-gray-500">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setMenuOpen(false)} className={pathname === link.href ? 'text-orange-600' : ''}>
                  {link.name}
                </Link>
              ))}
            </nav>
            <Link
              href="/contact-us"
              className="block bg-orange-600 text-white py-4 rounded-2xl text-center font-black uppercase text-xs tracking-widest"
              onClick={() => setMenuOpen(false)}
            >
              Send Enquiry
            </Link>
          </div>
        )}
      </header>
    </>
  );
}