import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import npsHeroImg from '../../assets/nps/hero.webp';

export default function NpsHero() {
  return (
    <section className="relative pt-[110px] pb-6 sm:pt-[120px] sm:pb-8 overflow-hidden bg-gradient-to-b from-[#eef4ff] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center pb-4 sm:pb-6 gap-2 text-xs sm:text-sm text-gray-500">
          <Link to="/" className="hover:text-[#032e92] transition-colors">Home</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-400" />
          <Link to="/products" className="hover:text-[#032e92] transition-colors">Products</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-400" />
          <span className="text-[#032e92] font-semibold">National Pension System (NPS)</span>
        </div>

        {/* Hero Banner with text overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-gray-100"
        >
          {/* Background Image - full visible without cuts */}
          <img
            src={npsHeroImg}
            alt="Retirement in real is closer than it appears"
            className="w-full h-auto block"
          />

          {/* Text Overlay on Top Left */}
          <div className="absolute top-4 sm:top-8 md:top-10 lg:top-12 left-4 sm:left-8 md:left-10 lg:left-14 max-w-[200px] sm:max-w-xs md:max-w-md lg:max-w-lg z-10 pointer-events-none">
            <h1 className="text-base sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-900 tracking-tight leading-tight sm:leading-snug drop-shadow-sm">
              How do you see your <br />Retirement ?
            </h1>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
