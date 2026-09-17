import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faArrowRight, faShieldHalved, faUserCheck, faChartLine, faHandHoldingHeart } from '@fortawesome/free-solid-svg-icons';
import { useLeadModal } from '../../context/LeadModalContext';

export default function WhyChooseServices() {
  const { openLeadModal } = useLeadModal();

  const features = [
    {
      icon: faUserCheck,
      title: "Personalized Advisory",
      desc: "Tailored asset allocation and goal strategies built around your risk tolerance and life milestones."
    },
    {
      icon: faChartLine,
      title: "Proven Market Expertise",
      desc: "Decades of research-backed investment selection across equity, debt, and alternative products."
    },
    {
      icon: faShieldHalved,
      title: "100% Unbiased & Transparent",
      desc: "Zero hidden costs, fiduciary guidance, and complete regulatory compliance at every step."
    },
    {
      icon: faHandHoldingHeart,
      title: "Dedicated Relationship Support",
      desc: "Continuous portfolio monitoring, periodic rebalancing, and prompt assistance whenever you need it."
    }
  ];

  return (
    <section className="py-20 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left - Premium Image Illustration with Live Metric Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative order-2 lg:order-1"
          >
            <div className="relative rounded-3xl overflow-hidden aspect-[4/4.5] shadow-2xl shadow-blue-900/10 border border-[#e8edf7]">
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop" 
                alt="Expert Financial Advice" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f]/85 via-[#0a192f]/20 to-transparent" />
              
              {/* Floating Satisfaction Badge */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-white/60 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#032e92] flex items-center justify-center text-white shadow-md shadow-blue-900/20">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
                  </div>
                  <div>
                    <p className="text-[#0a192f] font-black text-2xl leading-none mb-1">99.8%</p>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Client Retention & Trust</p>
                  </div>
                </div>

                <span className="hidden sm:inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Verified
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Content & Feature Grid */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eef4ff] text-[#032e92] text-[11px] font-extrabold tracking-widest uppercase mb-5">
              Why Partner With Us
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#0a192f] leading-tight tracking-tight mb-8">
              Expert Financial Guidance Tailored to <span className="text-[#032e92]">Your Ambitions</span>
            </h2>

            <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 mb-10">
              {features.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-[#f8fafc] p-5 rounded-2xl border border-[#e8edf7] hover:border-blue-200 hover:bg-white hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-white shadow-sm text-[#032e92] flex items-center justify-center mb-3 group-hover:bg-[#032e92] group-hover:text-white transition-colors duration-200">
                    <FontAwesomeIcon icon={item.icon} className="text-sm" />
                  </div>
                  <h4 className="font-bold text-[#0a192f] text-sm mb-1.5">{item.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed font-medium">{item.desc}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={openLeadModal}
              className="btn-ripple bg-gradient-to-r from-[#032e92] to-[#021d63] text-white px-8 py-3.5 rounded-xl font-semibold shadow-md hover:shadow-lg hover:shadow-[#032e92]/30 transition-all duration-300 text-[15px] flex items-center gap-3 cursor-pointer"
            >
              <span>Schedule Free Consultation</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
