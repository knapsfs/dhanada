import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faReceipt,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';

export default function SmallSavingsTaxBenefits() {
  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faReceipt} />
            <span>Taxation Framework</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Tax Benefits & Rules for Post Office Schemes
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Understand how our 4 core Post Office small savings schemes are treated under the Indian Income Tax Act.
          </p>
        </div>

        {/* 3 Distinct Tax Categorization Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Card 1: Section 80C Deduction */}
          <div className="p-8 rounded-3xl bg-white border-2 border-emerald-300 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Tax Deduction
              </span>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                Section 80C
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Section 80C Tax Deduction</h3>
            <div className="text-xs font-bold text-blue-600">
              Schemes: NSC (VIII Issue) & 5-Year Time Deposit (POTD)
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Deduction on the principal deposit under Section 80C of the Income Tax Act (Old Tax Regime):
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 mt-0.5" />
                <span><strong>Principal Deposit:</strong> Deductible up to ₹1.5 Lakh per financial year.</span>
              </li>
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 mt-0.5" />
                <span><strong>Sovereign Backing:</strong> 100% capital safety backed by Government of India.</span>
              </li>
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-500 mt-0.5" />
                <span><strong>Lock-in Tenure:</strong> 5 Years statutory holding period.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Deemed Reinvestment Benefit */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Compounding Benefit
              </span>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-blue-100 text-[#032e92]">
                Deemed 80C
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">NSC Deemed Reinvestment</h3>
            <div className="text-xs font-bold text-blue-600">
              Scheme: National Savings Certificate (NSC)
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Unique tax advantage where interest accrued annually is deemed reinvested:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 mt-0.5" />
                <span><strong>Years 1 to 4:</strong> Accrued interest is deemed reinvested and qualifies for fresh 80C deductions.</span>
              </li>
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 mt-0.5" />
                <span><strong>Year 5 (Maturity):</strong> Interest earned in the 5th year is added to income and taxed at slab rate.</span>
              </li>
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500 mt-0.5" />
                <span><strong>No Tax at Source:</strong> Post Office does not deduct TDS on maturity payouts.</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Taxable at Slab Rate (Zero TDS) */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Income Slab Tax
              </span>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                Slab Rate Tax
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Taxed at Income Slab (Zero TDS)</h3>
            <div className="text-xs font-bold text-blue-600">
              Schemes: KVP, 1/2/3-Yr POTD, and PORD
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              No Section 80C deduction on deposit. Interest is taxable at your applicable slab rate:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-slate-400 mt-0.5" />
                <span><strong>Interest Taxation:</strong> Declared under 'Income from Other Sources' at slab rates.</span>
              </li>
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-slate-400 mt-0.5" />
                <span><strong>Zero TDS:</strong> Department of Posts does NOT deduct TDS at source.</span>
              </li>
              <li className="flex items-start gap-2">
                <FontAwesomeIcon icon={faCheckCircle} className="text-slate-400 mt-0.5" />
                <span><strong>Senior Citizen Relief:</strong> Interest income eligible for up to ₹50,000 deduction u/s 80TTB.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Caveat */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 text-center max-w-3xl mx-auto">
          <p className="text-xs text-slate-500 leading-relaxed">
            * <strong>Important Note:</strong> Section 80C deductions apply under the Old Tax Regime. Tax laws and slab rates are governed by prevailing Finance Act regulations.
          </p>
        </div>
      </div>
    </section>
  );
}
