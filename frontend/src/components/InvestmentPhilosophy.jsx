import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useLeadModal } from '../context/LeadModalContext';
import patienceDisciplineImg from '../assets/patience-discipline.png';

export default function InvestmentPhilosophy() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { openLeadModal } = useLeadModal();

  return (
    <section id="philosophy" className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div ref={ref} className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6 flex flex-col items-start"
          >
            {/* Tag */}
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-xs sm:text-sm font-semibold mb-6">
              <span>💡</span> Our Philosophy
            </span>

            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Invest with a plan, <span className="gradient-text"> not with emotions </span>
            </h2>

            {/* Paragraph 1 */}
            <p className="text-gray-500 font-normal leading-relaxed text-sm sm:text-base mb-5">
              Every investment decision should start with a clear goal. What am I investing for? How much do I need? And how long can I stay invested? The answers should guide my investment choices, not market rumours, a friend’s advice or the fear of missing out.
            </p>

            {/* Paragraph 2 */}
            <p className="text-gray-500 font-normal leading-relaxed text-sm sm:text-base mb-8">
              Markets will rise and fall. A disciplined investor should stay focused on the plan, avoid panic during downturns and give investments the time they need to work.
            </p>

            {/* CTA Button */}
            <button
              onClick={() => openLeadModal()}
              className="px-8 py-3.5 rounded-full bg-[#032e92] text-white text-sm sm:text-base font-bold shadow-lg shadow-blue-900/20 hover:bg-[#021d63] hover:shadow-xl hover:shadow-blue-900/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Invest Now
            </button>
          </motion.div>

          {/* Right Content / Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-6 flex flex-col justify-center items-start lg:pl-6"
          >


            {/* Visual Image */}
            <div className="w-full flex justify-center items-center">
              <img
                src={patienceDisciplineImg}
                alt="Patience and discipline are the key to building wealth"
                className="w-full max-w-[540px] h-auto object-contain select-none"
                loading="lazy"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
