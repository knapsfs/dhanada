import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faLandmark,
  faBuildingColumns
} from "@fortawesome/free-solid-svg-icons";

const tenureBreakdowns = [
  { product: "Bank FD (1Y)", type: "Fixed Deposit", tenure: "1 Year", principal: "₹1,00,000", interest: "₹7,250", maturity: "₹1,07,250", effectiveYield: "7.25% p.a." },
  { product: "Corporate FD (3Y)", type: "Fixed Deposit", tenure: "3 Years", principal: "₹1,00,000", interest: "₹26,800", maturity: "₹1,26,800", effectiveYield: "8.25% p.a." },
  { product: "54EC Bonds (5Y)", type: "GoI Bond", tenure: "5 Years", principal: "₹1,00,000", interest: "₹26,250", maturity: "₹1,26,250", effectiveYield: "5.25% + LTCG Saved" },
  { product: "RBI FRSB (7Y)", type: "GoI Bond", tenure: "7 Years", principal: "₹1,00,000", interest: "₹56,350", maturity: "₹1,56,350", effectiveYield: "8.05% Sovereign" }
];

export default function FixedDepositInterestMaturity() {

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faChartLine} className="text-[#032e92]" />
            <span>Yield & Cashflow Mechanics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Interest Payout &{" "}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Compounding Dynamics
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Understand how interest generates income across cumulative compounding FDs, regular non-cumulative monthly payouts, and semi-annual sovereign bond coupons.
          </p>
        </div>

        {/* 2 Mechanics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Card 1: Cumulative vs Non-Cumulative FDs */}
          <div className="bg-[#f7f9fc] rounded-3xl p-8 border border-gray-200/80 hover:bg-white hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#032e92] mb-6 shadow-xs">
              <FontAwesomeIcon icon={faBuildingColumns} className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-[#0a192f] mb-3">
              Fixed Deposit Payout Options
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
              When booking a Fixed Deposit, you can tailor your interest structure to your specific liquidity requirements:
            </p>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-white border border-gray-100">
                <span className="font-bold text-[#032e92] block mb-1">Cumulative FD (Reinvestment Plan)</span>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Interest is compounded quarterly and paid in full along with the principal upon maturity. Ideal for long-term goal accumulation.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-gray-100">
                <span className="font-bold text-[#032e92] block mb-1">Non-Cumulative FD (Periodic Payout)</span>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Interest is calculated and paid out at regular monthly, quarterly, or annual intervals directly to your bank account. Perfect for retirees needing steady pension-like cashflow.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Sovereign GoI Bond Coupons */}
          <div className="bg-[#f7f9fc] rounded-3xl p-8 border border-gray-200/80 hover:bg-white hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-6 shadow-xs">
              <FontAwesomeIcon icon={faLandmark} className="text-xl" />
            </div>
            <h3 className="text-xl font-bold text-[#0a192f] mb-3">
              Government of India (GoI) Bond Payouts
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
              Sovereign bonds issue semi-annual or annual coupon payments backed directly by the Reserve Bank of India:
            </p>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-white border border-gray-100">
                <span className="font-bold text-emerald-700 block mb-1">RBI FRSB Semi-Annual Payouts</span>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Earn interest credited twice a year on <strong>January 1st</strong> and <strong>July 1st</strong>. The coupon rate resets every 6 months pegged at 35 bps over the prevailing NSC rate.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-gray-100">
                <span className="font-bold text-emerald-700 block mb-1">Section 54EC Annual Coupon</span>
                <p className="text-gray-600 text-xs leading-relaxed">
                  54EC Capital Gain bonds (REC/PFC/NHAI) pay an annual interest coupon of 5.25% p.a., while 100% of your real estate LTCG is legally tax-exempt up to ₹50 Lakhs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Illustrative Yield Breakdown Table */}
        <div className="overflow-x-auto rounded-3xl border border-gray-200/90 shadow-md bg-white">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-xs uppercase font-bold tracking-wider">
                <th className="py-3.5 px-5">Instrument</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Tenure</th>
                <th className="py-3.5 px-5">Principal</th>
                <th className="py-3.5 px-5">Estimated Interest</th>
                <th className="py-3.5 px-5">Total Maturity Proceeds</th>
                <th className="py-3.5 px-5">Indicative Yield</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
              {tenureBreakdowns.map((item, idx) => (
                <tr key={idx} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-[#0a192f]">{item.product}</td>
                  <td className="py-3.5 px-5 text-gray-500">{item.type}</td>
                  <td className="py-3.5 px-5 text-gray-700">{item.tenure}</td>
                  <td className="py-3.5 px-5 text-gray-700">{item.principal}</td>
                  <td className="py-3.5 px-5 font-semibold text-emerald-600">+{item.interest}</td>
                  <td className="py-3.5 px-5 font-bold text-[#032e92]">{item.maturity}</td>
                  <td className="py-3.5 px-5 font-semibold text-gray-800">{item.effectiveYield}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
