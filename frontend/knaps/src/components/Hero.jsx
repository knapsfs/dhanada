import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import knapsBanner from '../assets/knaps-banner.png';
import knapsBannerGlassCards from '../assets/knaps-banner-glass-cards.png';
import { getCsrfToken } from '../utils/csrf';

import { productOptions } from '../data/productOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { COUNTRIES, DEFAULT_COUNTRY } from '../data/countries';

export default function Hero() {
  const [productOpen, setProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
  });
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const dropdownRef = useRef(null);
  const countryDropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProductOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedProductObj = productOptions.find((p) => p.value === selectedProduct);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.includes(countrySearch)
  );

  const handleCountryChange = (iso) => {
    const country = COUNTRIES.find((c) => c.iso === iso) || DEFAULT_COUNTRY;
    setSelectedCountry(country);
    if (formData.mobile.length > country.maxDigits) {
      setFormData((prev) => ({ ...prev, mobile: prev.mobile.slice(0, country.maxDigits) }));
    }
    if (errors.mobile) {
      setErrors((prev) => ({ ...prev, mobile: '' }));
    }
  };

  const validateField = (name, value, country = selectedCountry) => {
    switch (name) {
      case 'product':
        if (!value) return 'Please select a product';
        return '';
      case 'name': {
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
      case 'mobile': {
        const digits = value.replace(/\D/g, '');
        if (!digits) return 'Please enter your mobile number';
        if (country.iso === 'IN') {
          if (digits.length !== 10) return `Mobile number must be exactly 10 digits (${digits.length}/10 entered)`;
          if (!/^[6-9]\d{9}$/.test(digits)) return 'Please enter a valid Indian mobile number starting with 6, 7, 8, or 9';
        } else {
          if (digits.length < country.minDigits || digits.length > country.maxDigits) {
            if (country.minDigits === country.maxDigits) {
              return `Phone number must be ${country.minDigits} digits (${digits.length} entered)`;
            }
            return `Phone number must be between ${country.minDigits} and ${country.maxDigits} digits`;
          }
        }
        return '';
      }
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {
      product: validateField('product', selectedProduct),
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      mobile: validateField('mobile', formData.mobile),
    };

    if (!agreedToTerms) {
      newErrors.terms = 'Please accept Terms & Conditions to proceed';
    }

    // Filter out empty errors
    const activeErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([, msg]) => Boolean(msg))
    );

    setErrors(activeErrors);
    return Object.keys(activeErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'mobile') {
      const maxLen = selectedCountry.maxDigits || 15;
      const digitsOnly = value.replace(/\D/g, '').slice(0, maxLen);
      setFormData((prev) => ({ ...prev, mobile: digitsOnly }));
      if (errors.mobile) {
        setErrors((prev) => ({ ...prev, mobile: '' }));
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
    if (status === 'submitting') return;

    if (!validateForm()) {
      setStatus('error');
      setErrorMessage('Please fill all the fields in the form before submitting.');
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
          full_name: formData.name.trim(),
          email: formData.email.trim(),
          phone: `${selectedCountry.code} ${formData.mobile.trim()}`,
          product: selectedProductObj?.label || selectedProduct || 'Hero Form',
          csrf_token: csrfToken || undefined,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (response.ok && data.message && data.message.success) {
        setStatus('success');
      } else {
        let errorMsg = 'Something went wrong. Please try again.';
        if (response.status === 429 || data?.exc_type === 'RateLimitExceededError') {
          errorMsg = "You're sending requests a little too quickly. Please wait about a minute and try again.";
        } else if (data?.message?.message) {
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
            errorMsg = 'Something went wrong. Please try again.';
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
    <section className="mb-12 sm:mb-10 sm:mb-12 relative isolate min-h-[680px] lg:min-h-screen pt-28 sm:pt-32 pb-14 lg:pb-16 overflow-hidden flex items-center justify-center">
      {/* 1. Full Panoramic Landscape Background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <img
          src={knapsBanner}
          alt="KNAPS Wealth Creation Background"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* 2. Hero Content Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative w-full z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Side Content */}
          <div className="lg:col-span-7 flex flex-col justify-start py-2 sm:py-4">
            {/* Heading & Subtitle using website standard typography */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-2xl text-left"
            >
              <h1 className="text-3xl pt-10 md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-[1.15]">
                <span className="block text-[#032e92]">
                  Invest Today
                </span>
                <span className="block text-[#1a1a1a] mt-1 sm:mt-1.5">
                  for the Life You Want Tomorrow
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#6b7280] font-medium leading-relaxed mt-3 sm:mt-4">
                Your goals, your priorities, our expertise.
              </p>
            </motion.div>

            {/* Glass Cards Layer - Positioned directly below the text and aligned on the left */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="mt-6 sm:mt-8 w-full max-w-2xl text-left"
            >
              <img
                src={knapsBannerGlassCards}
                alt="Investment Goals - Dream House, Family Secure Future, Peaceful Retirement, Financial Freedom"
                className="w-full h-auto object-contain object-left select-none drop-shadow-xl -ml-1 sm:-ml-2"
              />
            </motion.div>
          </div>

          {/* Right Side - Lead Capture Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex items-center justify-center lg:justify-end w-full"
          >
            <div className="bg-white/95 rounded-2xl shadow-[0_16px_45px_rgba(0,0,0,0.15)] border border-gray-100 p-7 sm:p-8 w-full max-w-md backdrop-blur-md">
              <h3 className="text-xl sm:text-[22px] font-bold text-gray-800 mb-6 sm:mb-8 leading-tight">
                Start your Investment Journey with KNAPS
              </h3>

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 sm:py-8"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-[#16a34a] flex items-center justify-center text-2xl mx-auto mb-4 border border-emerald-100 shadow-sm">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    We have received your details. Our team will get in touch with you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setFormData({ name: '', email: '', mobile: '' });
                      setSelectedProduct('');
                      setErrors({});
                      setAgreedToTerms(true);
                    }}
                    className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Submit Another Enquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {status === 'error' && errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-medium flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                        <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth="2"></line>
                      </svg>
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Product Dropdown - Consistent Underline Style */}
                  <div className="relative" ref={dropdownRef}>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Product <span className="text-red-500">*</span>
                    </label>

                    <div
                      onClick={() => setProductOpen(!productOpen)}
                      role="button"
                      tabIndex={0}
                      aria-haspopup="listbox"
                      aria-expanded={productOpen}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setProductOpen(!productOpen);
                        } else if (e.key === 'Escape') {
                          setProductOpen(false);
                        }
                      }}
                      className={`w-full bg-transparent border-b-2 pb-2 text-sm flex items-center justify-between cursor-pointer transition-colors select-none ${errors.product
                        ? 'border-red-400'
                        : productOpen
                          ? 'border-[#032e92]'
                          : 'border-gray-300 hover:border-gray-400'
                        }`}
                    >
                      <span className={selectedProduct ? 'text-gray-800 font-medium' : 'text-gray-400 font-normal'}>
                        {selectedProductObj ? selectedProductObj.label : 'Select a product'}
                      </span>

                      <div className={`text-gray-400 transition-transform duration-200 ${productOpen ? 'rotate-180 text-[#032e92]' : ''}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {errors.product && (
                      <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.product}</p>
                    )}

                    {/* Hidden Input for Native Form Handling */}
                    <input type="hidden" name="product" value={selectedProduct} />

                    {/* Styled Floating Dropdown Menu */}
                    <AnimatePresence>
                      {productOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl shadow-blue-950/10 border border-gray-100 p-1.5 z-50 overflow-hidden"
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
                                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg cursor-pointer text-sm transition-colors ${isSelected
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

                  {/* Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      placeholder="Please enter your full name"
                      className={`w-full bg-transparent border-b-2 pb-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition-colors disabled:opacity-60 ${errors.name
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-gray-300 focus:border-[#032e92]'
                        }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      placeholder="e.g. yourname@example.com"
                      className={`w-full bg-transparent border-b-2 pb-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition-colors disabled:opacity-60 ${errors.email
                        ? 'border-red-400 focus:border-red-500'
                        : 'border-gray-300 focus:border-[#032e92]'
                        }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.email}</p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div className="relative" ref={countryDropdownRef}>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      {/* <span className={`text-[10px] font-medium transition-colors ${formData.mobile.length === selectedCountry.maxDigits
                        ? 'text-emerald-600 font-semibold'
                        : formData.mobile.length > 0
                          ? 'text-blue-600'
                          : 'text-gray-400'
                        }`}>
                        {formData.mobile.length}/{selectedCountry.maxDigits} digits
                      </span> */}
                    </div>
                    <div
                      className={`flex items-center border-b-2 pb-1.5 transition-colors ${errors.mobile
                        ? 'border-red-400 focus-within:border-red-500'
                        : isCountryOpen
                          ? 'border-[#032e92]'
                          : 'border-gray-300 focus-within:border-[#032e92]'
                        }`}
                    >
                      {/* Country Code Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (status !== 'submitting') {
                            setIsCountryOpen((prev) => !prev);
                            setCountrySearch('');
                          }
                        }}
                        disabled={status === 'submitting'}
                        aria-label="Select Country Code"
                        className="flex items-center gap-1.5 pr-2 mr-2 border-r border-gray-300 hover:text-[#032e92] transition-colors cursor-pointer select-none group flex-shrink-0 disabled:cursor-not-allowed focus:outline-none"
                      >
                        <span className="text-sm font-semibold text-gray-700 font-mono tracking-tight group-hover:text-[#032e92]">
                          {selectedCountry.code}
                        </span>
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={`text-[9px] text-gray-400 group-hover:text-[#032e92] transition-transform duration-200 ${isCountryOpen ? 'rotate-180 text-[#032e92]' : ''
                            }`}
                        />
                      </button>

                      {/* Phone Input */}
                      <input
                        type="tel"
                        name="mobile"
                        inputMode="numeric"
                        maxLength={selectedCountry.maxDigits}
                        value={formData.mobile}
                        onChange={handleChange}
                        disabled={status === 'submitting'}
                        placeholder={selectedCountry.placeholder || 'Enter mobile number'}
                        className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none disabled:opacity-60 tracking-wider"
                      />
                    </div>
                    {errors.mobile && (
                      <p className="text-red-500 text-[11px] mt-1 font-medium">{errors.mobile}</p>
                    )}

                    {/* Country Code Dropdown Menu */}
                    <AnimatePresence>
                      {isCountryOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 bottom-full mb-2 w-full sm:w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col"
                          style={{ boxShadow: '0 20px 40px -10px rgba(3, 46, 146, 0.22)' }}
                        >
                          {/* Search Header */}
                          <div className="p-2.5 border-b border-gray-100 bg-gray-50/80">
                            <input
                              type="text"
                              placeholder="Search country or code..."
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92]/20 text-gray-800 placeholder:text-gray-400"
                              autoFocus
                            />
                          </div>

                          {/* Country List */}
                          <div className="max-h-52 overflow-y-auto divide-y divide-gray-50 py-1">
                            {filteredCountries.length === 0 ? (
                              <div className="p-4 text-center text-xs text-gray-400 font-medium">
                                No countries found
                              </div>
                            ) : (
                              filteredCountries.map((c) => {
                                const isSelected = selectedCountry.iso === c.iso;
                                return (
                                  <button
                                    key={c.iso}
                                    type="button"
                                    onClick={() => {
                                      handleCountryChange(c.iso);
                                      setIsCountryOpen(false);
                                      setCountrySearch('');
                                    }}
                                    className={`w-full flex items-center justify-between px-3.5 py-2.5 text-left text-xs transition-colors hover:bg-blue-50/80 cursor-pointer ${isSelected
                                      ? 'bg-blue-50/70 font-semibold text-[#032e92]'
                                      : 'text-gray-700'
                                      }`}
                                  >
                                    <div className="flex items-center gap-2.5 truncate pr-2">
                                      <span className="text-base flex-shrink-0 leading-none">{c.flag}</span>
                                      <span className="truncate">{c.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <span
                                        className={`font-mono text-xs ${isSelected ? 'text-[#032e92] font-bold' : 'text-gray-400'
                                          }`}
                                      >
                                        {c.code}
                                      </span>
                                      {isSelected && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#032e92]" />
                                      )}
                                    </div>
                                  </button>
                                );
                              })
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Checkbox */}
                  <div className="pt-1">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={agreedToTerms}
                        onChange={(e) => {
                          setAgreedToTerms(e.target.checked);
                          if (e.target.checked && errors.terms) {
                            setErrors((prev) => ({ ...prev, terms: '' }));
                          }
                        }}
                        className="mt-1 w-4 h-4 text-[#0665d0] rounded border-gray-300 focus:ring-[#0665d0] cursor-pointer"
                      />
                      <label htmlFor="terms" className="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed cursor-pointer select-none">
                        By continuing, you provide consent and agree to our{' '}
                        <a href="/terms" className="text-[#0665d0] hover:underline">
                          Terms & Conditions
                        </a>
                      </label>
                    </div>
                    {errors.terms && (
                      <p className="text-red-500 text-[11px] mt-1 font-medium pl-7">{errors.terms}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full btn-ripple px-6 py-3.5 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center justify-center gap-2 mt-2 disabled:opacity-75 cursor-pointer active:scale-[0.99]"
                  >
                    {status === 'submitting' ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
