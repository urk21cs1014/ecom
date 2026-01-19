'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddMaterialPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: '',
    grades: [''] as string[],
  });

  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const addGrade = () => {
    setForm({ ...form, grades: [...form.grades, ''] });
  };

  const removeGrade = (index: number) => {
    setForm({
      ...form,
      grades: form.grades.filter((_, i) => i !== index),
    });
  };

  const updateGrade = (index: number, value: string) => {
    const newGrades = [...form.grades];
    newGrades[index] = value;
    setForm({ ...form, grades: newGrades });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    // Filter out empty grades
    const validGrades = form.grades.filter(grade => grade.trim() !== '');

    if (!form.name.trim()) {
      setStatus('Material name is required');
      setLoading(false);
      return;
    }

    if (validGrades.length === 0) {
      setStatus('At least one grade is required');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          grades: validGrades,
        }),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin/materials');
      } else {
        setStatus(data.error || 'Failed to save material');
        setLoading(false);
      }
    } catch (error) {
      setStatus('An error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <Link
            href="/admin/materials"
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Material</h1>
        </div>
        <p className="text-gray-600">Create a new material type with grades</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Material Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Material Name *
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="e.g., Stainless Steel, Carbon Steel, Duplex Steel"
            />
          </div>

          {/* Grades */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Grades *
              </label>
              <button
                type="button"
                onClick={addGrade}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                + Add Grade
              </button>
            </div>
            <div className="space-y-2">
              {form.grades.map((grade, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => updateGrade(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., ASTM A403 WP316/316L, DIN 1.4301"
                  />
                  {form.grades.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeGrade(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Add all available grades for this material (e.g., ASTM standards, DIN numbers, etc.)
            </p>
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
              disabled={loading}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Material'}
            </button>
            <Link
              href="/admin/materials"
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
