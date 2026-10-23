import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleInfo,
  faLandmark,
  faBuildingColumns,
  faBullseye,
  faArrowRight,
  faShieldHalved,
  faEnvelopeOpenText,
  faCoins
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const pillars = [
  {
    icon: faLandmark,
    title: '1. Direct Sovereign Backing',
    description:
      'Deposits are pooled into the National Small Savings Fund (NSSF), backed by the full faith and credit of the Government of India, making them free of private institutional default risk.'
  },
  {
    icon: faEnvelopeOpenText,
    title: '2. Nationwide Accessibility',
    description:
      'Operated through over 1.5 lakh post offices across rural and urban India, as well as designated public sector and major private commercial banks with digital passbook facilities.'
  },
  {
    icon: faBullseye,
    title: '3. Lifecycle Financial Alignment',
    description:
      'Structured instruments catered to specific life milestones: girl child welfare (SSY), retirement accumulation (PPF), senior citizen quarterly income (SCSS), or monthly cash flow (POMIS).'
  }
];

export default function WhatAreSmallSavingsSchemes() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faCircleInfo} />
            <span>Foundational Overview</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            What are Small Savings Schemes?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Small Savings Schemes are government-sponsored savings instruments administered by the Ministry of Finance, Government of India, to mobilize household savings, encourage long-term financial discipline, and fund national development priorities.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 sm:mb-12">
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

        {/* Informative Deep-Dive Panel */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-[#032e92] tracking-wider uppercase">
                The National Small Savings Fund (NSSF)
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                How Your Savings Support India’s Development
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                When you invest in Post Office or bank-managed small savings schemes, your capital is channeled into the National Small Savings Fund (NSSF) managed by the Ministry of Finance. These funds provide stable, long-term financing for critical infrastructure projects and state government development initiatives, creating a symbiotic bond between citizen financial growth and nation building.
              </p>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span><strong>Sovereign Guarantee:</strong> Unlike commercial bank deposits which are insured up to ₹5 Lakh under DICGC, small savings schemes carry direct sovereign backing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span><strong>Quarterly Rate Reset:</strong> Interest rates are calibrated every quarter by the government, linked formulaically to benchmark secondary market G-Sec yields.</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() =>
                    openLeadModal({
                      title: 'Consult on Small Savings Options',
                      defaultService: 'Small Savings Schemes'
                    })
                  }
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#032e92] hover:text-blue-700 cursor-pointer"
                >
                  <span>Request an Allocation Consultation</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase">Avenue Category</span>
                  <span className="text-xs font-bold text-slate-400 uppercase">Representative Scheme</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs sm:text-sm">
                  <span className="text-slate-600 font-medium">Retirement & 15-Yr Wealth</span>
                  <span className="font-bold text-[#032e92]">PPF (7.1% EEE)</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs sm:text-sm">
                  <span className="text-slate-600 font-medium">Girl Child Welfare</span>
                  <span className="font-bold text-pink-700">SSY (8.2% EEE)</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs sm:text-sm">
                  <span className="text-slate-600 font-medium">Senior Regular Income</span>
                  <span className="font-bold text-emerald-700">SCSS (8.2% Qtr)</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs sm:text-sm">
                  <span className="text-slate-600 font-medium">Monthly Regular Cash Flow</span>
                  <span className="font-bold text-indigo-700">POMIS (7.4% Mo)</span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                  * All rates subject to quarterly notification by the Ministry of Finance, Government of India.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
