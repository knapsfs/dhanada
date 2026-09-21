import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faScaleBalanced,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const multiAssetRows = [
  {
    parameter: 'Investment Structure',
    sss: 'Sovereign schemes managed via Post Office / Banks (Lump sum or periodic)',
    fd: 'One-time lump-sum deposit with scheduled commercial banks',
    rd: 'Monthly fixed installment with commercial banks or Post Office',
    mf: 'Market-linked pooled investment via AMFI-registered Asset Management Companies',
    bonds: 'Debt securities issued by Central/State Govts, PSUs, or Corporates'
  },
  {
    parameter: 'Return Characteristics',
    sss: 'Government-notified fixed or quarterly adjusted rates (6.7% – 8.2%)',
    fd: 'Pre-contracted fixed interest rate locked on Day 1 (6.0% – 7.5%)',
    rd: 'Pre-contracted fixed interest rate locked on Day 1 (6.5% – 7.5%)',
    mf: 'Market-linked variable returns (NAV reflects underlying portfolio value)',
    bonds: 'Fixed coupon payouts periodically with capital returned at maturity'
  },
  {
    parameter: 'Market Volatility Exposure',
    sss: 'Zero market risk; insulated from secondary market price fluctuations',
    fd: 'Zero market risk; backed by bank balance sheet & DICGC cover up to ₹5L',
    rd: 'Zero market risk; backed by bank balance sheet & DICGC cover up to ₹5L',
    mf: 'Direct market exposure (Equity, credit, or interest rate duration risk)',
    bonds: 'Subject to interest rate sensitivity and mark-to-market trading volatility'
  },
  {
    parameter: 'Liquidity & Lock-In',
    sss: 'Defined statutory tenures (1 to 21 years); conditional premature exit',
    fd: 'High liquidity; premature withdrawal permitted with 0.5%–1% penalty',
    rd: 'High liquidity; premature withdrawal permitted with 0.5%–1% penalty',
    mf: 'High liquidity (T+1 / T+2 days for open-ended funds; 3-year lock-in for ELSS)',
    bonds: 'Tradable on secondary debt exchanges, subject to market liquidity'
  },
  {
    parameter: 'Tax Considerations',
    sss: 'Select EEE schemes (PPF, SSY); 80C deductions (SCSS, NSC, 5y TD)',
    fd: 'Interest fully taxed at individual slab rates; 5y FD qualifies for 80C',
    rd: 'Interest fully taxed at individual slab rates; No 80C deduction',
    mf: 'Equity: 12.5% LTCG, 20% STCG. Debt: Taxed at slab rate. ELSS gets 80C',
    bonds: 'Interest coupon taxed at slab rate; Listed bonds subject to capital gains tax'
  },
  {
    parameter: 'Risk Characteristics',
    sss: 'Lowest credit risk (Direct sovereign guarantee of Government of India)',
    fd: 'Very low risk (DICGC insurance coverage up to ₹5 Lakh per bank)',
    rd: 'Very low risk (DICGC insurance coverage up to ₹5 Lakh per bank)',
    mf: 'Variable risk profile (Low in liquid debt funds to High in equity funds)',
    bonds: 'Sovereign for G-Secs; Credit risk varies for PSU and Corporate papers'
  }
];

export default function SmallSavingsVsOthers() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faScaleBalanced} />
            <span>Multi-Asset Context</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Small Savings vs Other Investment Avenues
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            A balanced comparison of small savings schemes alongside Bank FDs, Recurring Deposits, Mutual Funds, and Corporate/Govt Bonds.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="bg-[#f7f9fc] rounded-3xl border border-slate-200/80 shadow-md overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200">
                  <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/6">
                    Parameter
                  </th>
                  <th className="py-4 px-5 text-xs font-extrabold text-[#032e92] uppercase tracking-wider bg-blue-50/70 border-x border-blue-100 w-1/5">
                    Small Savings Schemes
                  </th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-700 uppercase tracking-wider w-1/6">
                    Fixed Deposits (FD)
                  </th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-700 uppercase tracking-wider w-1/6">
                    Recurring Deposits (RD)
                  </th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-700 uppercase tracking-wider w-1/6">
                    Mutual Funds
                  </th>
                  <th className="py-4 px-5 text-xs font-bold text-slate-700 uppercase tracking-wider w-1/6">
                    Bonds / Debentures
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 text-xs sm:text-sm bg-white">
                {multiAssetRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-900">{row.parameter}</td>
                    <td className="py-4 px-5 font-semibold text-[#032e92] bg-blue-50/20 border-x border-blue-100/60 leading-relaxed">
                      {row.sss}
                    </td>
                    <td className="py-4 px-5 text-slate-700 leading-relaxed">{row.fd}</td>
                    <td className="py-4 px-5 text-slate-700 leading-relaxed">{row.rd}</td>
                    <td className="py-4 px-5 text-slate-700 leading-relaxed">{row.mf}</td>
                    <td className="py-4 px-5 text-slate-700 leading-relaxed">{row.bonds}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Objective Balance Note */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Portfolio Coexistence:</strong> No single asset class fits every need. Prudent financial plans allocate across Small Savings Schemes (for absolute safety and EEE tax relief), Mutual Funds (for inflation-beating long-term equity growth), and Bank FDs (for immediate emergency liquidity).
          </p>
          <button
            onClick={() =>
              openLeadModal({
                title: 'Multi-Asset Allocation Advisory',
                defaultService: 'Small Savings Schemes'
              })
            }
            className="btn-ripple px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>Consult Asset Allocation</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
          </button>
        </div>
      </div>
    </section>
  );
}
