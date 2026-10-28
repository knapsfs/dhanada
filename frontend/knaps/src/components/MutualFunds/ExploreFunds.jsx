import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faArrowRight,
  faCalculator,
  faRotateLeft,
  faShieldHalved,
  faClock,
  faCheck,
  faCompass
} from '@fortawesome/free-solid-svg-icons';
import { EXPLORE_FUNDS_DATA } from '../../data/mutualFundsData';
import { useLeadModal } from '../../context/LeadModalContext';

export default function ExploreFunds() {
  const [selectedType, setSelectedType] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [selectedHorizon, setSelectedHorizon] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { openLeadModal } = useLeadModal();

  const typeOptions = ['All', 'Equity', 'Debt', 'Hybrid', 'Index', 'ELSS', 'Liquid'];
  const riskOptions = ['All', 'Low', 'Moderate', 'Moderately High', 'Very High'];
  const horizonOptions = ['All', 'Ultra Short (<1Y)', 'Medium Term (1-3Y)', 'Long Term (3-5Y)', 'Wealth Creation (5Y+)'];

  const filteredFunds = useMemo(() => {
    return EXPLORE_FUNDS_DATA.filter((fund) => {
      // Type match
      if (selectedType !== 'All' && fund.category !== selectedType) return false;
      // Risk match
      if (selectedRisk !== 'All' && fund.risk !== selectedRisk) return false;
      // Horizon match
      if (selectedHorizon !== 'All' && fund.horizon !== selectedHorizon) return false;
      // Search match
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = fund.name.toLowerCase().includes(query);
        const matchesDesc = fund.idealFor.toLowerCase().includes(query);
        const matchesCat = fund.category.toLowerCase().includes(query);
        const matchesMix = fund.assetMix.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat && !matchesMix) return false;
      }
      return true;
    });
  }, [selectedType, selectedRisk, selectedHorizon, searchQuery]);

  const resetFilters = () => {
    setSelectedType('All');
    setSelectedRisk('All');
    setSelectedHorizon('All');
    setSearchQuery('');
  };

  const scrollToCalculator = () => {
    const el = document.getElementById('mf-calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getRiskBadgeColor = (risk) => {
    switch (risk) {
      case 'Low': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Moderate': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Moderately High': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'High':
      case 'Very High': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <section id="explore-funds" className="py-20 lg:py-24 bg-[#f7f9fc] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faCompass} className="text-[#2490ef]" />
            <span>Interactive Scheme Discovery</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#032e92] tracking-tight">
            Explore Mutual Fund Categories
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            Filter mutual fund strategies across risk appetite, investment time horizon, and asset type to construct your tailored portfolio.
          </p>
        </div>

        {/* Filter Control Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-md shadow-blue-900/5 mb-10 space-y-6">
          {/* Top row: Search input and Reset */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-6 border-b border-slate-100">
            <div className="relative w-full sm:w-80">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search strategies (e.g. Large Cap, Nifty)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#032e92] focus:bg-white transition-colors"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs sm:text-sm font-semibold text-slate-500">
                Showing <strong className="text-[#032e92]">{filteredFunds.length}</strong> of {EXPLORE_FUNDS_DATA.length} Strategies
              </span>
              {(selectedType !== 'All' || selectedRisk !== 'All' || selectedHorizon !== 'All' || searchQuery !== '') && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  <FontAwesomeIcon icon={faRotateLeft} className="text-xs" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Filter 1: Fund Type */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              <span>Fund Type:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    selectedType === type
                      ? 'bg-[#032e92] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Filter 2: Risk Profile */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              <span>Risk Tolerance:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {riskOptions.map((risk) => (
                <button
                  key={risk}
                  type="button"
                  onClick={() => setSelectedRisk(risk)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    selectedRisk === risk
                      ? 'bg-[#032e92] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
          </div>

          {/* Filter 3: Horizon */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
              <span>Time Horizon:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {horizonOptions.map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setSelectedHorizon(h)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    selectedHorizon === h
                      ? 'bg-[#032e92] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Funds Grid */}
        {filteredFunds.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
            <p className="text-base text-slate-600 font-medium">No mutual fund strategies match your selected combination of filters.</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#032e92] text-white text-sm font-bold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredFunds.map((fund) => (
                <motion.div
                  layout
                  key={fund.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-3xl border border-blue-100/90 shadow-xs hover:shadow-lg hover:border-blue-300 transition-all duration-300 p-6 flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Title and Badge */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                          {fund.category} Mutual Fund
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 mt-0.5">{fund.name}</h3>
                      </div>
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-[#032e92] border border-blue-100 flex-shrink-0">
                        {fund.badge}
                      </span>
                    </div>

                    {/* Risk & Horizon Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getRiskBadgeColor(fund.risk)}`}>
                        <FontAwesomeIcon icon={faShieldHalved} className="text-[10px]" />
                        <span>{fund.risk} Risk</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        <FontAwesomeIcon icon={faClock} className="text-[10px] text-slate-500" />
                        <span>{fund.horizon}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal mb-4">
                      {fund.idealFor}
                    </p>

                    {/* Metrics Box */}
                    <div className="p-3.5 rounded-2xl bg-[#f8fbff] border border-blue-100/70 space-y-2 mb-4 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Asset Allocation:</span>
                        <span className="font-semibold text-slate-800">{fund.assetMix}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Min. SIP:</span>
                        <span className="font-bold text-[#032e92]">₹{fund.minSip.toLocaleString('en-IN')} / mo</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Min. Lumpsum:</span>
                        <span className="font-bold text-slate-800">₹{fund.minLumpsum.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="space-y-1.5 mb-5">
                      {fund.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                          <FontAwesomeIcon icon={faCheck} className="text-emerald-500 text-[10px]" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openLeadModal(`Mutual Funds: Invest in ${fund.name}`)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#032e92] text-white text-xs font-bold hover:bg-[#021d63] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>Invest via SIP</span>
                      <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                    </button>
                    <button
                      type="button"
                      onClick={scrollToCalculator}
                      className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-[#032e92] text-xs font-semibold transition-colors cursor-pointer"
                      title="Calculate SIP"
                    >
                      <FontAwesomeIcon icon={faCalculator} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
