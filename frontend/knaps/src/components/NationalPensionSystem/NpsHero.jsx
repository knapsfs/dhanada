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
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-gray-100 aspect-[16/9] sm:aspect-[2.1/1] md:aspect-[2.235/1] min-h-[220px] sm:min-h-[320px]"
        >
          {/* Background Image */}
          <img
            src={npsHeroImg}
            alt="How do you see your Retirement?"
            className="w-full h-full object-cover object-center"
          />

          {/* Text Overlay matching reference design */}
          <div className="absolute top-[18%] sm:top-[20%] md:top-[23%] left-[6%] sm:left-[8%] md:left-[8.5%] z-10 select-none">
            <h1 className="flex flex-col tracking-tight">
              <span className="text-base sm:text-2xl md:text-3xl lg:text-[32px] font-semibold text-[#0b2e75] leading-snug drop-shadow-xs">
                How do you see your
              </span>
              <span className="text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold sm:font-extrabold text-[#d31424] leading-[1.05] mt-0.5 sm:mt-1.5 drop-shadow-xs">
                Retirement?
              </span>
            </h1>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
