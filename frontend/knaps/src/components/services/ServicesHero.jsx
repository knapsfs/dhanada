import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function ServicesHero() {
  return (
    <section className="relative pt-[110px] pb-6 sm:pt-[120px] sm:pb-8 overflow-hidden bg-gradient-to-b from-[#eef4ff] to-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Header: Breadcrumb & Headline matching About Us page */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Breadcrumb Navigation */}
          <div className="flex items-center pb-4 sm:pb-5 gap-3 text-[15px] font-medium text-gray-500">
            <Link to="/" className="hover:text-[#032e92] transition-colors">Home</Link>
            <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-400" />
            <span className="text-[#032e92]">Services</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-black tracking-tight leading-tight max-w-4xl">
            Financial solutions designed for <span className="text-[#032e92]">your life goals</span>
          </h1>
        </motion.div>
      </div>
    </section>
  );
}
