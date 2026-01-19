'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Props {
    initialCategories: { id: number; name: string }[];
    initialMaterials: { id: number; name: string }[];
}

export default function ShopFilters({ initialCategories, initialMaterials }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State for filters
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [selectedCats, setSelectedCats] = useState<string[]>(searchParams.get('category')?.split(',').filter(Boolean) || []);
    const [selectedMats, setSelectedMats] = useState<string[]>(searchParams.get('material')?.split(',').filter(Boolean) || []);
    const [selectedStock, setSelectedStock] = useState<string[]>(searchParams.get('stock')?.split(',').filter(Boolean) || []);
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance');

    // Update URL function
    const applyFilters = (updates: any) => {
        const params = new URLSearchParams(searchParams.toString());

        // Always reset page to 1 on filter change
        params.set('page', '1');

        Object.keys(updates).forEach(key => {
            const value = updates[key];
            if (Array.isArray(value)) {
                if (value.length > 0) params.set(key, value.join(','));
                else params.delete(key);
            } else if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        router.push(`/shop?${params.toString()}`, { scroll: false });
    };

    // Clear filters on mount (to handle "clear on refresh" requirement)
    useEffect(() => {
        if (searchParams.toString() !== '') {
            router.replace('/shop', { scroll: false });
        }
    }, []);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search !== (searchParams.get('search') || '')) {
                applyFilters({ search });
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const toggleFilter = (list: string[], setList: any, key: string, value: string) => {
        const newList = list.includes(value)
            ? list.filter(v => v !== value)
            : [...list, value];
        setList(newList);
        applyFilters({ [key]: newList });
    };

    const clearSection = (setList: any, key: string) => {
        setList([]);
        applyFilters({ [key]: [] });
    };

    return (
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit sticky top-24">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Filters</h2>
                <button
                    onClick={() => router.push('/shop')}
                    className="text-[10px] font-bold text-orange-600 uppercase tracking-widest hover:underline"
                >
                    Clear All
                </button>
            </div>

            {/* Search */}
            <div className="space-y-3">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Search Products</h3>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-black"
                    />
                    <svg className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Categories ({selectedCats.length})</h3>
                    {selectedCats.length > 0 && (
                        <button onClick={() => clearSection(setSelectedCats, 'category')} className="text-[10px] text-orange-600 font-bold uppercase tracking-widest">Clear</button>
                    )}
                </div>
                <div className="max-h-48 overflow-y-auto pr-2 space-y-2.5 custom-scrollbar border-b border-gray-50 pb-2">
                    {initialCategories.map(cat => (
                        <label key={cat.id} className="flex items-center group cursor-pointer">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedCats.includes(cat.name)}
                                    onChange={() => toggleFilter(selectedCats, setSelectedCats, 'category', cat.name)}
                                    className="peer w-4 h-4 border-gray-300 rounded text-orange-600 focus:ring-orange-500 cursor-pointer appearance-none border-2 checked:bg-orange-600 checked:border-orange-600 transition-all"
                                />
                                <svg className="absolute left-0.5 top-0.5 w-3 h-3 text-white hidden peer-checked:block pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span className="ml-3 text-sm text-gray-600 group-hover:text-black transition-colors font-medium">{cat.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Materials */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Material Type ({selectedMats.length})</h3>
                    {selectedMats.length > 0 && (
                        <button onClick={() => clearSection(setSelectedMats, 'material')} className="text-[10px] text-orange-600 font-bold uppercase tracking-widest">Clear</button>
                    )}
                </div>
                <div className="max-h-32 overflow-y-auto pr-2 space-y-2.5 custom-scrollbar border-b border-gray-50 pb-2">
                    {initialMaterials.map(mat => (
                        <label key={mat.id} className="flex items-center group cursor-pointer">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedMats.includes(mat.name)}
                                    onChange={() => toggleFilter(selectedMats, setSelectedMats, 'material', mat.name)}
                                    className="peer w-4 h-4 border-gray-300 rounded text-orange-600 focus:ring-orange-500 cursor-pointer appearance-none border-2 checked:bg-orange-600 checked:border-orange-600 transition-all"
                                />
                                <svg className="absolute left-0.5 top-0.5 w-3 h-3 text-white hidden peer-checked:block pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span className="ml-3 text-sm text-gray-600 group-hover:text-black transition-colors font-medium">{mat.name}</span>
                        </label>
                    ))}
                </div>
            </div>



            {/* Stock Status */}
            <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Stock Status</h3>
                <div className="space-y-2.5 border-b border-gray-50 pb-2">
                    {['IN_STOCK', 'OUT_OF_STOCK'].map(status => (
                        <label key={status} className="flex items-center group cursor-pointer">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedStock.includes(status)}
                                    onChange={() => toggleFilter(selectedStock, setSelectedStock, 'stock', status)}
                                    className="peer w-4 h-4 border-gray-300 rounded text-orange-600 focus:ring-orange-500 cursor-pointer appearance-none border-2 checked:bg-orange-600 checked:border-orange-600 transition-all"
                                />
                                <svg className="absolute left-0.5 top-0.5 w-3 h-3 text-white hidden peer-checked:block pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <span className="ml-3 text-sm text-gray-600 group-hover:text-black transition-colors font-medium">
                                {status === 'IN_STOCK' ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Price Range (USD)</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs text-black"
                    />
                    <span className="text-gray-300">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs text-black"
                    />
                </div>
                <button
                    onClick={() => applyFilters({ minPrice, maxPrice })}
                    className="w-full py-2.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-orange-600 transition-all shadow-lg shadow-gray-100"
                >
                    Apply Price
                </button>
            </div>

            {/* Sort By */}
            <div className="space-y-3">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Sort By</h3>
                <select
                    value={sortBy}
                    onChange={(e) => {
                        setSortBy(e.target.value);
                        applyFilters({ sort: e.target.value });
                    }}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-black appearance-none cursor-pointer"
                >
                    <option value="relevance">Relevance</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="newest">Newest First</option>
                </select>
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
        </aside>
    );
}
