'use client';

import { useState } from 'react';
import QuoteModal from './QuoteModal';

export default function QuoteButton({
  productName,
  categoryName,
  productSlug,
}: {
  productName: string;
  categoryName?: string;
  productSlug: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-orange-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-700 transition-all shadow-xl hover:shadow-orange-200 active:scale-[0.98]"
      >
        Request a Quote
      </button>

      {open && (
        <QuoteModal
          productName={productName}
          categoryName={categoryName}
          productSlug={productSlug}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}