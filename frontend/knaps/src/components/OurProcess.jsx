import { motion } from 'framer-motion';
import { useLeadModal } from '../context/LeadModalContext';

import step1Img from '../assets/process/step_1_3d.png';
import step2Img from '../assets/process/step_2_3d.png';
import step3Img from '../assets/process/step_3_3d.png';
import step4Img from '../assets/process/step_4_3d.png';
import step5Img from '../assets/process/step_5_3d.png';

const steps = [
  {
    step: 1,
    title: 'Intro Call',
    desc: 'We connect with you to understand your financial background and explore how we can help.',
    image: step1Img,
    badgeBg: 'bg-blue-100/90 text-blue-600 ring-4 ring-blue-50/70',
    hoverGlow: 'hover:shadow-blue-200/50',
  },
  {
    step: 2,
    title: 'Risk Profiling',
    desc: 'We assess your risk tolerance and financial situation to understand what suits you.',
    image: step2Img,
    badgeBg: 'bg-emerald-100/90 text-emerald-600 ring-4 ring-emerald-50/70',
    hoverGlow: 'hover:shadow-emerald-200/50',
  },
  {
    step: 3,
    title: 'Understand Your Goals',
    desc: 'We take the time to understand your short-term and long-term goals, so we can stay aligned with what matters to you.',
    image: step3Img,
    badgeBg: 'bg-amber-100/90 text-amber-600 ring-4 ring-amber-50/70',
    hoverGlow: 'hover:shadow-amber-200/50',
  },
  {
    step: 4,
    title: 'Recommend Suitable Schemes',
    desc: 'We suggest suitable investment options based on your goals, time horizon and risk profile.',
    image: step4Img,
    badgeBg: 'bg-rose-100/90 text-rose-600 ring-4 ring-rose-50/70',
    hoverGlow: 'hover:shadow-rose-200/50',
  },
  {
    step: 5,
    title: 'Onboarding and Support',
    desc: 'We complete the onboarding process seamlessly and stay with you till your goals are met — and beyond',
    image: step5Img,
    badgeBg: 'bg-purple-100/90 text-purple-600 ring-4 ring-purple-50/70',
    hoverGlow: 'hover:shadow-purple-200/50',
  },
];

export default function OurProcess() {
  const { openLeadModal } = useLeadModal();

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#f8faff] via-white to-[#f5f9ff] relative overflow-hidden">



      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header with Handwritten Script */}
        <div className="relative text-center max-w-3xl mx-auto mb-10 sm:mb-12">

          {/* Plan Invest Grow Script in Top-Right */}
          {/* <div className="hidden md:block absolute -top-4 -right-12 lg:-right-20 pointer-events-none select-none transform rotate-3">
            <img src={planInvestGrowImg} alt="Plan Invest Grow" className="w-24 lg:w-28 opacity-90" />
          </div> */}

          {/* Header Tag */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full border border-[#032e92]/20 text-[#032e92] bg-[#eef5ff] font-semibold text-sm mb-4 uppercase tracking-wider text-center"
          >
            OUR PROCESS
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-4xl lg:text-[42px] font-extrabold text-[#0f172a] tracking-tight leading-tight"
          >
            5 Easy Steps to Start Investing
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-base text-gray-500 font-normal max-w-xl mx-auto mt-2.5 leading-relaxed"
          >
            A simple, step-by-step process to help you invest with clarity and confidence.
          </motion.p>
        </div>

        {/* 5 Steps Process Grid */}
        <div className="relative">

          {/* Connecting Wavy Dashed Line across Steps (Desktop) */}
          <div className="hidden lg:block absolute top-4 left-[9%] right-[9%] h-6 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 900 24" fill="none" preserveAspectRatio="none">
              <path
                d="M 10 12 Q 112 4, 225 12 T 450 12 T 675 12 T 890 12"
                stroke="#cbd5e1"
                strokeWidth="2"
                strokeDasharray="6 6"
              />
            </svg>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-6 lg:gap-4 relative z-10">
            {steps.map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.08 * idx }}
                className="flex flex-col items-center text-center group cursor-pointer"
                onClick={() => openLeadModal(`Process Step ${item.step}: ${item.title}`)}
              >
                {/* Step Number Circle Badge */}
                <div className="relative mb-2">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-extrabold text-xs sm:text-sm transition-transform duration-300 group-hover:scale-115 ${item.badgeBg}`}>
                    {item.step}
                  </div>
                </div>

                {/* 3D Pedestal Illustration */}
                <div className="w-32 sm:w-36 h-28 sm:h-30 flex items-center justify-center relative my-1">
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    whileHover={{ scale: 1.08, y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                    className="w-full h-full object-contain filter drop-shadow-md group-hover:drop-shadow-xl transition-all duration-300"
                  />
                </div>

                {/* Step Title */}
                <h3 className="text-[16px] sm:text-[17px] font-bold text-[#0f172a] leading-snug group-hover:text-[#032e92] transition-colors mt-2">
                  {item.title}
                </h3>

                {/* Step Description */}
                <p className="text-xs sm:text-[13px] text-gray-500 font-normal leading-relaxed mt-2 max-w-[220px]">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12 sm:mt-14 relative z-10">
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => openLeadModal('Process: Start Your Journey')}
            className="btn-ripple px-6 py-3 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-[#032e92] to-[#021d63] text-white hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 inline-flex items-center justify-center gap-2.5 cursor-pointer group"
          >
            <span>Start Your Journey</span>

          </motion.button>
        </div>

      </div>
    </section>
  );
}
