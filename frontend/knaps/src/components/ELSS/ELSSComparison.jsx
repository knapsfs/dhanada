import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faScaleBalanced,
  faCheckCircle,
  faArrowRight,
  faStar,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const instruments = [
  {
    name: 'ELSS Mutual Funds',
    isELSS: true,
    assetClass: 'Equities (≥ 80%)',
    lockIn: '3 Years (Shortest)',
    returnsNature: 'Market-linked (High Potential)',
    inflationBeating: 'High',
    deduction80C: 'Up to ₹1,50,000',
    taxOnMaturity: '12.5% LTCG on gains > ₹1.25 Lakh',
    minInvestment: '₹500'
  },
  {
    name: 'Public Provident Fund (PPF)',
    isELSS: false,
    assetClass: 'Government Backed Debt',
    lockIn: '15 Years',
    returnsNature: 'Fixed (~7.1% p.a. quarterly revised)',
    inflationBeating: 'Low to Moderate',
    deduction80C: 'Up to ₹1,50,000',
    taxOnMaturity: 'Exempt (EEE Status)',
    minInvestment: '₹500'
  },
  {
    name: 'National Pension System (NPS)',
    isELSS: false,
    assetClass: 'Equity + Debt Hybrid',
    lockIn: 'Till Retirement (Age 60)',
    returnsNature: 'Market-linked mix (~9%–11%)',
    inflationBeating: 'Moderate to High',
    deduction80C: '₹1.5L + ₹50k u/s 80CCD(1B)',
    taxOnMaturity: '60% Lump sum exempt, 40% Annuity taxed',
    minInvestment: '₹500'
  },
  {
    name: 'Tax-Saver Fixed Deposit (FD)',
    isELSS: false,
    assetClass: 'Bank Fixed Deposit',
    lockIn: '5 Years',
    returnsNature: 'Fixed (~6.5%–7.5% p.a.)',
    inflationBeating: 'Low (Loses to inflation)',
    deduction80C: 'Up to ₹1,50,000',
    taxOnMaturity: 'Interest fully taxed as per tax slab',
    minInvestment: '₹1,000'
  },
  {
    name: 'National Savings Certificate (NSC)',
    isELSS: false,
    assetClass: 'Post Office Fixed Debt',
    lockIn: '5 Years',
    returnsNature: 'Fixed (~7.7% p.a.)',
    inflationBeating: 'Low',
    deduction80C: 'Up to ₹1,50,000',
    taxOnMaturity: 'Interest taxable as income',
    minInvestment: '₹1,000'
  },
  {
    name: 'Unit Linked Insurance Plan (ULIP)',
    isELSS: false,
    assetClass: 'Life Insurance + Market Funds',
    lockIn: '5 Years',
    returnsNature: 'Market-linked insurance mix',
    inflationBeating: 'Moderate (Impacted by charges)',
    deduction80C: 'Up to ₹1,50,000',
    taxOnMaturity: 'Exempt u/s 10(10D) if premium ≤ ₹2.5L/yr',
    minInvestment: '₹10,000+'
  }
];

export default function ELSSComparison() {
  const { openLeadModal } = useLeadModal();
  const [selectedMobileIndex, setSelectedMobileIndex] = useState(0);

  return (
    <section id="elss-comparison" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faScaleBalanced} className="text-[#032e92]" />
            <span>Side-by-Side Evaluation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            ELSS vs Other{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Tax-Saving Options
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Compare Section 80C options across lock-in periods, asset classes, returns characteristics, and tax implications upon maturity.
          </p>
        </div>

        {/* Desktop Comparison Table (Hidden on small screens) */}
        <div className="hidden lg:block overflow-hidden rounded-3xl border border-gray-200/90 shadow-xl bg-white mb-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f7f9fc] border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-600">
                <th className="py-4 px-5">Instrument</th>
                <th className="py-4 px-4">Asset Class</th>
                <th className="py-4 px-4">Lock-In Period</th>
                <th className="py-4 px-4">Return Characteristics</th>
                <th className="py-4 px-4">Inflation Beating</th>
                <th className="py-4 px-4">Tax on Maturity</th>
                <th className="py-4 px-4">Min. Investment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
              {instruments.map((inst, idx) => {
                const isElss = inst.isELSS;
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isElss
                        ? 'bg-blue-50/70 hover:bg-blue-50 font-medium'
                        : 'hover:bg-gray-50/70 text-gray-700'
                    }`}
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        {isElss && (
                          <span className="w-2 h-2 rounded-full bg-[#032e92] animate-pulse" />
                        )}
                        <span className={`font-bold ${isElss ? 'text-[#032e92]' : 'text-[#0a192f]'}`}>
                          {inst.name}
                        </span>
                        {isElss && (
                          <span className="px-2 py-0.5 rounded-full bg-[#032e92] text-white text-[10px] font-semibold">
                            Recommended
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-800">{inst.assetClass}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                          isElss
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {inst.lockIn}
                      </span>
                    </td>
                    <td className="py-4 px-4">{inst.returnsNature}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`font-semibold ${
                          inst.inflationBeating === 'High'
                            ? 'text-emerald-700'
                            : inst.inflationBeating.includes('Moderate')
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }`}
                      >
                        {inst.inflationBeating}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-600">{inst.taxOnMaturity}</td>
                    <td className="py-4 px-4 font-medium text-gray-900">{inst.minInvestment}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card-based View */}
        <div className="lg:hidden space-y-4 mb-10">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Instrument:</span>
            <span className="text-xs text-[#032e92] font-semibold">Tap to inspect</span>
          </div>

          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none">
            {instruments.map((inst, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedMobileIndex(idx)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  selectedMobileIndex === idx
                    ? 'bg-[#032e92] text-white border-[#032e92] shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {inst.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Selected Mobile Instrument Card */}
          {(() => {
            const activeInst = instruments[selectedMobileIndex];
            return (
              <div
                className={`rounded-2xl p-5 border shadow-sm ${
                  activeInst.isELSS ? 'bg-blue-50/70 border-blue-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-200/60 mb-3">
                  <h4 className="text-base font-bold text-[#0a192f]">{activeInst.name}</h4>
                  {activeInst.isELSS && (
                    <span className="px-2 py-0.5 rounded-full bg-[#032e92] text-white text-[10px] font-bold">
                      ELSS
                    </span>
                  )}
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Asset Class:</span>
                    <strong className="text-gray-900">{activeInst.assetClass}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lock-In Period:</span>
                    <strong className="text-emerald-700">{activeInst.lockIn}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Return Type:</span>
                    <strong className="text-gray-900">{activeInst.returnsNature}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Inflation Beating:</span>
                    <strong className="text-[#032e92]">{activeInst.inflationBeating}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tax on Gains:</span>
                    <span className="text-gray-800 text-right max-w-[60%]">{activeInst.taxOnMaturity}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-100">
                    <span className="text-gray-500">Min. Investment:</span>
                    <strong className="text-gray-900">{activeInst.minInvestment}</strong>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Regulatory Note */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-200/80 flex items-start gap-3 text-xs text-gray-600">
          <FontAwesomeIcon icon={faCircleInfo} className="text-[#032e92] mt-0.5 flex-shrink-0" />
          <p>
            <strong>Regulatory & Tax Context:</strong> Tax benefits under Section 80C are applicable only for taxpayers opting for the Old Tax Regime. In the Union Budget 2024 (Finance Act 2024), Long-Term Capital Gains (LTCG) on equity mutual funds are taxed at 12.5% on gains exceeding ₹1.25 Lakh per financial year. Past performance is not indicative of future returns.
          </p>
        </div>
      </div>
    </section>
  );
}
