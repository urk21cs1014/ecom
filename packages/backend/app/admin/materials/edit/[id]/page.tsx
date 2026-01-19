'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditMaterialPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!id) return;

    fetch(`/api/admin/materials/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load material');
        return res.json();
      })
      .then(data => {
        setForm({
          name: data.name || '',
          grades: Array.isArray(data.grades) ? data.grades : [],
        });
        setLoading(false);
      })
      .catch(() => {
        setStatus('Failed to load material');
        setLoading(false);
      });
  }, [id]);

  const addGrade = () => {
    setForm({ ...form, grades: [...form.grades, ''] });
  };

  const removeGrade = (index: number) => {
    setForm({
      ...form,
      grades: form.grades.filter((_: any, i: number) => i !== index),
    });
  };

  const updateGrade = (index: number, value: string) => {
    const newGrades = [...form.grades];
    newGrades[index] = value;
    setForm({ ...form, grades: newGrades });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus('');

    const validGrades = form.grades.filter((grade: string) => grade.trim() !== '');

    if (!form.name.trim()) {
      setStatus('Material name is required');
      setSaving(false);
      return;
    }

    if (validGrades.length === 0) {
      setStatus('At least one grade is required');
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/admin/materials/${id}`, {
        method: 'PUT',
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
        setStatus(data.error || 'Failed to update material');
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
          <div className="text-gray-500">Loading material...</div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          Material not found
        </div>
      </div>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Material</h1>
        </div>
        <p className="text-gray-600">Update material information</p>
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
              {form.grades.map((grade: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => updateGrade(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
              disabled={saving}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Updating...' : 'Update Material'}
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
