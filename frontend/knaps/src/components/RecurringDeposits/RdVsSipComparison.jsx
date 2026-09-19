import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faScaleBalanced,
  faShieldHalved,
  faChartLine,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const sipComparisonData = [
  {
    parameter: 'Core Investment Mechanism',
    rd: 'Monthly deposit into a fixed-income bank account',
    sip: 'Monthly investment into market-linked mutual fund units'
  },
  {
    parameter: 'Return Predictability',
    rd: 'Predetermined & guaranteed by contract for full tenure',
    sip: 'Market-linked, variable based on fund NAV performance'
  },
  {
    parameter: 'Market Volatility Exposure',
    rd: 'Zero market risk; insulated from stock/bond volatility',
    sip: 'Subject to equity/debt market cycles and NAV fluctuations'
  },
  {
    parameter: 'Capital Protection',
    rd: 'Insured up to ₹5 Lakh by DICGC (in scheduled banks)',
    sip: 'No capital guarantee; NAV fluctuates with underlying assets'
  },
  {
    parameter: 'Tenure & Flexibility',
    rd: 'Fixed tenure chosen at start (6m – 10y); penalty on break',
    sip: 'Perpetual/open-ended; pause, stop, or modify anytime without exit loads (after initial period)'
  },
  {
    parameter: 'Tax Treatment on Gains',
    rd: 'Interest added to income and taxed at your slab rate',
    sip: 'Equity: 12.5% LTCG above ₹1.25L, 20% STCG. Debt: Slab rate'
  },
  {
    parameter: 'Inflation-Beating Potential',
    rd: 'Moderate; typically matches or closely tracks CPI',
    sip: 'High over long horizons (7+ years) via equity compounding'
  },
  {
    parameter: 'Ideal Time Horizon',
    rd: 'Short to Medium Term (6 Months to 3 Years)',
    sip: 'Medium to Long Term (5 Years to 15+ Years)'
  }
];

export default function RdVsSipComparison() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faScaleBalanced} />
            <span>Asset Allocation Perspective</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            RD vs Systematic Investment Plan (SIP)
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Both instruments encourage monthly financial discipline, but serve complementary roles across your savings and investment spectrum.
          </p>
        </div>

        {/* Side-by-side Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* RD Card */}
          <div className="p-8 rounded-3xl bg-[#f7f9fc] border border-blue-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#032e92] text-white flex items-center justify-center text-lg">
                  <FontAwesomeIcon icon={faShieldHalved} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#032e92]">Recurring Deposit (RD)</h3>
                  <span className="text-xs text-slate-500">Fixed Income • Capital Stability</span>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-[#032e92]">
                Guaranteed Yield
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Prioritizes absolute certainty of capital and predetermined maturity value. Unaffected by bull or bear equity markets, making it the bedrock for non-negotiable near-term milestone funding.
            </p>
          </div>

          {/* SIP Card */}
          <div className="p-8 rounded-3xl bg-[#f7f9fc] border border-indigo-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-700 text-white flex items-center justify-center text-lg">
                  <FontAwesomeIcon icon={faChartLine} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-indigo-950">Mutual Fund SIP</h3>
                  <span className="text-xs text-slate-500">Market-Linked • Wealth Growth</span>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800">
                Growth Potential
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Prioritizes long-term inflation-beating wealth creation by participating in India’s corporate earnings growth. Fluctuates in the short term but historically rewards disciplined multi-year compounding.
            </p>
          </div>
        </div>

        {/* Detailed Neutral Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/3">
                    Comparison Parameter
                  </th>
                  <th className="py-4 px-6 text-xs font-extrabold text-[#032e92] uppercase tracking-wider bg-blue-50/60 border-x border-blue-100 w-1/3">
                    Recurring Deposit (RD)
                  </th>
                  <th className="py-4 px-6 text-xs font-extrabold text-indigo-900 uppercase tracking-wider w-1/3">
                    Mutual Fund SIP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {sipComparisonData.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{item.parameter}</td>
                    <td className="py-4 px-6 text-slate-700 bg-blue-50/20 border-x border-blue-100/60">
                      {item.rd}
                    </td>
                    <td className="py-4 px-6 text-slate-700">{item.sip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Balance Conclusion */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center max-w-4xl mx-auto">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Balanced Financial Strategy:</strong> Many prudent savers maintain both—directing short-term target funds (1–3 years) into an RD for locked predictability, while committing long-term surplus (5+ years) to equity SIPs to outpace inflation. Neither instrument is universally superior; each solves for distinct time horizons and risk tolerances.
          </p>
        </div>
      </div>
    </section>
  );
}
