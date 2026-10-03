import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faCircleCheck, faChevronDown, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { getCsrfToken } from '../../utils/csrf';
import { productOptions } from '../../data/productOptions';

export default function ContactForm() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productOpen, setProductOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: '',
    consent: true,
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProductOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedProductObj = productOptions.find((p) => p.value === selectedProduct);

  const validate = () => {
    const newErrors = {};
    if (!selectedProduct) {
      newErrors.product = 'Please select a product';
    }
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.consent) {
      newErrors.consent = 'Please agree to the Privacy Policy to proceed';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return;

    if (!validate()) {
      setStatus('error');
      setErrorMessage('Please fill all required fields before submitting.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');
    setErrors({});

    try {
      const csrfToken = await getCsrfToken();
      const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
      if (csrfToken) {
        headers['X-Frappe-CSRF-Token'] = csrfToken;
      }

      const response = await fetch('/api/method/dhanada.api.create_website_lead', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          full_name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          product: selectedProductObj?.label || selectedProduct || 'Contact Us',
          notes: formData.message.trim(),
          csrf_token: csrfToken || undefined,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok && data.message && data.message.success) {
        setStatus('success');
      } else {
        let err = 'Something went wrong. Please try again.';
        if (response.status === 429 || data?.exc_type === 'RateLimitExceededError') {
          err = "You're sending requests a little too quickly. Please wait about a minute and try again.";
        } else if (data?.message?.message) {
          err = data.message.message;
        } else if (data?.exc_message) {
          err = data.exc_message;
        }
        setStatus('error');
        setErrorMessage(err);
      }
    } catch {
      setStatus('success');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-[0_20px_50px_-15px_rgba(3,46,146,0.08)] border border-gray-100"
    >
      <h2 className="text-3xl font-bold text-[#0a192f] mb-2">Get In Touch With Our Financial Experts</h2>
      <p className="text-gray-500 mb-6 text-[15px]">Fill out the form below and one of our wealth advisors will contact you shortly.</p>

      {status === 'success' ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-500 flex items-center justify-center text-3xl mx-auto mb-4">
            <FontAwesomeIcon icon={faCircleCheck} />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">Thank you!</h4>
          <p className="text-gray-500 text-sm">We've received your details. Our team will contact you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {status === 'error' && errorMessage && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium">
              {errorMessage}
            </div>
          )}

          {/* Product Dropdown Field */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Product <span className="text-red-500">*</span>
            </label>
            <div
              onClick={() => setProductOpen(!productOpen)}
              role="button"
              tabIndex={0}
              aria-haspopup="listbox"
              aria-expanded={productOpen}
              className={`w-full bg-gray-50 border rounded-xl px-4 py-3.5 flex items-center justify-between cursor-pointer transition-all ${
                errors.product
                  ? 'border-red-400 bg-red-50/20'
                  : productOpen
                    ? 'border-[#032e92] ring-2 ring-[#032e92]/20 bg-white'
                    : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className={selectedProduct ? 'text-gray-900 font-medium' : 'text-gray-400 font-normal'}>
                {selectedProductObj ? selectedProductObj.label : 'Select a product'}
              </span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`text-gray-400 text-xs transition-transform duration-200 ${
                  productOpen ? 'rotate-180 text-[#032e92]' : ''
                }`}
              />
            </div>
            {errors.product && <p className="text-red-500 text-xs mt-1 font-medium">{errors.product}</p>}

            <AnimatePresence>
              {productOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-full mt-1 bg-white rounded-xl shadow-xl shadow-blue-950/10 border border-gray-100 p-1.5 z-50 overflow-hidden"
                >
                  {productOptions.map((option) => {
                    const isSelected = selectedProduct === option.value;
                    return (
                      <div
                        key={option.value}
                        onClick={() => {
                          setSelectedProduct(option.value);
                          setProductOpen(false);
                          if (errors.product) {
                            setErrors((prev) => ({ ...prev, product: '' }));
                          }
                        }}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg cursor-pointer text-sm transition-colors ${
                          isSelected
                            ? 'bg-[#eef4ff] text-[#032e92] font-semibold'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-[#032e92]'
                        }`}
                      >
                        <span>{option.label}</span>
                        {isSelected && (
                          <svg className="w-4 h-4 text-[#032e92]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => {
                  setFormData({ ...formData, fullName: e.target.value });
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                }}
                className={`w-full bg-gray-50 border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all shadow-sm ${
                  errors.fullName ? 'border-red-400' : 'border-gray-200 text-gray-900'
                }`}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center">
                <span className="text-sm font-semibold text-gray-400 mr-2 select-none">+91</span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter your mobile number"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, phone: val });
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all shadow-sm ${
                    errors.phone ? 'border-red-400' : 'border-gray-200 text-gray-900'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Address */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                className={`w-full bg-gray-50 border rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all shadow-sm ${
                  errors.email ? 'border-red-400' : 'border-gray-200 text-gray-900'
                }`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Message</label>
            <textarea
              rows="4"
              placeholder="Tell us about your financial goals..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all shadow-sm resize-none"
            ></textarea>
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="privacy"
              checked={formData.consent}
              onChange={(e) => {
                setFormData({ ...formData, consent: e.target.checked });
                if (errors.consent) setErrors((prev) => ({ ...prev, consent: '' }));
              }}
              className="mt-1 w-4.5 h-4.5 text-[#032e92] rounded border-gray-300 focus:ring-[#032e92] cursor-pointer"
            />
            <label htmlFor="privacy" className="text-[13px] text-gray-500 leading-relaxed cursor-pointer select-none">
              I agree to the{' '}
              <a href="/terms" className="text-[#032e92] font-semibold hover:underline">
                Privacy Policy
              </a>{' '}
              and consent to being contacted by financial advisors.
            </label>
          </div>
          {errors.consent && <p className="text-red-500 text-xs">{errors.consent}</p>}

          {/* Primary Button */}
          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-[#032e92] text-white font-bold rounded-xl px-8 py-4 flex items-center justify-center gap-3 hover:bg-[#021d63] transition-all shadow-lg shadow-[#032e92]/20 group cursor-pointer disabled:opacity-75"
          >
            {status === 'submitting' ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                <span>Scheduling Consultation...</span>
              </>
            ) : (
              <>
                <span>Schedule Consultation</span>
                <FontAwesomeIcon icon={faPaperPlane} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
}
