import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
  faCoins,
  faVault,
  faCalculator,
  faArrowTrendUp,
  faSquareRootVariable,
  faCircleCheck,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function RecurringDepositMaturityBreakdown() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faChartPie} />
            <span>Component Analysis</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            RD Maturity Breakdown
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Understand how each rupee of your monthly deposit interacts with compounding interest to produce your consolidated maturity sum.
          </p>
        </div>

        {/* Visual 4-Pillar Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 sm:mb-12">
          <div className="p-6 rounded-2xl bg-[#f7f9fc] border border-slate-200/80 hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#032e92] flex items-center justify-center text-lg mb-4">
              <FontAwesomeIcon icon={faCoins} />
            </div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
              Monthly Contributions
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1">P × n</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every month, a fixed installment $P$ is debited on your chosen date for $n$ consecutive months.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#f7f9fc] border border-slate-200/80 hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg mb-4">
              <FontAwesomeIcon icon={faVault} />
            </div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
              Total Principal Deposited
            </div>
            <div className="text-2xl font-black text-slate-900 mb-1">100% Capital</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              The aggregate amount of your own money placed in the deposit, fully protected by the issuing institution.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#f7f9fc] border border-slate-200/80 hover:border-blue-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg mb-4">
              <FontAwesomeIcon icon={faArrowTrendUp} />
            </div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">
              Compound Interest Earned
            </div>
            <div className="text-2xl font-black text-emerald-600 mb-1">Quarterly Accrual</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interest calculated on reducing tenures for successive installments and compounded every 3 months.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#032e92] to-[#021d63] text-white shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-white/10 text-blue-200 flex items-center justify-center text-lg mb-4">
              <FontAwesomeIcon icon={faCalculator} />
            </div>
            <div className="text-xs text-blue-200 font-bold uppercase tracking-wider mb-1">
              Total Maturity Amount
            </div>
            <div className="text-2xl font-black text-white mb-1">Principal + Interest</div>
            <p className="text-xs text-blue-100/80 leading-relaxed">
              The final lump sum credited directly to your savings account upon completion of the contractual tenure.
            </p>
          </div>
        </div>

        {/* Compounding Formula Detail Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#f7f9fc] border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#032e92] text-xs font-bold uppercase tracking-wider">
                <FontAwesomeIcon icon={faSquareRootVariable} />
                <span>Standard Banking Mathematical Model</span>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                The Indian Banking Compounding Formula
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                As per Indian Banks' Association (IBA) guidelines, interest on recurring deposits is compounded quarterly based on the exact duration each individual monthly installment resides in the account:
              </p>
              <div className="p-4 rounded-xl bg-white border border-slate-200 font-mono text-xs sm:text-sm text-[#032e92] font-bold overflow-x-auto">
                M = Σ [ P × (1 + r / 400) ^ (4 × (n - k + 1) / 12) ]
              </div>
              <ul className="text-xs text-slate-600 space-y-1.5">
                <li>• <strong>M:</strong> Total maturity amount received</li>
                <li>• <strong>P:</strong> Fixed monthly installment amount</li>
                <li>• <strong>r:</strong> Contracted annual interest rate (in %)</li>
                <li>• <strong>n:</strong> Total number of monthly installments</li>
                <li>• <strong>k:</strong> Installment index number (k = 1 to n)</li>
              </ul>
            </div>

            <div className="lg:col-span-6">
              <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
                  Worked Illustration (₹10,000 / mo for 3 Years @ 7.00% p.a.)
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly Contribution:</span>
                    <span className="font-bold text-slate-800">₹10,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Tenure:</span>
                    <span className="font-bold text-slate-800">36 Months (3 Years)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Capital Deposited:</span>
                    <span className="font-bold text-slate-900">₹3,60,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Quarterly Compounded Interest:</span>
                    <span className="font-bold text-emerald-600">+₹42,300*</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-200 text-base font-extrabold text-[#032e92]">
                    <span>Final Maturity Value:</span>
                    <span>₹4,02,300*</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pt-2 border-t border-slate-100">
                  * Indicative calculation before applicable TDS deductions. Pre-tax values shown.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
