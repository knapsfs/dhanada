import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

const processSteps = [
  { step: '01', title: 'Understand Client Goals', desc: 'Deep dive into your financial aspirations, risk tolerance, and timelines.' },
  { step: '02', title: 'Financial Assessment', desc: 'Comprehensive analysis of your current assets, liabilities, and cash flow.' },
  { step: '03', title: 'Investment Strategy', desc: 'Crafting a bespoke asset allocation blueprint tailored to your needs.' },
  { step: '04', title: 'Portfolio Allocation', desc: 'Deploying capital across diversified instruments for optimal risk-reward.' },
  { step: '05', title: 'Regular Monitoring', desc: 'Continuous tracking and rebalancing of your portfolio against market shifts.' },
  { step: '06', title: 'Wealth Growth', desc: 'Achieving your milestones and building sustainable, long-term generational wealth.' }
];

export default function OurProcess() {
  return (
    <section className="py-24 bg-[#f8f9fc] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-2 rounded-full border border-gray-200 text-[#032e92] bg-white font-semibold text-sm mb-4 tracking-wider uppercase shadow-sm"
          >
            How We Work
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
          >
            Our <span className="text-[#032e92]">6-Step</span> Wealth Process
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            A systematic, transparent, and proven approach to building and protecting your financial future.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          
          {/* Connector Lines (Visible on Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-[#032e92]/10 via-[#c10000]/20 to-[#032e92]/10 -translate-y-1/2 z-0"></div>

          {processSteps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className="relative z-10"
            >
              <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-[#032e92]/10 hover:-translate-y-2 transition-all duration-500 group h-full flex flex-col">
                
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 rounded-full bg-[#f8f9fc] flex items-center justify-center border border-gray-100 group-hover:bg-[#032e92] transition-colors duration-300">
                    <span className="text-xl font-black text-gray-400 group-hover:text-white transition-colors duration-300">
                      {step.step}
                    </span>
                  </div>
                  
                  {/* Arrow indicating flow */}
                  {idx !== processSteps.length - 1 && (
                    <div className="hidden lg:flex items-center text-gray-300 group-hover:text-[#c10000] transition-colors mt-4 -mr-12 z-20 bg-white px-2">
                      <FontAwesomeIcon icon={faArrowRight} />
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#032e92] transition-colors">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm flex-grow">
                  {step.desc}
                </p>

              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
