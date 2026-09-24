import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTriangleExclamation,
  faChartLine,
  faLock,
  faHandHoldingDollar,
  faArrowTrendDown,
  faFileContract
} from '@fortawesome/free-solid-svg-icons';

const risks = [
  {
    icon: faChartLine,
    title: 'Market-Linked Returns (No Guarantees)',
    badge: 'NAV Volatility',
    description:
      'Unlike EPF or PPF, NPS does not provide guaranteed interest rates. Underlying units fluctuate daily in line with prevailing equity markets, interest rate cycles, and corporate credit spreads.'
  },
  {
    icon: faLock,
    title: 'Strict Statutory Lock-In Until Age 60',
    badge: 'Illiquid Capital',
    description:
      'Tier I funds are locked until age 60. While partial withdrawals of up to 25% of your own contributions are permitted for specific life events after 3 years, NPS is intentionally unsuited for short-term liquidity.'
  },
  {
    icon: faHandHoldingDollar,
    title: 'Mandatory Annuity Purchase & Taxation',
    badge: 'Annuity Drag',
    description:
      'At least 40% of the maturity corpus must be converted into a life annuity. While the purchase is tax-exempt, the periodic monthly pension received from the annuity provider is taxable at your marginal income tax slab.'
  },
  {
    icon: faArrowTrendDown,
    title: 'Interest Rate & Annuity Yield Risk',
    badge: 'Reinvestment Risk',
    description:
      'The monthly pension you receive depends on the annuity interest rates offered by insurance companies at the time of your retirement. If interest rates are low at age 60, your annuity yield could be impacted.'
  },
  {
    icon: faFileContract,
    title: 'Regulatory & Tax Regime Amendments',
    badge: 'Policy Evolution',
    description:
      'Contribution limits, asset allocation rules, tax deduction ceilings, and withdrawal guidelines are subject to periodic amendments by PFRDA and the Ministry of Finance.'
  }
];

export default function NpsRisks() {
  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <span>Risk Factors & Constraints</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Risks & Things to Know About NPS
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            While NPS provides institutional governance and low fees, subscribers must evaluate market volatility, liquidity lock-ins, and annuity taxation.
          </p>
        </div>

        {/* 5 Risk Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {risks.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
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

        {/* Advisory Banner */}
        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-center max-w-4xl mx-auto">
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
            ⚠️ <strong>Prudent Perspective:</strong> Do not park emergency funds in NPS Tier I. Treat your Tier I contributions purely as an untouchable retirement fund, utilizing Tier II or debt mutual funds for intermediate liquidity.
          </p>
        </div>
      </div>
    </section>
  );
}
