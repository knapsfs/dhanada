import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faShieldHalved,
  faPersonWalkingWithCane,
  faVault,
  faBullseye,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const profiles = [
  {
    icon: faShieldHalved,
    title: 'Capital Preservation Seekers',
    description: 'Investors who prioritize principal stability over market volatility, preferring a contracted interest yield with zero day-to-day market exposure.',
    tag: 'Low Risk Tolerance'
  },
  {
    icon: faPersonWalkingWithCane,
    title: 'Retirees & Senior Citizens',
    description: 'Individuals aged 60+ seeking predictable monthly or quarterly cash flow to fund household expenses, benefiting from additional senior citizen interest rates and Section 80TTB tax benefits.',
    tag: 'Regular Income Needs'
  },
  {
    icon: faVault,
    title: 'Emergency Fund Custodians',
    description: 'Savers parking 3 to 12 months of household expenses in a safe vehicle that yields better than a savings account while remaining accessible via premature withdrawal or overdraft.',
    tag: 'Contingency Reserves'
  },
  {
    icon: faBullseye,
    title: 'Defined Near-Term Milestone Savers',
    description: 'Individuals with commitments due in 6 months to 3 years (e.g., college tuition fees, home down payments, vehicle purchases) where equity market volatility cannot be tolerated.',
    tag: 'Near-Term Commitments'
  }
];

export default function WhoShouldConsiderFD() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 lg:py-28 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faUsers} className="text-[#032e92]" />
            <span>Suitability & Goals Alignment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Who May Consider{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Fixed Deposits (FD)?
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            While investment preferences vary, Fixed Deposits are widely utilized across conservative savings and goal-oriented wealth preservation strategies.
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {profiles.map((profile, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-gray-200/80 hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-xs">
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

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-[#032e92] group-hover:translate-x-1 transition-transform">
                <span>Evaluate your suitability</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px] ml-1.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Suitability Disclaimer */}
        <div className="mt-12 p-6 rounded-3xl bg-white border border-gray-200 text-center max-w-4xl mx-auto shadow-xs">
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            <strong>Suitability Guidance:</strong> The use cases above illustrate general scenarios and do not constitute personalized financial advice. For ultra-long-term wealth creation (7+ years), investors often combine Fixed Deposits with equity-oriented mutual funds to balance capital stability with inflation-beating growth.
          </p>
        </div>
      </div>
    </section>
  );
}
