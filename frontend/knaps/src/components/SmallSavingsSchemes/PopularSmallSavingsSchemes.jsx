import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAward,
  faCalendarDays,
  faCoins,
  faReceipt,
  faArrowRight,
  faXmark,
  faBuildingColumns,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { SMALL_SAVINGS_SCHEMES } from '../../data/smallSavingsData';
import { useLeadModal } from '../../context/LeadModalContext';

export default function PopularSmallSavingsSchemes() {
  const [selectedScheme, setSelectedScheme] = useState(null);
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faAward} />
            <span>Product Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Popular Small Savings Schemes
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Government-backed savings instruments offering sovereign safety, competitive notified rates, and diverse tenure structures.
          </p>
        </div>

        {/* 9 Scheme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
          {SMALL_SAVINGS_SCHEMES.map((scheme) => (
            <div
              key={scheme.id}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${scheme.badgeColor}`}>
                    {scheme.badge}
                  </span>
                  <span className="text-lg font-black text-[#032e92]">
                    {scheme.interestRate}% <span className="text-xs font-medium text-slate-500">p.a.</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#032e92] transition-colors">
                    {scheme.name}
                  </h3>
                  <span className="text-xs font-semibold text-slate-400 block mt-0.5">
                    {scheme.category}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {scheme.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tenure:</span>
                    <span className="font-bold text-slate-800">{scheme.tenure}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tax Treatment:</span>
                    <span className="font-bold text-emerald-600">{scheme.taxStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payout Mode:</span>
                    <span className="font-bold text-slate-800">{scheme.payoutType}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedScheme(scheme)}
                  className="text-xs font-bold text-[#032e92] hover:text-blue-700 cursor-pointer"
                >
                  View Details
                </button>
                <button
                  onClick={() =>
                    openLeadModal({
                      title: `Inquire About ${scheme.name}`,
                      defaultService: 'Small Savings Schemes'
                    })
                  }
                  className="btn-ripple px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Inquire</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Informative Disclaimer */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center max-w-4xl mx-auto">
          <p className="text-xs text-slate-500 leading-relaxed">
            * <strong>Notice:</strong> Availability, eligibility criteria, interest rates, tenure, contribution limits, and premature withdrawal terms vary by scheme and are subject to prevailing notifications by the Ministry of Finance, Government of India.
          </p>
        </div>

        {/* Modal Detail View */}
        {selectedScheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setSelectedScheme(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>

              <div className="space-y-6">
                <div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${selectedScheme.badgeColor}`}>
                    {selectedScheme.badge}
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 mt-2">
                    {selectedScheme.name}
                  </h3>
                  <div className="text-lg font-black text-[#032e92] mt-1">
                    {selectedScheme.interestRate}% p.a. • {selectedScheme.compounding}
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {selectedScheme.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block mb-1">Tenure</span>
                    <strong className="text-slate-900">{selectedScheme.tenure}</strong>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block mb-1">Tax Exemption</span>
                    <strong className="text-emerald-700">{selectedScheme.taxStatus}</strong>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block mb-1">Deposit Limits</span>
                    <strong className="text-slate-900">
                      Min ₹{selectedScheme.minDeposit.toLocaleString('en-IN')} / Max{' '}
                      {selectedScheme.maxDeposit > 0
                        ? `₹${selectedScheme.maxDeposit.toLocaleString('en-IN')}`
                        : 'No upper limit'}
                    </strong>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-slate-500 block mb-1">Liquidity / Withdrawals</span>
                    <strong className="text-slate-900">{selectedScheme.liquidity}</strong>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-700">
                  <strong>Eligibility:</strong> {selectedScheme.eligibility}
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => {
                      const schemeToOpen = selectedScheme;
                      setSelectedScheme(null);
                      openLeadModal({
                        title: `Apply for ${schemeToOpen.name}`,
                        defaultService: 'Small Savings Schemes'
                      });
                    }}
                    className="btn-ripple w-full py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <span>Proceed with {selectedScheme.shortName}</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
