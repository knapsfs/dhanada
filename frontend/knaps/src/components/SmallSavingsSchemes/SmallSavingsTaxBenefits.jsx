import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faReceipt,
  faShieldHalved,
  faCheckCircle,
  faCoins,
  faBuildingColumns,
  faFileContract
} from '@fortawesome/free-solid-svg-icons';

export default function SmallSavingsTaxBenefits() {
  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faReceipt} />
            <span>Tax Framework</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Tax Benefits & Taxation Across Schemes
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Understand how different small savings schemes are treated under the Indian Income Tax Act—from complete EEE exemptions to taxable interest rules.
          </p>
        </div>

        {/* 3 Distinct Tax Categorization Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Card 1: EEE */}
          <div className="p-8 rounded-3xl bg-white border-2 border-emerald-300 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Triple Exemption
              </span>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                EEE Status
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Exempt-Exempt-Exempt (EEE)</h3>
            <div className="text-xs font-bold text-blue-600">
              Schemes: Public Provident Fund (PPF) & Sukanya Samriddhi (SSY)
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              The gold standard of tax efficiency under Indian tax laws:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 mt-0.5" />
                <span><strong>Deposit Phase:</strong> Tax deduction up to ₹1.5 Lakh under Section 80C.</span>
              </li>
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 mt-0.5" />
                <span><strong>Accumulation Phase:</strong> Annual interest accrued is 100% tax-free.</span>
              </li>
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 mt-0.5" />
                <span><strong>Maturity Phase:</strong> Entire final corpus paid out is 100% tax-free.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: 80C Deduction with Taxable Interest */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Deposit Deduction Only
              </span>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-100 text-[#032e92]">
                Section 80C
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">80C Deduction (Interest Taxable)</h3>
            <div className="text-xs font-bold text-blue-600">
              Schemes: SCSS, NSC & 5-Year Time Deposit
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Deduction on the principal deposit, while the interest earned is treated as taxable income:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 mt-0.5" />
                <span><strong>Principal Deposit:</strong> Deductible up to ₹1.5L under Section 80C.</span>
              </li>
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 mt-0.5" />
                <span><strong>Interest Taxation:</strong> Added to gross total income and taxed at slab rates.</span>
              </li>
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 mt-0.5" />
                <span><strong>Senior Relief:</strong> SCSS interest eligible for up to ₹50,000 deduction u/s 80TTB.</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Fully Taxable */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Regular Tax Treatment
              </span>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                Slab Rate Tax
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Fully Taxable Schemes</h3>
            <div className="text-xs font-bold text-blue-600">
              Schemes: POMIS, KVP, MSSC, 1/2/3-Yr TD & Post Office RD
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              No Section 80C tax deduction available on deposits. Entire interest earned is taxable:
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-slate-400 mt-0.5" />
                <span><strong>Principal Deposit:</strong> Zero tax deduction on entry.</span>
              </li>
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-slate-400 mt-0.5" />
                <span><strong>Interest Income:</strong> Taxed under 'Income from Other Sources' at slab rates.</span>
              </li>
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-slate-400 mt-0.5" />
                <span><strong>TDS Policy:</strong> Post Office generally does not deduct TDS; depositor self-reports.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Caveat */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center max-w-4xl mx-auto">
          <p className="text-xs text-slate-500 leading-relaxed">
            * <strong>Important:</strong> Section 80C deductions apply under the Old Tax Regime. Tax laws, rebate thresholds, and surcharge rates are subject to amendments under the Finance Act. Consult a tax professional for personal advice.
          </p>
        </div>
      </div>
    </section>
  );
}
