'use client';

import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface Props {
  productName: string;
  productSlug: string;
  onSuccess?: () => void;
}

export default function ProductEnquiryForm({
  productName,
  productSlug,
  onSuccess,
}: Props) {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    company: '',
    quantity: '',
    technical_specs: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<{
    full_name?: string;
    email?: string;
    phone?: string;
  }>({});
  const errorBannerRef = useRef<HTMLDivElement>(null);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  function validateForm() {
    const newErrors: typeof errors = {};

    if (!form.full_name.trim() || !/^[A-Za-z\s.]+$/.test(form.full_name.trim())) {
      newErrors.full_name = 'Contact Name should contain only letters, spaces, or dots.';
    }

    if (!emailRegex.test(form.email)) {
      newErrors.email = 'Please enter a valid corporate email address.';
    }

    if (!form.phone.trim()) {
      newErrors.phone = 'Phone number must contain numbers only.';
    } else if (form.phone.length < 10 || form.phone.length > 15) {
      newErrors.phone = 'Phone number length is not valid.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      setTimeout(() => {
        errorBannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Focus first error field
        if (errors.full_name) document.getElementsByName('full_name')[0]?.focus();
        else if (errors.email) document.getElementsByName('email')[0]?.focus();
        else if (errors.phone) document.getElementsByName('phone')[0]?.focus();
      }, 50);
      return;
    }

    if (!captchaToken) {
      setError('Please complete the CAPTCHA verification.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiry_type: 'PRODUCT',
          product_name: productName,
          product_slug: productSlug,
          product_url: typeof window !== 'undefined' ? window.location.href : '',
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          quantity: form.quantity,
          technical_specs: form.technical_specs,
          message: form.message,
          recaptchaToken: captchaToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send enquiry');
      }

      setSuccess('Enquiry sent successfully!');
      setForm({
        full_name: '',
        email: '',
        phone: '',
        company: '',
        quantity: '',
        technical_specs: '',
        message: '',
      });
      setErrors({});
      setCaptchaToken(null);

      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {Object.keys(errors).length > 0 && (
        <div ref={errorBannerRef} className="bg-red-50 border border-red-100 p-3 rounded-xl mb-4">
          <p className="text-red-600 text-[10px] font-black uppercase tracking-widest text-center">
            Please fill in all mandatory fields with valid information.
          </p>
        </div>
      )}
      <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl mb-6 flex justify-between items-center">
        <div>
          <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Enquiring For</p>
          <p className="text-sm font-bold text-black">{productName}</p>
        </div>
        <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center mb-1.5 ml-1">
            <label className={`text-[10px] font-black uppercase tracking-widest ${errors.full_name ? 'text-red-600' : 'text-gray-400'}`}>
              Contact Name *
            </label>
            {errors.full_name && <span className="text-red-600 text-[9px] font-bold uppercase tracking-wider animate-pulse">{errors.full_name}</span>}
          </div>
          <input
            type="text"
            name="full_name"
            className={`w-full border px-5 py-3 rounded-xl text-black bg-white outline-none placeholder:text-gray-400 transition-all
            ${errors.full_name ? 'border-red-500 ring-1 ring-red-500 bg-red-50/10' : 'border-gray-200 focus:ring-2 focus:ring-orange-500'}`}
            placeholder="Enter your name"
            value={form.full_name}
            onChange={(e) => {
              const value = e.target.value;
              setForm({ ...form, full_name: value });
              if (value.trim() && !/^[A-Za-z\s.]+$/.test(value)) {
                setErrors(prev => ({ ...prev, full_name: 'Contact Name should contain only letters, spaces, or dots.' }));
              } else {
                setErrors(prev => ({ ...prev, full_name: undefined }));
              }
            }}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5 ml-1">
            <label className={`text-[10px] font-black uppercase tracking-widest ${errors.email ? 'text-red-600' : 'text-gray-400'}`}>
              Corporate Email *
            </label>
            {errors.email && <span className="text-red-600 text-[9px] font-bold uppercase tracking-wider animate-pulse">{errors.email}</span>}
          </div>
          <input
            type="text"
            name="email"
            className={`w-full border px-5 py-3 rounded-xl text-black bg-white outline-none placeholder:text-gray-400 transition-all
            ${errors.email ? 'border-red-500 ring-1 ring-red-500 bg-red-50/10' : 'border-gray-200 focus:ring-2 focus:ring-orange-500'}`}
            placeholder="name@company.com"
            value={form.email}
            onChange={(e) => {
              const value = e.target.value;
              setForm({ ...form, email: value });
              if (value && !emailRegex.test(value)) {
                setErrors(prev => ({ ...prev, email: 'Please enter a valid corporate email address.' }));
              } else {
                setErrors(prev => ({ ...prev, email: undefined }));
              }
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center mb-1.5 ml-1">
            <label className={`text-[10px] font-black uppercase tracking-widest ${errors.phone ? 'text-red-600' : 'text-gray-400'}`}>
              Phone Number *
            </label>
            {errors.phone && <span className="text-red-600 text-[9px] font-bold uppercase tracking-wider animate-pulse">{errors.phone}</span>}
          </div>
          <input
            type="text"
            name="phone"
            className={`w-full border px-5 py-3 rounded-xl text-black bg-white outline-none placeholder:text-gray-400 transition-all
            ${errors.phone ? 'border-red-500 ring-1 ring-red-500 bg-red-50/10' : 'border-gray-200 focus:ring-2 focus:ring-orange-500'}`}
            placeholder="Enter digits only"
            value={form.phone}
            maxLength={15}
            onChange={(e) => {
              const value = e.target.value;
              setForm({ ...form, phone: value });
              if (value && /\D/.test(value)) {
                setErrors(prev => ({ ...prev, phone: 'Phone number must contain numbers only.' }));
              } else if (value && (value.length < 10 || value.length > 15)) {
                setErrors(prev => ({ ...prev, phone: 'Phone number length is not valid.' }));
              } else {
                setErrors(prev => ({ ...prev, phone: undefined }));
              }
            }}
          />
        </div>

        <input
          className="w-full border border-gray-200 px-5 py-3 rounded-xl text-black bg-white focus:ring-2 focus:ring-orange-500 outline-none placeholder:text-gray-400"
          placeholder="Company Name"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
        />
      </div>

      <input
        className="w-full border border-gray-200 px-5 py-3 rounded-xl text-black bg-white focus:ring-2 focus:ring-orange-500 outline-none placeholder:text-gray-400"
        placeholder="Quantity Required (Units, Meters, etc.)"
        value={form.quantity}
        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
      />

      <textarea
        rows={2}
        className="w-full border border-gray-200 px-5 py-3 rounded-xl text-black bg-white focus:ring-2 focus:ring-orange-500 outline-none placeholder:text-gray-400"
        placeholder="Grade / Material / Technical Specs"
        value={form.technical_specs}
        onChange={(e) => setForm({ ...form, technical_specs: e.target.value })}
      />

      <textarea
        required
        rows={3}
        className="w-full border border-gray-200 px-5 py-3 rounded-xl text-black bg-white focus:ring-2 focus:ring-orange-500 outline-none placeholder:text-gray-400"
        placeholder="How can our technical team assist you? *"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
      />

      <div className="flex justify-start my-4">
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          onChange={(token) => setCaptchaToken(token)}
        />
      </div>

      <button
        disabled={loading}
        className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all duration-300 disabled:opacity-50 mt-4 h-[64px] flex items-center justify-center"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Processing...
          </span>
        ) : 'Request Instant Quote'}
      </button>

      {error && (
        <p className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-lg text-center mt-4 border border-red-100">{error}</p>
      )}

      {success && (
        <p className="bg-green-50 text-green-700 text-xs font-bold p-3 rounded-lg text-center mt-4 border border-green-100">{success}</p>
      )}
    </form>
  );
}