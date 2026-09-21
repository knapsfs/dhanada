import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCoins,
  faChartLine,
  faHourglassHalf,
  faSliders,
  faCheckCircle,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const tenureBreakdowns = [
  { tenure: '1 Year', principal: '₹1,00,000', interest: '₹7,450', maturity: '₹1,07,450', effectiveYield: '7.45%' },
  { tenure: '3 Years', principal: '₹1,00,000', interest: '₹24,015', maturity: '₹1,24,015', effectiveYield: '8.00%' },
  { tenure: '5 Years', principal: '₹1,00,000', interest: '₹43,178', maturity: '₹1,43,178', effectiveYield: '8.64%' },
  { tenure: '10 Years', principal: '₹1,00,000', interest: '₹1,05,000', maturity: '₹2,05,000', effectiveYield: '10.50%' }
];

export default function FixedDepositInterestMaturity() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faCoins} className="text-[#032e92]" />
            <span>Compounding Explained</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Understanding FD{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Interest & Maturity Mechanics
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Discover how quarterly compounding magnifies your effective annual yield over extended tenures, turning your initial principal into a substantial maturity pool.
          </p>
        </div>

        {/* Illustrative Compounding Milestones Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {tenureBreakdowns.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#f7f9fc] rounded-3xl p-6 border border-gray-200/80 shadow-xs hover:shadow-lg hover:bg-white hover:border-blue-200 transition-all duration-300"
            >
              <div className="flex items-center justify-between pb-3 border-b border-gray-200/60 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Tenure</span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#032e92] text-xs font-bold border border-blue-100">
                  {item.tenure}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Principal:</span>
                  <strong className="text-gray-800">{item.principal}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Interest Earned:</span>
                  <strong className="text-emerald-700">+{item.interest}</strong>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200/60 text-sm">
                  <span className="text-[#0a192f] font-bold">Maturity:</span>
                  <strong className="text-[#032e92] font-black">{item.maturity}</strong>
                </div>
                <div className="flex justify-between text-[11px] pt-1">
                  <span className="text-gray-400">Effective Annual Yield:</span>
                  <span className="text-indigo-700 font-semibold">{item.effectiveYield}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cumulative vs Non-Cumulative Comparison Box */}
        <div className="bg-gradient-to-br from-[#0a192f] to-[#021d63] rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-xl mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Payout Comparison</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Cumulative vs Non-Cumulative Payouts
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-blue-200">
              Choosing the right interest payout structure depends on whether you seek wealth accumulation or recurring cash flow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Cumulative Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/15 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center">
                  <FontAwesomeIcon icon={faChartLine} className="text-lg" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Cumulative FD (Reinvestment)</h4>
                  <p className="text-xs text-blue-200">Compounded Growth at Maturity</p>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-blue-100">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 mt-0.5 text-xs" />
                  <span><strong>Interest on Interest:</strong> Accrued quarterly interest is added back to principal, increasing subsequent earnings.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 mt-0.5 text-xs" />
                  <span><strong>Highest Effective Return:</strong> Yields the highest final maturity sum among all FD payout options.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 mt-0.5 text-xs" />
                  <span><strong>Best for Goals:</strong> Perfectly suited for goals where capital is only needed at the end of the tenure.</span>
                </li>
              </ul>
            </div>

            {/* Non-Cumulative Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/15 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center">
                  <FontAwesomeIcon icon={faSliders} className="text-lg" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Non-Cumulative FD (Periodic)</h4>
                  <p className="text-xs text-blue-200">Regular Income Distribution</p>
                </div>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-blue-100">
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 mt-0.5 text-xs" />
                  <span><strong>Regular Cash Flow:</strong> Interest is paid out monthly, quarterly, or annually directly into your bank account.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 mt-0.5 text-xs" />
                  <span><strong>Income for Retirees:</strong> Ideal for senior citizens needing dependable cash flow to fund household expenses.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-400 mt-0.5 text-xs" />
                  <span><strong>Principal Preservation:</strong> Your principal stays completely intact while interest income supports daily living.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mathematical Formula Explanation Card */}
        <div className="bg-[#f7f9fc] rounded-3xl p-6 sm:p-8 border border-gray-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-base font-bold text-[#0a192f]">
              Standard Compound Interest Formula Used by Indian Banks
            </h4>
            <p className="text-xs text-gray-600 max-w-2xl leading-relaxed">
              Banks in India compound interest quarterly using the formula: <strong className="text-[#032e92]">A = P × (1 + r/n)^(n × t)</strong>, where <em>P</em> is principal, <em>r</em> is the annual interest rate, <em>n</em> is compounding frequency (4 times/year), and <em>t</em> is the tenure in years.
            </p>
          </div>
          <button
            onClick={() => openLeadModal({ title: 'Schedule Fixed Income Strategy Consultation', defaultService: 'Fixed Deposits' })}
            className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 flex items-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <span>Plan Your FD Portfolio</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
