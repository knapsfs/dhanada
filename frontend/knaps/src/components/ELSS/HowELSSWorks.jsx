import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoins,
  faChartPie,
  faHourglassHalf,
  faHandHoldingDollar,
  faCheckCircle,
  faArrowRight,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const steps = [
  {
    stepNumber: '01',
    title: 'Choose Investment Route',
    desc: 'Decide between automated monthly SIPs (from ₹500/month) to average out market fluctuations, or a one-time lump-sum investment to optimize annual tax deductions.',
    icon: faCoins,
    highlights: [
      'SIP from just ₹500/month',
      'Lump-sum option available',
      'No upper ceiling on investment'
    ]
  },
  {
    stepNumber: '02',
    title: 'Equity Portfolio Allocation',
    desc: 'Your capital is pooled into an actively managed fund where professional fund managers construct a diversified portfolio across high-potential Indian businesses.',
    icon: faChartPie,
    highlights: [
      '80%+ equity market exposure',
      'Diversified across key sectors',
      'Professional fund managers'
    ]
  },
  {
    stepNumber: '03',
    title: '3-Year Statutory Lock-In',
    desc: 'Each unit purchased remains locked for exactly 3 years from its allotment date. In a SIP, each monthly installment runs its own individual 36-month clock.',
    icon: faHourglassHalf,
    highlights: [
      'Shortest 80C lock-in period',
      'Instills market discipline',
      'Reduces emotional exits'
    ]
  },
  {
    stepNumber: '04',
    title: 'Post-Lock-In Freedom',
    desc: 'Once the 3-year period finishes, you have 100% freedom. You can redeem units, switch schemes, or continue holding to let compound interest work its magic.',
    icon: faHandHoldingDollar,
    highlights: [
      'No mandatory redemption',
      'Continue holding for 5–10+ yrs',
      'Tax-efficient redemption'
    ]
  }
];

export default function HowELSSWorks() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <span>Simple 4-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            How ELSS Works —{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              From Investment to Maturity
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Understanding the lifecycle of an ELSS investment: from your initial contribution to portfolio management and post-lock-in flexibility.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-blue-200/90 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-200/60 flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-xs">
                    <FontAwesomeIcon icon={step.icon} className="text-lg" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-gray-200 group-hover:text-[#032e92]/30 transition-colors">
                    {step.stepNumber}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2">
                {step.highlights.map((h, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2 text-xs text-gray-700">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-xs" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Process Guarantee Banner */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-[#0a192f] to-[#021d63] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-bold tracking-tight">
              Ready to start your disciplined tax-saving SIP today?
            </h4>
            <p className="text-xs sm:text-sm text-blue-200">
              Get an objective, performance-oriented ELSS fund comparison in minutes with zero paperwork friction.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openLeadModal({ title: 'Start ELSS Investment', defaultService: 'ELSS' })}
              className="btn-ripple px-6 py-3.5 rounded-xl text-[15px] font-semibold bg-white text-[#032e92] hover:bg-blue-50 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Top ELSS Funds</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </button>
            <a
              href="tel:+918080808080"
              className="btn-ripple px-6 py-3.5 rounded-xl text-[15px] font-semibold bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <FontAwesomeIcon icon={faPhone} className="text-xs" />
              <span>+91 8080808080</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
