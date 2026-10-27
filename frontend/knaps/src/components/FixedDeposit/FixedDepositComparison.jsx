import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faScaleBalanced,
  faCircleInfo,
  faBuildingColumns,
  faLandmark
} from "@fortawesome/free-solid-svg-icons";

const comparisonData = [
  {
    name: "Scheduled Bank FD",
    category: "Fixed Deposit",
    isPrimary: true,
    safetyMechanism: "DICGC Insured up to ₹5 Lakh per bank",
    indicativeYield: "6.50% - 7.50% (+0.50% Seniors)",
    creditRisk: "Extremely Low (RBI Regulated)",
    tenureRange: "7 Days to 10 Years",
    payoutFrequency: "Monthly, Quarterly, or Cumulative",
    liquidity: "Premature withdrawal allowed (minor 0.5-1% penalty)",
    taxTreatment: "Taxed at marginal slab rate; TDS u/s 194A"
  },
  {
    name: "Corporate / NBFC FD",
    category: "Fixed Deposit",
    isPrimary: false,
    safetyMechanism: "Credit Rating (CRISIL / ICRA AAA & AA)",
    indicativeYield: "7.75% - 8.60%+ p.a.",
    creditRisk: "Low to Moderate (Issuer dependent)",
    tenureRange: "1 Year to 5 Years",
    payoutFrequency: "Monthly, Quarterly, Annual, Cumulative",
    liquidity: "Premature exit per issuer rules (3-month lock-in)",
    taxTreatment: "Taxed at marginal slab rate; TDS u/s 194A"
  },
  {
    name: "RBI Floating Rate Savings Bonds (FRSB)",
    category: "GoI Bond",
    isPrimary: true,
    safetyMechanism: "100% Sovereign Guarantee (Govt of India)",
    indicativeYield: "8.05% p.a. (Floating, NSC + 35 bps)",
    creditRisk: "Zero (Direct Sovereign Backing)",
    tenureRange: "7 Years (Early exit for seniors aged 60+)",
    payoutFrequency: "Semi-Annual (Jan 1 & Jul 1)",
    liquidity: "Non-transferable; no secondary trade",
    taxTreatment: "Taxed at slab rate; TDS applicable as per rules"
  },
  {
    name: "Section 54EC Capital Gain Bonds",
    category: "GoI Bond",
    isPrimary: false,
    safetyMechanism: "PSU Sovereign Equivalent (REC, PFC, IRFC, NHAI)",
    indicativeYield: "5.25% p.a. (Annual Coupon)",
    creditRisk: "Zero / AAA Public Sector",
    tenureRange: "5 Years (Strict Lock-in)",
    payoutFrequency: "Annual Interest Payout",
    liquidity: "Non-transferable; cannot be pledged",
    taxTreatment: "100% LTCG Tax Exemption up to ₹50 Lakhs"
  },
  {
    name: "Sovereign Gold Bonds (SGB)",
    category: "GoI Bond",
    isPrimary: false,
    safetyMechanism: "100% Sovereign Guarantee (Govt of India)",
    indicativeYield: "2.50% p.a. + Gold Price Appreciation",
    creditRisk: "Zero Credit Risk (Gold price volatility applies)",
    tenureRange: "8 Years (Exit window after Year 5)",
    payoutFrequency: "Semi-Annual Cash Coupon",
    liquidity: "Tradable on stock exchanges",
    taxTreatment: "100% Tax-Free capital gain at maturity"
  },
  {
    name: "Debt Mutual Funds",
    category: "Market Linked",
    isPrimary: false,
    safetyMechanism: "Portfolio Diversification & Credit Quality",
    indicativeYield: "Market-linked Yield to Maturity (~7.0% - 7.5%)",
    creditRisk: "Subject to credit & interest rate risk",
    tenureRange: "Overnight to 10+ Years",
    payoutFrequency: "Cumulative (Growth) or IDCW",
    liquidity: "T+1 / T+2 redemption (Exit load may apply)",
    taxTreatment: "Taxed at marginal slab rate (No indexation)"
  }
];

export default function FixedDepositComparison() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredData = activeTab === "all"
    ? comparisonData
    : activeTab === "fd"
    ? comparisonData.filter(d => d.category === "Fixed Deposit")
    : comparisonData.filter(d => d.category === "GoI Bond");

  return (
    <section id="fd-comparison" className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faScaleBalanced} className="text-[#032e92]" />
            <span>Side-by-Side Evaluation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Compare{" "}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Fixed Deposits vs GoI Bonds
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Understand how Bank FDs, Corporate FDs, and Sovereign Government Bonds compare across security, returns, liquidity, and taxation.
          </p>

          {/* Tab Filter */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-[#032e92] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Instruments
            </button>
            <button
              onClick={() => setActiveTab("fd")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "fd"
                  ? "bg-[#032e92] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FontAwesomeIcon icon={faBuildingColumns} className="text-xs" />
              <span>Fixed Deposits</span>
            </button>
            <button
              onClick={() => setActiveTab("bonds")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "bonds"
                  ? "bg-[#032e92] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <FontAwesomeIcon icon={faLandmark} className="text-xs" />
              <span>GoI Bonds</span>
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-3xl border border-gray-200/90 shadow-xl bg-white">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-gradient-to-r from-[#0a192f] to-[#032e92] text-white">
                <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider">Product / Instrument</th>
                <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider">Safety & Guarantee</th>
                <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider">Indicative Yield</th>
                <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider">Credit Risk</th>
                <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider">Tenure & Lock-in</th>
                <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider">Income Payout</th>
                <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider">Tax Treatment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
              {filteredData.map((row, idx) => (
                <tr
                  key={row.name}
                  className={`hover:bg-blue-50/40 transition-colors ${
                    row.isPrimary ? "bg-blue-50/20 font-medium" : idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  <td className="py-4 px-5 font-bold text-[#0a192f]">
                    <div className="flex items-center gap-2">
                      {row.isPrimary && (
                        <span className="w-2 h-2 rounded-full bg-[#032e92]" />
                      )}
                      <div>
                        <div>{row.name}</div>
                        <span className="text-[10px] text-gray-500 font-normal uppercase tracking-wider">
                          {row.category}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-gray-700">{row.safetyMechanism}</td>
                  <td className="py-4 px-5 font-bold text-[#032e92]">{row.indicativeYield}</td>
                  <td className="py-4 px-5 text-gray-700">{row.creditRisk}</td>
                  <td className="py-4 px-5 text-gray-700">{row.tenureRange}</td>
                  <td className="py-4 px-5 text-gray-700">{row.payoutFrequency}</td>
                  <td className="py-4 px-5 text-gray-600 text-xs">{row.taxTreatment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Informational Guidance Footer */}
        <div className="mt-6 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-3 text-xs text-gray-600">
          <FontAwesomeIcon icon={faCircleInfo} className="text-[#032e92] text-sm mt-0.5 flex-shrink-0" />
          <p className="leading-relaxed">
            <strong>KNAPS Asset Allocation Insight:</strong> Conservative investors seeking maximum safety can anchor their debt portfolio with 100% sovereign <strong>Government of India (GoI) Bonds</strong> for high yield and zero default risk, while utilizing <strong>Scheduled Bank FDs</strong> for emergency liquidity and laddered maturity dates.
          </p>
        </div>
      </div>
    </section>
  );
}
