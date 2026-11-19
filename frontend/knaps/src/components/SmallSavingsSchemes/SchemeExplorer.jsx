import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
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
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Explore <span className="text-[#032e92]">Post Office Small Savings Schemes</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mt-3.5">
            Filter our core government-backed post office schemes by financial goal, tenure, and tax preference.
          </p>
        </div>



        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredSchemes.map((scheme) => (
            <div
              key={scheme.id}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-[#032e92]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${scheme.badgeColor}`}>
                    {scheme.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {scheme.id.toUpperCase()}
                  </span>
                </div> */}

                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#032e92] transition-colors">{scheme.name}</h3>
                  <div className="text-xs text-blue-600 font-semibold mt-1">{scheme.category}</div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
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

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                {/* <span className="text-xs text-slate-500">100% Sovereign Safety</span> */}
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
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
