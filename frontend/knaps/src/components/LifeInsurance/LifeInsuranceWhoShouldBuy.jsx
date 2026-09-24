import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserGraduate,
  faPeopleRoof,
  faBriefcase,
  faHandHoldingHeart,
  faCheckCircle,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

const PROFILES = [
  {
    id: "young",
    tab: "Young Professionals",
    age: "Age 21 - 29",
    icon: faUserGraduate,
    tagline: "Lock-in rock bottom rates for life while supporting dependent parents.",
    needs: [
      "Lock in lowest premium rates for the next 35–40 years",
      "Support dependent parents and repay educational loans",
      "Cultivate financial discipline and save tax under Section 80C",
      "A 25-year-old pays ~60% lower premium than someone at 38"
    ],
    recommendation: "Term Insurance Cover: 20x Annual Income | Policy tenure up to Age 65-75"
  },
  {
    id: "married",
    tab: "Married with Kids",
    age: "Age 30 - 45",
    icon: faPeopleRoof,
    tagline: "Peak financial responsibilities: home loans, child education, and household lifestyle.",
    needs: [
      "Shield major home loan liabilities from falling on your spouse",
      "Ring-fence your children's school and overseas higher education dreams",
      "Include critical illness and disability living riders to protect against medical shocks",
      "Choose staggered monthly payout options to replace monthly household salaries"
    ],
    recommendation: "Comprehensive Term Plan + Critical Illness Rider | Cover: 15-20x Income + Debts"
  },
  {
    id: "business",
    tab: "Business Owners & Founders",
    age: "Entrepreneurs",
    icon: faBriefcase,
    tagline: "Protect enterprise liabilities, business partners, and personal guarantees.",
    needs: [
      "Shield personal family assets from company credit and personal loan guarantees",
      "Keyman Insurance to protect company valuation and business operations",
      "Partnership buy-sell agreement funding upon unfortunate events",
      "Tax efficiency under corporate financial structures"
    ],
    recommendation: "High Sum Assured Keyman Cover + MWP Act (Married Women's Property Act) Endorsement"
  },
  {
    id: "pre-retirees",
    tab: "Pre-Retirees & HNWIs",
    age: "Age 46 - 60+",
    icon: faHandHoldingHeart,
    tagline: "Generational wealth preservation, estate planning, and tax-free inheritance.",
    needs: [
      "Transfer wealth to children and grandchildren 100% tax-free under Section 10(10D)",
      "Provide lifelong financial security for dependent spouses or special-needs family members",
      "Clear any residual debts without liquidating retirement corpus or equity assets",
      "Whole-life legacy protection running until age 99 or 100"
    ],
    recommendation: "Whole Life Insurance or Guaranteed Pension Annuity Structure"
  }
];

export default function LifeInsuranceWhoShouldBuy() {
  const [activeTab, setActiveTab] = useState(0);
  const { openLeadModal } = useLeadModal();
  const current = PROFILES[activeTab];

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e8edf7] text-[#032e92] text-[11px] font-extrabold tracking-widest uppercase mb-4 shadow-sm">
            Life Stages
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0a192f] tracking-tight leading-tight mb-4">
            Who Needs Life Insurance <span className="text-[#032e92]">The Most?</span>
          </h2>
          <p className="text-gray-600 text-base sm:text-lg font-normal leading-relaxed">
            Financial responsibilities shift across different stages of life. See how life cover adapts to protect your specific situation.
          </p>
        </div>

        {/* Life Stage Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {PROFILES.map((p, idx) => {
            const isSelected = activeTab === idx;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveTab(idx)}
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center gap-2.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#032e92] text-white shadow-lg shadow-blue-900/20 scale-[1.02]'
                    : 'bg-white text-gray-600 hover:text-gray-900 border border-[#e8edf7] hover:border-gray-300'
                }`}
              >
                <FontAwesomeIcon icon={p.icon} className={isSelected ? 'text-blue-200' : 'text-gray-400'} />
                <span>{p.tab}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl p-7 sm:p-10 border border-[#e8edf7] shadow-xl shadow-blue-900/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-extrabold text-[#032e92] bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
                  {current.age}
                </span>
                <span className="text-xs text-gray-400 font-semibold">• Tailored Recommendation</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0a192f] mb-3 leading-tight">
                {current.tab}
              </h3>

              <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-medium mb-7">
                {current.tagline}
              </p>

              {/* Needs Checklist */}
              <div className="space-y-3.5 mb-8">
                {current.needs.map((item, nIdx) => (
                  <div key={nIdx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700 font-medium">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-emerald-600 mt-0.5 text-base flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Recommendation Highlight (5 Cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#0a192f] to-[#021d63] text-white rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-lg">
              <div>
                <span className="text-[10px] font-extrabold text-blue-200 uppercase tracking-widest block mb-2">
                  Recommended Structure
                </span>
                <h4 className="text-lg font-bold text-white mb-4 leading-snug">
                  Ideal Policy Formulation
                </h4>
                <div className="p-4 rounded-xl bg-white/10 border border-white/15 text-xs text-blue-100 font-medium leading-relaxed mb-6">
                  {current.recommendation}
                </div>
              </div>

              <button
                type="button"
                onClick={openLeadModal}
                className="btn-ripple w-full py-3.5 px-6 rounded-xl text-[15px] font-semibold bg-white text-[#032e92] hover:bg-blue-50 shadow-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Get Advice for {current.tab.split(' ')[0]}</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-xs group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
