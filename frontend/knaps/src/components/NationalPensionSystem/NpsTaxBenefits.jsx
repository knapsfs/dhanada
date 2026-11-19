import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faReceipt,
  faBuildingColumns,
  faCoins,
  faShieldHalved,
  faFileContract,
  faCircleCheck,
  faBriefcase,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function NpsTaxBenefits() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faReceipt} />
            <span>Tax Optimization</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            NPS Tax Benefits & Provisions
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            NPS offers unique multi-tier tax deductions during the accumulation phase and substantial tax-exempt withdrawals upon retirement under the Income Tax Act.
          </p>
        </div>

        {/* 4 Tax Pillar Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Card 1: Section 80CCD(1) */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Within Section 80C Limit
              </span>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-blue-100 text-[#032e92]">
                Up to ₹1,50,000
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Section 80CCD(1)</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Individual contributions made by an employee or self-employed individual are eligible for deduction up to 10% of salary (Basic + DA) for salaried employees, or up to 20% of Gross Total Income for self-employed individuals, subject to the overall ₹1,50,000 ceiling under Section 80CCE.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
              📌 Shared with traditional 80C instruments like EPF, PPF, ELSS, and Life Insurance.
            </div>
          </div>

          {/* Card 2: Section 80CCD(1B) - Exclusive ₹50k */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white border-2 border-blue-300 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#032e92] uppercase tracking-wider">
                Exclusive Over & Above 80C
              </span>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-[#032e92] text-white shadow-sm">
                Extra ₹50,000
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#032e92]">Section 80CCD(1B)</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              An exclusive additional tax deduction of up to <strong>₹50,000</strong> is available specifically for individual investments in NPS Tier I accounts. This deduction is over and above the ₹1.5 Lakh limit under Section 80C, allowing up to ₹2,00,000 in combined deductions.
            </p>
            <div className="p-3.5 rounded-xl bg-white border border-blue-200 text-xs font-medium text-slate-800">
              💡 <em>Saves up to ₹15,600 in taxes annually for individuals in the 30% tax slab (Old Regime).</em>
            </div>
          </div>

          {/* Card 3: Section 80CCD(2) - Employer Contribution */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Available in New Tax Regime Too!
              </span>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                10% to 14% of Salary
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Section 80CCD(2) — Corporate NPS</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Employer contributions made on behalf of an employee toward NPS are deductible up to 10% of salary (Basic + DA) for private sector employees, and up to 14% for Central/State Government employees. Crucially, this deduction remains available under both the Old and New Tax Regimes.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
              🏢 Subject to an aggregate employer PF/NPS/Superannuation cap of ₹7.5 Lakh/year.
            </div>
          </div>

          {/* Card 4: Maturity Tax Exemption */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                At Age 60 Exit
              </span>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
                100% Tax-Exempt
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Maturity Tax Exemption (Sec 10(12A))</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Upon reaching age 60, up to <strong>60% of the total accumulated corpus</strong> can be withdrawn as a lump sum completely free from income tax under Section 10(12A). The remaining 40% used to purchase an annuity is also not taxed at purchase; subsequent monthly annuity pensions are taxable as salary/income.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
              🛡️ Full EEE-like tax efficiency on the 60% lump sum retirement component.
            </div>
          </div>
        </div>

        {/* Advisory Banner */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center max-w-4xl mx-auto">
          <p className="text-xs text-slate-500 leading-relaxed">
            * <strong>Disclaimer:</strong> Tax deductions under Section 80CCD(1) and 80CCD(1B) apply specifically under the Old Tax Regime. Section 80CCD(2) (employer's contribution) is deductible under both the Old and New Tax Regimes. Tax laws and exemption limits are subject to amendments by the Government of India.
          </p>
        </div>
      </div>
    </section>
  );
}
