import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoiceDollar,
  faBuildingColumns,
  faShieldHalved,
  faFileContract,
  faCircleCheck,
  faCoins,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function RecurringDepositTaxation() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faFileInvoiceDollar} />
            <span>Taxation & Compliance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Taxation & TDS on Recurring Deposits
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Understand how interest on Recurring Deposits is taxed under Indian Income Tax provisions, TDS deduction rules, and available exemption forms.
          </p>
        </div>

        {/* 4 Tax Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Card 1: Slab Taxation */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#032e92] flex items-center justify-center text-lg">
              <FontAwesomeIcon icon={faCoins} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Taxed at Marginal Slab Rate</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Interest earned on Recurring Deposits is categorized under <strong>'Income from Other Sources'</strong> in your annual Income Tax Return (ITR). It is added to your total gross income and taxed at your applicable individual income tax slab rate (plus applicable surcharge and 4% Health & Education Cess).
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
              📌 <strong>Accrual Basis:</strong> Even though the lump sum is received on maturity, tax liability on accrued interest is recognized annually in your ITR.
            </div>
          </div>

          {/* Card 2: Section 194A TDS */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg">
              <FontAwesomeIcon icon={faBuildingColumns} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Section 194A — TDS Thresholds</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Banks are mandated to deduct Tax Deducted at Source (TDS) at <strong>10%</strong> (20% if valid PAN is not furnished) if total interest earned across all branches of the bank exceeds the statutory threshold in a financial year:
            </p>
            <ul className="space-y-2 text-xs text-slate-700 font-medium">
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500" />
                <span><strong>Regular Depositors:</strong> ₹40,000 per financial year</span>
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500" />
                <span><strong>Senior Citizens (Age 60+):</strong> ₹50,000 per financial year</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Form 15G & 15H */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg">
              <FontAwesomeIcon icon={faFileContract} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Form 15G & Form 15H for Zero TDS</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              If your total estimated taxable income for the financial year is below the basic tax exemption limit, you can submit self-declaration forms at the beginning of the financial year to request the bank not to deduct TDS:
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 block mb-0.5">Form 15G</strong>
                <span className="text-slate-500">For resident individuals below 60 years of age</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <strong className="text-slate-800 block mb-0.5">Form 15H</strong>
                <span className="text-slate-500">For resident senior citizens aged 60 years or above</span>
              </div>
            </div>
          </div>

          {/* Card 4: Section 80TTB */}
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg">
              <FontAwesomeIcon icon={faShieldHalved} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Section 80TTB Relief for Seniors</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Under Section 80TTB of the Income Tax Act, resident senior citizens can claim a deduction of up to <strong>₹50,000</strong> on total interest earned from bank deposits (savings, FDs, and RDs) and post office deposits in a financial year, effectively shielding modest interest earnings from tax.
            </p>
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-800">
              💡 <em>Note: Section 80TTA (up to ₹10,000 for regular depositors) applies exclusively to savings bank accounts, NOT to recurring or fixed deposits.</em>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimer Banner */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center max-w-4xl mx-auto">
          <p className="text-xs text-slate-500 leading-relaxed">
            * Tax laws, TDS thresholds, surcharge brackets, and rebate provisions are subject to prevailing amendments by the Ministry of Finance, Government of India. Depositors should consult a qualified chartered accountant or tax advisor for personalized tax planning.
          </p>
        </div>
      </div>
    </section>
  );
}
