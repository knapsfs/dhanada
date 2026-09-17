import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faLandmark,
  faCalendarCheck,
  faScaleBalanced,
  faLock,
  faArrowsRotate
} from '@fortawesome/free-solid-svg-icons';

export default function InterestRateNotifications() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faBell} />
            <span>Government Notification Mechanism</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Interest Rates & Government Notifications
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Understand how the Ministry of Finance determines small savings interest rates, the quarterly review cycle, and how rate revisions affect existing versus new deposits.
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
                Small savings interest rates are not determined arbitrarily. By law, they are linked formulaically to the secondary market yields of benchmark Government Securities (G-Secs) of comparable maturities traded over the preceding three months, plus a sovereign policy spread ranging between 0 and 100 basis points.
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

          {/* Right Column: Fixed vs Floating Nature */}
          <div className="lg:col-span-6 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 border border-blue-100 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-[#032e92] uppercase tracking-wider">
                Crucial Rule Distinction
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Rate Lock-in vs Floating Rates
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Subscribers must understand that some schemes lock your rate forever on Day 1, while others adjust dynamically to every quarterly notification:
              </p>

              {/* Locked schemes */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-extrabold text-[#032e92]">
                  <FontAwesomeIcon icon={faLock} />
                  <span>Fixed for Full Tenure (Day 1 Locked)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Schemes:</strong> SCSS, POMIS, NSC, KVP, MSSC & Post Office Time Deposits.<br />
                  The rate notified on the date of your account opening is legally contracted and remains unchanged throughout your 2, 5, or 9.5-year tenure.
                </p>
              </div>

              {/* Floating schemes */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 text-sm font-extrabold text-blue-700">
                  <FontAwesomeIcon icon={faArrowsRotate} />
                  <span>Floating Quarterly (Applies to All Accounts)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Schemes:</strong> Public Provident Fund (PPF) & Sukanya Samriddhi Yojana (SSY).<br />
                  Interest rate resets dynamically every quarter for all existing and new accounts based on the latest government notification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
