import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faLock,
  faLockOpen,
  faReceipt,
  faMoneyBillWave,
  faArrowRight,
  faCheckCircle,
  faXmarkCircle
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function NpsAccountTypes() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faLayerGroup} />
            <span>Account Spectrum</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            NPS Account Types — Tier I vs Tier II
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            NPS operates on a dual-account architecture designed to balance statutory retirement compounding with voluntary liquidity.
          </p>
        </div>

        {/* 2 Big Comparative Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Tier I Account Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-blue-50/80 via-white to-slate-50 border-2 border-blue-200/90 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#032e92] text-white flex items-center justify-center text-lg shadow-md shadow-blue-900/20">
                    <FontAwesomeIcon icon={faLock} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#032e92]">Tier I Account</h3>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                      Mandatory Pension Account
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-100 text-[#032e92] text-xs font-extrabold">
                  Tax-Advantaged
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                The core pension account required by every NPS subscriber. Designed with statutory lock-in until age 60 to ensure uninterrupted compound growth toward a lifelong retirement corpus.
              </p>

              <div className="space-y-3 pt-2 text-xs sm:text-sm">
                <div className="flex justify-between py-2 border-b border-slate-200/70">
                  <span className="text-slate-500 font-medium">Primary Purpose:</span>
                  <span className="font-bold text-slate-900">Retirement Pension Corpus</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200/70">
                  <span className="text-slate-500 font-medium">Withdrawal & Liquidity:</span>
                  <span className="font-bold text-amber-700">Locked till 60 (Conditional 25% partial)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200/70">
                  <span className="text-slate-500 font-medium">Min. Contribution:</span>
                  <span className="font-bold text-slate-900">₹500 / time (Min ₹1,000 / year)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200/70">
                  <span className="text-slate-500 font-medium">Tax Benefits (Contribution):</span>
                  <span className="font-bold text-emerald-600">Sec 80CCD(1) + 80CCD(1B) + 80CCD(2)</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">Maturity Tax Treatment:</span>
                  <span className="font-bold text-emerald-600">60% Lump Sum Tax-Free, 40% Annuity</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200">
              <button
                onClick={() =>
                  openLeadModal({
                    title: 'Open NPS Tier I Account',
                    defaultService: 'National Pension System (NPS)'
                  })
                }
                className="btn-ripple w-full px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Open Tier I Account</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            </div>
          </div>

          {/* Tier II Account Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center text-lg border border-slate-200">
                    <FontAwesomeIcon icon={faLockOpen} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Tier II Account</h3>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Voluntary Liquid Savings
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-extrabold">
                  Anytime Liquidity
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                An optional, companion investment facility available only to active Tier I subscribers. Offers complete liquidity, allowing unrestricted deposits and withdrawals at low institutional fund charges.
              </p>

              <div className="space-y-3 pt-2 text-xs sm:text-sm">
                <div className="flex justify-between py-2 border-b border-slate-200/70">
                  <span className="text-slate-500 font-medium">Primary Purpose:</span>
                  <span className="font-bold text-slate-900">Flexible Wealth Accumulation</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200/70">
                  <span className="text-slate-500 font-medium">Withdrawal & Liquidity:</span>
                  <span className="font-bold text-emerald-600">100% Unrestricted Anytime Withdrawal</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200/70">
                  <span className="text-slate-500 font-medium">Min. Contribution:</span>
                  <span className="font-bold text-slate-900">₹250 / time (No annual minimum)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-200/70">
                  <span className="text-slate-500 font-medium">Tax Benefits (Contribution):</span>
                  <span className="font-bold text-slate-500">None (Except eligible Govt. employees)</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-slate-500 font-medium">Withdrawal Tax Treatment:</span>
                  <span className="font-bold text-slate-700">Capital gains taxed per individual slab</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200">
              <button
                onClick={() =>
                  openLeadModal({
                    title: 'Inquire About Tier II Account Setup',
                    defaultService: 'National Pension System (NPS)'
                  })
                }
                className="btn-ripple w-full px-6 py-3 rounded-xl text-[15px] font-semibold bg-white hover:bg-blue-50 text-[#032e92] border border-[#032e92]/20 shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Inquire About Tier II Setup</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
              </button>
            </div>
          </div>
        </div>

        {/* Informative Note */}
        <div className="p-6 rounded-2xl bg-[#f7f9fc] border border-slate-200 text-center max-w-4xl mx-auto">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-900">Pre-requisite:</strong> A Tier I account is mandatory to activate an NPS PRAN. A Tier II account can be activated simultaneously or at any subsequent time without needing a separate PRAN.
          </p>
        </div>
      </div>
    </section>
  );
}
