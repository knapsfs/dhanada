import React from 'react';
import { motion } from 'framer-motion';
import knapsBanner from '../assets/knaps-banner.png';
import knapsBannerGlassCards from '../assets/knaps-banner-glass-cards.png';

export default function Hero() {
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

              <form className="space-y-5 sm:space-y-6">
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
                <div className="flex items-start gap-3 pt-1">
                  <input type="checkbox" id="terms" defaultChecked className="mt-1 w-4 h-4 text-[#0665d0] rounded border-gray-300 focus:ring-[#0665d0] cursor-pointer" />
                  <label htmlFor="terms" className="text-[12px] sm:text-[13px] text-gray-500 leading-relaxed cursor-pointer select-none">
                    By continuing, you provide consent and agree to our <a href="/terms" className="text-[#0665d0] hover:underline">Terms & Conditions</a>
                  </label>
                </div>

                {/* Submit Button */}
                <button type="button" className="w-full bg-[#032e92] hover:bg-[#021d63] text-white text-[15px] font-semibold py-3.5 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-900/20 mt-2 cursor-pointer active:scale-[0.99]">
                  Start Investing
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
