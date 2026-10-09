import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faBriefcase,
  faSeedling,
  faBullseye,
  faArrowTrendUp,
  faShieldHeart,
  faCheckCircle,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const profiles = [
  {
    icon: faBriefcase,
    title: 'Old Tax Regime Taxpayers',
    description: 'Individuals and HUFs who have opted for the Old Tax Regime and wish to optimize their eligible Section 80C deduction limit of up to ₹1,50,000 to reduce taxable income.',
    tag: 'Section 80C Filers'
  },
  {
    icon: faSeedling,
    title: 'First-Time Equity Investors',
    description: 'Investors taking their first steps into the equity market who benefit from the mandatory 3-year lock-in, which prevents panic-selling during routine market fluctuations.',
    tag: 'Disciplined Beginners'
  },
  {
    icon: faArrowTrendUp,
    title: 'Long-Term Wealth Builders',
    description: 'Investors with a time horizon of 5 to 10+ years who recognize that equity compounding has historically outperformed traditional fixed-income instruments over extended cycles.',
    tag: 'Wealth Compounding'
  },
  {
    icon: faBullseye,
    title: 'Goal-Oriented Systematic Savers',
    description: 'Salaried professionals seeking to automate their savings through monthly SIPs aligned with future medium-to-long term financial milestones like child education or down payments.',
    tag: 'Milestone Planning'
  }
];

export default function WhoShouldConsiderELSS() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faUsers} className="text-[#032e92]" />
            <span>Suitability & Profile Match</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Who May Consider{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              ELSS Mutual Funds?
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            While financial goals differ for every individual, ELSS mutual funds are commonly evaluated across several classic investment and tax-planning use cases.
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {profiles.map((profile, idx) => (
            <div
              key={idx}
              className="bg-[#f7f9fc] rounded-3xl p-7 sm:p-8 border border-gray-200/80 hover:bg-white hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-xs">
                    <FontAwesomeIcon icon={profile.icon} className="text-lg" />
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-[#032e92] border border-blue-100">
                    {profile.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors">
                  {profile.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {profile.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center text-xs font-semibold text-[#032e92] group-hover:translate-x-1 transition-transform">
                <span>Evaluate your suitability</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px] ml-1.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Suitability Notice Callout */}
        <div className="mt-12 p-6 rounded-3xl bg-blue-50/60 border border-blue-100 text-center max-w-4xl mx-auto">
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            <strong>Important Suitability Note:</strong> The profiles above are broad illustrative use cases and should not be construed as personalized investment advice. If your investment horizon is strictly under 3 years or you cannot tolerate equity market volatility, traditional fixed-income avenues may be more suitable.
          </p>
        </div>
      </div>
    </section>
  );
}
