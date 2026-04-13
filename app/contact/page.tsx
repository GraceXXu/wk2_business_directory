// app/contact/page.tsx
'use client';

import { useState, FormEvent, useEffect } from 'react';

// Helper function to validate email format
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  return emailRegex.test(email);
};

// Helper function to validate phone number format
const isValidPhone = (phone: string): boolean => {
  // Accepts: (123) 456-7890, 123-456-7890, 1234567890, +1 123 456 7890
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  return phoneRegex.test(phone);
};

// Format phone number as user types
const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');
  
  // Limit to 10 digits (US/Canada)
  const limited = cleaned.slice(0, 10);
  
  // Format as (XXX) XXX-XXXX
  if (limited.length >= 6) {
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6, 10)}`;
  } else if (limited.length >= 4) {
    return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
  } else if (limited.length > 0) {
    return `(${limited}`;
  }
  return limited;
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cell: '',
    comment: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    cell: '',
  });
  const [touched, setTouched] = useState({
    email: false,
    cell: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // Real-time validation for email
  useEffect(() => {
    if (touched.email && formData.email && !isValidEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address (e.g., name@example.com)' }));
    } else if (touched.email && formData.email === '') {
      setErrors(prev => ({ ...prev, email: 'Email is required' }));
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  }, [formData.email, touched.email]);

  // Real-time validation for phone
  useEffect(() => {
    if (touched.cell && formData.cell && !isValidPhone(formData.cell)) {
      setErrors(prev => ({ ...prev, cell: 'Please enter a valid phone number (e.g., (123) 456-7890 or 123-456-7890)' }));
    } else if (touched.cell && formData.cell === '') {
      setErrors(prev => ({ ...prev, cell: '' })); // Phone is optional
    } else {
      setErrors(prev => ({ ...prev, cell: '' }));
    }
  }, [formData.cell, touched.cell]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formatted = formatPhoneNumber(rawValue);
    setFormData((prev) => ({ ...prev, cell: formatted }));
  };

  const handleBlur = (field: 'email' | 'cell') => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = { email: '', cell: '' };

    // Mark both fields as touched on submit
    setTouched({ email: true, cell: true });

    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address (e.g., name@example.com)';
      isValid = false;
    }

    if (formData.cell && !isValidPhone(formData.cell)) {
      newErrors.cell = 'Please enter a valid phone number (e.g., (123) 456-7890 or 123-456-7890)';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Form submitted:', formData);
      setSubmitStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent successfully.',
      });
      // Reset form
      setFormData({ name: '', email: '', cell: '', comment: '' });
      setTouched({ email: false, cell: false });
      setErrors({ email: '', cell: '' });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'Something went wrong. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-lg text-gray-600">
          We&apos;d love to hear from you. Fill out the form below and we&apos;ll get back to you shortly.
        </p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="John Doe"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              onBlur={() => handleBlur('email')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                errors.email && touched.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="hello@example.com"
            />
            {touched.email && errors.email && (
              <div className="mt-1 flex items-center gap-1 text-red-600">
                <span className="text-sm">⚠️</span>
                <p className="text-sm">{errors.email}</p>
              </div>
            )}
            {!touched.email && (
              <p className="mt-1 text-xs text-gray-500">Format: name@example.com</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label htmlFor="cell" className="block text-sm font-semibold text-gray-700 mb-1">
              Cell Phone
            </label>
            <input
              type="tel"
              id="cell"
              name="cell"
              value={formData.cell}
              onChange={handlePhoneChange}
              onBlur={() => handleBlur('cell')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                errors.cell && touched.cell ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="(123) 456-7890"
            />
            {touched.cell && errors.cell && (
              <div className="mt-1 flex items-center gap-1 text-red-600">
                <span className="text-sm">⚠️</span>
                <p className="text-sm">{errors.cell}</p>
              </div>
            )}
            {!touched.cell && (
              <div className="mt-1">
                <p className="text-xs text-gray-500">Format: (123) 456-7890 or 123-456-7890</p>
                <p className="text-xs text-gray-400 mt-0.5">Auto-formats as you type</p>
              </div>
            )}
          </div>

          {/* Comment Field */}
          <div>
            <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-1">
              Comment / Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment"
              name="comment"
              required
              rows={5}
              value={formData.comment}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-vertical"
              placeholder="How can we help you?"
            />
          </div>

          {/* Live Format Preview for Phone */}
          {formData.cell && !errors.cell && touched.cell && (
            <div className="mt-0 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 flex items-center gap-1">
                <span>✓</span> Phone number format accepted!
              </p>
            </div>
          )}

          {/* Submit Button & Status */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl shadow-sm transition-all duration-200 hover:shadow-md disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>

            {submitStatus.type === 'success' && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700">{submitStatus.message}</p>
              </div>
            )}

            {submitStatus.type === 'error' && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{submitStatus.message}</p>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Format Guide */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <span>📱</span> Phone Number Format Guide
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
          <div className="flex items-center gap-2">
            <span className="font-mono bg-white px-2 py-1 rounded">(123) 456-7890</span>
            <span>→ Standard US format</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono bg-white px-2 py-1 rounded">123-456-7890</span>
            <span>→ Dash format</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono bg-white px-2 py-1 rounded">1234567890</span>
            <span>→ 10 digits only</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono bg-white px-2 py-1 rounded">+1 123 456 7890</span>
            <span>→ International format</span>
          </div>
        </div>
      </div>

      {/* Optional Contact Info Cards */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center hover:shadow-md transition-shadow">
          <div className="text-3xl mb-2">📧</div>
          <h3 className="font-semibold text-gray-900">Email Us</h3>
          <p className="text-sm text-gray-600 mt-1">support@businesscards.com</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center hover:shadow-md transition-shadow">
          <div className="text-3xl mb-2">📞</div>
          <h3 className="font-semibold text-gray-900">Call Us</h3>
          <p className="text-sm text-gray-600 mt-1">(555) 123-4567</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-center hover:shadow-md transition-shadow">
          <div className="text-3xl mb-2">📍</div>
          <h3 className="font-semibold text-gray-900">Visit Us</h3>
          <p className="text-sm text-gray-600 mt-1">123 Business Ave, Suite 100</p>
        </div>
      </div>
    </div>
  );
}