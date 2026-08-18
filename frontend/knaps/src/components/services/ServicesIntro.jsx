import { motion } from 'framer-motion';

export default function ServicesIntro() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-[750px] mx-auto text-center"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#f8f9fa] border border-gray-100 mb-6">
            <span className="text-[#c10000] text-xs font-bold tracking-widest uppercase">What We Offer</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#0a192f] leading-tight mb-6">
            Comprehensive Financial Services Under One Roof
          </h2>
          
          <p className="text-gray-600 text-lg leading-relaxed">
            From securing your family's future to growing your wealth and planning for retirement, our extensive suite of financial services is tailored to meet your unique needs at every life stage with total transparency and expert guidance.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
