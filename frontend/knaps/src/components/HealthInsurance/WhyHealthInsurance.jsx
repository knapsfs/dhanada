import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShieldHeart,
  faTriangleExclamation,
  faCheckCircle,
  faXmarkCircle,
  faArrowTrendUp,
  faArrowRight,
  faHospitalUser,
  faCoins,
  faHeartPulse
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const costBenchmarks = [
  { procedure: 'Coronary Bypass Surgery (CABG)', cost: '₹4.5L – ₹9.5L', duration: '5–8 days hospital stay' },
  { procedure: 'Joint Replacement (Knee / Hip)', cost: '₹3.0L – ₹6.5L', duration: 'Per joint with implants' },
  { procedure: 'Cancer Therapy (Chemo & Radiation)', cost: '₹8.0L – ₹25.0L+', duration: 'Multi-month cycles' },
  { procedure: 'ICU Care & Ventilator Support', cost: '₹2.5L – ₹5.5L', duration: 'Per week in top metros' }
];

export default function WhyHealthInsurance() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/70 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50/70 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Why Health Insurance is Your{' '}
            <span className="text-[#032e92]">
              Most Critical Financial Shield
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-normal max-w-2xl sm:max-w-3xl mx-auto leading-relaxed mt-3.5">
            In India, over 70% of medical expenses are still paid out of pocket. A single unforeseen hospitalization can wipe out decades of equity compounding and planned family goals.
          </p>
        </div>

        {/* 3 Core Financial Realities Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10 sm:mb-12">
          <div className="bg-[#f7f9fc] rounded-2xl p-7 border border-gray-200/80 shadow-xs hover:shadow-lg transition-all duration-300">
            {/* <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600 mb-5">
              <FontAwesomeIcon icon={faArrowTrendUp} className="text-lg" />
            </div> */}
            <h3 className="text-lg font-bold text-[#0a192f] mb-2">14% Annual Medical Inflation</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Healthcare costs in India are escalating twice as fast as overall consumer inflation. Regular fixed deposits or debt funds cannot keep up with future hospital bills.
            </p>
          </div>

          <div className="bg-[#f7f9fc] rounded-2xl p-7 border border-gray-200/80 shadow-xs hover:shadow-lg transition-all duration-300">
            {/* <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 mb-5">
              <FontAwesomeIcon icon={faTriangleExclamation} className="text-lg" />
            </div> */}
            <h3 className="text-lg font-bold text-[#0a192f] mb-2">Corporate Cover is Inadequate</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Typical employer health covers provide only ₹3L–₹5L, which can be exhausted in a single ICU admission. Furthermore, corporate cover ends the day you switch jobs or retire.
            </p>
          </div>

          <div className="bg-[#f7f9fc] rounded-2xl p-7 border border-gray-200/80 shadow-xs hover:shadow-lg transition-all duration-300">
            {/* <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-[#032e92] mb-5">
              <FontAwesomeIcon icon={faCoins} className="text-lg" />
            </div> */}
            <h3 className="text-lg font-bold text-[#0a192f] mb-2">Preserves Long-Term Wealth</h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              When high medical bills strike, uninsured families are forced to liquidate mutual funds, break FDs, or sell property in distress. Insurance shields your net worth intact.
            </p>
          </div>
        </div>

        {/* Side-by-Side Comparison: With Insurance vs Without Insurance */}
        <div className="bg-gradient-to-br from-[#0a192f] via-[#021d63] to-[#032e92] rounded-3xl p-6 sm:p-10 lg:p-12 text-white shadow-2xl mb-10 sm:mb-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hospitalization Reality Check
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-blue-200">
              Comparing what happens when an unexpected ₹12,00,000 medical emergency hits your family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Without Health Insurance */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/15 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center">
                  <FontAwesomeIcon icon={faXmarkCircle} className="text-lg" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-rose-200">Without Health Insurance</h4>
                  {/* <p className="text-xs text-blue-200">Unprotected Lifetime Savings</p> */}
                </div>
              </div>

              <ul className="space-y-3 pt-2 text-xs sm:text-sm text-blue-100/90">
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold mt-0.5">✕</span>
                  <span><strong>Depletes Liquid Wealth:</strong> Emergency funds and mutual funds must be liquidated immediately at prevailing market prices.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold mt-0.5">✕</span>
                  <span><strong>Debt & Borrowing:</strong> Relatives, personal loans, or gold loans at 12%–18% interest to clear discharge invoices.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold mt-0.5">✕</span>
                  <span><strong>Treatment Compromise:</strong> Worrying about hospital charges rather than choosing premier medical specialists and facilities.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-rose-400 font-bold mt-0.5">✕</span>
                  <span><strong>Zero Tax Benefit:</strong> No relief on out-of-pocket medical bill payments under income tax laws.</span>
                </li>
              </ul>
            </div>

            {/* With Comprehensive Health Insurance */}
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-emerald-400/40 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-bl-xl">
                Safe & Protected
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-lg" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-emerald-200">With Health Insurance</h4>
                  {/* <p className="text-xs text-blue-200">Zero-Stress Recovery</p> */}
                </div>
              </div>

              <ul className="space-y-3 pt-2 text-xs sm:text-sm text-blue-100/90">
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  <span><strong>100% Cashless Settlement:</strong> Hospital bills are settled directly by the insurer; your personal savings remain undisturbed.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  <span><strong>Access to Best Private Rooms:</strong> Choose single private rooms without arbitrary room-rent deduction traps.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  <span><strong>Pre & Post Care Covered:</strong> Diagnostic tests, doctor visits, and medications covered for 60 days before and 180 days after.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                  <span><strong>Save up to ₹1,00,000 Tax:</strong> Annual premiums qualify for substantial tax deductions under Section 80D.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>


      </div>
    </section>
  );
}
