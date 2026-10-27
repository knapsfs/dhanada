import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMoneyBillTransfer,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';

const withdrawalRules = [
  {
    scheme: 'Post Office Time Deposit (POTD)',
    tenure: '1, 2, 3, or 5 Years',
    rule: 'Premature closure allowed after 6 months from deposit date. If closed between 6 and 12 months, post office savings account interest rate (4.0% p.a.) is paid. If closed after 1 year, interest is 2% below the applicable TD rate.'
  },
  {
    scheme: 'Kisan Vikas Patra (KVP)',
    tenure: '115 Months (9Y 7M)',
    rule: 'Premature encashment is permitted anytime after completing 2 years and 6 months (30 months) from deposit date, with predefined progressive surrender values determined by the Ministry of Finance.'
  },
  {
    scheme: 'National Savings Certificate (NSC)',
    tenure: '5 Years',
    rule: 'Strictly locked for the full 5-year tenure to ensure guaranteed compounding. Premature encashment is permitted only under exceptional statutory conditions (court order, death of holder, or gazetted pledge forfeiture).'
  },
  {
    scheme: 'Post Office Recurring Deposit (PORD)',
    tenure: '5 Years (60 Months)',
    rule: 'Premature closure is permitted after 3 years from account opening date. Loan facility up to 50% of the accumulated deposit is available after completing 1 continuous year with regular payments.'
  }
];

export default function LiquidityAndWithdrawals() {
  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faMoneyBillTransfer} />
            <span>Liquidity & Exits</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Liquidity, Withdrawals & Premature Closure Rules
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Understand the premature encashment, lock-in timelines, and loan provisions applicable to our 4 Post Office small savings schemes.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {withdrawalRules.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:border-[#032e92]/30 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-900">{item.scheme}</h3>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#032e92]">
                    Tenure: {item.tenure}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.rule}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 font-medium">
                <FontAwesomeIcon icon={faShieldHalved} className="text-emerald-500" />
                <span>Statutory Post Office Rule</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
