import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilter,
  faSearch,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { SMALL_SAVINGS_SCHEMES } from '../../data/smallSavingsData';
import { useLeadModal } from '../../context/LeadModalContext';

export default function SchemeExplorer() {
  const [selectedGoal, setSelectedGoal] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { openLeadModal } = useLeadModal();

  // Filter logic for 4 Post Office schemes
  const filteredSchemes = useMemo(() => {
    return SMALL_SAVINGS_SCHEMES.filter((scheme) => {
      // Goal Filter
      if (selectedGoal === 'tax-saving' && !['nsc', 'potd'].includes(scheme.id)) return false;
      if (selectedGoal === 'capital-doubling' && scheme.id !== 'kvp') return false;
      if (selectedGoal === 'term-deposit' && scheme.id !== 'potd') return false;
      if (selectedGoal === 'monthly-recurring' && scheme.id !== 'pord') return false;

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
  }, [selectedGoal, searchQuery]);

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faFilter} />
            <span>Interactive Scheme Discovery</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Explore Post Office Small Savings Schemes
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Filter our core government-backed post office schemes by financial goal, tenure, and tax preference.
          </p>
        </div>

        {/* Filter Control Bar */}
        <div className="bg-[#f7f9fc] rounded-3xl p-6 sm:p-8 border border-slate-200/80 mb-10 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
              />
              <input
                type="text"
                placeholder="Search POTD, KVP, NSC, PORD..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#032e92] transition-colors"
              />
            </div>

            {/* Quick Goal Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedGoal('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedGoal === 'all'
                    ? 'bg-[#032e92] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                All Schemes
              </button>
              <button
                type="button"
                onClick={() => setSelectedGoal('tax-saving')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedGoal === 'tax-saving'
                    ? 'bg-[#032e92] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Section 80C Tax-Saving
              </button>
              <button
                type="button"
                onClick={() => setSelectedGoal('capital-doubling')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedGoal === 'capital-doubling'
                    ? 'bg-[#032e92] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Capital Doubling (KVP)
              </button>
              <button
                type="button"
                onClick={() => setSelectedGoal('term-deposit')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedGoal === 'term-deposit'
                    ? 'bg-[#032e92] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Time Deposits (POTD)
              </button>
              <button
                type="button"
                onClick={() => setSelectedGoal('monthly-recurring')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedGoal === 'monthly-recurring'
                    ? 'bg-[#032e92] text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                Monthly Savings (PORD)
              </button>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="p-8 rounded-3xl bg-[#f7f9fc] border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${scheme.badgeColor}`}>
                    {scheme.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {scheme.id.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900">{scheme.name}</h3>
                  <div className="text-xs text-blue-600 font-semibold mt-1">{scheme.category}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-white p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-500 block">Interest Rate:</span>
                    <span className="font-bold text-[#032e92] text-base">{scheme.interestRate}% p.a.</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Tenure:</span>
                    <span className="font-semibold text-slate-800">{scheme.tenure}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Deposit Frequency:</span>
                    <span className="font-semibold text-slate-800">{scheme.depositFrequency}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Tax Exemption:</span>
                    <span className="font-semibold text-slate-800">{scheme.taxSection}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {scheme.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">100% Sovereign Safety</span>
                <button
                  type="button"
                  onClick={() =>
                    openLeadModal({
                      title: `Apply for ${scheme.name}`,
                      defaultService: scheme.name
                    })
                  }
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#032e92] text-white hover:bg-[#021d63] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Apply Now</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
