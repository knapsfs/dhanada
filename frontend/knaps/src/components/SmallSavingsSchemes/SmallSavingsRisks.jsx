import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTriangleExclamation,
  faArrowTrendDown,
  faLock,
  faReceipt,
  faScaleUnbalanced,
  faBuildingColumns
} from '@fortawesome/free-solid-svg-icons';

const risks = [
  {
    icon: faArrowTrendDown,
    title: 'Inflation & Real Purchasing Power',
    badge: 'Purchasing Power',
    description:
      'Because small savings rates are fixed throughout your deposit tenure, high sustained inflation can compress your net real return, especially when maturity proceeds are taxed at higher slab brackets.'
  },
  {
    icon: faLock,
    title: 'Statutory Lock-In Restrictions',
    badge: 'Illiquidity',
    description:
      'Schemes like NSC (5 years) carry strict lock-ins with no premature exit except upon court order or depositor demise. POTD accounts closed before 1 year earn only Post Office savings account rates.'
  },
  {
    icon: faReceipt,
    title: 'Slab-Rate Taxation',
    badge: 'Tax Implications',
    description:
      'Interest earned across POTD, KVP, and PORD is fully taxable at your individual slab rate. While India Post does not deduct TDS at source, you must declare this income when filing your ITR.'
  },
  {
    icon: faScaleUnbalanced,
    title: 'Opportunity & Reinvestment Risk',
    badge: 'Fixed Yield Lock',
    description:
      'Locking into a 5-year POTD or 115-month KVP protects you against rate drops, but also prevents you from taking advantage if prevailing economic yields rise without incurring premature closure penalties.'
  },
  {
    icon: faBuildingColumns,
    title: 'Branch Verification for Closure',
    badge: 'Physical Formalities',
    description:
      'Unlike private bank FDs that can be created and closed instantly via net-banking apps in seconds, encashing or closing post office physical certificates often requires postal branch verification.'
  }
];

export default function SmallSavingsRisks() {
  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <span>Essential Considerations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Risks & Things to Know About Post Office Small Savings
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            While Post Office small savings schemes carry sovereign safety, savers must carefully evaluate lock-in durations, inflation dynamics, and slab-rate taxation.
          </p>
        </div>

        {/* 5 Risk Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {risks.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#f7f9fc] border border-slate-200/80 hover:border-amber-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center text-lg transition-transform group-hover:scale-105">
                    <FontAwesomeIcon icon={item.icon} />
                  </div>
                  <span className="text-[11px] font-bold text-amber-800 bg-amber-100/60 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-amber-900 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Prudent Liquidity Notice */}
        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-center max-w-4xl mx-auto">
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
            ⚠️ <strong>Prudent Allocation Tip:</strong> Avoid committing emergency liquidity into 5-year lock-in certificates like NSC. Choose tenure-appropriate POTD (1, 2, 3, or 5 years) or maintain an emergency fund separately.
          </p>
        </div>
      </div>
    </section>
  );
}
