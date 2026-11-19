import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTableList,
  faCheckCircle,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const comparisonData = [
  {
    feature: 'Primary Purpose',
    nps: 'Dedicated long-term retirement corpus & lifelong annuity pension',
    mf: 'General wealth accumulation across varying time horizons',
    fd: 'Capital preservation & fixed predictable interest income'
  },
  {
    feature: 'Market Exposure',
    nps: 'Market-linked (Equities E, Corporate Debt C, G-Secs G, Alternatives A)',
    mf: 'Market-linked (Equity, Debt, Hybrid, Sectoral, Commodity schemes)',
    fd: 'Zero market risk; contracted interest guaranteed by issuing bank'
  },
  {
    feature: 'Liquidity & Lock-In',
    nps: 'Tier I locked until age 60 (conditional partial exits); Tier II liquid',
    mf: 'High liquidity (open-ended schemes exit in T+1/T+2 days; ELSS has 3y lock-in)',
    fd: 'High liquidity (Premature withdrawal allowed with 0.5%–1% interest penalty)'
  },
  {
    feature: 'Expense Ratio / Fees',
    nps: 'Ultra-low (~0.09% p.a. fund management fee)',
    mf: 'Moderate to high (0.5% to 2.25% p.a. depending on scheme/TER)',
    fd: 'Zero explicit management fees'
  },
  {
    feature: 'Retirement Focus',
    nps: '100% retirement-centric with mandatory 40% annuity conversion at 60',
    mf: 'Flexible; can be used for retirement, education, home, or general goals',
    fd: 'Short to medium-term savings, capital safety, emergency parking'
  },
  {
    feature: 'Tax Deductions on Investment',
    nps: 'Sec 80CCD(1) up to ₹1.5L + exclusive ₹50,000 u/s 80CCD(1B) + 80CCD(2)',
    mf: 'Only ELSS qualifies for deduction under Section 80C (up to ₹1.5L)',
    fd: 'Only 5-Year Tax-Saver FDs qualify under Section 80C (up to ₹1.5L)'
  },
  {
    feature: 'Maturity Tax Treatment',
    nps: '60% Lump Sum is 100% tax-free; 40% annuity is tax-exempt at purchase',
    mf: 'Equity: 12.5% LTCG above ₹1.25L, 20% STCG. Debt: Taxed at slab rate',
    fd: 'Interest added to income and taxed at your marginal slab rate'
  },
  {
    feature: 'Investment Choice Flexibility',
    nps: 'Active Choice (custom E, C, G, A) or Auto Choice (LC75, LC50, LC25)',
    mf: 'Thousands of specialized active and passive schemes across asset classes',
    fd: 'Choice of issuer, tenure (7 days to 10 years), and payout frequency'
  },
  {
    feature: 'Risk Characteristics',
    nps: 'Market-linked risk tempered by age-based automated rebalancing options',
    mf: 'Depends on fund category (Low in Liquid funds to High in Small-Cap)',
    fd: 'Zero market volatility; covered up to ₹5 Lakh under DICGC insurance'
  }
];

export default function NpsComparisonTable() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faTableList} />
            <span>Comparative Perspective</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            NPS vs Mutual Funds vs Fixed Deposits
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Compare purpose, market exposures, liquidity constraints, and tax treatments across India’s premier investment and savings avenues.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="py-5 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/4">
                    Comparison Parameter
                  </th>
                  <th className="py-5 px-6 text-xs font-extrabold text-[#032e92] uppercase tracking-wider bg-blue-50/60 border-x border-blue-100 w-1/4">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#032e92]" />
                      National Pension System (NPS)
                    </span>
                  </th>
                  <th className="py-5 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider w-1/4">
                    Mutual Funds
                  </th>
                  <th className="py-5 px-6 text-xs font-bold text-slate-700 uppercase tracking-wider w-1/4">
                    Fixed Deposits (FD)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{row.feature}</td>
                    <td className="py-4 px-6 font-semibold text-[#032e92] bg-blue-50/30 border-x border-blue-100/60 leading-relaxed">
                      {row.nps}
                    </td>
                    <td className="py-4 px-6 text-slate-700 leading-relaxed">{row.mf}</td>
                    <td className="py-4 px-6 text-slate-600 leading-relaxed">{row.fd}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Neutral Balanced Takeaway */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Portfolio Coexistence:</strong> A sound financial plan rarely relies on just one vehicle. Many individuals utilize Fixed Deposits for short-term liquidity, Mutual Funds for medium-term flexibility, and NPS for dedicated low-cost retirement compounding and Section 80CCD(1B) tax optimization.
          </p>
          <button
            onClick={() =>
              openLeadModal({
                title: 'NPS vs MF Portfolio Allocation Consultation',
                defaultService: 'National Pension System (NPS)'
              })
            }
            className="btn-ripple px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-2"
          >
            <span>Consult an Advisor</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
          </button>
        </div>
      </div>
    </section>
  );
}
