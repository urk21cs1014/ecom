'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [materials, setMaterials] = useState<any[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [pricing, setPricing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [slugError, setSlugError] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetch('/api/admin/materials')
      .then(res => res.json())
      .then(data => {
        setMaterials(data.materials || []);
      })
      .catch(console.error);

    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load product');
        return res.json();
      })
      .then(data => {
        setForm({
          title: data.title || '',
          slug: data.slug || '',
          material_id: data.material_id || '',
          category_id: data.category_id || '',
          category: data.category || '',
          sku: data.sku || '',
          short_description: data.short_description || '',
          full_description: data.full_description || '',
          image1_url: data.image1_url || '',
          image2_url: data.image2_url || '',
          image3_url: data.image3_url || '',
          og_title: data.og_title || '',
          og_description: data.og_description || '',
          twitter_title: data.twitter_title || '',
          twitter_description: data.twitter_description || '',
          facebook_title: data.facebook_title || '',
          facebook_description: data.facebook_description || '',
          stock_status: data.stock_status || 'IN_STOCK',
          base_price: data.base_price ?? '',
          is_offer: data.is_offer || 0,
          discount_type: data.discount_type || 'PERCENTAGE',
          discount_value: data.discount_value || 0,
        });
        setPricing(data.pricing || []);
        setLoading(false);
      })
      .catch(() => {
        setStatus('Failed to load product');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (form?.material_id) {
      const material = materials.find(m => m.id === parseInt(form.material_id));
      setSelectedMaterial(material);
    } else {
      setSelectedMaterial(null);
    }
  }, [form?.material_id, materials]);

  // Check for duplicate slug (excluding current product)
  useEffect(() => {
    const checkSlug = async () => {
      if (!form?.slug || !id) {
        setSlugError('');
        return;
      }
      try {
        const res = await fetch('/api/admin/products/check-slug', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: form.slug, excludeId: id }),
        });
        const data = await res.json();
        if (data.exists) {
          setSlugError('This slug already exists. Please choose another.');
        } else {
          setSlugError('');
        }
      } catch (error) {
        console.error('Error checking slug:', error);
      }
    };

    const timer = setTimeout(checkSlug, 500);
    return () => clearTimeout(timer);
  }, [form?.slug, id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setForm((prev: any) => ({ ...prev, [field]: data.url }));
      } else {
        setStatus('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setStatus('Image upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const addPricingEntry = () => {
    setPricing([
      ...pricing,
      {
        material_id: form?.material_id || '',
        grade: '',
        size: '',
        price: '',
      },
    ]);
  };

  const removePricingEntry = (index: number) => {
    setPricing(pricing.filter((_, i) => i !== index));
  };

  const updatePricingEntry = (index: number, field: string, value: string) => {
    const newPricing = [...pricing];
    newPricing[index] = { ...newPricing[index], [field]: value };
    setPricing(newPricing);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (slugError) return;
    if (form.short_description.length > 200) {
      setStatus('Short description exceeds 200 characters limit');
      return;
    }
    if (form.og_description.length > 160) {
      setStatus('OG description exceeds 160 characters limit');
      return;
    }
    if (form.twitter_description.length > 120) {
      setStatus('Twitter description exceeds 120 characters limit');
      return;
    }
    if (form.facebook_description.length > 120) {
      setStatus('Facebook description exceeds 120 characters limit');
      return;
    }

    setSaving(true);
    setStatus('');

    const validPricing = pricing.filter(
      p => p.material_id
    );

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          material_id: form.material_id ? parseInt(form.material_id) : null,
          category_id: form.category_id ? parseInt(form.category_id) : null,
          pricing: validPricing.map(p => ({
            material_id: typeof p.material_id === 'string' ? parseInt(p.material_id) : p.material_id,
            grade: p.grade,
            size: p.size,
            price: typeof p.price === 'string' ? parseFloat(p.price) : p.price,
          })),
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin/products');
      } else {
        setStatus(data.error || 'Failed to update product');
        setSaving(false);
      }
    } catch (error) {
      setStatus('An error occurred. Please try again.');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading product...</div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/products"
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          </div>
          {form?.slug && (
            <Link
              href={`http://localhost:3001/products/${form.slug}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Product Page
            </Link>
          )}
        </div>
        <p className="text-gray-600">Update product information</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-6xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-black ${slugError
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-orange-500'
                      }`}
                  />
                  {slugError && (
                    <p className="absolute -bottom-6 left-0 text-xs text-red-600">
                      {slugError}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Status
                </label>
                <select
                  value={form.stock_status}
                  onChange={(e) => setForm({ ...form, stock_status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="IN_STOCK">In Stock</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Offer Configuration */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Offer Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-2 pt-8">
                  <input
                    type="checkbox"
                    id="is_offer"
                    checked={form.is_offer === 1}
                    onChange={(e) => setForm({ ...form, is_offer: e.target.checked ? 1 : 0 })}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="is_offer" className="text-sm font-medium text-gray-700">
                    Enable Active Offer
                  </label>
                </div>

                {form.is_offer === 1 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Type
                      </label>
                      <select
                        value={form.discount_type}
                        onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                      >
                        <option value="PERCENTAGE">Percentage (%)</option>
                        <option value="FIXED">Fixed Amount (USD)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Discount Value
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={form.discount_value}
                        onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                        placeholder="0.00"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Show Grades when Material is Selected */}
            {selectedMaterial && Array.isArray(selectedMaterial.grades) && selectedMaterial.grades.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">Available Grades for {selectedMaterial.name}:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMaterial.grades.map((grade: string, idx: number) => (
                    <span
                      key={idx}
                      className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                    >
                      {grade}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Pricing (Material, Grade, Size)</h2>
              <button
                type="button"
                onClick={addPricingEntry}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                + Add Pricing Entry
              </button>
            </div>
            {pricing.length === 0 ? (
              <p className="text-sm text-gray-500 mb-4">No pricing entries. Click "Add Pricing Entry" to add pricing based on material, grade, and size.</p>
            ) : (
              <div className="space-y-3">
                {pricing.map((entry, index) => {
                  // Find selected material for this entry to get its grades
                  const entryMaterial = materials.find(m => m.id === parseInt(entry.material_id));

                  return (
                    <div key={index} className="grid grid-cols-12 gap-3 p-4 border border-gray-200 rounded-lg">
                      <div className="col-span-12 md:col-span-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Material</label>
                        <select
                          value={entry.material_id || ''}
                          onChange={(e) => {
                            // Reset grade when material changes
                            const newPricing = [...pricing];
                            newPricing[index] = {
                              ...newPricing[index],
                              material_id: e.target.value,
                              grade: '' // Reset grade
                            };
                            setPricing(newPricing);
                          }}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="">Select</option>
                          {materials.map((material) => (
                            <option key={material.id} value={material.id}>
                              {material.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-12 md:col-span-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Grade</label>
                        {entryMaterial && Array.isArray(entryMaterial.grades) && entryMaterial.grades.length > 0 ? (
                          <select
                            value={entry.grade || ''}
                            onChange={(e) => updatePricingEntry(index, 'grade', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="">Select Grade</option>
                            {entryMaterial.grades.map((grade: string, idx: number) => (
                              <option key={idx} value={grade}>
                                {grade}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={entry.grade || ''}
                            onChange={(e) => updatePricingEntry(index, 'grade', e.target.value)}
                            placeholder={entry.material_id ? "No grades available" : "Select Material first"}
                            disabled={!entry.material_id}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-100"
                          />
                        )}
                      </div>
                      <div className="col-span-12 md:col-span-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Size</label>
                        <input
                          type="text"
                          value={entry.size || ''}
                          onChange={(e) => updatePricingEntry(index, 'size', e.target.value)}
                          placeholder="e.g., 1/2&quot;NB, 2&quot;NB"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Price (USD)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={entry.price || ''}
                          onChange={(e) => updatePricingEntry(index, 'price', e.target.value)}
                          placeholder="0.00"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-1 flex items-end">
                        <button
                          type="button"
                          onClick={() => removePricingEntry(index)}
                          className="w-full px-3 py-2 text-red-600 hover:text-red-800"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Descriptions */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Descriptions</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={3}
                  value={form.short_description}
                  onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-black ${form.short_description.length > 200 ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                    }`}
                  placeholder="Brief product description (max 200 chars)"
                />
                <div className="flex justify-end mt-1">
                  <span className={`text-xs ${form.short_description.length > 200 ? 'text-red-600' : 'text-gray-500'}`}>
                    {form.short_description.length}/200
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Description
                </label>
                <textarea
                  rows={5}
                  value={form.full_description}
                  onChange={(e) => setForm({ ...form, full_description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images (3 Required)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['image1_url', 'image2_url', 'image3_url'].map((field, idx) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image {idx + 1}
                  </label>
                  <div className="flex flex-col gap-4">
                    {/* @ts-ignore */}
                    {form[field] && (
                      <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center group">
                        <img
                          /* @ts-ignore */
                          src={form[field]}
                          alt={`Product preview ${idx + 1}`}
                          className="max-full max-h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setForm((prev: any) => ({ ...prev, [field]: '' }))}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                          title="Remove Image"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <div className="w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                          </svg>
                          <p className="mb-2 text-sm text-gray-500">
                            {isUploading ? 'Uploading...' : <span className="font-semibold">Click to upload</span>}
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e, field)}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OG Title
                  </label>
                  <input
                    type="text"
                    value={form.og_title || ''}
                    onChange={(e) => setForm({ ...form, og_title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                    placeholder="Open Graph Title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OG Description (Max 160)
                  </label>
                  <input
                    type="text"
                    value={form.og_description || ''}
                    onChange={(e) => setForm({ ...form, og_description: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-black ${(form.og_description || '').length > 160 ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                      }`}
                    placeholder="Open Graph Description"
                  />
                  <div className="flex justify-end mt-1">
                    <span className={`text-xs ${(form.og_description || '').length > 160 ? 'text-red-600' : 'text-gray-500'}`}>
                      {(form.og_description || '').length}/160
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Title
                  </label>
                  <input
                    type="text"
                    value={form.twitter_title || ''}
                    onChange={(e) => setForm({ ...form, twitter_title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                    placeholder="Twitter Title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Twitter Description (Max 120)
                  </label>
                  <input
                    type="text"
                    value={form.twitter_description || ''}
                    onChange={(e) => setForm({ ...form, twitter_description: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-black ${(form.twitter_description || '').length > 120 ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                      }`}
                    placeholder="Twitter Description"
                  />
                  <div className="flex justify-end mt-1">
                    <span className={`text-xs ${(form.twitter_description || '').length > 120 ? 'text-red-600' : 'text-gray-500'}`}>
                      {(form.twitter_description || '').length}/120
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook Title
                  </label>
                  <input
                    type="text"
                    value={form.facebook_title || ''}
                    onChange={(e) => setForm({ ...form, facebook_title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                    placeholder="Facebook Title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Facebook Description (Max 120)
                  </label>
                  <input
                    type="text"
                    value={form.facebook_description || ''}
                    onChange={(e) => setForm({ ...form, facebook_description: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent text-black ${(form.facebook_description || '').length > 120 ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                      }`}
                    placeholder="Facebook Description"
                  />
                  <div className="flex justify-end mt-1">
                    <span className={`text-xs ${(form.facebook_description || '').length > 120 ? 'text-red-600' : 'text-gray-500'}`}>
                      {(form.facebook_description || '').length}/120
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Message */}
          {status && (
            <div className={`p-4 rounded-lg ${status.includes('error') || status.includes('Failed') ? 'bg-red-50 text-red-800' : 'bg-blue-50 text-blue-800'}`}>
              {status}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving || !!slugError}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Updating...' : 'Update Product'}
            </button>
            <Link
              href="/admin/products"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
