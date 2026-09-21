import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

const FAQS = [
  {
    q: "How much life insurance cover do I realistically need?",
    a: "As a thumb rule, your life cover should be at least 15 to 20 times your current annual take-home income, plus any outstanding debts (such as home or vehicle loans), plus a dedicated fund for future child milestones, minus existing liquid investments. You can use our interactive Life Insurance Calculator above to get your personalized Human Life Value (HLV)."
  },
  {
    q: "What is the key difference between Term Insurance and traditional Endowment/ULIP plans?",
    a: "Term Insurance is pure risk protection: you pay a very low premium for a very large sum assured (e.g. ₹1 Cr for ~₹500/mo), with zero maturity benefit unless a death occurs. Endowment and ULIP plans combine savings or investment with life cover, but charge significantly higher premiums for a smaller life cover. We generally recommend buying a pure term plan for high cover and investing the remaining surplus in mutual funds or SIF for superior wealth creation."
  },
  {
    q: "What happens if I outlive my term insurance policy period?",
    a: "In a standard pure term insurance plan, no payout is made if you survive the policy tenure, as the policy served its purpose of shielding your family during your peak financial vulnerability years. However, you can opt for a 'Term Plan with Return of Premium' (TROP), where the insurer refunds 100% of all premiums paid (excluding taxes) upon surviving the tenure."
  },
  {
    q: "Can smokers or individuals with hypertension / diabetes get life cover?",
    a: "Yes. Smokers and individuals with pre-existing conditions like diabetes, thyroid, or hypertension can readily obtain life insurance. The insurer may charge a modest premium loading or request standard medical tests. It is critically important to declare all medical history transparently at the time of proposal to ensure 100% claim settlement guarantee later."
  },
  {
    q: "What is the Married Women's Property (MWP) Act endorsement?",
    a: "The MWP Act (Section 6) allows a married man to ring-fence his life insurance policy exclusively for his wife and children. Once endorsed, no creditors, business lenders, court attachments, or relatives can claim the policy death benefit, ensuring your family receives every rupee even if you face business insolvency."
  },
  {
    q: "What tax benefits apply to life insurance in India?",
    a: "Under Section 80C of the Income Tax Act, premiums paid up to ₹1.5 Lakh per financial year are tax-deductible. If you add critical illness riders, the rider premium qualifies for deduction under Section 80D up to ₹25,000. Furthermore, under Section 10(10D), any death benefit or qualifying maturity payout is 100% completely tax-free in the hands of the nominee."
  },
  {
    q: "How does KNAPS support my nominee during a claim settlement?",
    a: "KNAPS provides dedicated claim assistance. When a claim event occurs, your nominee simply contacts our specialized claims desk. We review the policy, collect and verify the requisite hospital/municipal records, submit documents directly to the insurer's nodal claim officers, and follow through until the funds are directly credited into your nominee's bank account."
  }
];

function FAQItem({ item, index, isOpen, onToggle }) {
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
      isOpen ? 'border-[#032e92]/30 shadow-md shadow-blue-900/5 bg-white' : 'border-[#e8edf7] bg-white hover:border-gray-300'
    }`}>
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors cursor-pointer"
      >
        <div className="flex items-start gap-4 flex-1">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold transition-colors ${
            isOpen ? 'bg-[#032e92] text-white' : 'bg-[#eef4ff] text-[#032e92]'
          }`}>
            {index + 1}
          </div>
          <span className={`text-sm sm:text-base font-bold transition-colors ${
            isOpen ? 'text-[#032e92]' : 'text-gray-900'
          }`}>
            {item.q}
          </span>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FontAwesomeIcon icon={faChevronDown} className={`text-xs flex-shrink-0 ml-3 ${
            isOpen ? 'text-[#032e92]' : 'text-gray-400'
          }`} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-5 pt-1">
              <div className="ml-11 bg-[#f8fafc] rounded-xl px-5 py-4 border border-[#e8edf7]">
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed">
                  {item.a}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LifeInsuranceFAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="py-12 sm:py-16 bg-[#f7f9fc] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e8edf7] text-[#032e92] text-[11px] font-extrabold tracking-widest uppercase mb-4 shadow-sm">
            Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight leading-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-sm sm:text-base font-normal">
            Everything you need to know about life cover, policy structures, claims, and tax rules.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3.5">
          {FAQS.map((item, idx) => (
            <FAQItem
              key={idx}
              item={item}
              index={idx}
              isOpen={openIndex === idx}
              onToggle={() => setOpenIndex(openIndex === idx ? -1 : idx)}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
