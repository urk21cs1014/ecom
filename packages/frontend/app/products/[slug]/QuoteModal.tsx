import { useState, useEffect } from 'react';
import ProductEnquiryForm from './product-enquiry-form';

export default function QuoteModal({
  productName,
  categoryName,
  productSlug,
  onClose,
}: {
  productName: string;
  categoryName?: string;
  productSlug: string;
  onClose: () => void;
}) {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="bg-white max-w-2xl w-full p-6 lg:p-8 rounded-2xl relative shadow-2xl my-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center font-bold"
          >
            ✕
          </button>

          <h2 className="text-2xl font-black mb-6 text-black uppercase tracking-tight pr-8">
            Request a Quote – {productName}
            {categoryName && <span className="block text-xs font-black text-orange-600 uppercase tracking-widest mt-2 bg-orange-50 w-fit px-2 py-1 rounded">{categoryName}</span>}
          </h2>

          <ProductEnquiryForm
            productName={productName}
            productSlug={productSlug}
            onSuccess={onClose}
          />
        </div>
      </div>
    </div>
  );
}