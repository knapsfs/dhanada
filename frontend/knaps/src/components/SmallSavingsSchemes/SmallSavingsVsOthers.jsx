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
    sss: 'Sovereign Post Office schemes (POTD, KVP, NSC, PORD) with lump sum or monthly options',
    fd: 'One-time lump-sum deposit with scheduled commercial banks',
    rd: 'Monthly fixed installment with commercial banks or Post Office',
    mf: 'Market-linked pooled investment via AMFI-registered Asset Management Companies',
    bonds: 'Debt securities issued by Central/State Govts, PSUs, or Corporates'
  },
  {
    parameter: 'Return Characteristics',
    sss: 'Government-notified sovereign fixed rates locked at deposit (6.7% – 7.7% p.a.)',
    fd: 'Pre-contracted fixed interest rate locked on Day 1 (6.0% – 7.5%)',
    rd: 'Pre-contracted fixed interest rate locked on Day 1 (6.5% – 7.5%)',
    mf: 'Market-linked variable returns (NAV reflects underlying portfolio value)',
    bonds: 'Fixed coupon payouts periodically with capital returned at maturity'
  },
  {
    parameter: 'Market Volatility Exposure',
    sss: 'Zero market risk; backed 100% by the sovereign guarantee of India',
    fd: 'Zero market risk; backed by bank balance sheet & DICGC cover up to ₹5L',
    rd: 'Zero market risk; backed by bank balance sheet & DICGC cover up to ₹5L',
    mf: 'Direct market exposure (Equity, credit, or interest rate duration risk)',
    bonds: 'Subject to interest rate sensitivity and mark-to-market trading volatility'
  },
  {
    parameter: 'Liquidity & Lock-In',
    sss: 'Defined statutory tenures (1 to 9.5 years / 115 months); loan / premature exit rules apply',
    fd: 'High liquidity; premature withdrawal permitted with 0.5%–1% penalty',
    rd: 'High liquidity; premature withdrawal permitted with 0.5%–1% penalty',
    mf: 'High liquidity (T+1 / T+2 days for open-ended funds; 3-year lock-in for ELSS)',
    bonds: 'Tradable on secondary debt exchanges, subject to market liquidity'
  },
  {
    parameter: 'Tax Considerations',
    sss: 'Sec 80C deduction (NSC & 5Y POTD); Interest taxed at slab rate with No TDS by Post Office',
    fd: 'Interest fully taxed at individual slab rates; 5y FD qualifies for 80C',
    rd: 'Interest fully taxed at individual slab rates; No 80C deduction',
    mf: 'Equity: 12.5% LTCG, 20% STCG. Debt: Taxed at slab rate. ELSS gets 80C',
    bonds: 'Interest coupon taxed at slab rate; Listed bonds subject to capital gains tax'
  },
  {
    parameter: 'Risk Characteristics',
    sss: 'Zero credit risk (Direct sovereign guarantee from Consolidated Fund of India)',
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
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Post Office Small Savings vs <span className="text-[#032e92]">Other Investment Avenues</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mt-3.5">
            A balanced comparison of Post Office Small Savings Schemes (POTD, KVP, NSC, PORD) alongside Bank FDs, Recurring Deposits, Mutual Funds, and Corporate/Govt Bonds.
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
                    Post Office Schemes (POTD, KVP, NSC, PORD)
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


      </div>
    </section>
  );
}
