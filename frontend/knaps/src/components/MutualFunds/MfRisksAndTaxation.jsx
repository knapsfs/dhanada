import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTriangleExclamation,
  faPercent,
  faDoorOpen,
  faFileInvoiceDollar,
  faShieldHalved,
  faArrowTrendDown
} from '@fortawesome/free-solid-svg-icons';

export default function MfRisksAndTaxation() {
  const riskLevels = [
    { name: 'Low', color: 'bg-emerald-500', desc: 'Overnight & Liquid funds with minimal price volatility.' },
    { name: 'Low to Moderate', color: 'bg-teal-500', desc: 'Short-duration & banking debt funds.' },
    { name: 'Moderate', color: 'bg-blue-500', desc: 'Arbitrage & conservative hybrid funds.' },
    { name: 'Moderately High', color: 'bg-amber-500', desc: 'Balanced advantage & multi-asset allocation funds.' },
    { name: 'High', color: 'bg-orange-500', desc: 'Large cap & aggressive hybrid funds.' },
    { name: 'Very High', color: 'bg-rose-500', desc: 'Mid cap, small cap & sectoral equity schemes.' }
  ];

  return (
    <section className="py-20 lg:py-24 bg-[#f7f9fc] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-600" />
            <span>Essential Due Diligence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#032e92] tracking-tight">
            Risks & Things to Know Before Investing
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            Smart investing requires complete transparency. Familiarize yourself with market volatility, risk gauges, operational costs, and the latest taxation rules.
          </p>
        </div>

        {/* 4 Core Operational Factors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Card 1: Market Fluctuations */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <FontAwesomeIcon icon={faArrowTrendDown} className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Market Fluctuations & Volatility</h3>
                <span className="text-xs font-semibold text-slate-500">Capital Value Moves With Markets</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Mutual fund Net Asset Values (NAVs) fluctuate in response to underlying stock market movements, macroeconomic factors, interest rate cycles, and corporate earnings. While equity markets experience short-term drawdowns, history shows holding a diversified portfolio across a 5 to 7+ year horizon dramatically minimizes loss probabilities.
            </p>
          </div>

          {/* Card 2: Total Expense Ratio (TER) */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#032e92]">
                <FontAwesomeIcon icon={faPercent} className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Total Expense Ratio (TER)</h3>
                <span className="text-xs font-semibold text-slate-500">Fund Management & Advisory Fees</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              The TER represents the annual percentage deducted proportionally from the fund's assets to cover management, research, administration, and compliance. SEBI strictly caps TER based on fund size (from ~0.10% for index funds up to 2.25% for smaller active funds). The daily published NAV is already net of the expense ratio.
            </p>
          </div>

          {/* Card 3: Exit Loads & Liquidity Rules */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <FontAwesomeIcon icon={faDoorOpen} className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Exit Loads & Redemption Horizons</h3>
                <span className="text-xs font-semibold text-slate-500">Premature Withdrawal Considerations</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              An Exit Load is a fee charged by the fund house if you redeem your units within a specified duration (typically 1% if redeemed within 365 days for equity funds; graded exit load for liquid funds during the first 7 days). After this period, redemptions carry zero exit load. ELSS funds have a mandatory 3-year statutory lock-in.
            </p>
          </div>

          {/* Card 4: SEBI Risk-o-meter */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <FontAwesomeIcon icon={faShieldHalved} className="text-xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Standardized SEBI Risk-o-meter</h3>
                <span className="text-xs font-semibold text-slate-500">Mandated 6-Tier Risk Gauge</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Every mutual fund in India is mandated by SEBI to evaluate and publish its objective risk profile on the 10th of every month across 6 standardized levels:
            </p>
            {/* Risk-o-meter visual pills */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {riskLevels.map((lvl) => (
                <div key={lvl.name} className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs">
                  <span className={`w-2.5 h-2.5 rounded-full ${lvl.color} flex-shrink-0`} />
                  <span className="font-semibold text-slate-800">{lvl.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Budget 2024 Taxation Framework Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-blue-100 shadow-md shadow-blue-900/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#032e92] text-xs font-bold mb-2">
                <FontAwesomeIcon icon={faFileInvoiceDollar} />
                <span>Updated as per Budget 2024</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#032e92]">
                Mutual Fund Capital Gains Taxation Framework
              </h3>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl self-start sm:self-auto">
              Effective from July 23, 2024
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70">
                  <th className="py-3.5 px-4 rounded-l-xl">Fund Category</th>
                  <th className="py-3.5 px-4">Holding Period for LTCG</th>
                  <th className="py-3.5 px-4">LTCG Tax Rate</th>
                  <th className="py-3.5 px-4 rounded-r-xl">STCG Tax Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                <tr className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-4 font-bold text-[#032e92]">
                    Equity Mutual Funds <br />
                    <span className="text-xs font-normal text-slate-500">(&ge; 65% Equity exposure)</span>
                  </td>
                  <td className="py-4 px-4">&gt; 12 Months</td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900">12.5%</span> on gains above ₹1.25 Lakh/year <br />
                    <span className="text-xs text-emerald-600 font-semibold">(Exemption up to ₹1.25 Lakh)</span>
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    20% Flat
                  </td>
                </tr>

                <tr className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-800">
                    ELSS (Tax Saving Funds) <br />
                    <span className="text-xs font-normal text-slate-500">(Section 80C compliant)</span>
                  </td>
                  <td className="py-4 px-4">3 Years Statutory Lock-in</td>
                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-900">12.5%</span> on gains above ₹1.25 Lakh/year
                  </td>
                  <td className="py-4 px-4 text-slate-400">
                    N/A (3-Year mandatory lock-in)
                  </td>
                </tr>

                <tr className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-800">
                    Debt Mutual Funds <br />
                    <span className="text-xs font-normal text-slate-500">(&le; 35% Equity, post-Apr 2023)</span>
                  </td>
                  <td className="py-4 px-4">No LTCG benefit</td>
                  <td className="py-4 px-4 text-slate-600">
                    Taxed at individual Income Tax Slab Rate
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    Taxed at individual Income Tax Slab Rate
                  </td>
                </tr>

                <tr className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-800">
                    Hybrid Funds (35% to 65% Equity) <br />
                    <span className="text-xs font-normal text-slate-500">(Multi-Asset, Conservative Hybrid)</span>
                  </td>
                  <td className="py-4 px-4">&gt; 24 Months</td>
                  <td className="py-4 px-4 font-bold text-slate-900">
                    12.5% (No indexation benefit)
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    Taxed at individual Income Tax Slab Rate
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs text-slate-500 italic">
            *Tax rates exclude applicable surcharge and 4% Health & Education cess. Consult your chartered accountant for specific tax calculations.
          </p>
        </div>
      </div>
    </section>
  );
}
