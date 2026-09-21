import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRoute,
  faAddressCard,
  faSliders,
  faChartPie,
  faHandHoldingDollar,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const steps = [
  {
    number: '01',
    icon: faAddressCard,
    title: 'Open Your NPS Account',
    subtitle: 'PRAN Generation',
    description:
      'Complete 100% paperless e-NPS registration using Aadhaar or PAN. A unique 12-digit Permanent Retirement Account Number (PRAN) is issued, which stays active throughout your lifetime.'
  },
  {
    number: '02',
    icon: faSliders,
    title: 'Choose Contribution & Strategy',
    subtitle: 'Asset Approach',
    description:
      'Open your mandatory Tier I account (and optional Tier II). Choose between Active Choice (self-allocated E, C, G, A) or Auto Choice (age-based Lifecycle Fund: LC75, LC50, or LC25).'
  },
  {
    number: '03',
    icon: faChartPie,
    title: 'Invest Across Asset Classes',
    subtitle: 'Institutional Management',
    description:
      'Set up monthly automated SIPs via D-Remit or make lump-sum contributions. Top PFRDA-registered Pension Fund Managers invest your funds systematically across Equities and Bonds.'
  },
  {
    number: '04',
    icon: faHandHoldingDollar,
    title: 'Access Retirement Benefits at 60',
    subtitle: 'Lump Sum & Annuity',
    description:
      'Upon reaching age 60, withdraw up to 60% of your accumulated corpus 100% tax-free. The remaining 40% (minimum) purchases an annuity for guaranteed lifelong monthly pension.'
  }
];

export default function HowNpsWorks() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faRoute} />
            <span>Operational Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            How NPS Works — A 4-Step Visual Journey
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            From initial PRAN onboarding to final annuity payouts, see how NPS structures your multi-decade retirement accumulation.
          </p>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative mb-14">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-7 rounded-2xl bg-[#f7f9fc] border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-[#032e92]/20 group-hover:text-[#032e92]/40 transition-colors">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-[#032e92] flex items-center justify-center text-lg shadow-sm group-hover:bg-[#032e92] group-hover:text-white transition-all duration-300">
                    <FontAwesomeIcon icon={step.icon} />
                  </div>
                </div>

                <div className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">
                  {step.subtitle}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span>Phase {idx + 1} of 4</span>
                <span className="w-2 h-2 rounded-full bg-[#032e92]/30 group-hover:bg-[#032e92] transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* Informative Callout Strip */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-bold text-slate-900">
              Need assistance selecting between Active Choice and Auto Lifecycle funds?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Our retirement planners evaluate your risk profile and retirement timeline to configure your initial asset allocation.
            </p>
          </div>
          <button
            onClick={() =>
              openLeadModal({
                title: 'Plan Your NPS Asset Allocation',
                defaultService: 'National Pension System (NPS)'
              })
            }
            className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Configure My NPS Strategy</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
