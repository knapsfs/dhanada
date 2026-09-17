import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimeline,
  faArrowTrendUp,
  faCoins,
  faChartLine,
  faPiggyBank,
  faHourglassHalf
} from '@fortawesome/free-solid-svg-icons';

const growthHorizons = {
  10: {
    label: '10 Years Horizon',
    invested: '₹12,00,000',
    growth: '₹8,48,000',
    total: '₹20,48,000',
    investedRatio: '59%',
    growthRatio: '41%',
    stageDescription: 'The Foundation Phase: Your contributions form the bulk of the portfolio as asset accumulation begins.'
  },
  20: {
    label: '20 Years Horizon',
    invested: '₹24,00,000',
    growth: '₹51,94,000',
    total: '₹75,94,000',
    investedRatio: '32%',
    growthRatio: '68%',
    stageDescription: 'The Compounding Surge: Investment gains now comfortably exceed total principal contributions.'
  },
  30: {
    label: '30 Years Horizon',
    invested: '₹36,00,000',
    growth: '₹1,90,50,000',
    total: '₹2,26,50,000',
    investedRatio: '16%',
    growthRatio: '84%',
    stageDescription: 'The Snowball Phase: Massive compounding effect where growth accounts for more than 84% of your total corpus.'
  }
};

export default function RetirementCorpusGrowth() {
  const [selectedHorizon, setSelectedHorizon] = useState(30);
  const data = growthHorizons[selectedHorizon];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faTimeline} />
            <span>Compounding Horizon</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Retirement Corpus Growth Over Time
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Witness the multi-decade power of compound growth. Assuming a disciplined ₹10,000 monthly contribution at an illustrative 10% CAGR.
          </p>
        </div>

        {/* Horizon Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 rounded-2xl bg-[#f7f9fc] border border-slate-200 shadow-sm">
            {[10, 20, 30].map((h) => (
              <button
                key={h}
                onClick={() => setSelectedHorizon(h)}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedHorizon === h
                    ? 'bg-[#032e92] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {growthHorizons[h].label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Interactive Horizon Card */}
        <div className="bg-[#f7f9fc] rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Multi-Decade Timeline
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {data.label}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {data.stageDescription}
              </p>

              <div className="space-y-3 pt-2 text-sm">
                <div className="flex justify-between p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-500 font-medium">Total Invested Capital:</span>
                  <span className="font-bold text-slate-900">{data.invested}</span>
                </div>
                <div className="flex justify-between p-3 rounded-xl bg-white border border-slate-200">
                  <span className="text-slate-500 font-medium">Estimated Growth / Profits:</span>
                  <span className="font-bold text-emerald-600">+{data.growth}</span>
                </div>
                <div className="flex justify-between p-3.5 rounded-xl bg-blue-50 border border-blue-200 font-extrabold text-[#032e92]">
                  <span>Total Accumulated Corpus:</span>
                  <span>{data.total}*</span>
                </div>
              </div>
            </div>

            {/* Visual Breakdown Bar & Stat Pillars */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                    <span className="text-[#032e92]">Principal Share: {data.investedRatio}</span>
                    <span className="text-emerald-600">Growth Share: {data.growthRatio}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden flex">
                    <div
                      style={{ width: data.investedRatio }}
                      className="bg-[#032e92] h-full transition-all duration-500"
                      title="Invested Principal"
                    />
                    <div
                      style={{ width: data.growthRatio }}
                      className="bg-emerald-500 h-full transition-all duration-500"
                      title="Compound Growth"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-xs text-slate-500 block mb-1">Time Horizon</span>
                    <span className="text-xl font-black text-slate-900">{selectedHorizon} Years</span>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-center">
                    <span className="text-xs text-emerald-700 block mb-1">Wealth Multiple</span>
                    <span className="text-xl font-black text-emerald-700">
                      {selectedHorizon === 10 ? '1.7x' : selectedHorizon === 20 ? '3.2x' : '6.3x'}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                  * Note: Figures assume ₹10,000 monthly contributions compounding at an illustrative 10% annual rate. Market returns will fluctuate over real market cycles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
