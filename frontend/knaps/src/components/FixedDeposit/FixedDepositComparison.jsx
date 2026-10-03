import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faScaleBalanced,
  faCircleInfo,
  faCheckCircle,
  faBuildingColumns
} from '@fortawesome/free-solid-svg-icons';

const comparisonData = [
  {
    name: 'Scheduled Bank FD',
    isPrimary: true,
    predictability: 'High (Contracted Rate)',
    marketExposure: 'Zero',
    liquidity: 'Premature withdrawal allowed (minor penalty)',
    tenureRange: '7 Days to 10 Years',
    safetyMechanism: 'DICGC Insured up to ₹5 Lakh',
    taxTreatment: 'Taxed at slab rate; TDS u/s 194A'
  },
  {
    name: 'Corporate / NBFC FD',
    isPrimary: false,
    predictability: 'High (Higher Contracted Rate)',
    marketExposure: 'Zero (Credit Risk applies)',
    liquidity: 'Premature exit per issuer rules (lock-in applies)',
    tenureRange: '1 Year to 5 Years',
    safetyMechanism: 'Credit Rating (CRISIL/ICRA AAA/AA)',
    taxTreatment: 'Taxed at slab rate; TDS u/s 194A'
  },
  {
    name: 'Savings Bank Account',
    isPrimary: false,
    predictability: 'Variable (Bank can adjust anytime)',
    marketExposure: 'Zero',
    liquidity: 'Instant (ATM / UPI / NetBanking)',
    tenureRange: 'Immediate / Open-ended',
    safetyMechanism: 'DICGC Insured up to ₹5 Lakh',
    taxTreatment: 'Taxed at slab; ₹10k exempt u/s 80TTA'
  },
  {
    name: 'Debt Mutual Funds',
    isPrimary: false,
    predictability: 'Market-linked (Yield to Maturity)',
    marketExposure: 'Moderate (Subject to interest rate & credit risk)',
    liquidity: 'High (Redeemed in T+1 business day)',
    tenureRange: 'Open-ended (Overnight to Long duration)',
    safetyMechanism: 'Market Value (NAV fluctuates)',
    taxTreatment: 'Taxed at investor’s income tax slab'
  },
  {
    name: 'Public Provident Fund (PPF)',
    isPrimary: false,
    predictability: 'Quarterly Govt Announced Rate',
    marketExposure: 'Zero',
    liquidity: 'Low (Partial withdrawal after 6 yrs)',
    tenureRange: '15 Years Mandatory',
    safetyMechanism: 'Sovereign Guarantee (Govt of India)',
    taxTreatment: 'Exempt (EEE: Investment, Interest & Maturity)'
  },
  {
    name: 'Post Office Time Deposit (POTD)',
    isPrimary: false,
    predictability: 'High (Govt Contracted Rate)',
    marketExposure: 'Zero',
    liquidity: 'Premature exit after 6 months with penalty',
    tenureRange: '1, 2, 3, or 5 Years',
    safetyMechanism: 'Sovereign Guarantee (Govt of India)',
    taxTreatment: 'Taxed at slab; 5-yr eligible u/s 80C'
  }
];

export default function FixedDepositComparison() {
  const [selectedMobileIndex, setSelectedMobileIndex] = useState(0);

  return (
    <section id="fd-comparison" className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faScaleBalanced} className="text-[#032e92]" />
            <span>Side-by-Side Savings Evaluation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Fixed Deposits vs Other{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Savings & Investment Options
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Compare return predictability, liquidity, safety mechanisms, and tax treatment across popular fixed-income avenues in India.
          </p>
        </div>

        {/* Desktop Comparison Table (Hidden on small screens) */}
        <div className="hidden lg:block overflow-hidden rounded-3xl border border-gray-200/90 shadow-xl bg-white mb-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f7f9fc] border-b border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-600">
                <th className="py-4 px-5">Instrument</th>
                <th className="py-4 px-4">Return Predictability</th>
                <th className="py-4 px-4">Market Exposure</th>
                <th className="py-4 px-4">Liquidity / Exit</th>
                <th className="py-4 px-4">Tenure Options</th>
                <th className="py-4 px-4">Capital Protection</th>
                <th className="py-4 px-4">Tax Consideration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
              {comparisonData.map((item, idx) => {
                const isPrimary = item.isPrimary;
                return (
                  <tr
                    key={idx}
                    className={`transition-colors ${
                      isPrimary
                        ? 'bg-blue-50/70 hover:bg-blue-50 font-medium'
                        : 'hover:bg-gray-50/70 text-gray-700'
                    }`}
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        {isPrimary && (
                          <span className="w-2 h-2 rounded-full bg-[#032e92] animate-pulse" />
                        )}
                        <span className={`font-bold ${isPrimary ? 'text-[#032e92]' : 'text-[#0a192f]'}`}>
                          {item.name}
                        </span>
                        {isPrimary && (
                          <span className="px-2 py-0.5 rounded-full bg-[#032e92] text-white text-[10px] font-semibold">
                            Core Focus
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-gray-800">{item.predictability}</td>
                    <td className="py-4 px-4 text-gray-700">{item.marketExposure}</td>
                    <td className="py-4 px-4 text-xs text-gray-600">{item.liquidity}</td>
                    <td className="py-4 px-4 font-medium text-gray-900">{item.tenureRange}</td>
                    <td className="py-4 px-4">
                      <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-800">
                        {item.safetyMechanism}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-600">{item.taxTreatment}</td>
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
            {comparisonData.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedMobileIndex(idx)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  selectedMobileIndex === idx
                    ? 'bg-[#032e92] text-white border-[#032e92] shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {item.name.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Selected Mobile Instrument Card */}
          {(() => {
            const active = comparisonData[selectedMobileIndex];
            return (
              <div
                className={`rounded-2xl p-5 border shadow-sm ${
                  active.isPrimary ? 'bg-blue-50/70 border-blue-200' : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-gray-200/60 mb-3">
                  <h4 className="text-base font-bold text-[#0a192f]">{active.name}</h4>
                  {active.isPrimary && (
                    <span className="px-2 py-0.5 rounded-full bg-[#032e92] text-white text-[10px] font-bold">
                      Core Option
                    </span>
                  )}
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Return Predictability:</span>
                    <strong className="text-gray-900">{active.predictability}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Market Exposure:</span>
                    <strong className="text-gray-900">{active.marketExposure}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tenure Range:</span>
                    <strong className="text-[#032e92]">{active.tenureRange}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Capital Protection:</span>
                    <span className="text-gray-800 text-right max-w-[60%]">{active.safetyMechanism}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Liquidity / Exit:</span>
                    <span className="text-gray-800 text-right max-w-[60%]">{active.liquidity}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-100">
                    <span className="text-gray-500">Tax Treatment:</span>
                    <span className="text-gray-800 text-right max-w-[60%]">{active.taxTreatment}</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Regulatory Note */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-gray-200/80 flex items-start gap-3 text-xs text-gray-600 shadow-xs">
          <FontAwesomeIcon icon={faCircleInfo} className="text-[#032e92] mt-0.5 flex-shrink-0" />
          <p>
            <strong>Regulatory & Safety Note:</strong> Deposits placed with scheduled commercial banks in India are protected by the Deposit Insurance and Credit Guarantee Corporation (DICGC) up to ₹5 Lakh per depositor per bank (inclusive of both principal and interest). Corporate FDs do not carry DICGC insurance and are evaluated by independent credit rating agencies.
          </p>
        </div>
      </div>
    </section>
  );
}
