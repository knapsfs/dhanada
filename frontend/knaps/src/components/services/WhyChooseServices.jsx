import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function WhyChooseServices() {
  const features = [
    { title: "Personalized Advice", desc: "Strategies built around your unique financial goals and life stage." },
    { title: "Experienced Advisors", desc: "Benefit from our team's decades of market expertise." },
    { title: "Transparent Process", desc: "No hidden fees. We believe in complete clarity and trust." },
    { title: "Long-Term Growth", desc: "Focusing on sustainable wealth creation for generations." }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left - Premium Image Illustration */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-2 lg:order-1 lg:pr-10"
          >
            <div className="relative rounded-[32px] overflow-hidden aspect-[4/5] shadow-2xl shadow-blue-900/10">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" 
                alt="Expert Financial Advice" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/90 via-transparent to-transparent"></div>
              
              {/* Floating Element */}
              <motion.div 
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/50 flex items-center justify-between"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-[#032e92] flex items-center justify-center text-white shadow-lg">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-[#0a192f] font-black text-2xl leading-none mb-1">99.8%</p>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Client Satisfaction</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Content Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-xs font-bold tracking-widest uppercase mb-6">
              Why Choose Us
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold text-[#0a192f] leading-tight mb-10">
              Expert Financial Guidance Tailored to <span className="text-[#032e92]">Your Goals</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-6 mb-12">
              {features.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="bg-[#f8fafc] p-6 rounded-2xl border border-gray-100 hover:shadow-lg hover:border-blue-100 hover:bg-white transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm text-[#c10000] flex items-center justify-center mb-4 group-hover:bg-[#c10000] group-hover:text-white transition-colors duration-300">
                    <FontAwesomeIcon icon={faCheckCircle} />
                  </div>
                  <h4 className="font-bold text-[#0a192f] mb-2">{item.title}</h4>
                  <p className="text-gray-500 text-[13px] leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <button className="bg-[#032e92] hover:bg-[#021d63] text-white px-8 py-4 rounded-xl font-bold shadow-xl shadow-[#032e92]/20 hover:-translate-y-1 transition-all duration-300 text-[15px] flex items-center gap-3">
              Schedule Consultation
              <FontAwesomeIcon icon={faCheckCircle} />
            </button>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
