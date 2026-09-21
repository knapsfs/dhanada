import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLayerGroup,
  faBuildingColumns,
  faPersonWalkingWithCane,
  faEnvelopeOpenText,
  faSliders,
  faBuilding,
  faChildReaching,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const rdTypes = [
  {
    icon: faBuildingColumns,
    title: 'Regular Bank Recurring Deposit',
    badge: 'Most Popular',
    badgeColor: 'bg-blue-100 text-[#032e92]',
    tenure: '6 Months to 10 Years',
    highlight: 'Quarterly Compounding',
    description:
      'Offered by all public and scheduled commercial banks in India. Deposits are covered up to ₹5 Lakh by DICGC. Offers complete digital management, standing instructions, and auto-sweep facilities.'
  },
  {
    icon: faPersonWalkingWithCane,
    title: 'Senior Citizen Recurring Deposit',
    badge: 'Higher Returns',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    tenure: '6 Months to 10 Years',
    highlight: '+0.50% to +0.75% Premium',
    description:
      'Designed exclusively for Indian resident individuals aged 60 years and above. Banks offer an additional interest spread above standard card rates, ensuring higher monthly savings compounding.'
  },
  {
    icon: faEnvelopeOpenText,
    title: 'Post Office Recurring Deposit (PORD)',
    badge: 'Sovereign Safety',
    badgeColor: 'bg-amber-100 text-amber-800',
    tenure: '5 Years (Fixed)',
    highlight: '100% Govt Backed',
    description:
      'A Department of Posts flagship small savings product. Features complete sovereign security, quarterly compounding, low minimum monthly deposit (₹100), with an option to extend for another 5 years.'
  },
  {
    icon: faSliders,
    title: 'Flexi / Smart Recurring Deposit',
    badge: 'Dynamic Cash Flows',
    badgeColor: 'bg-indigo-100 text-indigo-800',
    tenure: '1 Year to 5 Years',
    highlight: 'Variable Monthly Deposits',
    description:
      'Unlike strict fixed RDs, Flexi RDs allow you to deposit a core installment plus additional top-up amounts during months with surplus bonuses, without incurring penalties on baseline months.'
  },
  {
    icon: faBuilding,
    title: 'Corporate / NBFC Recurring Deposit',
    badge: 'Credit Rated',
    badgeColor: 'bg-purple-100 text-purple-800',
    tenure: '12 Months to 60 Months',
    highlight: 'Higher Yield Potential',
    description:
      'Offered by select Non-Banking Financial Companies (NBFCs) and housing finance corporations. Offers higher interest yields than banks; depositors should check CRISIL / ICRA credit ratings (AAA/AA).'
  },
  {
    icon: faChildReaching,
    title: 'Minor Recurring Deposit',
    badge: 'Youth Savings Habit',
    badgeColor: 'bg-rose-100 text-rose-800',
    tenure: '1 Year to 10 Years',
    highlight: 'Guardian Operated',
    description:
      'Opened by parents or legal guardians in the name of a minor child to accumulate savings for future educational goals or to teach financial literacy and savings habits early on.'
  }
];

export default function RecurringDepositTypes() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#032e92]/10 border border-[#032e92]/20 text-[#032e92] text-xs font-semibold uppercase tracking-wider mb-4">
            <FontAwesomeIcon icon={faLayerGroup} />
            <span>Product Spectrum</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#032e92] tracking-tight mb-4">
            Types of Recurring Deposits (RD)
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Select an RD variant that matches your profile, liquidity requirements, and comfort level across commercial banks, post offices, and rated financial institutions.
          </p>
        </div>

        {/* Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
          {rdTypes.map((type, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#f7f9fc] border border-slate-200/80 hover:border-[#032e92]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 text-[#032e92] group-hover:bg-[#032e92] group-hover:text-white flex items-center justify-center text-lg transition-all duration-300 shadow-sm">
                    <FontAwesomeIcon icon={type.icon} />
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${type.badgeColor}`}>
                    {type.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#032e92] transition-colors">
                  {type.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {type.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Tenure Window:</span>
                  <span className="font-semibold text-slate-800">{type.tenure}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Key Characteristic:</span>
                  <span className="font-semibold text-[#032e92]">{type.highlight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Regulatory Note */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center max-w-4xl mx-auto">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-800">Important Distinction:</span> Bank RDs are governed by RBI regulations and insured up to ₹5,00,000 under DICGC. Post Office RDs are backed directly by the Government of India. Corporate/NBFC RDs carry issuer credit risk and are not covered under DICGC deposit insurance.
          </p>
        </div>
      </div>
    </section>
  );
}
