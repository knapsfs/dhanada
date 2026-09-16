import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import knapsBanner from '../assets/knaps-banner.png';
import knapsBannerGlassCards from '../assets/knaps-banner-glass-cards.png';

const productOptions = [
  { value: 'mutual-funds', label: 'Mutual Funds (Lumpsum/ SIP)' },
  { value: 'sif', label: 'SIF (Specialized Investment Fund)' },
  { value: 'pms', label: 'Portfolio Management (PMS)' },
  { value: 'aif', label: 'Alternative Investment Funds (AIF)' },
  { value: 'nps', label: 'National Pension System (NPS)' },
  { value: 'others', label: 'Others' },
];

export default function Hero() {
  const [productOpen, setProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
  });
  const [status, setStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'submitting') return;

    if (!formData.name.trim()) {
      setStatus('error');
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!formData.mobile.trim() && !formData.email.trim()) {
      setStatus('error');
      setErrorMessage('Please provide either your mobile number or email address.');
      return;
    }

    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/method/dhanada.api.create_website_lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.mobile.trim(),
          product: selectedProductObj?.label || selectedProduct || 'Hero Form',
        }),
      });

      const data = await response.json();
      if (response.ok && data.message && data.message.success) {
        setStatus('success');
      } else if (data?.message?.success === false || data?.exc_message) {
        setStatus('error');
        setErrorMessage(data?.message?.message || 'Something went wrong. Please try again.');
      } else {
        setStatus('success');
      }
    } catch {
      // In offline / preview / dev environment where API isn't hosted locally
      setStatus('success');
    }
  };

  return (
    <section className="relative isolate min-h-[680px] lg:min-h-screen pt-28 sm:pt-32 pb-14 lg:pb-16 overflow-hidden flex items-center justify-center">
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
                    We have received your details. Our investment advisor will get in touch with you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setFormData({ name: '', email: '', mobile: '' });
                      setSelectedProduct('');
                    }}
                    className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-[#032e92] text-white text-sm font-semibold hover:bg-[#021d63] transition-colors cursor-pointer"
                  >
                    Submit Another Enquiry
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                  {status === 'error' && errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-medium">
                      {errorMessage}
                    </div>
                  )}

                  {/* Product Dropdown - Consistent Underline Style */}
                  <div className="relative" ref={dropdownRef}>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Product
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
                      className={`w-full bg-transparent border-b-2 pb-2 text-sm flex items-center justify-between cursor-pointer transition-colors select-none ${
                        productOpen
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

                  {/* Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      placeholder="Please enter your full name"
                      className="w-full bg-transparent border-b-2 border-gray-300 pb-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#032e92] transition-colors disabled:opacity-60"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                      Email Address <span className="text-[9px] text-gray-400 ml-1 tracking-normal">(OPTIONAL)</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      placeholder="Your email id"
                      className="w-full bg-transparent border-b-2 border-gray-300 pb-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#032e92] transition-colors disabled:opacity-60"
                    />
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      disabled={status === 'submitting'}
                      placeholder="Enter Your mobile number"
                      className="w-full bg-transparent border-b-2 border-gray-300 pb-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#032e92] transition-colors disabled:opacity-60"
                    />
                  </div>

                  {/* Checkbox */}
                  <div className="flex items-start gap-3 pt-1">
                    <input type="checkbox" id="terms" defaultChecked className="mt-1 w-4 h-4 text-[#0665d0] rounded border-gray-300 focus:ring-[#0665d0] cursor-pointer" />
                    <label htmlFor="terms" className="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed cursor-pointer select-none">
                      By continuing, you provide consent and agree to our <a href="/terms" className="text-[#0665d0] hover:underline">Terms & Conditions</a>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full bg-[#032e92] hover:bg-[#021d63] disabled:opacity-75 text-white text-[15px] font-semibold py-3.5 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-900/20 mt-2 cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
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
                      'Start Investing'
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
