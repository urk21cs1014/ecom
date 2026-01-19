'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCarouselProps {
    products: any[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300; // Adjust scroll amount as needed
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="relative group">
            {/* Left Button */}
            <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-orange-600 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Previous products"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>

            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto pb-8 hide-scrollbar snap-x snap-mandatory"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {products.map((product) => (
                    <div key={product.id} className="min-w-[260px] md:min-w-[280px] snap-start">
                        <Link
                            href={`/products/${product.slug}`}
                            className="group/card bg-white border border-gray-100 rounded-[20px] p-4 hover:shadow-xl hover:shadow-orange-100/30 transition-all duration-300 flex flex-col h-full"
                        >
                            <div className="relative aspect-square bg-[#fafafa] rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-gray-50 group-hover/card:border-orange-100 transition-colors">
                                <Image
                                    src={product.image1_url || product.image2_url || product.image3_url || '/images/product-placeholder.png'}
                                    alt={product.title}
                                    fill
                                    className="object-contain transition-transform duration-500"
                                />
                            </div>

                            <div className="flex flex-col flex-grow">
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight mb-2 line-clamp-1 group-hover/card:text-orange-600 transition-colors">
                                    {product.title}
                                </h3>

                                <p className="text-gray-500 text-[10px] font-medium leading-relaxed mb-4 line-clamp-2 uppercase tracking-tight">
                                    {product.short_description}
                                </p>

                                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Starting at</p>
                                        {product.min_price ? (
                                            <p className="text-orange-600 font-black text-sm">
                                                ${parseFloat(product.min_price).toFixed(2)}
                                            </p>
                                        ) : (
                                            <p className="text-gray-900 font-black uppercase text-[9px]">Contact Us</p>
                                        )}
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center group-hover/card:bg-orange-600 group-hover/card:text-white transition-all">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Right Button */}
            <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-orange-600 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
                aria-label="Next products"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
        </div>
    );
}
