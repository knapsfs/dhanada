import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAward,
  faArrowRight,
  faXmark,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { SMALL_SAVINGS_SCHEMES } from '../../data/smallSavingsData';
import { useLeadModal } from '../../context/LeadModalContext';

export default function PopularSmallSavingsSchemes() {
  const [selectedScheme, setSelectedScheme] = useState(null);
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faAward} />
            <span>Product Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Post Office Small Savings Schemes
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Explore our 4 key Post Office savings instruments offering sovereign safety, competitive notified rates, and diverse tenure structures.
          </p>
        </div>

        {/* 4 Scheme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {SMALL_SAVINGS_SCHEMES.map((scheme) => (
            <div
              key={scheme.id}
              className="p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[11px] font-bold px-3 py-1 rounded-full ${scheme.badgeColor}`}
                  >
                    {scheme.badge}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {scheme.id.toUpperCase()}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#032e92] transition-colors leading-snug">
                    {scheme.name}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium mt-1">
                    {scheme.category}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-medium">Interest Rate</span>
                    <span className="text-lg font-black text-[#032e92]">
                      {scheme.interestRate}% <span className="text-xs font-normal text-slate-500">p.a.</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Tenure</span>
                    <span className="font-semibold text-slate-800">{scheme.tenure}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Tax Status</span>
                    <span className="font-semibold text-slate-800">{scheme.taxSection}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {scheme.description}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedScheme(scheme)}
                  className="text-xs font-bold text-[#032e92] hover:underline cursor-pointer"
                >
                  View Details
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openLeadModal({
                      title: `Invest in ${scheme.name}`,
                      defaultService: scheme.name
                    })
                  }
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#032e92] text-white hover:bg-[#021d63] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Invest</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Detailed Scheme Specification */}
        {selectedScheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setSelectedScheme(null)}
                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>

              <div className="space-y-6">
                <div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${selectedScheme.badgeColor}`}>
                    {selectedScheme.badge}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-2">
                    {selectedScheme.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">{selectedScheme.category}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[11px] text-slate-500">Notified Rate</div>
                    <div className="text-base font-bold text-[#032e92]">{selectedScheme.interestRate}% p.a.</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[11px] text-slate-500">Tenure</div>
                    <div className="text-base font-bold text-slate-800">{selectedScheme.tenure}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[11px] text-slate-500">Tax Treatment</div>
                    <div className="text-base font-bold text-slate-800">{selectedScheme.taxSection}</div>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 mt-1" />
                    <div><strong>Min. Deposit:</strong> ₹{selectedScheme.minDeposit.toLocaleString('en-IN')}</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 mt-1" />
                    <div><strong>Compounding:</strong> {selectedScheme.compounding}</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 mt-1" />
                    <div><strong>Liquidity & Exit:</strong> {selectedScheme.liquidity}</div>
                  </div>
                  <div className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 mt-1" />
                    <div><strong>Eligibility:</strong> {selectedScheme.eligibility}</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {selectedScheme.description}
                </p>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedScheme(null)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const scheme = selectedScheme;
                      setSelectedScheme(null);
                      openLeadModal({
                        title: `Apply for ${scheme.name}`,
                        defaultService: scheme.name
                      });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#032e92] text-white text-xs font-bold hover:bg-[#021d63] cursor-pointer"
                  >
                    Apply Now
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
