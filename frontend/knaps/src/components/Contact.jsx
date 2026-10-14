import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhoneAlt, faEnvelope, faClock, faCircleCheck, faChevronDown, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { getCsrfToken } from '../utils/csrf';
import { productOptions } from '../data/productOptions';

export default function Contact() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productOpen, setProductOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
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
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    const cleanPhone = formData.phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number';
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
          full_name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          product: selectedProductObj?.label || selectedProduct || 'Contact Page',
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
    <section id="contact" className="py-12 sm:py-16 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full bg-[#eef5ff] text-[#032e92] font-semibold text-sm mb-4 uppercase tracking-wider"
          >
            Get In Touch
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a]"
          >
            Connect With Our <span className="text-[#032e92]">Experts</span>
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left - Contact Form (Takes 3 columns) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#eef5ff] to-transparent rounded-bl-full -z-10"></div>

            <h3 className="text-2xl font-bold text-gray-900 mb-6">Schedule Consultation</h3>

            {status === 'success' ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-500 flex items-center justify-center text-3xl mx-auto mb-4">
                  <FontAwesomeIcon icon={faCircleCheck} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Thank you!</h4>
                <p className="text-gray-500 text-sm">We've received your request. Our team will get back to you shortly.</p>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Product <span className="text-red-500">*</span>
                  </label>
                  <div
                    onClick={() => setProductOpen(!productOpen)}
                    role="button"
                    tabIndex={0}
                    aria-haspopup="listbox"
                    aria-expanded={productOpen}
                    className={`w-full px-5 py-4 rounded-xl bg-gray-50 border flex items-center justify-between cursor-pointer transition-all ${
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

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      className={`w-full px-5 py-4 rounded-xl bg-gray-50 border focus:border-[#032e92] focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 transition-all outline-none ${
                        errors.name ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      className={`w-full px-5 py-4 rounded-xl bg-gray-50 border focus:border-[#032e92] focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 transition-all outline-none ${
                        errors.email ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center">
                    <span className="text-sm font-semibold text-gray-400 mr-2 select-none">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="98765 43210"
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({ ...formData, phone: val });
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                      }}
                      className={`w-full px-5 py-4 rounded-xl bg-gray-50 border focus:border-[#032e92] focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 transition-all outline-none ${
                        errors.phone ? 'border-red-400' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea
                    rows="4"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-5 py-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-[#032e92] focus:bg-white focus:ring-2 focus:ring-[#032e92]/20 transition-all outline-none resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full btn-ripple px-6 py-3.5 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {status === 'submitting' ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                      <span>Requesting Consultation...</span>
                    </>
                  ) : (
                    'Request Consultation'
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Right - Office Info (Takes 2 columns) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="bg-[#032e92] rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full z-0"></div>

              <h3 className="text-2xl font-bold mb-8 relative z-10">Our Office</h3>

              <div className="space-y-6 relative z-10">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="text-white" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-blue-200 mb-1">Headquarters</h5>
                    <p className="text-white leading-relaxed">
                      14th Floor, Financial District Tower,<br />
                      BKC, Mumbai, Maharashtra 400051
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faPhoneAlt} className="text-white" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-blue-200 mb-1">Phone</h5>
                    <p className="text-white">+91 (22) 1234 5678</p>
                    <p className="text-white">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faEnvelope} className="text-white" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-blue-200 mb-1">Email</h5>
                    <p className="text-white">contact@Knaps.com</p>
                    <p className="text-white">support@Knaps.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faClock} className="text-white" />
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-blue-200 mb-1">Working Hours</h5>
                    <p className="text-white">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-white">Sat: 10:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gray-200 rounded-3xl h-64 overflow-hidden border border-gray-300 relative group">
              <div className="absolute inset-0 bg-black/5 flex items-center justify-center">
                <p className="text-gray-500 font-medium">Interactive Map Integration</p>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15082.979148443319!2d72.8559074!3d19.0743606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e317c37617%3A0xc31920cd704953c8!2sBandra%20Kurla%20Complex%2C%20Bandra%20East%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(100%) contrast(1.2)' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
