import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTriangleExclamation,
  faArrowTrendDown,
  faLock,
  faReceipt,
  faArrowsRotate,
  faBan
} from '@fortawesome/free-solid-svg-icons';

const risks = [
  {
    icon: faArrowTrendDown,
    title: 'Inflation & Real Rate Risk',
    badge: 'Purchasing Power',
    description:
      'Because small savings rates are fixed or formula-bound, persistent retail inflation (CPI) can compress your real post-tax purchasing power, especially on multi-year tenures where interest is taxable.'
  },
  {
    icon: faLock,
    title: 'Strict Tenure Lock-In Restrictions',
    badge: 'Illiquidity',
    description:
      'Schemes like PPF (15 years), SSY (21 years), and NSC (5 years) feature strict statutory lock-ins. Premature encashment is either prohibited or heavily penalized, making them unsuitable for emergency cash.'
  },
  {
    icon: faReceipt,
    title: 'Tax Drag on Non-Exempt Schemes',
    badge: 'Slab Rate Taxation',
    description:
      'Only PPF and SSY offer EEE tax exemption. Interest from SCSS, POMIS, KVP, and Post Office Time Deposits is fully taxable at your individual slab rate, reducing net post-tax yields for higher tax brackets.'
  },
  {
    icon: faArrowsRotate,
    title: 'Quarterly Rate Reset Volatility',
    badge: 'Floating Rate Impact',
    description:
      'In floating-rate schemes like PPF and SSY, interest rates reset every quarter. If macroeconomic benchmark yields soften, your deposit earnings adjust downward on all active accounts.'
  },
  {
    icon: faBan,
    title: 'Strict Statutory Deposit Ceilings',
    badge: 'Upper Cap Limits',
    description:
      'Most small savings schemes enforce strict statutory annual or lifetime caps (e.g., ₹1.5 Lakh/year in PPF/SSY, ₹9L single in POMIS, ₹30L in SCSS). You cannot park unlimited capital in sovereign schemes.'
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
            Risks & Things to Know About Small Savings
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            While small savings schemes carry sovereign safety, savers must carefully weigh inflation dynamics, tenure illiquidity, and tax drag.
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
            ⚠️ <strong>Prudent Allocation Tip:</strong> Avoid committing funds required within the next 2–3 years into 15-year or 5-year lock-in schemes. Match each scheme strictly with your milestone timeline to prevent costly premature penalties.
          </p>
        </div>
      </div>
    </section>
  );
}
