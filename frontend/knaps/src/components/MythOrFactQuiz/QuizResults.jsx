import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { getCsrfToken } from '../../utils/csrf';
import { productOptions } from '../../data/productOptions';

export default function QuizResults({ score, total, onRetake, isModal = false, onClose }) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [productOpen, setProductOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    consent: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedUser, setSubmittedUser] = useState(null);
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

  const getScoreDetails = () => {
    const pct = total > 0 ? (score / total) * 100 : 0;
    if (pct >= 80) {
      return {
        title: "Pro",
        colorClass: "text-emerald-300",
        desc: "You demonstrated an exceptional understanding of the concepts covered in this quiz."
      };
    } else if (pct >= 60) {
      return {
        title: "Intermediate",
        colorClass: "text-sky-300",
        desc: "You have a solid understanding of several core financial concepts."
      };
    } else if (pct >= 40) {
      return {
        title: "Begineer",
        colorClass: "text-amber-300",
        desc: "You have a developing understanding of important investment concepts."
      };
    } else {
      return {
        title: "Getting Started",
        colorClass: "text-rose-300",
        desc: "You're building your financial knowledge. Keep exploring the fundamentals."
      };
    }
  };

  const details = getScoreDetails();

  const validate = () => {
    const newErrors = {};

    if (!selectedProduct) {
      newErrors.product = 'Please select a product';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }

    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    const phoneClean = formData.phone.replace(/[^0-9]/g, '');
    if (!phoneClean || phoneClean.length !== 10) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.consent) {
      newErrors.consent = 'You must agree to be contacted to proceed.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      const csrfToken = await getCsrfToken();
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      if (csrfToken) {
        headers['X-Frappe-CSRF-Token'] = csrfToken;
      }

      const payload = {
        full_name: formData.name.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: `+91 ${formData.phone.trim()}`,
        product: selectedProductObj?.label || selectedProduct || 'General Investment',
        source: 'Myth or Fact Quiz',
        notes: `Quiz Score: ${score}/${total} (${details.title})`,
        csrf_token: csrfToken || undefined
      };

      const response = await fetch('/api/method/dhanada.api.create_website_lead', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && (data?.message?.success || data?.success || data?.message?.name)) {
        setIsSubmitted(true);
        setSubmittedUser({
          name: formData.name.trim(),
          email: formData.email.trim()
        });
      } else {
        let msg = 'Could not submit your details. Please check your details and try again.';
        if (response.status === 429 || data?.exc_type === 'RateLimitExceededError') {
          msg = "You're sending requests a little too quickly. Please wait a minute and try again.";
        } else if (data?.message?.message) {
          msg = data.message.message;
        } else if (data?.exc_message) {
          msg = data.exc_message;
        }
        setApiError(msg);
      }
    } catch (err) {
      console.error('Quiz lead submission error:', err);
      setApiError("We couldn't connect to the server. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`max-w-4xl mx-auto w-full bg-white rounded-2xl overflow-hidden shadow-xl shadow-blue-900/10 border border-gray-100 flex flex-col md:flex-row ${isModal ? 'my-1' : ''
        }`}
    >
      {/* Left Column: Quiz Results */}
      <div className={`md:w-5/12 bg-[#032e92] text-white flex flex-col justify-between ${isModal ? 'p-5 sm:p-6' : 'p-7 sm:p-8'
        }`}>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-200 text-[11px] font-bold uppercase tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Quiz Completed
          </div>

          {/* Result Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 my-2 shadow-inner">
            <div className="text-[10px] sm:text-[11px] font-bold text-blue-200 uppercase tracking-widest mb-1">
              Your Performance
            </div>
            <div className={`text-2xl sm:text-3xl font-black mb-2 tracking-tight ${details.colorClass}`}>
              {details.title}
            </div>
            <p className="text-xs sm:text-[13px] text-blue-50/95 leading-relaxed font-normal">
              {details.desc}
            </p>

            <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-blue-200">
              <span className="font-medium">Total Score</span>
              <span className="font-bold text-white font-mono bg-white/15 px-2.5 py-0.5 rounded-md">
                {score} / {total}
              </span>
            </div>

            {/* Explored concepts summary */}
            <div className="mt-3.5 pt-3 border-t border-white/15">
              <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-2">Concepts Explored</p>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-blue-100/90 font-medium">
                <span className="flex items-center gap-1">✓ Mutual Funds</span>
                <span className="flex items-center gap-1">✓ NPS Growth</span>
                <span className="flex items-center gap-1">✓ Risk Profiling</span>
                <span className="flex items-center gap-1">✓ SIF &amp; AIF</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
          <button
            type="button"
            onClick={onRetake}
            className="text-xs text-blue-200 hover:text-white transition-colors flex items-center gap-1.5 font-semibold cursor-pointer"
          >
            <span>↺ Retake Quiz</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-blue-200 hover:text-white transition-colors font-semibold cursor-pointer"
            >
              Done
            </button>
          )}
        </div>
      </div>

      {/* Right Column: Lead Form or Success Screen */}
      <div className={`md:w-7/12 ${isModal ? 'p-5 sm:p-6' : 'p-7 sm:p-9'}`}>
        {isSubmitted ? (
          <div className="text-center py-6 sm:py-8">
            <div className="w-16 h-16 bg-emerald-50 border-2 border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>

            <h3 className="font-black text-[#0a192f] text-xl sm:text-2xl mb-2">
              Thank You, {submittedUser?.name || 'Investor'}!
            </h3>

            <p className="text-gray-600 leading-relaxed text-xs sm:text-sm mb-6 max-w-md mx-auto">
              Your enquiry has been received. Our Team will connect with you shortly to help you explore the right investment products for your financial goals.
            </p>

            <div className="flex justify-center items-center gap-3">
              <button
                type="button"
                onClick={onRetake}
                className="rounded-xl font-bold text-[#032e92] bg-white border-2 border-gray-200 hover:border-[#032e92] hover:bg-gray-50 transition-colors px-6 py-2.5 text-xs sm:text-sm cursor-pointer"
              >
                Retake Quiz
              </button>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl font-bold bg-[#032e92] text-white hover:bg-[#022169] transition-colors shadow-md px-6 py-2.5 text-xs sm:text-sm cursor-pointer"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <h4 className="text-base sm:text-lg font-bold text-[#0a192f] leading-snug">
                Explore the right investment product for your goals
              </h4>
            </div>

            {apiError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
                {apiError}
              </div>
            )}

            <form onSubmit={handleSubmit} className={isModal ? 'space-y-3' : 'space-y-4'}>
              {/* Product Dropdown Field */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-xs font-bold text-gray-700 mb-1">Product *</label>
                <div
                  onClick={() => !isSubmitting && setProductOpen(!productOpen)}
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
                  className={`w-full rounded-xl border flex items-center justify-between cursor-pointer transition-all ${isModal ? 'px-3.5 py-2.5 text-xs sm:text-sm' : 'px-5 py-3.5 text-sm'
                    } ${errors.product
                      ? 'border-red-400 bg-red-50/30'
                      : productOpen
                        ? 'border-[#032e92] ring-2 ring-blue-50 bg-white'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                >
                  <span className={selectedProduct ? 'text-gray-800 font-medium' : 'text-gray-400 font-normal'}>
                    {selectedProductObj ? selectedProductObj.label : 'Select a product'}
                  </span>

                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-gray-400 text-xs transition-transform duration-200 ${productOpen ? 'rotate-180 text-[#032e92]' : ''
                      }`}
                  />
                </div>

                {errors.product && <p className="text-red-500 text-xs mt-1">{errors.product}</p>}

                {/* Floating Options Menu */}
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
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg cursor-pointer text-xs sm:text-sm transition-colors ${isSelected
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

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  className={`w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#032e92] focus:ring-2 focus:ring-blue-50 outline-none transition-all ${isModal ? 'px-3.5 py-2.5 text-xs sm:text-sm' : 'px-5 py-3.5'
                    }`}
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  className={`w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#032e92] focus:ring-2 focus:ring-blue-50 outline-none transition-all ${isModal ? 'px-3.5 py-2.5 text-xs sm:text-sm' : 'px-5 py-3.5'
                    }`}
                  placeholder="Enter your email address"
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number *</label>
                <div className="flex relative">
                  <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold ${isModal ? 'text-xs' : 'text-sm'}`}>+91</span>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData({ ...formData, phone: val });
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                    }}
                    className={`w-full pl-11 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#032e92] focus:ring-2 focus:ring-blue-50 outline-none transition-all ${isModal ? 'pr-3.5 py-2.5 text-xs sm:text-sm' : 'pr-5 py-3.5'
                      }`}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => {
                        setFormData({ ...formData, consent: e.target.checked });
                        if (errors.consent) setErrors((prev) => ({ ...prev, consent: '' }));
                      }}
                      className="w-4 h-4 border-2 border-gray-300 rounded appearance-none checked:bg-[#032e92] checked:border-[#032e92] transition-colors cursor-pointer"
                      disabled={isSubmitting}
                    />
                    {formData.consent && (
                      <svg className="w-2.5 h-2.5 text-white absolute pointer-events-none" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7.5L5.5 11L12 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-[11px] sm:text-xs text-gray-600 leading-tight select-none">
                    I agree to be contacted regarding my investment enquiry.
                  </span>
                </label>
                {errors.consent && <p className="text-red-500 text-xs mt-1">{errors.consent}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full btn-ripple rounded-xl font-semibold text-white transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${isModal ? 'py-3 px-6 text-[14px]' : 'py-3.5 px-6 text-[15px]'
                  } ${isSubmitting
                    ? 'bg-gray-400 opacity-70 cursor-wait'
                    : 'bg-gradient-to-r from-[#032e92] to-[#021d63] hover:shadow-lg hover:shadow-[#032e92]/30'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Details...
                  </>
                ) : (
                  'Explore Investment Products →'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </motion.div>
  );
}
