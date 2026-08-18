import { motion } from 'framer-motion';

export default function AboutJourney() {
  const milestones = [
    { year: "2012", title: "Company Founded", desc: "Started with a vision to democratize premium wealth management." },
    { year: "2016", title: "Expanded Services", desc: "Introduced advanced Portfolio Management and Alternative Investment Funds." },
    { year: "2020", title: "5000+ Investors", desc: "Crossed a major milestone of trusted long-term client relationships." },
    { year: "2024", title: "₹500Cr+ AUM", desc: "Managing substantial assets with industry-leading growth metrics." }
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#0a192f] mb-6"
          >
            Our Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-lg"
          >
            A timeline of our steady growth, driven by our commitment to client success.
          </motion.p>
        </div>

        <div className="relative">
          {/* Horizontal Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-1/2 z-0"></div>

          <div className="grid md:grid-cols-4 gap-8 md:gap-4 relative z-10">
            {milestones.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                className="text-center flex flex-col items-center group"
              >
                {/* Year Marker */}
                <div className="w-16 h-16 rounded-full bg-white border-[3px] border-[#032e92] flex items-center justify-center mb-6 shadow-lg shadow-blue-900/10 group-hover:bg-[#032e92] group-hover:text-white transition-colors duration-300">
                  <span className="font-bold text-[#032e92] group-hover:text-white">{item.year}</span>
                </div>
                
                <h3 className="text-xl font-bold text-[#0a192f] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs px-2">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
