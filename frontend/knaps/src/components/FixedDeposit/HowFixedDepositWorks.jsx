import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuildingColumns,
  faSliders,
  faLock,
  faHandHoldingDollar,
  faCheckCircle,
  faArrowRight,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const steps = [
  {
    stepNumber: '01',
    title: 'Select Issuer & Tenure',
    desc: 'Evaluate top scheduled commercial banks, small finance banks, or high-rated corporate issuers (CRISIL/ICRA AAA/AA) and choose a tenure ranging from 7 days to 10 years.',
    icon: faBuildingColumns,
    highlights: [
      'Bank & Corporate FD choices',
      'Custom tenure from 7 days',
      'Assess credit rating & DICGC cover'
    ]
  },
  {
    stepNumber: '02',
    title: 'Choose Payout Option',
    desc: 'Select Cumulative if you wish interest to compound quarterly and pay out at maturity, or Non-Cumulative if you require regular monthly or quarterly interest income.',
    icon: faSliders,
    highlights: [
      'Cumulative: Compounded growth',
      'Non-Cumulative: Periodic income',
      'Direct account credit'
    ]
  },
  {
    stepNumber: '03',
    title: 'Lock In Guaranteed Rate',
    desc: 'Your contracted interest rate is finalized and legally locked for the entire tenure. A digital Fixed Deposit Receipt (FDR) is generated instantly with your full maturity schedule.',
    icon: faLock,
    highlights: [
      'Rate remains fixed throughout',
      'Insulated from rate drops',
      'Instant digital FD advice'
    ]
  },
  {
    stepNumber: '04',
    title: 'Maturity & Settlement',
    desc: 'Upon tenure completion, your principal and accumulated interest are credited directly into your linked savings account, or auto-renewed per your preset instructions.',
    icon: faHandHoldingDollar,
    highlights: [
      'Seamless electronic payout',
      'Flexible auto-renewal options',
      'Loan against FD option available'
    ]
  }
];

export default function HowFixedDepositWorks() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <span>Simple 4-Step Journey</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            How Fixed Deposits Work —{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              From Placement to Maturity
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Understanding the straightforward lifecycle of an FD: from selecting your preferred issuer to interest accumulation and final maturity.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs hover:shadow-xl hover:border-blue-200/90 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/70 border border-blue-200/60 flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-xs">
                    <FontAwesomeIcon icon={step.icon} className="text-lg" />
                  </div>
                  <span className="text-2xl sm:text-3xl font-black tracking-tight text-gray-200 group-hover:text-[#032e92]/30 transition-colors">
                    {step.stepNumber}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#0a192f] mb-3 group-hover:text-[#032e92] transition-colors">
                  {step.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5">
                  {step.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2">
                {step.highlights.map((h, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2 text-xs text-gray-700">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 flex-shrink-0 text-xs" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Process Guarantee Banner */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-[#0a192f] to-[#021d63] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg sm:text-xl font-bold tracking-tight">
              Looking for competitive FD interest rates across banks and corporate issuers?
            </h4>
            <p className="text-xs sm:text-sm text-blue-200">
              Compare institutional yields, DICGC insurance parameters, and senior citizen rates in one unified consultation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openLeadModal({ title: 'Explore FD Issuers & Rates', defaultService: 'Fixed Deposits' })}
              className="btn-ripple px-6 py-3 rounded-xl text-sm font-semibold bg-white text-[#032e92] hover:bg-blue-50 shadow-md transition-all duration-300 flex items-center gap-2 cursor-pointer"
            >
              <span>Compare Fixed Deposit Rates</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </button>
            <a
              href="tel:+918080808080"
              className="px-5 py-3 rounded-xl text-sm font-semibold text-white/90 hover:text-white border border-white/20 hover:border-white/40 transition-colors flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faPhone} className="text-xs" />
              <span>+91 8080808080</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
