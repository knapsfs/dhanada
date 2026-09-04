import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faPhoneVolume, faBuildingColumns, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function ContactCTA() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative bg-gradient-to-br from-[#032e92] to-[#011441] rounded-[40px] overflow-hidden p-12 md:p-20 shadow-[0_40px_80px_-20px_rgba(3,46,146,0.4)] border border-blue-800/50"
      >
        {/* Floating Icons Background Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
           <motion.div 
             animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} 
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="absolute top-10 right-20 text-white/5 text-8xl"
           >
             <FontAwesomeIcon icon={faBuildingColumns} />
           </motion.div>
           <motion.div 
             animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }} 
             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-10 right-[30%] text-white/5 text-8xl"
           >
             <FontAwesomeIcon icon={faChartLine} />
           </motion.div>
           {/* Subtle Light Flare */}
           <div className="absolute top-[-50%] left-[-20%] w-[1000px] h-[1000px] rounded-full bg-white/5 blur-[120px]"></div>
        </div>

        <div className="relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white border border-white/20 font-semibold text-xs tracking-widest uppercase mb-6 backdrop-blur-md">
              Take The Next Step
            </div>
            <h2 className="text-4xl md:text-[56px] font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Ready To Secure Your <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Financial Future?</span>
            </h2>
            <p className="text-blue-100/80 text-xl leading-relaxed max-w-xl font-light">
              Our seasoned advisors are ready to help you make informed financial decisions. Reach out today to create a personalized wealth roadmap.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-5 justify-center lg:justify-end items-center">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
              className="group relative overflow-hidden bg-white text-[#032e92] px-8 py-5 rounded-2xl font-bold text-lg w-full sm:w-auto shadow-xl transition-transform hover:-translate-y-1"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                Schedule Consultation
                <FontAwesomeIcon icon={faArrowRight} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            
            <Link to="tel:+919876543210" className="group relative overflow-hidden bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-5 rounded-2xl font-bold text-lg w-full sm:w-auto flex items-center justify-center gap-3 transition-colors hover:bg-white/20 hover:border-white/40">
              <FontAwesomeIcon icon={faPhoneVolume} />
              Call Now
            </Link>
          </div>

        </div>
      </motion.div>
      </div>
    </section>
  );
}
