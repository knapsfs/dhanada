import { motion } from 'framer-motion';

export default function ServicesIntro() {
  return (
    <section className="pt-12 pb-6 bg-[#f7f9fc]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#e8edf7] shadow-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c10000]" />
            <span className="text-[#c10000] text-[11px] font-bold tracking-widest uppercase">Full Service Portfolio</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0a192f] leading-tight tracking-tight mb-4">
            Comprehensive Financial Services Under One Roof
          </h2>
          
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-normal">
            From growing your wealth with mutual funds and portfolio management to safeguarding your loved ones with insurance and securing your retirement, explore our 12 complete financial offerings.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
