import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faPhone, faEnvelope, faClock, faArrowRight } from '@fortawesome/free-solid-svg-icons';

export default function LuxuryContactSection() {
  return (
    <section className="relative pt-24 pb-16 overflow-hidden ">


      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#f0f4fd] text-[#032e92] font-semibold text-xs tracking-widest uppercase mb-4">
            Get In Touch
          </div>
          <h2 className="text-4xl lg:text-[52px] font-bold text-[#0a192f] leading-[1.1] tracking-tight">
            Talk To Our <span className="text-[#032e92]">Financial Experts</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-8 items-start">

          {/* LEFT SIDE (40%) - Luxury Contact Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
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
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/90 via-[#0a192f]/20 to-transparent"></div>
                <div className="absolute bottom-6 left-8 lg:left-10 text-left">
                  <h3 className="text-white text-2xl font-bold tracking-wide">Knaps Financial Services</h3>
                  <p className="text-blue-200 text-sm mt-1 font-medium tracking-wider uppercase">New Delhi, India</p>
                </div>
              </div>

              <div className="p-8 lg:p-10 space-y-8">
                {/* Office */}
                <div className="flex items-start gap-6 group/item relative cursor-pointer">
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#c10000] transition-all duration-300 group-hover/item:h-8 rounded-r-md"></div>
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#032e92] shadow-md border border-gray-50 transition-transform duration-300 group-hover/item:scale-110 group-hover/item:bg-[#032e92] group-hover/item:text-white">
                    <FontAwesomeIcon icon={faLocationDot} className="text-xl" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Office</h5>
                    <p className="text-[#0a192f] font-medium text-[17px] leading-relaxed max-w-[250px]">123 Financial District, Suite 500 New Delhi, India 110001</p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-6 group/item relative cursor-pointer">
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-0 bg-[#c10000] transition-all duration-300 group-hover/item:h-8 rounded-r-md"></div>
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#032e92] shadow-md border border-gray-50 transition-transform duration-300 group-hover/item:scale-110 group-hover/item:bg-[#032e92] group-hover/item:text-white">
                    <FontAwesomeIcon icon={faPhone} className="text-xl" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phone</h5>
                    <p className="text-[#0a192f] font-medium text-[17px] leading-relaxed">+91 98765 43210</p>
                  </div>
                </div>

                {/* Email */}
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

                {/* Working Hours */}
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
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="lg:w-[60%] relative"
          >
            {/* Subtle floating finance illustration behind form */}
            <div className="absolute top-10 right-10 w-64 h-64 opacity-5 pointer-events-none rotate-12">
              <svg viewBox="0 0 24 24" fill="none" stroke="#032e92" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>

            <div className="bg-white p-10 lg:p-12 rounded-[40px] shadow-2xl shadow-blue-900/5 border border-gray-100 relative z-10">
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Full Name */}
                  <div className="group">
                    <label className="block text-[11px] font-bold text-[#0a192f] uppercase tracking-widest mb-2">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ratan Tata"
                      className="w-full bg-[#f8fafc] border border-gray-200 text-gray-900 rounded-xl px-5 py-4 focus:outline-none focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] transition-colors placeholder-gray-400"
                    />
                  </div>

                  {/* Phone */}
                  <div className="group">
                    <label className="block text-[11px] font-bold text-[#0a192f] uppercase tracking-widest mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 00000 00000"
                      className="w-full bg-[#f8fafc] border border-gray-200 text-gray-900 rounded-xl px-5 py-4 focus:outline-none focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] transition-colors placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Email */}
                  <div className="group">
                    <label className="block text-[11px] font-bold text-[#0a192f] uppercase tracking-widest mb-2">Email Address</label>
                    <input
                      type="email"
                      placeholder="name@company.com"
                      className="w-full bg-[#f8fafc] border border-gray-200 text-gray-900 rounded-xl px-5 py-4 focus:outline-none focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] transition-colors placeholder-gray-400"
                    />
                  </div>

                  {/* Service */}
                  <div className="group relative">
                    <label className="block text-[11px] font-bold text-[#0a192f] uppercase tracking-widest mb-2">Service Interested</label>
                    <select className="w-full bg-[#f8fafc] border border-gray-200 text-gray-900 rounded-xl px-5 py-4 focus:outline-none focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] transition-colors appearance-none cursor-pointer">
                      <option value="" disabled selected>Select an area of interest</option>
                      <option value="wealth">Wealth Management</option>
                      <option value="mutual-funds">Mutual Funds</option>
                      <option value="pms">Portfolio Management (PMS)</option>
                      <option value="aif">Alternative Investment Funds</option>
                      <option value="insurance">Insurance & Protection</option>
                    </select>
                    <div className="absolute right-4 top-[38px] text-gray-400 pointer-events-none">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="group">
                  <label className="block text-[11px] font-bold text-[#0a192f] uppercase tracking-widest mb-2">Message (Optional)</label>
                  <textarea
                    rows="3"
                    placeholder="Briefly describe your financial objectives..."
                    className="w-full bg-[#f8fafc] border border-gray-200 text-gray-900 rounded-xl px-5 py-4 focus:outline-none focus:border-[#032e92] focus:ring-1 focus:ring-[#032e92] transition-colors placeholder-gray-400 resize-none"
                  ></textarea>
                </div>

                {/* Privacy Checkbox */}
                <div className="flex items-start gap-4 pt-2">
                  <input
                    type="checkbox"
                    id="privacy-policy"
                    className="mt-1.5 w-5 h-5 accent-[#032e92] cursor-pointer"
                  />
                  <label htmlFor="privacy-policy" className="text-[15px] text-gray-500 leading-relaxed cursor-pointer select-none">
                    I acknowledge that I have read and agree to the <a href="#" className="text-[#032e92] font-semibold hover:underline">Privacy Policy</a>. I understand that my information will be handled with strict confidentiality.
                  </label>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="button"
                    className="group relative overflow-hidden bg-[#032e92] text-white font-bold rounded-xl px-8 py-4 flex items-center justify-center gap-3 w-full shadow-xl shadow-[#032e92]/20 transition-transform hover:-translate-y-1"
                  >
                    <span className="relative z-10 text-[15px] tracking-wide">Schedule Consultation</span>
                    <FontAwesomeIcon icon={faArrowRight} className="relative z-10 group-hover:translate-x-1 transition-transform" />

                    {/* Ripple Hover Effect */}
                    <div className="absolute inset-0 bg-[#021d63] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out z-0"></div>
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
