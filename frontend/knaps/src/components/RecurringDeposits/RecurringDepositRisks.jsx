import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTriangleExclamation,
  faMoneyBillTransfer,
  faCalendarXmark,
  faArrowTrendDown,
  faBuildingColumns,
  faReceipt
} from '@fortawesome/free-solid-svg-icons';

const risks = [
  {
    icon: faMoneyBillTransfer,
    title: 'Premature Withdrawal Conditions & Penalties',
    badge: 'Liquidity Friction',
    description:
      'Closing an RD prior to its contractual maturity date usually attracts an interest rate reduction penalty (typically 0.5% to 1.0% below the applicable rate for the actual period held). Banks also have a minimum holding requirement (often 14 to 30 days) before any interest is earned.'
  },
  {
    icon: faCalendarXmark,
    title: 'Missed Installment Penalties & Default Charges',
    badge: 'Discipline Requirement',
    description:
      'If your account lacks sufficient funds on the due date and you miss an installment, banks levy a small delayed payment penalty (typically ₹1.50 to ₹2.00 per ₹100 of installment per month). Missing consecutive installments (usually 4 to 6 months) may result in automatic account termination.'
  },
  {
    icon: faArrowTrendDown,
    title: 'Inflation & Real Return Drag',
    badge: 'Purchasing Power',
    description:
      'While the nominal rate is guaranteed, high inflation can erode your real purchasing power over multi-year tenures. When consumer price inflation (CPI) is 6.0% and your pre-tax RD yield is 7.0%, your net real post-tax growth might be marginal or flat.'
  },
  {
    icon: faReceipt,
    title: 'Taxation at Individual Slab Rates',
    badge: 'Tax Drag',
    description:
      'RD interest is fully taxable under ‘Income from Other Sources’ at your highest marginal income tax slab. For savers in the 30% tax bracket, a nominal 7.0% yield results in an effective post-tax return of approximately 4.81% (excluding cess/surcharge).'
  },
  {
    icon: faBuildingColumns,
    title: 'Issuer-Specific Distinctions & Credit Risk',
    badge: 'Safety Variance',
    description:
      'Scheduled commercial bank deposits are insured up to ₹5 Lakh under DICGC, and Post Office RDs enjoy sovereign backing. However, corporate or cooperative bank RDs do not share the same uniform protection profile and carry issuer credit risk.'
  }
];

export default function RecurringDepositRisks() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <span>Essential Considerations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Risks & Things to Know About Recurring Deposits
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            While Recurring Deposits provide capital stability, prudent savers should carefully review liquidity constraints, penalty rules, and inflation dynamics.
          </p>
        </div>

        {/* 5 Risk Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {risks.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#f7f9fc] border border-slate-200/80 hover:border-amber-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
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

        {/* Advisory Checklist Banner */}
        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-center max-w-4xl mx-auto">
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
            💡 <strong>Prudent Saver Tip:</strong> Maintain an automated buffer in your primary savings account on your RD auto-debit date to avoid inadvertent installment defaults and maintain a pristine credit record with your bank.
          </p>
        </div>
      </div>
    </section>
  );
}
