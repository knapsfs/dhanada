import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShapes,
  faUserTie,
  faRotateRight,
  faArrowTrendUp,
  faHandHoldingDollar,
  faShieldHalved,
  faCircleCheck,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { WHY_INVEST_POINTS } from '../../data/mutualFundsData';

export default function WhyInvestMf() {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'faShapes': return faShapes;
      case 'faUserTie': return faUserTie;
      case 'faRotateRight': return faRotateRight;
      case 'faArrowTrendUp': return faArrowTrendUp;
      case 'faHandHoldingDollar': return faHandHoldingDollar;
      case 'faShieldHalved': return faShieldHalved;
      default: return faCircleCheck;
    }
  };

  return (
    <section className="py-20 lg:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faStar} className="text-[#2490ef]" />
            <span>Strategic Advantages</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#032e92] tracking-tight">
            Why Invest in Mutual Funds?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            Mutual funds democratize high-level investing by offering retail investors the same institutional-grade research, diversification, and liquidity enjoyed by large institutional funds.
          </p>
        </div>

        {/* 6 Benefit Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WHY_INVEST_POINTS.map((item, index) => (
            <div
              key={index}
              className="p-7 rounded-3xl bg-[#f8fbff] border border-blue-100/80 shadow-xs hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-[#032e92] shadow-xs">
                    <FontAwesomeIcon icon={getIcon(item.icon)} className="text-xl" />
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100/70 text-[#032e92]">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">{item.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-100/60 flex items-center gap-2 text-xs font-semibold text-[#032e92]">
                <FontAwesomeIcon icon={faCircleCheck} className="text-emerald-500" />
                <span>Verified KNAPS Advantage</span>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Metric Strip */}
        <div className="mt-16 bg-gradient-to-r from-[#032e92] to-[#021d63] rounded-3xl p-8 text-white shadow-xl shadow-blue-950/15">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            <div className="p-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">₹65+ Lakh Cr</div>
              <div className="text-xs sm:text-sm text-blue-200 mt-1 font-medium">Indian MF Industry AUM</div>
            </div>
            <div className="p-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">19+ Crore</div>
              <div className="text-xs sm:text-sm text-blue-200 mt-1 font-medium">Active Mutual Fund Folios</div>
            </div>
            <div className="p-2 pt-6 lg:pt-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">₹23,000+ Cr</div>
              <div className="text-xs sm:text-sm text-blue-200 mt-1 font-medium">Monthly SIP Contributions</div>
            </div>
            <div className="p-2 pt-6 lg:pt-2">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">100%</div>
              <div className="text-xs sm:text-sm text-blue-200 mt-1 font-medium">SEBI & AMFI Compliance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
