import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHospital,
  faCalendarCheck,
  faBed,
  faClockRotateLeft,
  faRotate,
  faNotesMedical,
  faGift,
  faPiggyBank,
  faArrowRight,
  faCheckDouble
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const benefits = [
  {
    icon: faHospital,
    title: 'Cashless Network at 14,000+ Hospitals',
    description: 'Walk in with your digital health card and get treated without paying cash upfront. Insurer settles directly with the hospital desk.',
    badge: '100% Cashless'
  },
  {
    icon: faCalendarCheck,
    title: 'Pre & Post Hospitalization Coverage',
    description: 'Doctor consultations, diagnostic lab tests, MRI/CT scans and medicines are covered for up to 60 days before admission and 180 days after discharge.',
    badge: '60 & 180 Days'
  },
  {
    icon: faBed,
    title: 'Zero Room Rent Capping & Sub-Limits',
    description: 'Opt for single private AC rooms or suites without fear of proportionate deduction penalties on doctors fees, OT charges, and nursing costs.',
    badge: 'No Room Deduction'
  },
  {
    icon: faClockRotateLeft,
    title: '500+ Modern Day Care Procedures',
    description: 'Advanced medical technologies allow treatments like dialysis, cataract, radiotherapy, and chemotherapy to conclude in under 24 hours — fully covered.',
    badge: 'Daycare Covered'
  },
  {
    icon: faRotate,
    title: 'Unlimited Automatic Sum Insured Restoration',
    description: 'If your sum insured is exhausted during the year, it instantly recharges by 100% for unrelated future illnesses for you or family members.',
    badge: '100% Refill'
  },
  {
    icon: faGift,
    title: 'Cumulative No Claim Bonus (NCB)',
    description: 'For every claim-free year, your sum insured increases by 10% to 50% without any increase in your premium, growing up to 100%–200% bonus cover.',
    badge: 'Up to 200% Bonus'
  },
  {
    icon: faNotesMedical,
    title: 'Annual Complimentary Health Check-Ups',
    description: 'Avail comprehensive annual preventive medical check-ups (blood tests, lipid profile, ECG) for all insured adult members without affecting NCB.',
    badge: 'Free Annual Check-up'
  },
  {
    icon: faPiggyBank,
    title: 'Tax Deductions up to ₹1,00,000 u/s 80D',
    description: 'Save up to ₹25,000 for self/family and an additional ₹50,000 for senior citizen parents under Section 80D of the Income Tax Act.',
    badge: 'Save up to ₹31,200 Tax'
  }
];

export default function HealthInsuranceBenefits() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#032e92] text-xs sm:text-sm font-semibold mb-4 shadow-xs">
            <FontAwesomeIcon icon={faCheckDouble} className="text-[#032e92]" />
            <span>Comprehensive Policy Advantages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0a192f] tracking-tight leading-tight">
            Key Benefits of a Modern{' '}
            <span className="bg-gradient-to-r from-[#032e92] to-[#0066cc] bg-clip-text text-transparent">
              Health Insurance Policy
            </span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed">
            Modern health insurance in India has evolved beyond basic emergency bills. Enjoy comprehensive wellness, cashless simplicity, and extensive out-of-hospital medical care.
          </p>
        </div>

        {/* Benefits Grid (4x2 on lg) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => {
            return (
              <div
                key={idx}
                className="bg-[#f7f9fc] rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs hover:shadow-xl hover:bg-white hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl sm:rounded-2xl bg-white border border-gray-200/80 flex items-center justify-center text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white group-hover:scale-105 transition-all duration-300 shadow-xs">
                      <FontAwesomeIcon icon={benefit.icon} className="text-lg" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#032e92] border border-blue-100">
                      {benefit.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0a192f] mb-2 group-hover:text-[#032e92] transition-colors leading-snug">
                    {benefit.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-200/60 flex items-center text-xs font-semibold text-[#032e92] group-hover:translate-x-1 transition-transform">
                  <span>Coverage details</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-[10px] ml-1.5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-14 text-center">
          <button
            onClick={() => openLeadModal({ title: 'Explore Policy Benefits', defaultService: 'Health Insurance' })}
            className="btn-ripple px-8 py-3.5 rounded-xl text-sm sm:text-base font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white shadow-lg shadow-[#032e92]/25 hover:shadow-xl hover:shadow-[#032e92]/35 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Protect Your Family Today</span>
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
