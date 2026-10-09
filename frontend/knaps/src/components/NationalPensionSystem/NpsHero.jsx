import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import npsHeroImg from '../../assets/nps/hero.png';

export default function NpsHero() {
  return (
    <section className="relative pt-[110px] pb-6 sm:pt-[120px] sm:pb-8 overflow-hidden bg-gradient-to-b from-[#eef4ff] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Breadcrumb Navigation */}
        <div className="flex items-center pb-4 sm:pb-6 gap-3 text-[15px] font-medium text-gray-500">
          <Link to="/" className="hover:text-[#032e92] transition-colors">Home</Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-[10px] text-gray-400" />
          <span className="text-[#032e92]">National Pension System (NPS)</span>
        </div>

        {/* Hero Banner with text overlay matching reference */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-gray-100 aspect-[16/9] sm:aspect-[2.1/1] md:aspect-[2.235/1] min-h-[250px] sm:min-h-[340px]"
        >
          {/* Background Image */}
          <img
            src={npsHeroImg}
            alt="Retirement in real is closer than it appears"
            className="w-full h-full object-cover object-center"
          />

          {/* Text Overlay on Top Left */}
          <div className="absolute top-6 sm:top-10 md:top-12 lg:top-16 left-6 sm:left-10 md:left-12 lg:left-16 max-w-xs sm:max-w-md md:max-w-lg z-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-semibold text-gray-900 tracking-tight leading-tight sm:leading-snug drop-shadow-sm">
              Retirement in real<br />is closer than it appears
            </h1>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
