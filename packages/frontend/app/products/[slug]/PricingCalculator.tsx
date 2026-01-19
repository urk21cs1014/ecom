'use client';

import { useState, useMemo } from 'react';

interface PricingEntry {
    material_id: number;
    material_name: string;
    grade: string;
    size: string;
    price: number;
}

interface PricingCalculatorProps {
    pricing: PricingEntry[];
    basePrice?: number | string | null;
    isOffer?: boolean;
    discountType?: string;
    discountValue?: number | string;
}

export default function PricingCalculator({ pricing, basePrice, isOffer, discountType, discountValue }: PricingCalculatorProps) {
    const [selectedMaterial, setSelectedMaterial] = useState<string>('');
    const [selectedGrade, setSelectedGrade] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');

    // Extract unique materials
    const materials = useMemo(() => {
        const unique = new Set(pricing.map(p => p.material_name));
        return Array.from(unique).sort();
    }, [pricing]);

    // Extract grades for selected material
    const grades = useMemo(() => {
        if (!selectedMaterial) return [];
        const filtered = pricing.filter(p => p.material_name === selectedMaterial);
        const unique = new Set(filtered.map(p => p.grade));
        return Array.from(unique).sort();
    }, [pricing, selectedMaterial]);

    // Extract sizes for selected material and grade
    const sizes = useMemo(() => {
        if (!selectedMaterial || !selectedGrade) return [];
        const filtered = pricing.filter(
            p => p.material_name === selectedMaterial && p.grade === selectedGrade
        );
        const unique = new Set(filtered.map(p => p.size));
        return Array.from(unique).sort();
    }, [pricing, selectedMaterial, selectedGrade]);

    // Find price
    const price = useMemo(() => {
        if (!selectedMaterial || !selectedGrade || !selectedSize) return null;
        const entry = pricing.find(
            p =>
                p.material_name === selectedMaterial &&
                p.grade === selectedGrade &&
                p.size === selectedSize
        );
        return entry ? entry.price : null;
    }, [pricing, selectedMaterial, selectedGrade, selectedSize]);

    // Reset downstream selections when upstream changes
    const handleMaterialChange = (val: string) => {
        setSelectedMaterial(val);
        setSelectedGrade('');
        setSelectedSize('');
    };

    const handleGradeChange = (val: string) => {
        setSelectedGrade(val);
        setSelectedSize('');
    };

    return (
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-2xl font-black mb-8 text-black uppercase tracking-tight">Configure Specifications for Instant Pricing</h3>

            <div className="space-y-8">
                {/* Material Selection */}
                <div>
                    <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-widest">
                        01. Choose Material
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {materials.map((material) => (
                            <button
                                key={material}
                                onClick={() => handleMaterialChange(material)}
                                className={`px-5 py-2.5 text-sm font-bold rounded-xl border transition-all ${selectedMaterial === material
                                    ? 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-100'
                                    : 'bg-white border-gray-200 text-black hover:border-orange-600'
                                    }`}
                            >
                                {material}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grade Selection - Only show if material selected */}
                {selectedMaterial && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                        <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-widest">
                            02. Specify Grade
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {grades.map((grade) => (
                                <button
                                    key={grade}
                                    onClick={() => handleGradeChange(grade)}
                                    className={`px-5 py-2.5 text-sm font-bold rounded-xl border transition-all ${selectedGrade === grade
                                        ? 'bg-black border-black text-white shadow-lg'
                                        : 'bg-white border-gray-200 text-black hover:border-black'
                                        }`}
                                >
                                    {grade}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Size Selection - Only show if grade selected */}
                {selectedGrade && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-500">
                        <label className="block text-xs font-black text-gray-500 mb-3 uppercase tracking-widest">
                            03. Select Dimension / Size
                        </label>
                        <select
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(e.target.value)}
                            className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-black font-bold appearance-none cursor-pointer"
                        >
                            <option value="">Select Target Size...</option>
                            {sizes.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Display Selected Price Only */}
                {price !== null && (
                    <div className="mt-10 pt-8 border-t border-gray-100 animate-in zoom-in-95 duration-500">
                        <div className="flex items-center justify-between bg-black text-white p-8 rounded-2xl shadow-2xl">
                            <div className="flex flex-col text-left w-full">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-50">
                                    Unit Quotation
                                </p>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl font-black text-white">
                                        ${(function () {
                                            const rawPrice = parseFloat(String(price));
                                            if (isOffer) {
                                                const disc = parseFloat(String(discountValue || '0'));
                                                if (discountType === 'PERCENTAGE') return (rawPrice - (rawPrice * (disc / 100))).toFixed(2);
                                                return (rawPrice - disc).toFixed(2)
                                            }
                                            return rawPrice.toFixed(2);
                                        })()}
                                    </span>
                                    {isOffer && (
                                        <span className="text-lg font-black text-white/40 line-through">
                                            ${parseFloat(String(price)).toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[10px] text-white/40 mt-3 font-bold uppercase tracking-widest italic">
                                    * Ex-Works price excluding taxes and shipping
                                </p>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 text-right mt-3 font-medium italic">
                            * Final pricing subject to quantity discounts and logistics.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
