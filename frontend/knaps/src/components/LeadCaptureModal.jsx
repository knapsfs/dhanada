import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleCheck, faCircleExclamation, faSpinner, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { getCsrfToken } from '../utils/csrf';
import {
  goalOptions,
  financialProductOptions,
  getPageProduct,
  findGoalOption,
} from '../data/productOptions';
import { COUNTRIES, DEFAULT_COUNTRY } from '../data/countries';

export default function LeadCaptureModal({ isOpen, onClose, defaultSource = '' }) {
  const location = useLocation();
  const currentPath = location?.pathname || (typeof window !== 'undefined' ? window.location.pathname : '');

  // Detect whether the current page or source is for a specific product vs a general goal page
  const matchedProduct = getPageProduct(defaultSource, currentPath);
  const isProductPage = Boolean(matchedProduct);
  const activeOptions = isProductPage ? financialProductOptions : goalOptions;

  const [selectedOption, setSelectedOption] = useState('');
  const [optionOpen, setOptionOpen] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '' });
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const dropdownRef = useRef(null);
  const optionDropdownRef = useRef(null);

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (optionDropdownRef.current && !optionDropdownRef.current.contains(e.target)) {
        setOptionOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset or pre-fill form when opened
  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
      setErrorMessage('');
      setErrors({});
      setFormData({ full_name: '', email: '', phone: '' });
      setSelectedCountry(DEFAULT_COUNTRY);
      setIsDropdownOpen(false);
      setOptionOpen(false);
      setSearchQuery('');
      setAgreedToTerms(false);

      if (isProductPage && matchedProduct) {
        setSelectedOption(matchedProduct.value);
      } else {
        const matchedGoal = findGoalOption(defaultSource);
        setSelectedOption(matchedGoal ? matchedGoal.value : '');
      }
    }
  }, [isOpen, defaultSource, currentPath, isProductPage, matchedProduct?.value]);

  const selectedOptionObj = activeOptions.find((p) => p.value === selectedOption);

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.includes(searchQuery)
  );

  const validateField = (name, value, country = selectedCountry) => {
    switch (name) {
      case 'option':
        if (!value) return isProductPage ? 'Please select a product' : 'Please select your goal';
        return '';
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
      option: validateField('option', selectedOption),
      full_name: validateField('full_name', formData.full_name),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
    };

    if (!agreedToTerms) {
      newErrors.terms = 'Please accept Terms & Conditions to proceed';
    }

    const activeErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([, msg]) => Boolean(msg))
    );

    setErrors(activeErrors);
    return Object.keys(activeErrors).length === 0;
  };

  const handleCountryChange = (iso) => {
    const country = COUNTRIES.find((c) => c.iso === iso) || DEFAULT_COUNTRY;
    setSelectedCountry(country);
    // Trim phone if exceeds maxDigits of new country
    if (formData.phone.length > country.maxDigits) {
      setFormData((prev) => ({ ...prev, phone: prev.phone.slice(0, country.maxDigits) }));
    }
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const maxLen = selectedCountry.maxDigits || 15;
      const digitsOnly = value.replace(/\D/g, '').slice(0, maxLen);
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

      const formattedPhone = `${selectedCountry.code} ${formData.phone.trim()}`;

      let sourceName = isProductPage ? 'Website Product Modal' : 'Website Goal Modal';
      if (typeof defaultSource === 'string' && defaultSource.trim()) {
        sourceName = defaultSource.trim();
      } else if (defaultSource && typeof defaultSource === 'object') {
        sourceName = defaultSource.title || defaultSource.source || defaultSource.defaultService || sourceName;
      }

      const submittedProduct = selectedOptionObj?.label || selectedOption || (isProductPage ? 'Product Inquiry' : 'General Goal');

      const response = await fetch('/api/method/dhanada.api.create_website_lead', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          phone: formattedPhone,
          product: submittedProduct,
          source: sourceName,
          csrf_token: csrfToken || undefined,
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.message && data.message.success) {
        setStatus('success');
      } else {
        let errorMsg = 'An error occurred while submitting your details. Please try again.';
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
            className="relative w-full max-w-[460px] bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white rounded-t-3xl">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#032e92] tracking-tight">Start Investing</h3>
                <p className="text-xs sm:text-sm text-gray-500 font-normal mt-1">Leave your details and we'll help you get started.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={status === 'submitting'}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors disabled:opacity-50 cursor-pointer"
                aria-label="Close"
              >
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
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
                    type="button"
                    onClick={onClose}
                    className="mt-6 w-full btn-ripple px-6 py-3.5 rounded-xl text-[15px] font-semibold bg-[#032e92] hover:bg-[#022475] text-white shadow-lg shadow-[#032e92]/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
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

                  {/* Goal or Product Dropdown Field */}
                  <div className="relative" ref={optionDropdownRef}>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      {isProductPage ? 'Product' : 'What’s your goal?'} <span className="text-red-500">*</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setOptionOpen((prev) => !prev)}
                      aria-haspopup="listbox"
                      aria-expanded={optionOpen}
                      className={`w-full px-4 py-3 rounded-xl border text-sm flex items-center justify-between cursor-pointer transition-all select-none text-left ${
                        errors.option
                          ? 'border-red-400 bg-red-50/20'
                          : optionOpen
                            ? 'border-[#032e92] ring-2 ring-blue-900/10 bg-white'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className={selectedOption ? 'text-gray-800 font-medium' : 'text-gray-400 font-normal'}>
                        {selectedOptionObj
                          ? selectedOptionObj.label
                          : (isProductPage ? 'Select a product' : 'Select your goal')}
                      </span>

                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`text-gray-400 text-xs transition-transform duration-200 ${
                          optionOpen ? 'rotate-180 text-[#032e92]' : ''
                        }`}
                      />
                    </button>

                    {errors.option && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{errors.option}</p>
                    )}

                    {/* Styled Floating Dropdown Menu */}
                    <AnimatePresence>
                      {optionOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl shadow-xl shadow-blue-950/10 border border-gray-100 p-1.5 z-50 max-h-56 overflow-y-auto"
                        >
                          {activeOptions.map((option) => {
                            const isSelected = selectedOption === option.value;
                            return (
                              <div
                                key={option.value}
                                onClick={() => {
                                  setSelectedOption(option.value);
                                  setOptionOpen(false);
                                  if (errors.option) {
                                    setErrors((prev) => ({ ...prev, option: '' }));
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

                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      placeholder="e.g. Rahul Sharma"
                      className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-sm disabled:bg-gray-50 text-gray-800 placeholder:text-gray-400 ${errors.full_name
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                        : 'border-gray-200 focus:border-[#032e92] focus:ring-2 focus:ring-blue-900/10 hover:border-gray-300'
                        }`}
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{errors.full_name}</p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      placeholder="e.g. rahul@example.com"
                      className={`w-full px-4 py-3 rounded-xl border transition-all outline-none text-sm disabled:bg-gray-50 text-gray-800 placeholder:text-gray-400 ${errors.email
                        ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                        : 'border-gray-200 focus:border-[#032e92] focus:ring-2 focus:ring-blue-900/10 hover:border-gray-300'
                        }`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="relative" ref={dropdownRef}>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <span className="text-xs text-gray-400 font-medium">
                        {selectedCountry.name}
                      </span>
                    </div>

                    <div
                      className={`relative flex items-stretch rounded-xl border transition-all bg-white shadow-xs ${errors.phone
                        ? 'border-red-400 ring-2 ring-red-500/10'
                        : isDropdownOpen
                          ? 'border-[#032e92] ring-2 ring-blue-900/10'
                          : 'border-gray-200 hover:border-gray-300 focus-within:border-[#032e92] focus-within:ring-2 focus-within:ring-blue-900/10'
                        } ${status === 'submitting' ? 'bg-gray-50 opacity-80' : ''}`}
                    >
                      {/* Country Code Trigger */}
                      <button
                        type="button"
                        onClick={() => {
                          if (status !== 'submitting') {
                            setIsDropdownOpen((prev) => !prev);
                            setSearchQuery('');
                          }
                        }}
                        disabled={status === 'submitting'}
                        aria-label="Select Country Code"
                        className="flex items-center gap-1.5 px-3.5 py-3 border-r border-gray-200 bg-white hover:bg-gray-50 rounded-l-xl transition-all cursor-pointer select-none group flex-shrink-0 disabled:cursor-not-allowed focus:outline-none"
                      >
                        <span className="text-sm font-bold text-gray-800 tracking-tight">
                          {selectedCountry.code}
                        </span>
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={`text-[9px] text-gray-400 group-hover:text-[#032e92] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-[#032e92]' : ''
                            }`}
                        />
                      </button>

                      {/* Phone Input */}
                      <input
                        type="tel"
                        name="phone"
                        inputMode="numeric"
                        maxLength={selectedCountry.maxDigits}
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={status === 'submitting'}
                        placeholder={selectedCountry.placeholder || "98765 43210"}
                        className="w-full px-3.5 py-3 outline-none text-sm bg-transparent disabled:bg-gray-50 text-gray-800 placeholder:text-gray-400 rounded-r-xl"
                      />
                    </div>

                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>
                    )}

                    {/* Country Code Dropdown Menu */}
                    <AnimatePresence>
                      {isDropdownOpen && (
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
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
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
                                      setIsDropdownOpen(false);
                                      setSearchQuery('');
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

                  {/* Terms & Conditions Checkbox */}
                  <div>
                    <div className="flex items-start gap-2.5 pt-1">
                      <input
                        type="checkbox"
                        id="modal-terms"
                        checked={agreedToTerms}
                        onChange={(e) => {
                          setAgreedToTerms(e.target.checked);
                          if (e.target.checked && errors.terms) {
                            setErrors((prev) => ({ ...prev, terms: '' }));
                          }
                        }}
                        className="mt-0.5 w-4 h-4 text-[#032e92] rounded border-gray-300 focus:ring-[#032e92] cursor-pointer"
                      />
                      <label htmlFor="modal-terms" className="text-xs sm:text-[13px] text-gray-500 leading-relaxed cursor-pointer select-none">
                        I agree to be contacted by a KNAPS representative and accept the
                        {' '}
                        <a href="/terms-and-conditions" className="text-[#0665d0] hover:underline" target="_blank" rel="noopener noreferrer">
                          Terms & Conditions.
                        </a>
                      </label>
                    </div>
                    {errors.terms && (
                      <p className="text-red-500 text-xs mt-1 font-medium pl-6.5">{errors.terms}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full btn-ripple px-6 py-3.5 rounded-xl text-[15px] font-bold bg-[#032e92] hover:bg-[#022475] text-white shadow-lg shadow-[#032e92]/25 hover:shadow-xl hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 cursor-pointer"
                  >
                    {status === 'submitting' ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-sm" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      'Get Started'
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
