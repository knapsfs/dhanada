import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LeadCapture({ onSubmitSuccess, isModal = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    consent: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }
    
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }
    
    const phoneClean = formData.phone.replace(/[^0-9+]/g, '');
    if (!phoneClean || (phoneClean.startsWith('+91') ? phoneClean.length !== 13 : phoneClean.length !== 10)) {
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
      await new Promise(resolve => setTimeout(resolve, 1200));
      onSubmitSuccess();
    } catch (err) {
      setApiError("We couldn't complete your request. Please check your connection and try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`max-w-3xl mx-auto w-full bg-white rounded-2xl overflow-hidden shadow-xl shadow-blue-900/10 border border-gray-100 flex flex-col md:flex-row ${isModal ? 'my-1' : ''}`}
    >
      <div className={`md:w-5/12 bg-[#032e92] text-white flex flex-col justify-center ${isModal ? 'p-5 sm:p-6' : 'p-8 md:p-12'}`}>
        <h3 className={`font-black mb-2 ${isModal ? 'text-xl sm:text-2xl' : 'text-3xl mb-4'}`}>Your Risk Profile Is Ready</h3>
        <p className={`text-blue-100 leading-relaxed ${isModal ? 'text-xs sm:text-sm mb-4' : 'text-lg mb-8'}`}>
          Enter your details below to receive your assessment result via email.
        </p>
        
        <div className={isModal ? 'space-y-2 text-xs' : 'space-y-4 text-sm'}>
          <div className="flex items-center gap-2 text-blue-200">
            <span className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">✓</span>
            <span>Questions completed</span>
          </div>
          <div className="flex items-center gap-2 text-blue-200">
            <span className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px]">✓</span>
            <span>Assessment ready</span>
          </div>
        </div>
      </div>
      
      <div className={`md:w-7/12 ${isModal ? 'p-5 sm:p-6' : 'p-8 md:p-12'}`}>
        {apiError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-medium">
            {apiError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={isModal ? 'space-y-3' : 'space-y-6'}>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
            <input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className={`w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#032e92] focus:ring-2 focus:ring-blue-50 outline-none transition-all ${isModal ? 'px-3.5 py-2.5 text-xs sm:text-sm' : 'px-5 py-4'}`}
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address *</label>
            <input 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={`w-full rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#032e92] focus:ring-2 focus:ring-blue-50 outline-none transition-all ${isModal ? 'px-3.5 py-2.5 text-xs sm:text-sm' : 'px-5 py-4'}`}
              placeholder="Enter your email address"
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
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className={`w-full pl-11 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#032e92] focus:ring-2 focus:ring-blue-50 outline-none transition-all ${isModal ? 'pr-3.5 py-2.5 text-xs sm:text-sm' : 'pr-5 py-4'}`}
                placeholder="10-digit mobile number"
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
                  onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                  className="w-4 h-4 border-2 border-gray-300 rounded appearance-none checked:bg-[#032e92] checked:border-[#032e92] transition-colors"
                />
                {formData.consent && (
                  <svg className="w-2.5 h-2.5 text-white absolute pointer-events-none" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7.5L5.5 11L12 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
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
            className={`w-full rounded-xl font-bold text-white transition-all shadow-md ${
              isModal ? 'py-2.5 text-xs sm:text-sm' : 'py-4'
            } ${
              isSubmitting ? 'bg-gray-400 cursor-wait' : 'bg-[#032e92] hover:bg-[#022169] hover:-translate-y-0.5 hover:shadow-blue-900/20'
            }`}
          >
            {isSubmitting ? 'Sending Request...' : 'Get My Risk Profile →'}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
