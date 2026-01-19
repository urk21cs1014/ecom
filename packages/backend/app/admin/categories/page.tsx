'use client';

import { useEffect, useState } from 'react';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/admin/categories');
            const data = await res.json();
            setCategories(data.categories || []);
            setLoading(false);
        } catch (error) {
            console.error('Fetch error:', error);
            setLoading(false);
        }
    };

    const addCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName) return;

        try {
            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName }),
            });
            const data = await res.json();

            if (data.success) {
                setNewCategoryName('');
                setIsAdding(false);
                fetchCategories();
                setMessage('Category added successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                alert(data.error || 'Failed to add category');
            }
        } catch (error) {
            alert('Error adding category');
        }
    };

    const updateCategory = async (id: number) => {
        if (!editingName) return;

        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editingName }),
            });
            const data = await res.json();

            if (data.success) {
                setEditingId(null);
                fetchCategories();
                setMessage('Category updated successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                alert(data.error || 'Failed to update category');
            }
        } catch (error) {
            alert('Error updating category');
        }
    };

    const deleteCategory = async (id: number) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const res = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                fetchCategories();
                setMessage('Category deleted successfully!');
                setTimeout(() => setMessage(''), 3000);
            } else {
                alert(data.error || 'Failed to delete category');
            }
        } catch (error) {
            alert('Error deleting category');
        }
    };

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                    <div className="ml-3 text-gray-500 font-medium">Loading categories...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase">Categories</h1>
                    <p className="text-gray-500 font-medium mt-1">Manage product categories</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Category
                    </button>
                )}
            </div>

            {message && (
                <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl text-sm font-bold">
                    {message}
                </div>
            )}

            {/* Add New Category Form */}
            {isAdding && (
                <div className="mb-8 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">New Category</h2>
                    <form onSubmit={addCategory} className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Category Name (e.g., Seamless Pipes)"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            autoFocus
                            className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 font-medium"
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-orange-600 text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-orange-700 transition-all"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-6 py-3 bg-gray-100 text-gray-600 text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search and List */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Filter categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-orange-500 font-medium"
                        />
                        <svg className="absolute left-4 top-3.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="divide-y divide-gray-50">
                    {filteredCategories.length === 0 ? (
                        <div className="px-6 py-12 text-center text-gray-400 font-bold uppercase text-xs tracking-[0.2em]">
                            {searchTerm ? 'No matches found' : 'No categories yet'}
                        </div>
                    ) : (
                        filteredCategories.map((category) => (
                            <div key={category.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#fcfcfc] transition-colors group">
                                {editingId === category.id ? (
                                    <div className="flex-1 flex gap-2">
                                        <input
                                            type="text"
                                            value={editingName}
                                            onChange={(e) => setEditingName(e.target.value)}
                                            className="flex-1 px-3 py-2 bg-gray-50 border border-orange-200 rounded-lg focus:ring-1 focus:ring-orange-500 font-medium"
                                            autoFocus
                                        />
                                        <button
                                            onClick={() => updateCategory(category.id)}
                                            className="px-4 py-2 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-lg"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => setEditingId(null)}
                                            className="px-4 py-2 bg-gray-100 text-gray-600 text-xs font-black uppercase tracking-widest rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-gray-900 font-bold tracking-tight">{category.name}</div>
                                        <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditingId(category.id);
                                                    setEditingName(category.name);
                                                }}
                                                className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-orange-600 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => deleteCategory(category.id)}
                                                className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-red-600 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {filteredCategories.length > 0 && (
                <div className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">
                    Total {filteredCategories.length} Categories
                </div>
            )}
        </div>
    );
}
