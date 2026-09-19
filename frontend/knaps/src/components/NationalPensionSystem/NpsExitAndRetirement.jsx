import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDoorOpen,
  faCoins,
  faHandHoldingDollar,
  faShieldHalved,
  faClockRotateLeft,
  faHospitalUser,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function NpsExitAndRetirement() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faDoorOpen} />
            <span>Maturity & Liquidity</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            NPS at Retirement & Exit Rules
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Understand the structured payout framework upon superannuation at age 60, premature exit conditions, and conditional partial withdrawal rules.
          </p>
        </div>

        {/* 3 Exit Scenario Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Scenario 1: Normal Superannuation at Age 60 */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50/70 via-white to-slate-50 border-2 border-blue-200/90 shadow-md space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Standard Superannuation
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#032e92]">
                  Age 60
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#032e92]">Normal Exit at Age 60</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The primary designed milestone of the NPS framework. Upon reaching 60:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span><strong>Up to 60% Lump Sum:</strong> Can be withdrawn 100% tax-free under Section 10(12A).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span><strong>Min. 40% Annuity:</strong> Must be deployed to buy an annuity for regular lifelong pension.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span><strong>Small Corpus Exemption:</strong> If total corpus is ≤ ₹5 Lakh, 100% lump sum is permitted.</span>
                </li>
              </ul>
            </div>
            <div className="p-3.5 rounded-xl bg-blue-100/50 text-xs text-[#032e92] font-semibold text-center">
              Option to defer withdrawals up to age 75.
            </div>
          </div>

          {/* Scenario 2: Premature Exit Before 60 */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Voluntary Early Exit
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Before Age 60
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Premature Exit (&lt; 60)</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Permitted after completing a minimum of 10 years of NPS membership:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-400 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    •
                  </span>
                  <span><strong>Max 20% Lump Sum:</strong> Up to 20% can be withdrawn as a lump sum (taxable per slab).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    •
                  </span>
                  <span><strong>Min. 80% Annuity:</strong> At least 80% must be committed to buy an annuity pension.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-400 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    •
                  </span>
                  <span><strong>Small Corpus Exemption:</strong> If total corpus is ≤ ₹2.5 Lakh, 100% can be withdrawn.</span>
                </li>
              </ul>
            </div>
            <div className="p-3.5 rounded-xl bg-amber-50 text-xs text-amber-800 font-semibold text-center">
              Discouraged unless in extreme emergency.
            </div>
          </div>

          {/* Scenario 3: Conditional Partial Withdrawals */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Emergency Liquidity
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  After 3 Years
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Partial Withdrawals</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Allowed after 3 years of membership without terminating the PRAN account:
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span><strong>Up to 25% of Own Contributions:</strong> Applies strictly to your principal (excludes employer's share & gains).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span><strong>Specific Life Events:</strong> Higher education of children, marriage, primary home purchase, or critical illness.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span><strong>Frequency Limit:</strong> Maximum 3 times during the entire subscription tenure.</span>
                </li>
              </ul>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-50 text-xs text-emerald-800 font-semibold text-center">
              100% Tax-Free under Section 10(12B).
            </div>
          </div>
        </div>

        {/* Regulatory Caveat */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center max-w-4xl mx-auto">
          <p className="text-xs text-slate-500 leading-relaxed">
            * <strong>Notice:</strong> Exit rules, annuity requirements, and partial withdrawal guidelines are governed by PFRDA (Exits and Withdrawals under the National Pension System) Regulations. Specific provisions can vary and should be officially verified with PFRDA prior to execution.
          </p>
        </div>
      </div>
    </section>
  );
}
