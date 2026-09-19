import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTriangleExclamation,
  faChartLine,
  faHourglassEnd,
  faFileInvoice,
  faBan,
  faScaleBalanced
} from '@fortawesome/free-solid-svg-icons';

const risks = [
  {
    icon: faChartLine,
    title: 'Market Risk & NAV Volatility',
    desc: 'Because ELSS funds invest heavily in equities (≥ 80%), unit values (NAV) fluctuate daily with market conditions. Returns are not guaranteed or protected, and past performance does not assure future results.'
  },
  {
    icon: faHourglassEnd,
    title: 'Independent SIP Lock-In Mechanics',
    desc: 'Each monthly SIP installment has its own separate 36-month lock-in. For example, an installment made in March 2025 will unlock in March 2028, while an installment in April 2025 unlocks in April 2028.'
  },
  {
    icon: faBan,
    title: 'Strictly No Premature Redemptions',
    desc: 'Units cannot be redeemed, pledged as collateral, or switched to another mutual fund scheme before the completion of the 3-year statutory lock-in period, even during personal financial emergencies.'
  },
  {
    icon: faFileInvoice,
    title: 'Tax Regime Compatibility (Old vs New)',
    desc: 'Section 80C tax deductions are available exclusively if you opt for the Old Tax Regime. The default New Tax Regime does not permit deductions under Section 80C (except Section 80CCD(2) for employer NPS).'
  },
  {
    icon: faScaleBalanced,
    title: 'LTCG Tax on Gains Above ₹1.25 Lakh',
    desc: 'As per the Finance Act 2024, Long-Term Capital Gains (LTCG) from equity mutual funds exceeding ₹1.25 Lakh in a single financial year are taxed at 12.5% without indexation benefits.'
  },
  {
    icon: faTriangleExclamation,
    title: '3 Years is a Minimum, Not the Ideal Horizon',
    desc: 'While the statutory lock-in is 3 years, equity mutual funds deliver better risk-adjusted compounding over 5 to 7+ years. Exiting at exactly 3 years during a market trough could adversely affect returns.'
  }
];

export default function ELSSRisks() {
  return (
    <section className="py-20 lg:py-28 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-600" />
            <span>Transparency & Risk Disclosure</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Key Risks & Things to Know{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Before You Invest
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Every prudent investment journey begins with a complete, transparent understanding of risks, lock-in rules, and taxation nuances.
          </p>
        </div>

        {/* Risks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {risks.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700 mb-5 shadow-xs">
                  <FontAwesomeIcon icon={item.icon} className="text-lg" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#0a192f] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Regulatory Banner */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-gray-200 text-center max-w-4xl mx-auto shadow-xs">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>Standard SEBI Statutory Warning:</strong> Mutual Fund investments are subject to market risks, read all scheme related documents carefully. Past performance is no guarantee of future returns. The tax details provided herein are based on current provisions of the Income Tax Act, 1961 and are subject to amendments from time to time.
          </p>
        </div>
      </div>
    </section>
  );
}
