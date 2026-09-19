import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoiceDollar,
  faScaleBalanced,
  faShieldHalved,
  faFileContract,
  faCircleInfo,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

export default function FixedDepositTaxation() {
  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faScaleBalanced} className="text-[#032e92]" />
            <span>Taxation & Statutory Rules</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Taxation & Important{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              TDS Considerations
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Understanding how FD interest is taxed, when banks deduct TDS, and how eligible depositors can optimize tax compliance using Form 15G or 15H.
          </p>
        </div>

        {/* 4 Core Tax Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
          {/* Pillar 1: Slab Rate Taxation */}
          <div className="bg-[#f7f9fc] rounded-3xl p-7 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#032e92]">
                <FontAwesomeIcon icon={faFileInvoiceDollar} className="text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0a192f]">Taxable at Slab Rates</h3>
                <span className="text-xs text-blue-700 font-semibold">Income from Other Sources</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Interest earned on Fixed Deposits is added to your total gross income and taxed as per your applicable income tax slab rate (plus applicable surcharge and 4% cess). In cumulative FDs, tax liability accrues annually, even though the interest is received upon maturity.
            </p>
            <div className="pt-2 border-t border-gray-200/60 text-xs text-gray-500">
              *Applies equally under both the Old and New Tax Regimes.
            </div>
          </div>

          {/* Pillar 2: TDS Thresholds u/s 194A */}
          <div className="bg-[#f7f9fc] rounded-3xl p-7 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-700">
                <FontAwesomeIcon icon={faScaleBalanced} className="text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0a192f]">TDS Thresholds (Section 194A)</h3>
                <span className="text-xs text-indigo-700 font-semibold">10% Standard TDS Rate</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Banks deduct 10% TDS if aggregate annual interest across all branches of a bank exceeds <strong>₹40,000</strong> for individuals (below age 60) or <strong>₹50,000</strong> for senior citizens. If your PAN is not seeded, TDS is deducted at a penal rate of <strong>20%</strong>.
            </p>
            <div className="pt-2 border-t border-gray-200/60 text-xs text-gray-500">
              *TDS is an advance tax deduction; final tax liability depends on your total annual income.
            </div>
          </div>

          {/* Pillar 3: Form 15G & Form 15H */}
          <div className="bg-[#f7f9fc] rounded-3xl p-7 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700">
                <FontAwesomeIcon icon={faFileContract} className="text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0a192f]">Form 15G & Form 15H</h3>
                <span className="text-xs text-emerald-700 font-semibold">Zero TDS Self-Declaration</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              If your total taxable income for the financial year is below the basic tax exemption limit, you can submit <strong>Form 15G</strong> (for individuals under 60) or <strong>Form 15H</strong> (for senior citizens aged 60+) at the beginning of each financial year to request banks not to deduct TDS.
            </p>
            <div className="pt-2 border-t border-gray-200/60 text-xs text-gray-500">
              *Must be resubmitted annually at the start of every financial year (April).
            </div>
          </div>

          {/* Pillar 4: Section 80TTB for Senior Citizens */}
          <div className="bg-[#f7f9fc] rounded-3xl p-7 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700">
                <FontAwesomeIcon icon={faShieldHalved} className="text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0a192f]">Section 80TTB Exemption</h3>
                <span className="text-xs text-amber-700 font-semibold">Up to ₹50,000 for Seniors</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Resident senior citizens (aged 60 and above) can claim a dedicated income tax deduction of up to <strong>₹50,000</strong> per financial year on interest income earned from bank, post office, and co-operative bank deposits under Section 80TTB of the Income Tax Act.
            </p>
            <div className="pt-2 border-t border-gray-200/60 text-xs text-gray-500">
              *Available under the Old Tax Regime to lower taxable interest income directly.
            </div>
          </div>
        </div>

        {/* Informative Tax Summary Banner */}
        <div className="p-6 rounded-3xl bg-blue-50/70 border border-blue-100 flex items-start gap-3.5 text-xs text-gray-700 max-w-4xl mx-auto shadow-xs">
          <FontAwesomeIcon icon={faCircleInfo} className="text-[#032e92] mt-0.5 text-sm flex-shrink-0" />
          <p className="leading-relaxed">
            <strong>Tax Disclaimer:</strong> Tax provisions, exemptions, and TDS thresholds are governed by the Income Tax Act, 1961, and are subject to legislative updates announced in the Union Budget. Investors should evaluate their individual tax bracket or consult a qualified Chartered Accountant / tax professional before planning deposit distributions.
          </p>
        </div>
      </div>
    </section>
  );
}
