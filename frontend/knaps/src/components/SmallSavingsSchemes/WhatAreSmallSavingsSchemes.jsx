import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleInfo,
  faLandmark,
  faEnvelopeOpenText,
  faBullseye,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const pillars = [
  {
    icon: faLandmark,
    title: '1. Direct Sovereign Backing',
    description:
      'Deposits are pooled into the National Small Savings Fund (NSSF), backed by the full faith and credit of the Government of India, making them free of private commercial bank default risk.'
  },
  {
    icon: faEnvelopeOpenText,
    title: '2. Nationwide Postal Accessibility',
    description:
      'Operated through over 1.5 lakh Post Offices across rural and urban India, providing unmatched doorstep accessibility, physical passbooks, and nationwide account transferability.'
  },
  {
    icon: faBullseye,
    title: '3. Strategic Financial Goals',
    description:
      'Structured instruments tailored to capital doubling (KVP), 5-year tax-saving growth (NSC), flexible term deposits (POTD 1 to 5 years), and disciplined monthly savings (PORD from ₹100/mo).'
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
            What are Post Office Small Savings Schemes?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Post Office Small Savings Schemes are government-sponsored savings instruments administered by the Ministry of Finance, Government of India, and operated through the Department of Posts to mobilize household savings with 100% sovereign security.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 sm:mb-12">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#f7f9fc] border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white flex items-center justify-center text-lg transition-all duration-300 shadow-sm mb-6">
                  <FontAwesomeIcon icon={pillar.icon} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-[#032e92] transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Informative Guidance Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold text-[#032e92]">
              Need Assistance Opening a Post Office Scheme?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Our experts provide end-to-end guidance for KYC, post office processing, and certificate management.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              openLeadModal({
                title: 'Post Office Schemes Consultation',
                defaultService: 'Post Office Small Savings Schemes'
              })
            }
            className="px-6 py-3 rounded-xl bg-[#032e92] text-white font-bold text-xs sm:text-sm shadow-md hover:bg-[#021d63] transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Talk to an Expert</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
