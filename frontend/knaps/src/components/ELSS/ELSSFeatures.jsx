import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
  faClock,
  faCoins,
  faScaleBalanced,
  faFileInvoiceDollar,
  faArrowTrendUp,
  faCheckCircle,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const features = [
  {
    icon: faChartPie,
    title: 'Equity-Oriented Portfolio',
    description: 'Under SEBI mutual fund categorisation, ELSS schemes must deploy at least 80% of total corpus in equities across large, mid, and small market capitalisations, offering true long-term compounding potential.',
    badge: '≥ 80% Equity'
  },
  {
    icon: faClock,
    title: '3-Year Statutory Lock-In',
    description: 'Every unit is locked for exactly 36 months from its allotment date. This is the shortest lock-in among all 80C instruments, allowing flexibility to reallocate or withdraw earlier than other tax-saving products.',
    badge: '36 Months'
  },
  {
    icon: faCoins,
    title: 'Flexible SIP & Lump-Sum Modes',
    description: 'Invest via monthly Systematic Investment Plans (SIP) starting from just ₹500 per month, or allocate lump sums whenever you have surplus funds. There is no statutory upper cap on investments.',
    badge: 'From ₹500'
  },
  {
    icon: faFileInvoiceDollar,
    title: 'Section 80C Tax Deduction',
    description: 'Eligible individuals and HUFs opting for the Old Tax Regime can claim deductions of up to ₹1,50,000 per financial year, lowering their taxable salary or business income directly.',
    badge: 'Up to ₹1.5L'
  },
  {
    icon: faArrowTrendUp,
    title: 'Growth & IDCW Options',
    description: 'Choose the "Growth" option to let capital compound undisturbed over time, or select "IDCW" (Income Distribution cum Capital Withdrawal) to receive periodic dividends declared by the AMC.',
    badge: 'Choice of Payout'
  },
  {
    icon: faScaleBalanced,
    title: 'Long-Term Capital Gains (LTCG) Tax',
    description: 'Because units are held for over 12 months, profits upon redemption are treated as Long-Term Capital Gains. Gains up to ₹1.25 Lakh per financial year are completely tax-free; excess is taxed at 12.5%.',
    badge: '12.5% Tax Rate'
  }
];

export default function ELSSFeatures() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 lg:py-28 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <span>Essential Fund Characteristics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Key Features of{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              ELSS Mutual Funds
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Examine the structural, statutory, and taxation framework that governs Equity Linked Savings Schemes in India.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-7 sm:p-8 border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-200/60 flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-xs">
                    <FontAwesomeIcon icon={feature.icon} className="text-lg" />
                  </div>
                  <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-[#032e92] border border-blue-100">
                    {feature.badge}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors leading-snug">
                  {feature.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs font-semibold text-[#032e92] group-hover:translate-x-1 transition-transform">
                <span>Regulatory and tax details</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px] ml-1.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA trigger */}
        <div className="mt-14 text-center">
          <button
            onClick={() => openLeadModal({ title: 'Explore Top ELSS Features', defaultService: 'ELSS' })}
            className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Compare ELSS with Other Instruments</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
