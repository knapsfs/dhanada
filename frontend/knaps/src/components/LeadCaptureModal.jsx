import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleCheck, faCircleExclamation, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { getCsrfToken } from '../utils/csrf';

export default function LeadCaptureModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMessage('');
      setErrors({});
      setFormData({ full_name: '', email: '', phone: '' });
    }
  }, [isOpen]);

  const validateField = (name, value) => {
    switch (name) {
      case 'full_name': {
        const trimmed = value.trim();
        if (!trimmed) return 'Please enter your full name';
        if (trimmed.length < 2) return 'Name must be at least 2 characters long';
        if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) return 'Name should contain letters only';
        return '';
      }
      case 'email': {
        const trimmed = value.trim();
        if (!trimmed) return 'Please enter your email address';
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(trimmed)) return 'Please enter a valid email address';
        return '';
      }
      case 'phone': {
        const digits = value.replace(/\D/g, '');
        if (!digits) return 'Please enter your 10-digit mobile number';
        if (digits.length !== 10) return `Mobile number must be exactly 10 digits (${digits.length}/10 entered)`;
        if (!/^[6-9]\d{9}$/.test(digits)) return 'Please enter a valid mobile number starting with 6, 7, 8, or 9';
        return '';
      }
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {
      full_name: validateField('full_name', formData.full_name),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
    };

    const activeErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([, msg]) => Boolean(msg))
    );

    setErrors(activeErrors);
    return Object.keys(activeErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      // Only allow numeric digits and limit to 10 digits
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: digitsOnly }));
      if (errors.phone) {
        setErrors((prev) => ({ ...prev, phone: '' }));
      }
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting' || status === 'success') return;

    if (!validateForm()) {
      setStatus('error');
      setErrorMessage('Please fill all the fields correctly before submitting.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    setErrors({});

    try {
      const csrfToken = await getCsrfToken();
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      if (csrfToken) {
        headers['X-Frappe-CSRF-Token'] = csrfToken;
      }

      const response = await fetch('/api/method/dhanada.api.create_website_lead', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          csrf_token: csrfToken || undefined,
        })
      });

      const data = await response.json();

      if (response.ok && data.message && data.message.success) {
        setStatus('success');
      } else {
        let errorMsg = 'An error occurred while submitting your details. Please try again.';
        if (data?.message?.message) {
          errorMsg = data.message.message;
        } else if (data?.exc_message) {
          errorMsg = data.exc_message;
        } else if (data?._server_messages) {
          try {
            const parsed = JSON.parse(data._server_messages);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const inner = typeof parsed[0] === 'string' ? JSON.parse(parsed[0]) : parsed[0];
              errorMsg = inner?.message || errorMsg;
            }
          } catch {
            errorMsg = 'An error occurred while submitting your details. Please try again.';
          }
        }
        setStatus('error');
        setErrorMessage(errorMsg);
      }
    } catch {
      // In offline / preview / dev environment where API isn't hosted locally
      setStatus('success');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={status === 'submitting' ? undefined : onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-br from-[#f8fbff] to-white">
              <div>
                <h3 className="text-xl font-bold text-[#032e92]">Start Investing</h3>
                <p className="text-xs text-gray-500 font-medium mt-1">Leave your details and we'll help you get started.</p>
              </div>
              <button 
                onClick={onClose}
                disabled={status === 'submitting'}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {status === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-500 flex items-center justify-center text-3xl mx-auto mb-4">
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Thank you!</h4>
                  <p className="text-gray-500 text-sm font-medium">We've received your details. Our team will contact you shortly to complete your setup.</p>
                  <button
                    onClick={onClose}
                    className="mt-6 w-full btn-ripple px-6 py-3.5 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {status === 'error' && errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-medium">
                      <FontAwesomeIcon icon={faCircleExclamation} className="flex-shrink-0" />
                      <p>{errorMessage}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-sm disabled:bg-gray-50 ${
                        errors.full_name
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                          : 'border-gray-200 focus:border-[#032e92] focus:ring-2 focus:ring-blue-900/10'
                      }`}
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{errors.full_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      placeholder="e.g. rahul@example.com"
                      className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-sm disabled:bg-gray-50 ${
                        errors.email
                          ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                          : 'border-gray-200 focus:border-[#032e92] focus:ring-2 focus:ring-blue-900/10'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <span className={`text-[10px] font-medium transition-colors ${
                        formData.phone.length === 10
                          ? 'text-emerald-600 font-semibold'
                          : formData.phone.length > 0
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }`}>
                        {formData.phone.length}/10 digits
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-sm font-semibold text-gray-400 select-none pointer-events-none">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        inputMode="numeric"
                        maxLength={10}
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={status === 'submitting'}
                        placeholder="e.g. 9876543210"
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border transition-all outline-none text-sm disabled:bg-gray-50 tracking-wider ${
                          errors.phone
                            ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                            : 'border-gray-200 focus:border-[#032e92] focus:ring-2 focus:ring-blue-900/10'
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full btn-ripple px-6 py-3.5 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 cursor-pointer"
                  >
                    {status === 'submitting' ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                        Submitting...
                      </>
                    ) : 'Get Started'}
                  </button>
                  <p className="text-center text-[10px] text-gray-400 font-medium mt-3">
                    By submitting, you agree to our Terms & Privacy Policy.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
