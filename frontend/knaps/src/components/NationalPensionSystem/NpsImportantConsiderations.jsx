import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faScaleBalanced,
  faAddressCard,
  faBuildingColumns,
  faArrowsRotate,
  faUserShield,
  faFileContract
} from '@fortawesome/free-solid-svg-icons';

const guidelines = [
  {
    icon: faAddressCard,
    title: '100% PRAN Portability',
    description:
      'Your Permanent Retirement Account Number (PRAN) is tied to you as an individual, not to your employer. If you change jobs, switch industries, or relocate to another city, your PRAN remains identical and active without transfer friction.'
  },
  {
    icon: faBuildingColumns,
    title: 'Choice of 10 Registered Pension Fund Managers',
    description:
      'Subscribers can select their preferred PFM from among 10 PFRDA-registered institutional managers (SBI, LIC, HDFC, ICICI Prudential, UTI, Kotak, Axis, Tata, Aditya Birla Sun Life, and Max Life Pension Fund).'
  },
  {
    icon: faArrowsRotate,
    title: 'Flexibility to Switch PFMs & Asset Allocations',
    description:
      'You are never locked into a single fund manager or asset allocation. Under current PFRDA norms, subscribers can switch their Pension Fund Manager once a year and rebalance their asset allocation twice a financial year free of charge.'
  },
  {
    icon: faUserShield,
    title: 'Nomination & Estate Succession',
    description:
      'Subscribers can nominate up to three nominees for both Tier I and Tier II accounts, specifying the percentage share for each. In the unfortunate event of the subscriber’s demise, the entire accumulated corpus is handed over to the nominees.'
  }
];

export default function NpsImportantConsiderations() {
  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faScaleBalanced} />
            <span>Fiduciary Rules</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Important NPS Considerations & Guidelines
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Essential operational rules governing PRAN administration, Pension Fund Manager flexibility, and investor rights under PFRDA.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {guidelines.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#f7f9fc] border border-slate-200/80 hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#032e92] flex items-center justify-center text-lg shadow-sm">
                  <FontAwesomeIcon icon={item.icon} />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center max-w-4xl mx-auto">
          <p className="text-xs text-slate-500 leading-relaxed">
            * <strong>Statutory Regulatory Notice:</strong> All contribution thresholds, premature withdrawal terms, exit conditions, annuity requirements, tax exemptions, and PFM investment guidelines are governed strictly by the Pension Fund Regulatory and Development Authority (PFRDA) Act, 2013, and the Income Tax Act, 1961. Subscribers should verify prevailing circulars on the official PFRDA portal before making execution decisions.
          </p>
        </div>
      </div>
    </section>
  );
}
