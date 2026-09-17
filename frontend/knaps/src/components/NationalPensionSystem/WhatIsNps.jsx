import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleInfo,
  faAddressCard,
  faChartPie,
  faHandHoldingDollar,
  faBuildingColumns,
  faArrowRight,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const pillars = [
  {
    icon: faAddressCard,
    title: '1. Individual PRAN Account',
    description:
      'Every subscriber receives a unique 12-digit Permanent Retirement Account Number (PRAN). Your account remains 100% portable across jobs, cities, and sectors (government, corporate, or all-citizens).'
  },
  {
    icon: faChartPie,
    title: '2. Multi-Asset Diversification',
    description:
      'Contributions are invested across four distinct asset classes—Equity (E), Corporate Bonds (C), Government Securities (G), and Alternative Assets (A)—managed by professional Pension Fund Managers.'
  },
  {
    icon: faHandHoldingDollar,
    title: '3. Lump-Sum & Lifetime Annuity',
    description:
      'At age 60, up to 60% of your accumulated corpus can be withdrawn completely tax-free as a lump sum, while a minimum 40% is utilized to purchase an annuity guaranteeing lifelong regular pension.'
  }
];

export default function WhatIsNps() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faCircleInfo} />
            <span>Retirement Framework</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            What is the National Pension System (NPS)?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            The National Pension System is a government-sponsored, voluntary, defined-contribution retirement savings scheme regulated by the Pension Fund Regulatory and Development Authority (PFRDA), designed to instill long-term disciplined investing and secure post-retirement income.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#f7f9fc] border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#032e92] to-[#021d63] text-white flex items-center justify-center text-xl mb-6 shadow-md shadow-[#032e92]/20 group-hover:scale-105 transition-transform">
                  <FontAwesomeIcon icon={pillar.icon} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{pillar.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Explanatory Panel */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-[#032e92] tracking-wider uppercase">
                Regulatory Architecture
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                PFRDA Governance & Ultra-Low Institutional Costs
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Initially instituted for central and state government employees, NPS was opened to all Indian citizens (both resident and non-resident) between the ages of 18 and 70 in 2009. Key operational highlights include:
              </p>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#032e92] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span><strong>Lowest Expense Ratio Globally:</strong> Fund management fees are capped at roughly 0.09% p.a., ensuring the vast majority of your compounding remains inside your corpus.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#032e92] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span><strong>Top-Tier Pension Fund Managers (PFMs):</strong> Choose between trusted institutions like SBI Pension Funds, LIC Pension Fund, HDFC Pension Fund, ICICI Prudential, and UTI.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#032e92] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span><strong>Strict Fiduciary Safety:</strong> Securities are held by an independent custodian (Stock Holding Corporation of India), safeguarding assets against PFM insolvencies.</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() =>
                    openLeadModal({
                      title: 'Start NPS Account Advisory',
                      defaultService: 'National Pension System (NPS)'
                    })
                  }
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#032e92] hover:text-blue-700 cursor-pointer"
                >
                  <span>Request an NPS Onboarding Consultation</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase">Product Feature</span>
                  <span className="text-xs font-bold text-slate-400 uppercase">NPS Framework</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs sm:text-sm">
                  <span className="text-slate-600 font-medium">Regulatory Authority</span>
                  <span className="font-bold text-slate-900">PFRDA (Govt. of India)</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs sm:text-sm">
                  <span className="text-slate-600 font-medium">Eligible Age Bracket</span>
                  <span className="font-bold text-slate-900">18 to 70 Years</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs sm:text-sm">
                  <span className="text-slate-600 font-medium">Min. Annual Contribution</span>
                  <span className="font-bold text-slate-900">₹1,000 (Tier I)</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/80 border border-blue-200 text-xs sm:text-sm">
                  <span className="text-[#032e92] font-semibold">Special Tax Deduction</span>
                  <span className="font-extrabold text-[#032e92]">₹50,000 u/s 80CCD(1B)</span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                  * Applicable terms, contribution minimums, and tax laws are governed by PFRDA guidelines and Income Tax Act provisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
