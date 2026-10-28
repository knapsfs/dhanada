import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBullseye,
  faSliders,
  faFingerprint,
  faChartPie,
  faArrowRight,
  faCompass
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function HowToInvestMf() {
  const { openLeadModal } = useLeadModal();

  const steps = [
    {
      step: '01',
      title: 'Define Financial Goal & Horizon',
      desc: 'Identify what you are investing for — whether it is an emergency corpus (Liquid/Debt), home down-payment (Hybrid), child higher education (Flexi/Large Cap), or retirement (Equity Index & Small Cap).',
      icon: faBullseye,
      duration: '10 Mins'
    },
    {
      step: '02',
      title: 'Select a Suitable Scheme',
      desc: 'Based on your risk tolerance and holding duration, filter the best-fit mutual fund categories. Our AMFI-certified advisors review rolling returns, expense ratios, and fund manager track records.',
      icon: faSliders,
      duration: 'Expert Assisted'
    },
    {
      step: '03',
      title: 'Invest via SIP or Lumpsum',
      desc: 'Complete 100% paperless e-KYC using Aadhaar & PAN. Set up automated monthly bank SIP mandates through NPCI / Net Banking for effortless, disciplined deductions.',
      icon: faFingerprint,
      duration: 'Instant & Digital'
    },
    {
      step: '04',
      title: 'Track, Review & Rebalance',
      desc: 'Monitor your consolidated portfolio in real-time. Conduct annual rebalancing reviews to lock in gains and ensure your asset allocation stays true to your risk appetite.',
      icon: faChartPie,
      duration: 'Ongoing Guidance'
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faCompass} className="text-[#2490ef]" />
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#032e92] tracking-tight">
            How to Invest in Mutual Funds with KNAPS
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            Investing does not have to be intimidating. Start your disciplined mutual fund journey with a paperless, assisted, and completely transparent onboarding flow.
          </p>
        </div>

        {/* 4 Cards Grid with Connecting Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((item) => (
            <div
              key={item.step}
              className="p-7 rounded-3xl bg-[#f8fbff] border border-blue-100/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-[#032e92] text-white">
                    STEP {item.step}
                  </span>
                  <div className="w-11 h-11 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-[#032e92] shadow-xs">
                    <FontAwesomeIcon icon={item.icon} className="text-lg" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2.5">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">{item.desc}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-blue-100/60 flex items-center justify-between text-xs font-semibold text-[#032e92]">
                <span>{item.duration}</span>
                <span className="text-blue-400">→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Consultation Callout Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50/70 border border-blue-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-bold text-[#032e92]">Need Guidance Picking the Right Mutual Funds?</h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Speak with our AMFI-registered financial experts for zero-bias portfolio planning tailored to your income and goals.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openLeadModal('Mutual Funds: How to Invest Assistance')}
            className="px-6 py-3 rounded-xl bg-[#032e92] text-white font-bold text-xs sm:text-sm shadow-md hover:bg-[#021d63] transition-colors flex items-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <span>Request Free Portfolio Call</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
