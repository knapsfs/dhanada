import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSliders,
  faRobot,
  faUserGear,
  faChartPie,
  faArrowRight,
  faCheckCircle,
  faShieldHalved
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function ActiveVsAutoChoice() {
  const [selectedMode, setSelectedMode] = useState('auto'); // 'active' or 'auto'
  const [selectedLifecycle, setSelectedLifecycle] = useState('lc50'); // 'lc75', 'lc50', 'lc25'
  const { openLeadModal } = useLeadModal();

  const lifecycleData = {
    lc75: {
      name: 'Aggressive Life Cycle Fund (LC75)',
      badge: 'For Young / High Risk Tolerance',
      equityStart: '75%',
      equityEnd: '15%',
      taperAge: '35 Years',
      description:
        'Maintains a heavy 75% equity exposure until age 35. Thereafter, equity automatically tapers down by 4% per year, shifting toward Corporate Debt and G-Secs to safeguard the corpus as retirement nears.'
    },
    lc50: {
      name: 'Moderate Life Cycle Fund (LC50 — Default)',
      badge: 'Balanced Growth & Preservation',
      equityStart: '50%',
      equityEnd: '10%',
      taperAge: '35 Years',
      description:
        'The default NPS option for subscribers who do not select a strategy. Maintains 50% in equities up to age 35, gradually tapering down by 2% each year down to 10% by age 55.'
    },
    lc25: {
      name: 'Conservative Life Cycle Fund (LC25)',
      badge: 'Capital Safety Centric',
      equityStart: '25%',
      equityEnd: '5%',
      taperAge: '35 Years',
      description:
        'Prioritizes fixed-income stability from the outset with only 25% equity up to age 35, tapering to 5% by age 55. The vast majority of capital remains anchored in Government Securities and Corporate Debt.'
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faSliders} />
            <span>Investment Strategies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Active Choice vs Auto Choice
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Choose whether you prefer full hands-on asset allocation control or automated, age-dependent de-risking via PFRDA lifecycle funds.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#f7f9fc] border border-slate-200 shadow-inner">
            <button
              onClick={() => setSelectedMode('auto')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedMode === 'auto'
                  ? 'bg-[#032e92] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FontAwesomeIcon icon={faRobot} />
              <span>Auto Choice (Lifecycle Funds)</span>
            </button>
            <button
              onClick={() => setSelectedMode('active')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                selectedMode === 'active'
                  ? 'bg-[#032e92] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FontAwesomeIcon icon={faUserGear} />
              <span>Active Choice (Self-Directed)</span>
            </button>
          </div>
        </div>

        {/* Content Box */}
        {selectedMode === 'auto' ? (
          <div className="bg-[#f7f9fc] rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
            <div className="max-w-3xl">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Automated Age-Based De-Risking
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                Lifecycle Funds — Protect Gains as You Mature
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Under Auto Choice, you select a risk tier once. The PFRDA system automatically rebalances your portfolio annually on your birthday, systematically reducing volatile equity exposure as you get closer to retirement age 60.
              </p>
            </div>

            {/* Sub-tabs for the 3 Lifecycle Funds */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'lc75', label: 'LC75 (Aggressive)' },
                { id: 'lc50', label: 'LC50 (Moderate / Default)' },
                { id: 'lc25', label: 'LC25 (Conservative)' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedLifecycle(item.id)}
                  className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all border ${
                    selectedLifecycle === item.id
                      ? 'bg-white border-[#032e92] text-[#032e92] shadow-sm'
                      : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Selected Lifecycle Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h4 className="text-xl font-extrabold text-slate-900">
                    {lifecycleData[selectedLifecycle].name}
                  </h4>
                  <span className="text-xs font-semibold text-blue-600">
                    {lifecycleData[selectedLifecycle].badge}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-[#032e92]">
                    Equity at 35: {lifecycleData[selectedLifecycle].equityStart}
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                    Equity at 55: {lifecycleData[selectedLifecycle].equityEnd}
                  </div>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                {lifecycleData[selectedLifecycle].description}
              </p>

              {/* Graphical representation bar */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-slate-500 font-semibold">
                  <span>Age 18 – 35 (Growth Phase)</span>
                  <span>Age 45 (Transition)</span>
                  <span>Age 55 – 60 (Preservation Phase)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden flex">
                  <div
                    style={{
                      width: selectedLifecycle === 'lc75' ? '75%' : selectedLifecycle === 'lc50' ? '50%' : '25%'
                    }}
                    className="bg-blue-600 h-full transition-all duration-500"
                    title="Equity Share"
                  />
                  <div className="bg-indigo-500 h-full w-[25%]" title="Corporate Debt" />
                  <div className="bg-emerald-500 h-full flex-1" title="Govt Securities" />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Equity (E)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" /> Corporate Bonds (C)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> G-Secs (G)
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#f7f9fc] rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
            <div className="max-w-3xl">
              <span className="text-xs font-bold text-[#032e92] uppercase tracking-wider">
                Full Customization Control
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                Active Choice — Define Your Exact Asset Split
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Under Active Choice, you maintain 100% manual discretion over how your money is divided among Asset Classes E, C, G, and A. You can rebalance or modify your allocation up to twice a financial year free of cost.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-blue-600">Asset Class E (Equity)</div>
                <div className="text-2xl font-black text-slate-900">Up to 75%</div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Capped at 75% up to age 50; drops 2.5% per year to stabilize at 50% by age 60.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-indigo-600">Asset Class C (Corp Debt)</div>
                <div className="text-2xl font-black text-slate-900">Up to 100%</div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  No statutory cap. You can allocate 100% to Corporate Bonds if you seek predictable yield.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-emerald-600">Asset Class G (G-Secs)</div>
                <div className="text-2xl font-black text-slate-900">Up to 100%</div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Zero statutory cap. Complete sovereign backing without any equity or corporate credit exposure.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-purple-600">Asset Class A (Alternatives)</div>
                <div className="text-2xl font-black text-slate-900">Strictly 5% Max</div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Permitted only up to 5% for safety due to the specialized nature of REITs and InvITs.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-slate-700 flex items-center justify-between">
              <span>
                💡 <em>Rule Requirement: The sum total of your active allocation percentages across E + C + G + A must equal exactly 100%.</em>
              </span>
              <button
                onClick={() =>
                  openLeadModal({
                    title: 'Active Choice NPS Allocation Consultation',
                    defaultService: 'National Pension System (NPS)'
                  })
                }
                className="px-4 py-1.5 rounded-lg bg-[#032e92] text-white font-semibold hover:bg-[#021d63] transition-all shrink-0 cursor-pointer"
              >
                Get Allocation Advice
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
