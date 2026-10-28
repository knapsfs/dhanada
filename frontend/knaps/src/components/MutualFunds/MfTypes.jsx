import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faShieldHalved,
  faScaleBalanced,
  faArrowTrendUp,
  faFileInvoiceDollar,
  faCoins,
  faClock,
  faTriangleExclamation,
  faPercent,
  faLayerGroup,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { MF_CATEGORIES } from '../../data/mutualFundsData';
import { useLeadModal } from '../../context/LeadModalContext';

export default function MfTypes() {
  const [activeCategoryId, setActiveCategoryId] = useState('equity');
  const { openLeadModal } = useLeadModal();

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'equity': return faChartLine;
      case 'debt': return faShieldHalved;
      case 'hybrid': return faScaleBalanced;
      case 'index': return faArrowTrendUp;
      case 'elss': return faFileInvoiceDollar;
      case 'liquid': return faCoins;
      default: return faLayerGroup;
    }
  };

  const activeCategory = MF_CATEGORIES.find((c) => c.id === activeCategoryId) || MF_CATEGORIES[0];

  return (
    <section id="mf-types" className="py-20 lg:py-24 bg-[#f7f9fc] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faLayerGroup} className="text-[#2490ef]" />
            <span>Asset Classes & Categories</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#032e92] tracking-tight">
            Types of Mutual Funds in India
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            SEBI categorizes mutual funds into distinct classes based on asset allocation, market cap, and risk profile. Explore each category to find the ideal match for your financial roadmap.
          </p>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 gap-2.5 sm:gap-3 scrollbar-none mb-10">
          {MF_CATEGORIES.map((cat) => {
            const isSelected = activeCategoryId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategoryId(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#032e92] text-white shadow-md shadow-[#032e92]/20 scale-[1.02]'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                }`}
              >
                <FontAwesomeIcon icon={getCategoryIcon(cat.id)} className={isSelected ? 'text-blue-300' : 'text-[#032e92]'} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl border border-blue-100 shadow-xl shadow-blue-900/5 p-6 sm:p-8 lg:p-10"
          >
            {/* Top Bar with Category Overview & Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b border-slate-100 items-start">
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#032e92]">
                    <FontAwesomeIcon icon={getCategoryIcon(activeCategory.id)} className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#032e92]">
                      {activeCategory.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">SEBI Regulated Asset Category</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed pt-1">
                  {activeCategory.shortDesc}
                </p>
              </div>

              {/* 3 Metric Pills */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-[#f8fbff] border border-blue-100/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-500 text-xs" />
                    <span>Risk Level</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800">{activeCategory.riskLevel}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f8fbff] border border-blue-100/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                    <FontAwesomeIcon icon={faClock} className="text-blue-500 text-xs" />
                    <span>Ideal Horizon</span>
                  </div>
                  <div className="text-sm font-bold text-[#032e92]">{activeCategory.idealHorizon}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#f8fbff] border border-blue-100/80">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-1">
                    <FontAwesomeIcon icon={faPercent} className="text-emerald-500 text-xs" />
                    <span>Taxation</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 leading-tight">{activeCategory.taxTreatment}</div>
                </div>
              </div>
            </div>

            {/* Subcategories Breakdown */}
            <div className="mt-8">
              <h4 className="text-base font-bold text-slate-900 mb-5">
                Key Fund Subcategories & Mandates in {activeCategory.name}:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeCategory.subcategories.map((sub, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-gradient-to-br from-[#fafcff] to-[#f4f7fb] border border-blue-100/70 hover:border-blue-300 transition-all duration-200"
                  >
                    <div className="text-sm font-bold text-[#032e92] mb-1.5">{sub.name}</div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">{sub.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Action strip */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500 italic">
                *Asset allocation mandates follow SEBI circular SEBI/HO/IMD/DF3/CIR/P/2017/114.
              </p>
              <button
                type="button"
                onClick={() => openLeadModal(`Mutual Funds: Explore ${activeCategory.name}`)}
                className="px-5 py-2.5 rounded-xl bg-[#032e92] text-white text-xs sm:text-sm font-bold hover:bg-[#021d63] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Find Suitable {activeCategory.name}</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
