import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTriangleExclamation,
  faArrowTrendDown,
  faBan,
  faRotateRight,
  faBuildingCircleExclamation,
  faFileInvoiceDollar,
  faPercent
} from '@fortawesome/free-solid-svg-icons';

const risks = [
  {
    icon: faArrowTrendDown,
    title: 'Inflation Risk (Post-Tax Returns)',
    desc: 'While nominal returns are guaranteed, real purchasing power may decline if inflation exceeds your post-tax interest yield. For high-tax bracket investors, post-tax FD yields often lag consumer inflation.'
  },
  {
    icon: faBan,
    title: 'Premature Withdrawal Penalties',
    desc: 'Liquidating a bank FD before its contracted maturity date typically incurs a 0.5% to 1.0% interest rate reduction penalty. Tax-saving 5-year FDs strictly prohibit premature withdrawal under any circumstance.'
  },
  {
    icon: faRotateRight,
    title: 'Reinvestment & Rate Cycle Risk',
    desc: 'When a high-interest deposit matures during an economic rate-cut cycle, renewing the funds will occur at prevailing lower rates, leading to reduced periodic interest cash flow.'
  },
  {
    icon: faBuildingCircleExclamation,
    title: 'Issuer Credit Risk (Corporate FDs)',
    desc: 'Bank deposits are insured under DICGC up to ₹5,00,000 per bank. Corporate/NBFC FDs are uninsurable under DICGC and carry default risk linked to the corporate balance sheet and credit rating.'
  },
  {
    icon: faFileInvoiceDollar,
    title: 'Taxation at Full Slab Rates',
    desc: 'Unlike equity capital gains which benefit from concessional tax rates, FD interest is added to your total income and taxed at your marginal slab rate (up to 30% + cess), alongside mandatory TDS deductions.'
  },
  {
    icon: faPercent,
    title: 'Dynamic Rate Adjustments on Renewal',
    desc: 'Interest rates displayed today apply only to newly booked deposits. At the time of maturity and auto-renewal, the prevailing card rates on that specific renewal date will apply.'
  }
];

export default function FixedDepositRisks() {
  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-amber-600" />
            <span>Transparency & Risk Realities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Key Risks & Things to Know{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Before Booking an FD
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            While Fixed Deposits offer capital stability, investors must understand inflation dynamics, liquidity constraints, and issuer distinctions.
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

        {/* Regulatory Disclaimer Banner */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-gray-200 text-center max-w-4xl mx-auto shadow-xs">
          <p className="text-xs text-gray-500 leading-relaxed">
            <strong>Regulatory Guidance:</strong> Fixed deposit interest rates, maturity proceeds, premature withdrawal conditions, and TDS applicability are governed by the respective financial institution's policies and guidelines prescribed by the Reserve Bank of India (RBI) and the Ministry of Corporate Affairs (MCA).
          </p>
        </div>
      </div>
    </section>
  );
}
