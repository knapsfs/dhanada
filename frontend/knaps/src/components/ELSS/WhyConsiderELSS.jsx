import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faClock,
  faCoins,
  faFileInvoiceDollar,
  faLock,
  faUserTie,
  faArrowRight,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const advantages = [
  {
    icon: faChartLine,
    title: 'Long-Term Equity Growth Potential',
    description: 'Unlike traditional fixed-rate tax-saving instruments that offer fixed 7% returns, ELSS invests predominantly in equities, offering the potential to generate inflation-beating wealth over multi-year horizons.',
    highlight: 'Inflation Beater'
  },
  {
    icon: faClock,
    title: 'Shortest Lock-In Period (3 Years)',
    description: 'Among all Section 80C options, ELSS offers the quickest path to liquidity. Your capital is locked for only 36 months, compared to 5 years for Tax-Saver FDs, 15 years for PPF, and retirement for NPS.',
    highlight: 'Shortest in 80C'
  },
  {
    icon: faCoins,
    title: 'Disciplined Investing via Monthly SIP',
    description: 'You do not have to scramble for lump-sum tax planning at year-end. Start a monthly Systematic Investment Plan (SIP) from as low as ₹500, smoothing market volatility through rupee-cost averaging.',
    highlight: 'Rupee Cost Averaging'
  },
  {
    icon: faFileInvoiceDollar,
    title: 'Applicable Tax Deductions u/s 80C',
    description: 'Investors opting for the Old Tax Regime can claim deductions of up to ₹1,50,000 per financial year, translating to potential tax savings of up to ₹46,800 in the 30% tax bracket (+ cess).',
    highlight: 'Save up to ₹46.8k'
  },
  {
    icon: faLock,
    title: 'Built-in Behavioral Discipline',
    description: 'The mandatory 3-year lock-in serves as a natural psychological barrier against premature panic exits during routine market volatility, allowing your investments to ride through market cycles.',
    highlight: 'Patience by Design'
  },
  {
    icon: faUserTie,
    title: 'Expert Professional Management',
    description: 'Your money is managed by professional asset management companies (AMCs) and seasoned fund managers backed by institutional equity research teams, sectoral models, and risk controls.',
    highlight: 'Active Research'
  }
];

export default function WhyConsiderELSS() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faChartLine} className="text-[#032e92]" />
            <span>Core Investment Advantages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Why Consider{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              ELSS Mutual Funds?
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            ELSS stands out at the intersection of tax optimization and equity market participation. Discover why millions of Indian investors choose ELSS for their wealth journey.
          </p>
        </div>

        {/* Advantages Grid (3x2) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {advantages.map((adv, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-200/60 flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-xs">
                    <FontAwesomeIcon icon={adv.icon} className="text-lg" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#032e92] border border-blue-100">
                    {adv.highlight}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors leading-snug">
                  {adv.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {adv.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-[#032e92] group-hover:translate-x-1 transition-transform">
                <span>Learn more about this feature</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px] ml-1.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="mt-14 text-center">
          <button
            onClick={() => openLeadModal({ title: 'Explore ELSS Opportunities', defaultService: 'ELSS' })}
            className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Start Your ELSS Investment</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
