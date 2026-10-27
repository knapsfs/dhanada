import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faLock,
  faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';

export default function InterestRateNotifications() {
  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faBell} />
            <span>Government Notification Mechanism</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Interest Rates & Government Notifications
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Understand how the Ministry of Finance notifies small savings interest rates, the quarterly review cycle, and how sovereign rate lock-in protects your returns.
          </p>
        </div>

        {/* 2 Big Column Comparison & Process */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12">
          {/* Left Column: The Determination Formula */}
          <div className="lg:col-span-6 p-8 sm:p-10 rounded-3xl bg-[#f7f9fc] border border-slate-200 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Shyamala Gopinath Committee Formula
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900">
                How Notified Rates are Calculated
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Small savings interest rates are linked formulaically to the secondary market yields of benchmark Government Securities (G-Secs) of comparable maturities traded over the preceding three months, plus a sovereign policy spread.
              </p>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900">Quarterly Government Review Calendar:</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <span className="p-2 rounded-lg bg-slate-50 border">Q1: April – June</span>
                  <span className="p-2 rounded-lg bg-slate-50 border">Q2: July – September</span>
                  <span className="p-2 rounded-lg bg-slate-50 border">Q3: October – December</span>
                  <span className="p-2 rounded-lg bg-slate-50 border">Q4: January – March</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Official circulars are published by the Department of Economic Affairs, Ministry of Finance, typically in the final week before each new quarter begins.
            </p>
          </div>

          {/* Right Column: Fixed Rate Lock-in across POTD, KVP, NSC, PORD */}
          <div className="lg:col-span-6 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#032e92] uppercase tracking-wider">
                Sovereign Rate Guarantee
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Day 1 Rate Lock-in Protection
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                All 4 Post Office schemes offered (POTD, KVP, NSC, and PORD) lock in your contracted interest rate on the date of account opening:
              </p>

              {/* Day 1 Locked */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#032e92]">
                  <FontAwesomeIcon icon={faLock} />
                  <span>Fixed for Entire Tenure (Immune to Future Rate Cuts)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Covered Schemes:</strong> POTD (1, 2, 3, 5 Years), KVP (115 Months), NSC (5 Years), and PORD (5 Years).<br />
                  Once opened, subsequent downward quarterly revisions by the government do not affect your existing deposits. Your contracted yield is 100% sovereign-guaranteed until maturity.
                </p>
              </div>

              {/* New Deposits Timing */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-extrabold text-emerald-700">
                  <FontAwesomeIcon icon={faCalendarCheck} />
                  <span>When Do New Rates Apply?</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Newly revised rates apply strictly to fresh deposits opened on or after the effective date of the quarterly notification circular.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
