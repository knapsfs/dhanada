import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuildingColumns,
  faPersonWalkingWithCane,
  faFileInvoiceDollar,
  faCoins,
  faHandHoldingDollar,
  faBuilding,
  faRotate,
  faCheckCircle,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const fdTypes = [
  {
    id: 'regular-bank-fd',
    title: 'Regular Bank Fixed Deposit',
    tagline: 'Standard term deposit offered by scheduled public and private commercial banks.',
    icon: faBuildingColumns,
    badge: 'Most Popular',
    badgeColor: 'bg-blue-50 text-[#032e92] border-blue-200',
    idealFor: 'Any individual looking for capital stability and predictable returns',
    tenures: '7 Days to 10 Years',
    highlights: [
      'Covered by DICGC insurance up to ₹5 Lakh per depositor per bank',
      'Flexible tenures tailored to exact goal dates',
      'Option to choose cumulative compounding or periodic interest payout',
      'Instant loan or overdraft facility available up to 90% of deposit'
    ]
  },
  {
    id: 'senior-citizen-fd',
    title: 'Senior Citizen Fixed Deposit',
    tagline: 'Special preferential rates designed for individuals aged 60 and above.',
    icon: faPersonWalkingWithCane,
    badge: 'Preferential Rates',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    idealFor: 'Retirees and seniors seeking dependable cash flow and higher yield',
    tenures: '7 Days to 10 Years',
    highlights: [
      'Additional 0.25% to 0.50% p.a. interest over standard retail rates',
      'Non-cumulative monthly or quarterly payout options for living expenses',
      'Tax exemption on interest income up to ₹50,000 u/s 80TTB',
      'Eligible to submit Form 15H for zero TDS if total income is below taxable limits'
    ]
  },
  {
    id: 'tax-saving-fd',
    title: 'Tax-Saving Fixed Deposit',
    tagline: 'Designated 5-year fixed deposit offering tax deduction under Section 80C.',
    icon: faFileInvoiceDollar,
    badge: 'Section 80C Eligible',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    idealFor: 'Taxpayers opting for the Old Tax Regime needing a safe 80C avenue',
    tenures: 'Fixed 5-Year Lock-In',
    highlights: [
      'Deduction of up to ₹1,50,000 per financial year under Section 80C',
      'Mandatory 5-year statutory lock-in with zero premature withdrawal',
      'No loan or overdraft facility allowed against tax-saver FDs',
      'Interest earned is taxable as per investor’s applicable income tax slab'
    ]
  },
  {
    id: 'cumulative-fd',
    title: 'Cumulative Fixed Deposit',
    tagline: 'Interest is reinvested quarterly and paid out together with principal at maturity.',
    icon: faCoins,
    badge: 'Compounded Growth',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    idealFor: 'Investors planning for future lump-sum milestones without interim cash needs',
    tenures: '6 Months to 10 Years',
    highlights: [
      'Quarterly compounding accelerates effective annual yield',
      'Lump-sum maturity value paid at the end of the contracted tenure',
      'Ideal for milestone planning like children’s education or property down payment',
      'TDS is deducted annually on accrued interest even though payout is at maturity'
    ]
  },
  {
    id: 'non-cumulative-fd',
    title: 'Non-Cumulative Fixed Deposit',
    tagline: 'Earn regular interest income credited directly to your bank account periodically.',
    icon: faHandHoldingDollar,
    badge: 'Regular Cash Flow',
    badgeColor: 'bg-pink-50 text-pink-800 border-pink-200',
    idealFor: 'Retirees, homemakers, or freelancers requiring predictable monthly cash flow',
    tenures: '1 Year to 10 Years',
    highlights: [
      'Choice of Monthly, Quarterly, Half-Yearly, or Annual interest payouts',
      'Predictable regular income without eroding the underlying principal deposit',
      'Automated direct electronic transfer into your savings bank account',
      'Effective annual yield is slightly lower than cumulative FDs due to lack of reinvestment'
    ]
  },
  {
    id: 'corporate-fd',
    title: 'Corporate / Company Fixed Deposit',
    tagline: 'Term deposits issued by leading non-banking financial companies (NBFCs) and corporations.',
    icon: faBuilding,
    badge: 'Higher Potential Yield',
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    idealFor: 'Investors seeking higher yields who are comfortable evaluating credit ratings',
    tenures: '1 Year to 5 Years',
    highlights: [
      'Offers 0.50% to 1.50% higher interest rates compared to standard bank FDs',
      'Credit ratings from CRISIL, ICRA, or CARE (AAA/AA rated highly recommended)',
      'Not covered by DICGC insurance; safety relies on the issuer’s creditworthiness',
      'Subject to guidelines established by the Reserve Bank of India (RBI) and MCA'
    ]
  },
  {
    id: 'flexi-sweep-fd',
    title: 'Flexi / Auto-Sweep Fixed Deposit',
    tagline: 'Smart hybrid deposit linked directly to your savings bank account.',
    icon: faRotate,
    badge: 'Liquid Hybrid',
    badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    idealFor: 'Active earners wanting FD interest on idle cash without sacrificing liquidity',
    tenures: 'Auto-determined by bank rules',
    highlights: [
      'Surplus balances above a threshold automatically sweep into an FD to earn higher interest',
      'Reverse sweep automatically breaks required portion of FD if savings balance falls short',
      'Zero manual management required; handled entirely through core banking automation',
      'Maintains ready liquidity for cheques and ATM withdrawals at all times'
    ]
  }
];

export default function FixedDepositTypes() {
  const { openLeadModal } = useLeadModal();

  return (
    <section id="fd-types" className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <span>Comprehensive Product Range</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Types of{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Fixed Deposits Available
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            From conventional bank term deposits and senior citizen schemes to tax-saving FDs and high-yield corporate deposits, find the exact structure matching your financial goal.
          </p>
        </div>

        {/* Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {fdTypes.map((type) => (
            <div
              key={type.id}
              className="bg-[#f7f9fc] rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs hover:shadow-xl hover:bg-white hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white transition-all duration-300 shadow-xs">
                    <FontAwesomeIcon icon={type.icon} className="text-lg" />
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${type.badgeColor}`}>
                    {type.badge}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-xl font-bold text-[#0a192f] mb-2 group-hover:text-[#032e92] transition-colors">
                  {type.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  {type.tagline}
                </p>

                {/* Ideal For & Tenures */}
                <div className="space-y-2 py-3 border-y border-gray-200/60 mb-5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Ideal For:</span>
                    <span className="font-semibold text-gray-800 text-right max-w-[65%]">{type.idealFor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 font-medium">Tenure:</span>
                    <span className="font-bold text-[#032e92]">{type.tenures}</span>
                  </div>
                </div>

                {/* Highlights */}
                <ul className="space-y-2 mb-6">
                  {type.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 text-xs flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => openLeadModal({ title: `Explore ${type.title}`, defaultService: 'Fixed Deposits' })}
                  className="w-full btn-ripple py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:scale-[1.01] cursor-pointer"
                >
                  <span>Explore {type.title.split(' ')[0]} Options</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bank vs Corporate FD Note */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-blue-50/60 border border-blue-100 text-center max-w-4xl mx-auto space-y-2">
          <h4 className="text-base font-bold text-[#0a192f]">
            Important Distinction: Bank Deposits vs Corporate Deposits
          </h4>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Bank FDs are covered by the Deposit Insurance and Credit Guarantee Corporation (DICGC), an RBI subsidiary, up to ₹5,00,000 per depositor per bank. Corporate FDs, while offering higher yields, are unsecured or partially secured borrowings governed by the Companies Act/RBI and carry credit risk corresponding to the issuer’s credit rating (e.g. CRISIL AAA, AA+). They are not covered by DICGC insurance.
          </p>
        </div>
      </div>
    </section>
  );
}
