import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export default function ContactForm() {
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

      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your full name" 
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all shadow-sm"
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Mobile Number</label>
            <input 
              type="tel" 
              placeholder="Enter your mobile number" 
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all shadow-sm"
            />
          </div>

          {/* Investment Interest Dropdown */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Investment Interest</label>
            <div className="relative">
              <select defaultValue="" className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all shadow-sm appearance-none cursor-pointer">
                <option value="" disabled>Select a service</option>
                <option value="wealth">Wealth Management</option>
                <option value="mutual-funds">Mutual Funds</option>
                <option value="retirement">Retirement Planning</option>
                <option value="insurance">Insurance Solutions</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Message</label>
          <textarea 
            rows="4"
            placeholder="Tell us about your financial goals..." 
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-[#032e92]/20 focus:border-[#032e92] transition-all shadow-sm resize-none"
          ></textarea>
        </div>

        {/* Checkbox */}
        <div className="flex items-start gap-3">
          <input 
            type="checkbox" 
            id="privacy" 
            className="mt-1 w-4.5 h-4.5 text-[#032e92] rounded border-gray-300 focus:ring-[#032e92] cursor-pointer" 
          />
          <label htmlFor="privacy" className="text-[13px] text-gray-500 leading-relaxed cursor-pointer select-none">
            I agree to the <a href="#" className="text-[#032e92] font-semibold hover:underline">Privacy Policy</a> and consent to being contacted by financial advisors.
          </label>
        </div>

        {/* Primary Button */}
        <button 
          type="button" 
          className="w-full bg-[#032e92] text-white font-bold rounded-xl px-8 py-4 flex items-center justify-center gap-3 hover:bg-[#021d63] transition-all shadow-lg shadow-[#032e92]/20 group"
        >
          Schedule Consultation
          <FontAwesomeIcon icon={faPaperPlane} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </form>
    </motion.div>
  );
}
