import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoiceDollar,
  faScaleBalanced,
  faShieldHalved,
  faCircleInfo,
  faLandmark,
  faCoins
} from "@fortawesome/free-solid-svg-icons";

export default function FixedDepositTaxation() {
  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faScaleBalanced} className="text-[#032e92]" />
            <span>Taxation & Exemptions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Tax Rules for{" "}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Fixed Deposits & GoI Bonds
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Understand how interest income, TDS, capital gain exemptions (Section 54EC), and tax-free maturities work across your fixed income holdings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
          <div className="bg-[#f7f9fc] rounded-3xl p-7 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#032e92]">
                <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0a192f]">FD Interest & TDS (Sec 194A)</h3>
                <span className="text-xs text-blue-700 font-semibold">Taxed at Marginal Slab</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Interest earned on Bank & Corporate FDs is added to your total income and taxed at your applicable slab rate. Banks deduct 10% TDS if interest exceeds <strong>₹40,000</strong>/year (or <strong>₹50,000</strong> for senior citizens). If total taxable income is below the threshold, submit <strong>Form 15G / 15H</strong> for zero TDS deduction.
            </p>
            <div className="pt-2 border-t border-gray-200/60 text-xs text-gray-500">
              *Senior citizens can claim deduction up to ₹50,000 on bank interest under Section 80TTB.
            </div>
          </div>

          <div className="bg-[#f7f9fc] rounded-3xl p-7 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-700">
                <FontAwesomeIcon icon={faShieldHalved} className="text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0a192f]">Section 54EC Property Tax Exemption</h3>
                <span className="text-xs text-indigo-700 font-semibold">Save Up to ₹50 Lakhs LTCG Tax</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              When you sell land or residential/commercial property, you can invest your Long Term Capital Gains (LTCG) into 54EC Bonds (REC, PFC, IRFC, NHAI) within 6 months of sale. The invested capital (up to ₹50 Lakhs) is <strong>100% exempt from capital gains tax</strong>, while yielding 5.25% annual interest over a 5-year tenure.
            </p>
            <div className="pt-2 border-t border-gray-200/60 text-xs text-gray-500">
              *Annual interest is taxable at slab, but entire real estate capital gain is protected.
            </div>
          </div>

          <div className="bg-[#f7f9fc] rounded-3xl p-7 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700">
                <FontAwesomeIcon icon={faLandmark} className="text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0a192f]">RBI Floating Rate Bonds (FRSB)</h3>
                <span className="text-xs text-emerald-700 font-semibold">Semi-Annual Taxable Coupon</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Interest on RBI Floating Rate Savings Bonds (currently 8.05% p.a.) is fully taxable under other sources at your marginal income tax slab. TDS is deducted at the time of semi-annual interest payment unless eligible exemption certificates (Form 15G/15H) are registered.
            </p>
            <div className="pt-2 border-t border-gray-200/60 text-xs text-gray-500">
              *Ideal for conservative investors prioritizing sovereign security over tax arbitrage.
            </div>
          </div>

          <div className="bg-[#f7f9fc] rounded-3xl p-7 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700">
                <FontAwesomeIcon icon={faCoins} className="text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0a192f]">Sovereign Gold Bonds (SGB)</h3>
                <span className="text-xs text-amber-700 font-semibold">100% Tax-Free Capital Gain</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              While the 2.50% p.a. semi-annual interest is taxable at your slab rate, the capital gains arising on redemption upon the 8-year maturity are <strong>completely exempt from income tax</strong> under Section 47 of the Income Tax Act, making SGBs the most tax-efficient fixed income vehicle for gold.
            </p>
            <div className="pt-2 border-t border-gray-200/60 text-xs text-gray-500">
              *Secondary market sales before maturity attract LTCG with indexation benefits.
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-blue-50/70 border border-blue-100 flex items-start gap-3.5 text-xs text-gray-700 max-w-4xl mx-auto shadow-xs">
          <FontAwesomeIcon icon={faCircleInfo} className="text-[#032e92] mt-0.5 text-sm flex-shrink-0" />
          <p className="leading-relaxed">
            <strong>Tax Disclaimer:</strong> Tax provisions, exemptions, and TDS thresholds are governed by the Income Tax Act, 1961, and are subject to legislative updates. Investors should consult their Chartered Accountant or financial advisor to optimize their post-tax fixed income yields.
          </p>
        </div>
      </div>
    </section>
  );
}
