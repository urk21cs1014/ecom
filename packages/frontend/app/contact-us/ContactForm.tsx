'use client';

import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export default function ContactForm() {
    const [captchaToken, setCaptchaToken] = useState<string | null>(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        enquiryType: 'Sales Enquiry',
        message: '',
    });

    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        phone?: string;
    }>({});
    const errorHeadingRef = useRef<HTMLParagraphElement>(null);

    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    function validateForm() {
        const newErrors: typeof errors = {};

        if (!form.name.trim() || !/^[A-Za-z\s]+$/.test(form.name.trim())) {
            newErrors.name = 'Please enter a valid name using letters and spaces only.';
        }

        if (!emailRegex.test(form.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }

        if (!form.phone) {
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
                errorHeadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Focus first error field
                if (errors.name) document.getElementsByName('name')[0]?.focus();
                else if (errors.email) document.getElementsByName('email')[0]?.focus();
                else if (errors.phone) document.getElementsByName('phone')[0]?.focus();
            }, 50);
            return;
        }

        if (!captchaToken) {
            setStatus('Please clear the CAPTCHA check box.');
            return;
        }

        setLoading(true);
        setStatus('');

        try {
            const res = await fetch('/api/enquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enquiry_type: 'GENERAL',
                    full_name: form.name,
                    email: form.email,
                    phone: form.phone || null,
                    company: form.company || null,
                    subject: form.enquiryType,
                    message: form.message,
                    recaptchaToken: captchaToken,
                }),
            });

            const data = await res.json();
            setLoading(false);

            if (data.success) {
                setStatus('Message sent successfully. We will contact you within 24 hours.');
                setForm({
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    enquiryType: 'Sales Enquiry',
                    message: '',
                });
                setErrors({});
                setCaptchaToken(null);
            } else {
                setStatus(data.error || 'Failed to send enquiry');
            }
        } catch (err: any) {
            console.error(err);
            setStatus(err.message || 'An error occurred. Please try again.');
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
            <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase">
                Send us a message
            </h2>
            <p
                ref={errorHeadingRef}
                className={`${Object.keys(errors).length > 0 ? 'text-red-600' : 'text-gray-500'} mb-8 font-medium transition-colors`}
            >
                {Object.keys(errors).length > 0
                    ? 'Please fill in all mandatory fields with valid information.'
                    : 'Fill out the form below and our specialists will get back to you shortly.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className={`text-[10px] font-black uppercase ${errors.name ? 'text-red-600' : 'text-gray-400'}`}>
                                Full Name
                            </label>
                            {errors.name && <span className="text-red-600 text-[9px] font-bold uppercase tracking-wider animate-pulse">{errors.name}</span>}
                        </div>
                        <input
                            type="text"
                            name="name"
                            className={`w-full bg-gray-50 px-5 py-4 rounded-2xl outline-none font-medium transition-all
                            ${errors.name ? 'ring-2 ring-red-500 bg-red-50/30' : 'focus:ring-2 focus:ring-orange-600'}`}
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={(e) => {
                                const value = e.target.value;
                                setForm({ ...form, name: value });
                                if (value.trim() && !/^[A-Za-z\s]+$/.test(value)) {
                                    setErrors(prev => ({ ...prev, name: 'Please enter a valid name using letters and spaces only.' }));
                                } else {
                                    setErrors(prev => ({ ...prev, name: undefined }));
                                }
                            }}
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className={`text-[10px] font-black uppercase ${errors.email ? 'text-red-600' : 'text-gray-400'}`}>
                                Email Address
                            </label>
                            {errors.email && <span className="text-red-600 text-[9px] font-bold uppercase tracking-wider animate-pulse">{errors.email}</span>}
                        </div>
                        <input
                            type="text"
                            name="email"
                            className={`w-full bg-gray-50 px-5 py-4 rounded-2xl outline-none font-medium transition-all
                            ${errors.email ? 'ring-2 ring-red-500 bg-red-50/30' : 'focus:ring-2 focus:ring-orange-600'}`}
                            placeholder="name@company.com"
                            value={form.email}
                            onChange={(e) => {
                                const value = e.target.value;
                                setForm({ ...form, email: value });
                                if (value && !emailRegex.test(value)) {
                                    setErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
                                } else {
                                    setErrors(prev => ({ ...prev, email: undefined }));
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className={`text-[10px] font-black uppercase ${errors.phone ? 'text-red-600' : 'text-gray-400'}`}>
                                Phone Number
                            </label>
                            {errors.phone && <span className="text-red-600 text-[9px] font-bold uppercase tracking-wider animate-pulse">{errors.phone}</span>}
                        </div>
                        <input
                            type="text"
                            name="phone"
                            className={`w-full bg-gray-50 px-5 py-4 rounded-2xl outline-none font-medium transition-all
                            ${errors.phone ? 'ring-2 ring-red-500 bg-red-50/30' : 'focus:ring-2 focus:ring-orange-600'}`}
                            placeholder="9876543210"
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

                    {/* COMPANY */}
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-400">
                            Company
                        </label>
                        <input
                            className="w-full bg-gray-50 px-5 py-4 rounded-2xl outline-none font-medium focus:ring-2 focus:ring-orange-600"
                            placeholder="Company Ltd"
                            value={form.company}
                            onChange={(e) => setForm({ ...form, company: e.target.value })}
                        />
                    </div>
                </div>

                {/* ENQUIRY TYPE */}
                <div>
                    <label className="text-[10px] font-black uppercase text-gray-400">
                        Enquiry Type
                    </label>
                    <select
                        className="w-full bg-gray-50 px-5 py-4 rounded-2xl outline-none font-medium focus:ring-2 focus:ring-orange-600"
                        value={form.enquiryType}
                        onChange={(e) => setForm({ ...form, enquiryType: e.target.value })}
                    >
                        <option>Sales Enquiry</option>
                        <option>Technical Support</option>
                        <option>Bulk Order</option>
                        <option>General Question</option>
                    </select>
                </div>

                {/* MESSAGE */}
                <div>
                    <label className="text-[10px] font-black uppercase text-gray-400">
                        Your Message
                    </label>
                    <textarea
                        className="w-full bg-gray-50 px-5 py-4 rounded-2xl outline-none font-medium focus:ring-2 focus:ring-orange-600"
                        rows={4}
                        placeholder="Tell us about your requirements..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                    />
                </div>

                <div className="flex justify-start my-4">
                    <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                        onChange={(token) => setCaptchaToken(token)}
                    />
                </div>

                <button
                    disabled={loading}
                    className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black uppercase hover:bg-orange-600 transition-all disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Submit Enquiry'}
                </button>

                {status && (
                    <div
                        className={`p-4 rounded-xl text-center font-bold text-sm
                        ${status.includes('successfully')
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-700'}`}
                    >
                        {status}
                    </div>
                )}
            </form>
        </div>
    );
}
