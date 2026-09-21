import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faClock,
  faShieldHalved,
  faSliders,
  faCheckDouble,
  faHandHoldingDollar,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const reasons = [
  {
    icon: faChartLine,
    title: 'Predictable & Locked-In Interest',
    description: 'The contracted interest rate is locked in on the date of placement. Your yield remains insulated from market volatility or central bank repo-rate reductions throughout the agreed tenure.',
    highlight: 'Insulated from Rate Cuts'
  },
  {
    icon: faClock,
    title: 'Defined Maturity Terms',
    description: 'Match your investment tenure precisely to your upcoming commitments — whether it is college tuition in 18 months, a property down payment in 3 years, or retirement compounding.',
    highlight: 'Goal-Aligned'
  },
  {
    icon: faShieldHalved,
    title: 'Capital Stability Characteristics',
    description: 'For investors prioritizing principal safety over aggressive market risk, bank Fixed Deposits offer stability backed by bank balance sheets and DICGC coverage up to ₹5 Lakh per bank.',
    highlight: 'DICGC Insured in Banks'
  },
  {
    icon: faSliders,
    title: 'Flexible Tenure Range (7D – 10Y)',
    description: 'Unlike instruments with rigid 5 or 15-year statutory lock-ins, Fixed Deposits allow you to pick custom tenures ranging from as short as 7 days up to 10 years based on liquidity needs.',
    highlight: 'High Tenure Choice'
  },
  {
    icon: faHandHoldingDollar,
    title: 'Dependable Cash Flow Options',
    description: 'Choose non-cumulative payouts to receive predictable monthly, quarterly, or half-yearly income directly into your savings account, ideal for retirees and regular cash-flow requirements.',
    highlight: 'Periodic Income'
  },
  {
    icon: faCheckDouble,
    title: 'Simple & Transparent Structure',
    description: 'Fixed Deposits require zero market timing, portfolio tracking, or fund manager evaluations. You know your exact payout schedule and maturity proceeds right from Day 1.',
    highlight: 'Zero Complexity'
  }
];

export default function WhyConsiderFixedDeposit() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 lg:py-28 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faShieldHalved} className="text-[#032e92]" />
            <span>Core Investment Advantages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Why Consider{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Fixed Deposits (FD)?
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Fixed Deposits provide a stable foundation for financial planning, combining predictable income with structured capital management.
          </p>
        </div>

        {/* 6 Reasons Grid (3x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {reasons.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-200/60 flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-xs">
                    <FontAwesomeIcon icon={item.icon} className="text-lg" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#032e92] border border-blue-100">
                    {item.highlight}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-[#032e92] group-hover:translate-x-1 transition-transform">
                <span>View placement details</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px] ml-1.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-14 text-center">
          <button
            onClick={() => openLeadModal({ title: 'Explore Fixed Deposit Options', defaultService: 'Fixed Deposits' })}
            className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Compare Fixed Deposit Rates</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
