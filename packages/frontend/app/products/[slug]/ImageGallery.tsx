'use client';

import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
  title: string;
  stockStatus: string;
}

export default function ImageGallery({ images, title, stockStatus }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const selectedImage = images[activeIndex] || images[0];

  return (
    <div className="space-y-6">
      {/* Main Image Container */}
      <div className="relative aspect-square bg-[#fafafa] rounded-3xl overflow-hidden border border-gray-100 flex items-center justify-center group">
        <img
          src={selectedImage}
          alt={title}
          className="w-full h-full object-cover transition-opacity duration-300"
          key={selectedImage}
        />

        {/* Navigation Layers - Clickable sides */}
        <div className="absolute inset-0 flex">
          <div
            className="w-1/2 h-full cursor-pointer z-10"
            onClick={prevImage}
            title="Previous Image"
          />
          <div
            className="w-1/2 h-full cursor-pointer z-10"
            onClick={nextImage}
            title="Next Image"
          />
        </div>

        {/* Navigation Arrows (Visible on hover) */}
        <button
          onClick={(e) => { e.stopPropagation(); prevImage(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20 focus:outline-none"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); nextImage(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-20 focus:outline-none"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Stock Status Badge */}
        <div className="absolute top-6 left-6 z-20">
          <span className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase ${stockStatus === 'IN_STOCK'
            ? 'bg-green-500 text-white shadow-lg shadow-green-100'
            : 'bg-red-500 text-white shadow-lg shadow-red-100'
            }`}>
            {stockStatus === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {/* Image Counter Badge */}
        <div className="absolute bottom-6 right-6 z-20">
          <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            <span className="text-white text-[10px] font-black tracking-widest uppercase">
              {activeIndex + 1} / {images.length}
            </span>
          </div>
        </div>
      </div>

      {/* Thumbnails Grid */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`aspect-square bg-white border-2 rounded-2xl overflow-hidden transition-all p-2 shadow-sm ${activeIndex === idx ? 'border-orange-600 ring-4 ring-orange-50' : 'border-gray-100 hover:border-orange-200'
              }`}
          >
            <img src={img} alt={`${title} thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
          </button>
        ))}
      </div>
    </div>
  );
}
