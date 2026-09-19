import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBillTransfer,
  faLock,
  faHandHoldingDollar,
  faShieldHalved,
  faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

const withdrawalRules = [
  {
    scheme: 'Public Provident Fund (PPF)',
    tenure: '15 Years',
    rule: 'Partial withdrawal permitted from 7th financial year (up to 50% of balance at end of 4th preceding year). Loan facility available between 3rd and 6th financial years.'
  },
  {
    scheme: 'Sukanya Samriddhi Account (SSY)',
    tenure: '21 Years',
    rule: 'Partial withdrawal up to 50% permitted once the girl child turns 18 for certified higher education expenses. Complete closure permitted on marriage after age 18.'
  },
  {
    scheme: "Senior Citizens' Savings Scheme (SCSS)",
    tenure: '5 Years',
    rule: 'Premature exit allowed after 1 year: 1.5% deduction from deposit between 1 and 2 years; 1% deduction after 2 years. No penalty if extended after 5 years.'
  },
  {
    scheme: 'Post Office Monthly Income Scheme (POMIS)',
    tenure: '5 Years',
    rule: 'Premature exit allowed after 1 year: 2% deduction from principal between 1 and 3 years; 1% deduction between 3 and 5 years. No exit permitted in the 1st year.'
  },
  {
    scheme: 'National Savings Certificate (NSC)',
    tenure: '5 Years',
    rule: 'Strictly locked for the entire 5-year tenure. Premature encashment is prohibited except in the event of the holder’s demise, forfeiture by a gazetted authority, or court order.'
  },
  {
    scheme: 'Kisan Vikas Patra (KVP)',
    tenure: '115 Months',
    rule: 'Premature encashment is permitted anytime after completing 2 years and 6 months (30 months) from deposit date, with predefined progressive surrender values.'
  },
  {
    scheme: 'Mahila Samman Savings Certificate (MSSC)',
    tenure: '2 Years',
    rule: 'One partial withdrawal of up to 40% of the eligible balance is permitted after 1 year from account opening date. Premature closure allowed on compassionate grounds.'
  }
];

export default function LiquidityAndWithdrawals() {
  return (
    <section className="py-20 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faMoneyBillTransfer} />
            <span>Liquidity & Exits</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Liquidity, Withdrawals & Premature Closure
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Sovereign schemes balance long-term discipline with emergency liquidity. Review scheme-specific lock-in rules and premature exit penalties before deploying capital.
          </p>
        </div>

        {/* Withdrawal Matrix Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {withdrawalRules.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-[#032e92]/30 hover:shadow-md transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase">Tenure: {item.tenure}</span>
                <span className="w-2 h-2 rounded-full bg-[#032e92]" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">{item.scheme}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                {item.rule}
              </p>
            </div>
          ))}
        </div>

        {/* Prudent Liquidity Guidance Box */}
        <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-center max-w-4xl mx-auto">
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
            💡 <strong>Liquidity Rule of Thumb:</strong> Small savings schemes should not be treated as emergency cash reserves. Always maintain 6 months of living expenses in an accessible savings bank account or liquid mutual fund before committing funds to multi-year small savings tenures.
          </p>
        </div>
      </div>
    </section>
  );
}
