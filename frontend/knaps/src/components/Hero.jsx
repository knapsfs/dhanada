import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight, faShieldAlt, faUsers, faBuildingColumns,
  faChartLine, faWallet, faChartPie, faArrowTrendUp, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 overflow-hidden bg-white flex items-center">
      {/* Background Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#eef5ff] mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#fce8e8] mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#f0f4fd] mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left Side Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#eef5ff] text-[#032e92] font-semibold text-sm mb-6 border border-blue-100 shadow-sm"
            >
              <FontAwesomeIcon icon={faShieldAlt} className="text-[#c10000]" />
              Trusted Wealth Management Partner
            </motion.div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-[1.15] mb-8">
              Build, Protect & Grow Your Wealth With <span className="text-[#032e92] relative">
                Confidence
                <span className="absolute bottom-1 left-0 w-full h-3 bg-[#eef5ff] -z-10 rounded-sm"></span>
              </span>
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-semibold bg-[#032e92] text-white shadow-lg shadow-[#032e92]/30 flex items-center justify-center gap-2 hover:bg-[#021d63] transition-colors"
              >
                Start Investing
                <FontAwesomeIcon icon={faArrowRight} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl font-semibold bg-white text-[#c10000] border-2 border-[#c10000] shadow-sm flex items-center justify-center hover:bg-[#c10000] hover:text-white transition-colors"
              >
                Talk to Advisor
              </motion.button>
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FontAwesomeIcon icon={faCheckCircle} className="text-[#16a34a] text-lg" />
                SEBI Registered
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FontAwesomeIcon icon={faUsers} className="text-[#032e92] text-lg" />
                10,000+ Investors
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FontAwesomeIcon icon={faBuildingColumns} className="text-[#c10000] text-lg" />
                ₹500Cr+ Managed
              </div>
            </div>
          </motion.div>

          {/* Right Side - Lead Capture Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center lg:justify-end w-full"
          >
            <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-8 w-full max-w-md">
              <h3 className="text-[22px] font-bold text-gray-800 mb-8 leading-tight">
                Start your Wealth Creation Journey with Knaps
              </h3>

              <form className="space-y-6">
                {/* Product Dropdown */}
                <div className="relative">
                  <select defaultValue="" className="w-full bg-transparent border-b-2 border-gray-300 pb-2 text-gray-700 text-sm focus:outline-none focus:border-[#032e92] appearance-none cursor-pointer transition-colors">
                    <option value="" disabled>Select a product</option>
                    <option value="mutual-funds">Mutual Funds</option>
                    <option value="sif">SIF</option>
                    <option value="pms">Portfolio Management (PMS)</option>
                    <option value="aif">Alternative Investment Funds (AIF)</option>
                  </select>
                  <div className="absolute right-0 top-0 text-gray-400 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Name</label>
                  <input type="text" placeholder="Please enter your full name" className="w-full bg-transparent border-b-2 border-gray-300 pb-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#032e92] transition-colors" />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                    Email Address <span className="text-[9px] text-gray-400 ml-1 tracking-normal">(OPTIONAL)</span>
                  </label>
                  <input type="email" placeholder="Your email id" className="w-full bg-transparent border-b-2 border-gray-300 pb-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#032e92] transition-colors" />
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">Mobile Number</label>
                  <input type="tel" placeholder="Enter Your mobile number" className="w-full bg-transparent border-b-2 border-gray-300 pb-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#032e92] transition-colors" />
                </div>

                {/* Checkbox */}
                <div className="flex items-start gap-3 pt-2">
                  <input type="checkbox" id="terms" defaultChecked className="mt-1 w-4 h-4 text-[#0665d0] rounded border-gray-300 focus:ring-[#0665d0] cursor-pointer" />
                  <label htmlFor="terms" className="text-[13px] text-gray-500 leading-relaxed cursor-pointer select-none">
                    By continuing, you provide consent and agree to our <a href="#" className="text-[#0665d0] hover:underline">Terms & Conditions</a>
                  </label>
                </div>

                {/* Submit Button */}
                <button type="button" className="w-full bg-[#032e92] hover:bg-[#021d63] text-white text-[15px] font-medium py-3 rounded-md transition-colors mt-2 shadow-lg shadow-[#032e92]/20">
                  Continue
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
