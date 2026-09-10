import { useState } from 'react';
import { motion } from 'framer-motion';

export default function LeadCapture({ onSubmitSuccess }) {
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
    
    // Indian mobile number validation (optional +91 followed by 10 digits, or just 10 digits)
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
      // Mock API call to lead system
      // const response = await fetch("/api/risk-profiler-lead", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData)
      // });
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      onSubmitSuccess();
      
    } catch (err) {
      setApiError("We couldn't complete your request. Please check your connection and try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto w-full bg-white rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-gray-100 flex flex-col md:flex-row"
    >
      <div className="md:w-5/12 bg-[#032e92] p-8 md:p-12 text-white flex flex-col justify-center">
        <h3 className="text-3xl font-black mb-4">Your Risk Profile Is Ready</h3>
        <p className="text-blue-100 text-lg mb-8 leading-relaxed">
          Enter your details below to receive your assessment result via email.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-blue-200">
            <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-sm">✓</span>
            <span>Questions completed</span>
          </div>
          <div className="flex items-center gap-3 text-blue-200">
            <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-sm">✓</span>
            <span>Assessment ready</span>
          </div>
        </div>
      </div>
      
      <div className="md:w-7/12 p-8 md:p-12">
        {apiError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 font-medium">
            {apiError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
            <input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#032e92] focus:ring-4 focus:ring-blue-50 outline-none transition-all"
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
            <input 
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#032e92] focus:ring-4 focus:ring-blue-50 outline-none transition-all"
              placeholder="Enter your email address"
            />
            {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number *</label>
            <div className="flex relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">+91</span>
              <input 
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full pl-14 pr-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#032e92] focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                placeholder="Enter 10-digit mobile number"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-sm mt-2">{errors.phone}</p>}
          </div>
          
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative flex items-center justify-center mt-1">
                <input 
                  type="checkbox"
                  checked={formData.consent}
                  onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                  className="w-5 h-5 border-2 border-gray-300 rounded appearance-none checked:bg-[#032e92] checked:border-[#032e92] transition-colors"
                />
                {formData.consent && (
                  <svg className="w-3 h-3 text-white absolute pointer-events-none" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7.5L5.5 11L12 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-600 leading-relaxed select-none">
                I agree to be contacted regarding my investment enquiry and the information I have requested.
              </span>
            </label>
            {errors.consent && <p className="text-red-500 text-sm mt-2">{errors.consent}</p>}
          </div>
          
          <p className="text-xs text-gray-400 leading-relaxed pt-2 border-t border-gray-100">
            Your information will be used to provide your assessment result and respond to your enquiry in accordance with our <a href="/privacy" className="text-[#032e92] underline">Privacy Policy</a>.
          </p>
          
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
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
