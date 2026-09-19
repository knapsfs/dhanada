import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faSearch,
  faArrowRight,
  faCoins,
  faCalendarDays,
  faShieldHalved,
  faCheckCircle,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { SMALL_SAVINGS_SCHEMES } from '../../data/smallSavingsData';
import { useLeadModal } from '../../context/LeadModalContext';

export default function SchemeExplorer() {
  const [selectedGoal, setSelectedGoal] = useState('all');
  const [selectedPayout, setSelectedPayout] = useState('all');
  const [selectedTax, setSelectedTax] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { openLeadModal } = useLeadModal();

  // Filter logic
  const filteredSchemes = useMemo(() => {
    return SMALL_SAVINGS_SCHEMES.filter((scheme) => {
      // Goal Filter
      if (selectedGoal === 'retirement' && !['ppf', 'scss'].includes(scheme.id)) return false;
      if (selectedGoal === 'girl-child' && !['ssy', 'mssc'].includes(scheme.id)) return false;
      if (selectedGoal === 'regular-income' && !['scss', 'pomis'].includes(scheme.id)) return false;
      if (selectedGoal === 'tax-saving' && !scheme.taxSection.includes('80C')) return false;

      // Payout Filter
      if (selectedPayout === 'regular' && !scheme.payoutType.includes('Regular')) return false;
      if (selectedPayout === 'maturity' && !scheme.payoutType.includes('Maturity') && !scheme.payoutType.includes('Cumulative')) return false;

      // Tax Filter
      if (selectedTax === 'eee' && !scheme.taxStatus.includes('EEE')) return false;
      if (selectedTax === '80c' && !scheme.taxSection.includes('80C')) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          scheme.name.toLowerCase().includes(query) ||
          scheme.shortName.toLowerCase().includes(query) ||
          scheme.category.toLowerCase().includes(query) ||
          scheme.description.toLowerCase().includes(query);
        if (!matches) return false;
      }

      return true;
    });
  }, [selectedGoal, selectedPayout, selectedTax, searchQuery]);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faFilter} />
            <span>Interactive Finder</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Small Savings Scheme Explorer
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Filter and discover sovereign schemes tailored to your specific cash flow, horizon, and tax requirements.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#f7f9fc] p-6 rounded-3xl border border-slate-200 shadow-sm mb-12 space-y-4">
          {/* Top Row: Search Input */}
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
            />
            <input
              type="text"
              placeholder="Search schemes by name, keyword (e.g., PPF, Senior, Girl Child, Tax)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-sm focus:ring-2 focus:ring-[#032e92] outline-none shadow-sm"
            />
          </div>

          {/* Filter Pills Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {/* Goal Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Financial Objective</label>
              <select
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 outline-none cursor-pointer"
              >
                <option value="all">All Goals</option>
                <option value="retirement">Retirement Planning</option>
                <option value="girl-child">Girl Child Welfare</option>
                <option value="regular-income">Regular Periodic Income</option>
                <option value="tax-saving">Tax Savings (Section 80C)</option>
              </select>
            </div>

            {/* Payout Structure */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Payout Structure</label>
              <select
                value={selectedPayout}
                onChange={(e) => setSelectedPayout(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 outline-none cursor-pointer"
              >
                <option value="all">All Payout Modes</option>
                <option value="regular">Regular Income (Monthly/Qtr)</option>
                <option value="maturity">Cumulative at Maturity</option>
              </select>
            </div>

            {/* Tax Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Tax Treatment</label>
              <select
                value={selectedTax}
                onChange={(e) => setSelectedTax(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 outline-none cursor-pointer"
              >
                <option value="all">All Tax Treatments</option>
                <option value="eee">Exempt-Exempt-Exempt (EEE)</option>
                <option value="80c">Section 80C Deduction</option>
              </select>
            </div>
          </div>

          {/* Reset button if active */}
          {(selectedGoal !== 'all' || selectedPayout !== 'all' || selectedTax !== 'all' || searchQuery) && (
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  setSelectedGoal('all');
                  setSelectedPayout('all');
                  setSelectedTax('all');
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Showing {filteredSchemes.length} of {SMALL_SAVINGS_SCHEMES.length} Schemes
          </span>
        </div>

        {/* Matching Scheme Cards */}
        {filteredSchemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSchemes.map((scheme) => (
              <div
                key={scheme.id}
                className="p-8 rounded-3xl bg-[#f7f9fc] border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${scheme.badgeColor}`}>
                      {scheme.badge}
                    </span>
                    <span className="text-lg font-black text-[#032e92]">
                      {scheme.interestRate}% <span className="text-xs text-slate-500 font-normal">p.a.</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{scheme.name}</h3>
                    <span className="text-xs font-medium text-slate-500">{scheme.category}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {scheme.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-200/80 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tenure:</span>
                      <span className="font-bold text-slate-800">{scheme.tenure}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tax Relief:</span>
                      <span className="font-bold text-emerald-600">{scheme.taxStatus}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/80 flex items-center justify-between">
                  <button
                    onClick={() =>
                      openLeadModal({
                        title: `Inquire on ${scheme.name}`,
                        defaultService: 'Small Savings Schemes'
                      })
                    }
                    className="btn-ripple w-full py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Inquire for {scheme.shortName}</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 p-8 rounded-3xl bg-slate-50 border border-slate-200">
            <p className="text-base text-slate-600 font-medium">
              No small savings schemes match your exact filter combination.
            </p>
            <button
              onClick={() => {
                setSelectedGoal('all');
                setSelectedPayout('all');
                setSelectedTax('all');
                setSearchQuery('');
              }}
              className="mt-4 px-5 py-2 rounded-xl bg-[#032e92] text-white text-xs font-semibold"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
