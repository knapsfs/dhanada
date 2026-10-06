import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPhone, faEnvelope, faClock, faArrowRight, faCircleCheck, faChevronDown, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { getCsrfToken } from '../../utils/csrf';
import { productOptions } from '../../data/productOptions';

export default function LuxuryContactSection() {
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
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
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
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
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
    <section className="relative pt-4 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f0f4fd] text-[#032e92] font-semibold text-xs tracking-widest uppercase mb-4">
            Get In Touch
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-[#0f172a] leading-[1.1] tracking-tight">
            Talk To Our <span className="text-[#032e92]">Financial Experts</span>
          </h2>
        </div> */}

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-8 items-start">
          {/* LEFT SIDE (40%) - Luxury Contact Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="lg:w-[40%] flex flex-col justify-center"
          >
            <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] shadow-xl shadow-blue-900/5 border border-gray-100 relative overflow-hidden group">
              {/* Premium Office Image */}
              <div className="w-full h-46 lg:h-54 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
                  alt="Our Headquarters"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/90 via-[#0a192f]/20 to-transparent"></div>
                <div className="absolute bottom-6 left-8 lg:left-10 text-left">
                  <h3 className="text-white text-2xl font-bold tracking-wide">KNAPS Private Limited</h3>
                  <p className="text-blue-200 text-sm mt-1 font-medium tracking-wider uppercase">New Delhi, India</p>
                </div>
              </div>

              <div className="p-8 lg:p-10 space-y-8">
                <div className="flex items-start gap-6 group/item relative cursor-pointer">
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#c10000] transition-all duration-300 group-hover/item:h-8 rounded-r-md"></div>
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#032e92] shadow-md border border-gray-50 transition-transform duration-300 group-hover/item:scale-110 group-hover/item:bg-[#032e92] group-hover/item:text-white">
                    <FontAwesomeIcon icon={faLocationDot} className="text-xl" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Office</h5>
                    <p className="text-[#0a192f] font-medium text-[17px] leading-relaxed max-w-[250px]">DG-206A, DLF Galleria, Plot No 1B, Mayur Vihar Phase - 1, East Delhi, Delhi - 110091</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group/item relative cursor-pointer">
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#c10000] transition-all duration-300 group-hover/item:h-8 rounded-r-md"></div>
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#032e92] shadow-md border border-gray-50 transition-transform duration-300 group-hover/item:scale-110 group-hover/item:bg-[#032e92] group-hover/item:text-white">
                    <FontAwesomeIcon icon={faPhone} className="text-xl" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phone</h5>
                    <p className="text-[#0a192f] font-medium text-[17px] leading-relaxed">+91-9990243143</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group/item relative cursor-pointer">
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#c10000] transition-all duration-300 group-hover/item:h-8 rounded-r-md"></div>
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#032e92] shadow-md border border-gray-50 transition-transform duration-300 group-hover/item:scale-110 group-hover/item:bg-[#032e92] group-hover/item:text-white">
                    <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email</h5>
                    <p className="text-[#0a192f] font-medium text-[17px] leading-relaxed">contact@knaps.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group/item relative cursor-pointer">
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#c10000] transition-all duration-300 group-hover/item:h-8 rounded-r-md"></div>
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#032e92] shadow-md border border-gray-50 transition-transform duration-300 group-hover/item:scale-110 group-hover/item:bg-[#032e92] group-hover/item:text-white">
                    <FontAwesomeIcon icon={faClock} className="text-xl" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Working Hours</h5>
                    <p className="text-[#0a192f] font-medium text-[17px] leading-relaxed">Mon - Fri, 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE (60%) - Large Elegant Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
            className="lg:w-[60%] relative"
          >
            <div className="bg-white p-10 lg:p-12 rounded-[40px] shadow-2xl shadow-blue-900/5 border border-gray-100 relative z-10">
              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-green-100 text-green-500 flex items-center justify-center text-3xl mx-auto mb-4">
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h4>
                  <p className="text-gray-500 text-base max-w-md mx-auto mb-6">
                    We've received your request. One of our senior wealth advisors will connect with you shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus('idle');
                      setSelectedProduct('');
                      setFormData({ fullName: '', phone: '', email: '', message: '', consent: true });
                    }}
                    className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status === 'error' && errorMessage && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-medium">
                      {errorMessage}
                    </div>
                  )}

                  {/* Standardized Product Field */}
                  <div className="relative" ref={dropdownRef}>
                    <label className="block text-[11px] font-bold text-[#0a192f] uppercase tracking-widest mb-2">
                      Product <span className="text-red-500">*</span>
                    </label>
                    <div
                      onClick={() => !status.startsWith('submit') && setProductOpen(!productOpen)}
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
                      className={`w-full bg-[#f8fafc] border rounded-xl px-5 py-4 flex items-center justify-between cursor-pointer transition-colors select-none ${errors.product
                        ? 'border-red-400 bg-red-50/20'
                        : productOpen
                          ? 'border-[#032e92] ring-1 ring-[#032e92] bg-white'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <span className={selectedProduct ? 'text-gray-900 font-medium' : 'text-gray-400 font-normal'}>
                        {selectedProductObj ? selectedProductObj.label : 'Select a product'}
                      </span>
                      <FontAwesomeIcon
                        icon={faChevronDown}
                        className={`text-gray-400 text-xs transition-transform duration-200 ${productOpen ? 'rotate-180 text-[#032e92]' : ''
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="group">
                      <label className="block text-[11px] font-bold text-[#0a192f] uppercase tracking-widest mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ratan Tata"
                        value={formData.fullName}
                        onChange={(e) => {
                          setFormData({ ...formData, fullName: e.target.value });
                          if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                        }}
                        className={`w-full bg-[#f8fafc] border rounded-xl px-5 py-4 focus:outline-none focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] transition-colors placeholder-gray-400 ${errors.fullName ? 'border-red-400' : 'border-gray-200 text-gray-900'
                          }`}
                      />
                      {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                    </div>

                    {/* Phone */}
                    <div className="group">
                      <label className="block text-[11px] font-bold text-[#0a192f] uppercase tracking-widest mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center">
                        <span className="text-sm font-semibold text-gray-400 pb-0 mr-2 select-none">+91</span>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="9990243143"
                          value={formData.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setFormData({ ...formData, phone: val });
                            if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                          }}
                          className={`w-full bg-[#f8fafc] border rounded-xl px-5 py-4 focus:outline-none focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] transition-colors placeholder-gray-400 ${errors.phone ? 'border-red-400' : 'border-gray-200 text-gray-900'
                            }`}
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label className="block text-[11px] font-bold text-[#0a192f] uppercase tracking-widest mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      className={`w-full bg-[#f8fafc] border rounded-xl px-5 py-4 focus:outline-none focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] transition-colors placeholder-gray-400 ${errors.email ? 'border-red-400' : 'border-gray-200 text-gray-900'
                        }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  {/* Message */}
                  <div className="group">
                    <label className="block text-[11px] font-bold text-[#0a192f] uppercase tracking-widest mb-2">Message (Optional)</label>
                    <textarea
                      rows="3"
                      placeholder="Briefly describe your financial objectives..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#f8fafc] border border-gray-200 text-gray-900 rounded-xl px-5 py-4 focus:outline-none focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] transition-colors placeholder-gray-400 resize-none"
                    ></textarea>
                  </div>

                  {/* Privacy Checkbox */}
                  <div className="flex items-start gap-4 pt-1">
                    <input
                      type="checkbox"
                      id="privacy-policy"
                      checked={formData.consent}
                      onChange={(e) => {
                        setFormData({ ...formData, consent: e.target.checked });
                        if (errors.consent) setErrors((prev) => ({ ...prev, consent: '' }));
                      }}
                      className="mt-1.5 w-5 h-5 accent-[#032e92] cursor-pointer"
                    />
                    <label htmlFor="privacy-policy" className="text-[14px] text-gray-500 leading-relaxed cursor-pointer select-none">
                      By submitting the details, you consent to be contacted by KNAPS team.
                    </label>
                  </div>
                  {errors.consent && <p className="text-red-500 text-xs">{errors.consent}</p>}

                  {/* Submit Button */}
                  <div>
                    <button
                      type="submit"
                      disabled={status === 'submitting'}
                      className="group relative overflow-hidden bg-[#032e92] text-white font-bold rounded-xl px-8 py-4 flex items-center justify-center gap-3 w-full shadow-xl shadow-[#032e92]/20 transition-transform hover:-translate-y-1 cursor-pointer disabled:opacity-75"
                    >
                      {status === 'submitting' ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} className="animate-spin relative z-10" />
                          <span className="relative z-10 text-[15px] tracking-wide">Scheduling Consultation...</span>
                        </>
                      ) : (
                        <>
                          <span className="relative z-10 text-[15px] tracking-wide">Talk to Us</span>
                        </>
                      )}
                      <div className="absolute inset-0 bg-[#021d63] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0"></div>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
